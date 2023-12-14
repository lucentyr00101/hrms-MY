<template>
  <a-modal
    :title="getTitle"
    v-model="claimTypeModal"
    :width="1000"
    :cancelButtonProps="{ style: { display: 'none' } }"
    :okButtonProps="{ style: { display: 'none' } }"
    @cancel="closeModal()"
  >
    <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" @submit="handleSubmit">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item :label="$t('table.column.claim-type')">
            <a-input
              :disabled="disabled"
              :maxLength="25"
              v-decorator="['claimType', { rules: [{ required: true, message: $t('error.claim-type.required') }] }]"
            >
            </a-input
          ></a-form-item>
        </a-col>
        <a-col :span="12"
          ><a-form-item :label="$t('table.column.descriptions')">
            <a-input
              :disabled="disabled"
              :maxLength="100"
              type="textarea"
              mode="tags"
              style="width: 100%"
              v-decorator="['descriptions']"
            >
            </a-input> </a-form-item
        ></a-col>
        <a-col :span="12"
          ><a-form-item :label="$t('table.column.limited') + ' ?'">
            <a-checkbox
              :disabled="disabled"
              v-decorator="[
                'limited',
                {
                  valuePropName: 'checked',
                  initialValue: false
                }
              ]"
              style="margin-right: 8px"
            />
            <span>{{ $t('table.column.limited-claims-amount') }}</span></a-form-item
          ></a-col
        ></a-row
      >

      <a-descriptions :title="$t('table.column.custom-requirements')"></a-descriptions>
      <custom-editable-table
        :disabled="disabled"
        :columns="columns"
        :editableColumns="editableColumns"
        :dataSource="dataSource"
        ref="customEditableTable"
      >
        <template v-slot="{ result }">
          <p style="color: red">{{ result?.length === 0 ? $t('error.custom-requirements.required') : '' }}</p>
          <div style="display: flex">
            <a-space style="margin-left: auto">
              <a-button type="primary" v-if="editAction && disabled" @click="disabled = false">{{
                $t('table.dialog.edit')
              }}</a-button>
              <a-button type="primary" v-if="!disabled" @click="handleSubmit(result)">{{
                $t('table.dialog.confirm')
              }}</a-button>
            </a-space>
          </div>
        </template>
      </custom-editable-table>
    </a-form>
  </a-modal>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'
import CustomEditableTable from '@/components/Table/CustomEditableTable.vue'
import { i18nRender } from '@/locales'
import pick from 'lodash.pick'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'index' }
  },
  {
    customTitle: '<span class="error">*</span>' + i18nRender('table.column.name'),
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' },
    align: 'left',
    slots: { title: 'name' }
  },
  {
    title: i18nRender('table.column.required'),
    dataIndex: 'required',
    scopedSlots: { customRender: 'required' },
    align: 'center'
  },
  {
    customTitle: '<span class="error">*</span>' + i18nRender('table.column.type'),
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' },
    slots: { title: 'type' }
  },
  {
    title: i18nRender('table.column.action'),
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center'
  }
]

const editableColumns = [
  {
    title: i18nRender('table.column.name'),
    dataIndex: 'name',
    valueType: 'text',
    smallerThan: 'max',
    maxLength: 25,
    required: true
  },
  {
    dataIndex: 'required',
    valueType: 'checkbox',
    defaultValue: false
  },
  {
    title: i18nRender('table.column.type'),
    dataIndex: 'type',
    valueType: 'select',
    valueEnums: [
      {
        value: 'checkbox',
        label: 'Checkbox'
      },
      {
        value: 'text',
        label: 'Text'
      },
      {
        value: 'date',
        label: 'Date'
      }
    ],
    required: true
  },
  {
    dataIndex: 'employeeContribution'
  }
]

export default {
  components: { CustomEditableTable },
  name: 'ClaimTypeModal',
  props: {
    mdl: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      columns,
      editableColumns,
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      dataSource: [],
      hasError: false,
      model: this.mdl,
      disabled: false
    }
  },
  computed: {
    claimTypeModal: {
      get() {
        return this.$store.state.modal.claimTypeModal
      },
      set() {
        // just to prevent error log when @cancel
      }
    },
    getTitle() {
      if (!this.editAction) {
        return this.$t('table.modal.add-claim-type')
      }
      return this.disabled ? this.$t('table.modal.view-claim-type') : this.$t('table.modal.edit-claim-type')
    },
    editAction() {
      return this.model && this.model.id
    }
  },
  watch: {
    mdl(val) {
      this.$nextTick(() => {
        const data = pick(val, ['claimType', 'descriptions'])
        this.form.setFieldsValue({ ...data, limited: val.limited === 'Enable' })
        this.dataSource = [...val.companyCustomRequirements.map((el) => ({ ...el, required: el.required === 'true' }))]
        this.disabled = true
        this.model = val
      })
    }
  },
  methods: {
    closeModal() {
      this.$store.commit('modal/TOGGLE_CLAIM_TYPE_MODAL')
      this.form.resetFields()
      this.model = null
      this.dataSource = []
      this.disabled = false
      this.$refs.customEditableTable.resetFields()
    },

    handleSubmit(result) {
      // this.hasError = true
      this.form.validateFields((err, values) => {
        if (!this.$refs.customEditableTable.validateTable() || err || result.length === 0) return
        this.showInfo(values, result)
      })
    },

    showInfo(values, result) {
      const _this = this
      result.length === 0 ? (this.hasError = true) : (this.hasError = false)
      this.$confirm({
        title: _this.$t('table.dialog.confirm-msg'),
        okText: this.$t('table.dialog.yes'),
        cancelText: this.$t('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,

        onOk: async () => {
          try {
            const data = {
              ...values,
              limited: values.limited ? 'Enable' : 'Disable',
              companyCustomRequirements: result
            }
            if (this.editAction) {
              await _this.$store.dispatch('api/setup/company/claimType/claimTypeUpdate', {
                ...data,
                id: _this.model.id,
                status: _this.model.status
              })
              _this.$notification.open({
                message: i18nRender('table.dialog.claim-type-updated'),
                icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
              })
            } else {
              await _this.$store.dispatch('api/setup/company/claimType/claimTypeAdd', { ...data, status: 'Enable' })
              _this.$notification.open({
                message: i18nRender('table.dialog.claim-type-added'),
                icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
              })
            }

            _this.closeModal()
            _this.$emit('refreshTable')
          } catch (e) {
            _this.$message.error(e.response.data.message)
          }
        },

        onCancel() {
          console.log('Cancel')
        }
      })
    }
  }
}
</script>

<style scoped>
.confirm-modal-title {
  display: flex;
  gap: 20px;
  align-items: center;
}
</style>
