<template>
  <div v-show="editSocsoModal">
    <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
      <a-form-item :label="`${$t('table.column.socso-type')} :`">
        <a-input
          :maxLength="25"
          v-decorator="['socsoType', { rules: [{ required: true, message: $t('error.socso.required') }] }]"
        >
        </a-input
      ></a-form-item>
      <a-form-item :label="`${$t('table.column.descriptions')} :`">
        <a-input :maxLength="100" type="textarea" mode="tags" style="width: 100%" v-decorator="['descriptions']">
        </a-input>
      </a-form-item>
      <EditableTable :columns="columns" :dataSource="salaryRanges" :editableColumns="editableCol" ref="editableTable">
        <template v-slot="{ isEditing, result }">
          <div style="display: flex">
            <a-space style="margin-left: auto">
              <a-button class="confirm-btn" type="secondary" @click="closeModal()">{{
                $t('table.dialog.cancel')
              }}</a-button>
              <a-button class="confirm-btn" type="primary" @click="handleSubmit(result)">{{
                $t('table.dialog.confirm')
              }}</a-button>
            </a-space>
          </div>
        </template>
      </EditableTable>
    </a-form>
  </div>
</template>

<script>
import { i18nRender } from '@/locales'
import EditableTable from '@/components/Table/EditableTable.vue'
import pick from 'lodash.pick'

const fields = ['socsoType', 'descriptions']

export default {
  name: 'EditSocsoModal',
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      dataSource: [],
      editableCol: [
        {
          dataIndex: 'minAnnualGrossSalary',
          smallerThan: 'maxAnnualGrossSalary',
          maxLength: 10,
          valueType: 'text'
        },
        {
          dataIndex: 'maxAnnualGrossSalary',
          maxLength: 10,
          valueType: 'text'
        },
        {
          dataIndex: 'employerContribution',
          maxLength: 10,
          valueType: 'text'
        },
        {
          dataIndex: 'employerContributionSecondCategory',
          maxLength: 10,
          valueType: 'text'
        },
        {
          dataIndex: 'employeeContribution',
          maxLength: 10,
          valueType: 'text'
        }
      ],
      fields,
      columns: [
        {
          title: i18nRender('table.column.annual-gross-salary'),
          children: [
            {
              title: i18nRender('table.column.min'),
              dataIndex: 'minAnnualGrossSalary',
              scopedSlots: { customRender: 'minAnnualGrossSalary' }
            },
            {
              title: i18nRender('table.column.max'),
              dataIndex: 'maxAnnualGrossSalary',
              scopedSlots: { customRender: 'maxAnnualGrossSalary' }
            }
          ]
        },
        {
          title: i18nRender('table.column.employer-contribution'),
          width: '15%',
          dataIndex: 'employerContribution',
          scopedSlots: { customRender: 'employerContribution' }
        },
        {
          title: i18nRender('table.column.employer-contribution-2'),
          width: '15%',
          dataIndex: 'employerContributionSecondCategory',
          scopedSlots: { customRender: 'employerContributionSecondCategory' }
        },
        {
          title: i18nRender('table.column.employee-contribution'),
          width: '15%',
          dataIndex: 'employeeContribution',
          scopedSlots: { customRender: 'employeeContribution' }
        },
        {
          title: i18nRender('table.column.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      salaryRanges: []
    }
  },
  components: { EditableTable },
  computed: {
    editSocsoModal: {
      get() {
        return this.$store.state.modal.editSocsoModal
      },
      set() {
        // just to prevent error log when @cancel
      }
    }
  },
  created() {
    fields.forEach((v) => this.form.getFieldDecorator(v))
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
      console.log(this.model.payrollSocsoList)
      this.salaryRanges = this.model.payrollSocsoList
    })
  },
  methods: {
    closeModal() {
      this.salaryRanges = []
      this.$store.commit('modal/TOGGLE_EDIT_SOCSO_MODAL')
    },
    handleSubmit(result) {
      const _this = this

      this.form.validateFields((err, values) => {
        if (this.$refs.editableTable.validateTable() && !err) {
          console.log({ ...values, data: result })
          const payload = { ..._this.model, ...values, payrollSocsoList: result }
          console.log(payload)
          _this.showInfo(payload)
        }
      })
    },
    showInfo(payload) {
      this.$confirm({
        title: i18nRender('table.dialog.confirm-msg'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        onOk: async () => {
          try {
            await this.$store.dispatch('api/setup/payroll/socso/update', payload)
            this.$notification.open({
              message: i18nRender('notification.socso.updated'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
            this.closeModal()
            this.$emit('refreshTable')
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    }
  },
  props: {
    data: {
      type: Array,
      default() {
        return null
      }
    },
    model: {
      type: Object,
      default: () => null
    }
  }
}
</script>
