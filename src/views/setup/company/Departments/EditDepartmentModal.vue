<template>
  <div>
    <a-modal
      :title="$t('table.dialog.edit-department')"
      :width="800"
      v-model="editDepartmentModal"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      @cancel="closeModal()"
    >
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
        <a-form-item label="Department: ">
          <a-input
            :maxLength="25"
            v-decorator="['department', { rules: [{ required: true, message: $t('error.department-name.required') }] }]"
            placeholder="example"
          >
          </a-input
          ></a-form-item>
        <a-form-item label="Descriptions:">
          <a-input
            :maxLength="100"
            type="textarea"
            mode="tags"
            style="width: 100%"
            placeholder="Autoheight based on content lines="
            v-decorator="['descriptions']"
          >
          </a-input
          ></a-form-item>
        <a-form-item label="Parent:">
          <a-spin :spinning="loading">
            <a-tree-select
              v-decorator="['parent_id', { rules: [{ required: true, message: $t('error.parent.required') }] }]"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              placeholder="Please select"
              tree-default-expand-all
              :replaceFields="{title:'departmentName', value: 'name'}"
            />
          </a-spin>
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 1, offset: 18 }">
          <a-button class="confirm-btn" type="primary" @click="handleSubmit()">{{ $t('table.dialog.confirm') }}</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { TreeSelect } from 'ant-design-vue'
import InfoCircle from '@/assets/info-circle.svg'

const fields = ['department', 'descriptions', 'parent_id']
export default {
  name: 'EditDepartmentModal',

  data () {
    return {
      TreeSelect,
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      treeData: [],
      loading: false
    }
  },
  watch: {
    async editDepartmentModal (visible) {
      if (visible) {
        this.loading = true
        const data = await this.$store.dispatch('api/setup/company/department/fetchDropdownList')
        this.treeData = this.setTreeData([data.data.parentTree])
        this.loading = false
      }
    },
    model (v) {
      const { descriptions, departmentName, parent } = this.model
      this.form.setFieldsValue({
        department: departmentName,
        descriptions,
        parent_id: parent
      })
    }
  },
  props: {
    departmentList: { type: Array,
    default () {
      return null
      }
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  created () {
    fields.forEach(v => this.form.getFieldDecorator(v))
  },
  computed: {
    editDepartmentModal: {
      get () {
        return this.$store.state.modal.editDepartmentModal
      },
      set () {
        // just to prevent error log when @cancel
      }
    }
  },
  methods: {
    setTreeData (children) {
      return children.reduce((list, department) => {
        const id = department.name
        const data = {
          id,
          ...department,
          label: department.name,
          children: department.children?.length > 0 ? this.setTreeData(department.children) : []
        }
        list.push(data)
        return list
      }, [])
    },
    closeModal () {
      this.$store.commit('modal/TOGGLE_EDIT_DEPARTMENT_MODAL')
      this.form.resetFields()
    },
    handleSubmit () {
      const _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          _this.showInfo(values)
        }
      })
    },
    showNotif () {
      this.$notification.open({
        message: this.$t('table.dialog.department-updated'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo (values) {
      const _this = this
      this.$confirm({
        title: _this.$t('table.dialog.confirm-msg'),
        okText: _this.$t('table.dialog.yes'),
        cancelText: _this.$t('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        async onOk () {
          const data = {
            departmentName: values.department,
            descriptions: values.descriptions,
            parent: values.parent_id,
            id: _this.model.id
          }
          try {
            await _this.$store.dispatch('api/setup/company/department/update', data)
            _this.$emit('refreshTable')
            _this.showNotif()
            _this.closeModal()
          } catch (e) {
            _this.$message.error(e.response.data.message)
          }
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
