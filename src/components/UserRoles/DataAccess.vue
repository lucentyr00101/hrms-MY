<template>
  <div>
    <a-modal
      :title="$t('table.dialog.data-access')"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      :visible="value"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      @cancel="closeModal"
    >
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" :form="form" layout="horizontal" grid @submit="handleSubmit">
        <a-form-item :label="`${$t('table.dialog.data-access-layer')}: `">
          <a-select
            :options="dataAccessList"
            @change="id => selectedDropdown = id"
            v-decorator="[fields[0], { rules: [{ required: true, message: $t('error.data-access-layer.required') }] }]"
          />
        </a-form-item>
        <template v-if="isCustom">
          <a-form-item
            :label="$t('table.dialog.departments')">
            <a-spin :spinning="departmentsLoading">
              <a-tree
                v-model="checkedKeys"
                checkable
                :expanded-keys="expandedKeys"
                :auto-expand-parent="autoExpandParent"
                :selected-keys="selectedKeys"
                :tree-data="departmentsTree"
                @expand="onExpand"
                @select="onSelect"
                @check="onCheck"
                :replaceFields="{ key: 'id', title: 'name' }"
              />
            </a-spin>
          </a-form-item>
        </template>
        <a-form-item :wrapperCol="{ span: 5, offset: 20 }">
          <a-button class="confirm-btn" type="primary" @click="handleSubmit">{{ $t('table.dialog.confirm') }}</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'RoleDataAccess',
  props: {
    value: Boolean,
    model: {
      type: Object,
      default: () => null
    }
  },
  watch: {
    async value (visible) {
      if (visible) {
        await this.fetchLayers()
        await this.fetchDataAccess()
      }
    },
    isCustom (isCustom) {
      if (isCustom) this.fetchDepartments()
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      dataAccessList: [],
      accessLayers: [],
      departmentsLoading: false,
      departmentsTree: [],
      checkedKeys: [],
      expandedKeys: [],
      autoExpandParent: true,
      selectedKeys: [],
      checkedKeysChecks: [],
      selectedDropdown: null,
      dataAccess: null
    }
  },
  computed: {
    fields () {
      return ['dataAccess']
    },
    isCustom () {
      const custom = this.accessLayers.find(v => v.name === 'Custom')
      return (this.selectedDropdown === custom?.id) || false
    }
  },
  methods: {
    recursiveChecking (data) {
      return data.reduce((prev, curr) => {
        prev.push(curr.id)
        return prev
      }, [])
    },
    async fetchDataAccess () {
      try {
        const payload = {
          id: this.model.id
        }
        const { data } = await this.$store.dispatch('api/security/roles/fetchDataAccess', payload)
        if (data) {
          this.dataAccess = data
          const { dataAccessTypeId } = this.dataAccess
          console.log(this.dataAccess, dataAccessTypeId)
          this.selectedDropdown = dataAccessTypeId
          this.form.setFieldsValue({
            dataAccess: dataAccessTypeId
          })
          if (data.companyDepartmentResponses.length) {
            this.checkedKeys = this.recursiveChecking(data.companyDepartmentResponses)
          }
        }
      } catch (e) {}
    },
    async fetchDepartments () {
      this.departmentsLoading = true
      try {
        const { data } = await this.$store.dispatch('api/dropdown/fetchDepartmentDropdown')
        const { parentTree } = data
        this.departmentsTree = parentTree
      } catch (e) {}
      this.departmentsLoading = false
    },
    onExpand(expandedKeys) {
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck(checkedKeys, info) {
      this.checkedKeys = checkedKeys
      this.checkedKeysChecks = info.halfCheckedKeys
    },
    onSelect(selectedKeys, info) {
      console.log(selectedKeys, info)
      this.selectedKeys = selectedKeys
      this.checkedKeysChecks = info.halfCheckedKeys
    },
    async fetchLayers () {
      try {
        const { data } = await this.$store.dispatch('api/security/roles/fetchAccessLayer')
        const { dataAccessLayer } = data
        this.accessLayers = [...dataAccessLayer]
        this.dataAccessList = dataAccessLayer.map(layer => {
          return {
            value: layer.id,
            label: layer.name
          }
        })
      } catch (e) {}
    },
    clearData () {
      this.dataAccessList = []
      this.selectedKeys = []
      this.expandedKeys = []
      this.checkedKeys = []
      this.checkedKeysChecks = []
      this.dataAccess = null
      this.selectedDropdown = null
    },
    closeModal () {
      this.$emit('input', false)
      this.$emit('clearModel')
      this.clearData()
      this.form.resetFields()
    },
    showNotification () {
      const message = this.$t('notification.data-access.assigned')
      this.$notification.open({
        message,
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    handleSubmit () {
      this.form.validateFields((err, values) => !err && this.showInfo(values))
    },
    showInfo (values) {
      this.$confirm({
        title: this.$t('table.dialog.confirm-msg'),
        okText: this.$t('table.dialog.yes'),
        cancelText: this.$t('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          const id = values.dataAccess
          const accessLayer = { ...this.accessLayers.find(v => v.id === id) || {} }
          const {
            id: dataAccessTypeId,
            description
          } = accessLayer
          const data = {
            ...(this.dataAccess ? { id: this.dataAccess.id } : {}),
            dataAccessTypeId,
            description,
            securityUserRolesResponse: {
              id: this.model.id
            },
            ...(
              this.isCustom
                ? { companyDepartmentResponses: this.checkedKeys.map(v => ({ id: v })) }
                : {}
            )
          }
          try {
            await this.$store.dispatch('api/security/roles/dataAccess', data)
            this.showNotification()
            this.closeModal()
            this.$emit('refreshTable')
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
        }
      })
    }
  },
  created () {
    this.fields.forEach(v => this.form.getFieldDecorator(v))
  }
}
</script>
