<template>
  <div v-if="EPFModal">
    <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
      <a-form-item :label="`${$t('table.column.epf-type')} :`">
        <a-input
          :maxLength="25"
          v-decorator="['epfType', { rules: [{ required: true, message: $t('error.epf.required') }] }]"
        />
      </a-form-item>
      <a-form-item :label="`${$t('table.column.descriptions')} :`">
        <a-input type="textarea" mode="tags" style="width: 100%" :maxLength="100" v-decorator="['descriptions']" />
      </a-form-item>
      <EditableTable :columns="columns" :dataSource="dataSource" :editableColumns="editableCol" ref="editableTable">
        <template v-slot="{ isEditing, result }">
          <div style="display: flex; margin-top: 20px">
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
import InfoCircle from '@/assets/info-circle.svg'
import pick from 'lodash.pick'
// import pick from 'lodash.pick'

const fields = ['epfType', 'descriptions']

export default {
  name: 'EPFModal',
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      dataSource: [],
      fields,
      emptyRecord: false,
      error1: false,
      error2: false,
      record: null,
      columns: [
        {
          title: i18nRender('table.column.annual-gross-salary'),
          dataIndex: 'annualGrossSalary',
          children: [
            {
              title: i18nRender('table.column.min'),
              dataIndex: 'min',
              scopedSlots: { customRender: 'min' }
            },
            {
              title: i18nRender('table.column.range'),
              width: '7%'
            },
            {
              title: i18nRender('table.column.max'),
              dataIndex: 'max',
              scopedSlots: { customRender: 'max' }
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
          title: i18nRender('table.column.employee-contribution'),
          width: '15%',
          dataIndex: 'employeeContribution',
          scopedSlots: { customRender: 'employeeContribution' }
        },
        {
          title: i18nRender('table.column.employee-fix-amount'),
          width: '15%',
          dataIndex: 'employeeFixAmount',
          scopedSlots: { customRender: 'employeeFixAmount' }
        },
        {
          title: i18nRender('table.column.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      editableCol: [
        {
          dataIndex: 'min',
          maxLength: 10,
          valueType: 'text',
          smallerThan: 'max'
        },
        {
          dataIndex: 'max',
          maxLength: 10,
          valueType: 'text'
        },
        {
          dataIndex: 'employerContribution',
          maxLength: 10,
          valueType: 'percent'
        },
        {
          dataIndex: 'employeeContribution',
          maxLength: 10,
          valueType: 'percent'
        },
        {
          dataIndex: 'employeeFixAmount',
          maxLength: 10,
          valueType: 'text'
        }
      ],
      payrollEpfs: []
    }
  },
  components: { EditableTable },
  computed: {
    EPFModal: {
      get() {
        return this.$store.state.modal.EPFModal
      },
      set() {
        // just to prevent error log when @cancel
      }
    },
    editAction() {
      return this.record && this.record.id
    }
  },
  watch: {
    model(val) {
      this.record = { ...val }
      this.dataSource = val.payrollEpfs.map((el, index) => ({
        ...el,
        key: index,
        min: el.minAnnualGrossSalary,
        max: el.maxAnnualGrossSalary
      }))
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(val, fields))
      })
    }
  },
  methods: {
    closeModal() {
      this.$store.commit('modal/TOGGLE_EPF_MODAL')
      this.$emit('refreshTable')
      this.form.resetFields()
      this.dataSource = []
      this.emptyRecord = false
      this.record = null
    },
    handleSubmit(result) {
      // validate required fields
      this.form.validateFields((err) => {
        if (err) {
          this.error1 = true
        } else {
          this.error1 = false
        }
      })
      // validate editable table
      if (!this.$refs.editableTable.validateTable()) {
        this.error2 = true
      } else {
        this.error2 = false
      }
      // if both validation has no error
      if (!this.error1 && !this.error2) {
        this.showInfo(result)
      }
    },
    showNotification() {
      this.$notification.open({
        message: this.$t('table.dialog.epf-added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo(result) {
      this.payrollEpfs = result.map((el) => ({
        annualGrossSalary: {
          min: el.min,
          max: el.max
        },
        employerContribution: el.employerContribution,
        employeeContribution: el.employeeContribution,
        employeeFixAmount: el.employeeFixAmount
      }))
      this.$confirm({
        title: i18nRender('table.dialog.confirm-msg'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          const data = {
            epfType: this.form.getFieldValue('epfType'),
            descriptions: this.form.getFieldValue('descriptions'),
            payrollEpfs: this.payrollEpfs,
            status: 'Enable'
          }
          console.log(data)
          try {
            if (this.editAction) {
              await this.$store.dispatch('api/setup/payroll/epf/updateEPF', { id: this.model.id, ...data })
              this.$notification.open({
                message: this.$t('table.dialog.epf-updated'),
                icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
              })
            } else {
              await this.$store.dispatch('api/setup/payroll/epf/addEPF', data)
              this.$notification.open({
                message: this.$t('table.dialog.epf-added'),
                icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
              })
            }

            this.closeModal()
            this.dataSource = []
            this.$emit('refreshTable')
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
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
