<template>
  <div>
    <FillEmployee :employee="employee" />
    <a-form :form="form" style="border: 1px solid #e8e8e8" :label-col="{ span: 9 }" @submit="handleSubmit">

      <Salary :form="form" :editable="editable"/>
      <Tax :form="form" :editable="editable"/>
      <PaymentEditableTable :form="form" :editable="editable" ref="paymentEditableTable" v-model="paymentMethodList"/>
      <EPF :form="form" :editable="editable"/>
      <SOCSO :form="form" :editable="editable"/>
      <PayrollEditableTable :form="form" :editable="editable" ref="payrollEditableTable" v-model="payrollList"/>

      <div style="float: right; margin-top: 20px">
        <a-button :disabled="editable" @click="handleCancel">{{ $t('table.dialog.cancel') }}</a-button>
        <a-button type="primary" style="margin-left: 20px" @click="editable ? handleEdit() : handleSubmit()">
          {{ editable ? $t('table.dialog.edit') : $t('table.dialog.confirm') }}
        </a-button>
      </div>
    </a-form>
  </div>
</template>

<script>
import Salary from './Salary.vue'
import Tax from './Tax.vue'
import EPF from './EPF.vue'
import SOCSO from './SOCSO.vue'
import PaymentEditableTable from './PaymentEditableTable.vue'
import PayrollEditableTable from './PayrollEditableTable.vue'
import { employeeSetupMixin } from '@/store/app-mixin'
import InfoCircle from '@/assets/info-circle.svg'
import pick from 'lodash.pick'
import { mapGetters } from 'vuex'
import FillEmployee from '@/components/Setup/Employee/EmployeeSetup/FillEmployee.vue'

const fields = [

  'epfNumber', 'epfType', 'payEpf',
  'socsoNumber', 'socsoType', 'paySocso', 'payEis'
]

export default {
  name: 'PayrollInformation',
  mixins: [employeeSetupMixin],
  props: {
    editable: { type: Boolean, default: null }
  },
  components: {
    Salary,
    Tax,
    EPF,
    SOCSO,
    PaymentEditableTable,
    PayrollEditableTable,
    FillEmployee
},
  data () {
    return {
      form: this.$form.createForm(this),
      emptyRecord: false,
      disabled: this.editable,
      formData: null,
      error: true,
      payrollEditing: false,
      fields,
      payroll: null,
      paymentMethodList: [],
      payrollList: [],
      salaryFields: [ 'salaryType', 'basicSalary', 'payFrequency' ],
      taxFields: [ 'taxType', 'taxNumber', 'taxBranch' ],
      epfFields: ['epfNumber', 'epfType'],
      socsoFields: ['socsoNumber', 'socsoType']
    }
  },
  created () {
    this.getEmployeePayroll()
  },
  computed: {
    ...mapGetters('api/setup/employee/employeeSetup', ['employee'])
  },
  methods: {
    getEmployeePayroll() {
      this.getEmployeeSetup(this.employeeId).then((res) => {
        if (res.data.employeeSetupPayrollResponse) {
          fields.forEach(v => this.form.getFieldDecorator(v))
          this.payroll = res.data.employeeSetupPayrollResponse
          const payroll = this.parseData(this.payroll)
          this.updatePayrollForm(payroll)
        } else {
          this.$emit('handleEditable')
        }
      })
    },
    getEditing (value) {
      console.log(value)
    },
    handleSelectChange (e) {
      console.log(e)
    },
    getEmptyRecord (value) {
      console.log(value)
    },
    updatePayrollForm (payroll) {
        // Salary
        this.form.setFieldsValue(pick(payroll.employeePayrollSalary, this.salaryFields))
        // Tax
        const tax = payroll.employeePayrollTax
        this.form.setFieldsValue(pick(tax, this.taxFields))
        this.form.setFieldsValue({ 'payTax': tax.payTax === 'Enable' })
        this.form.setFieldsValue({ 'selfDisabled': tax.selfDisabled === 'Enable' })
        this.form.setFieldsValue({ 'spouseDisabled': tax.spouseDisabled === 'Enable' })
        this.form.setFieldsValue({ 'borneByEmployer': tax.borneByEmployer === 'Enable' })
        // EPF
        const epf = payroll.employeePayrollEpf
        this.form.setFieldsValue(pick(epf, this.epfFields))
        this.form.setFieldsValue({ 'payEpf': epf.payEpf === 'Enable' })
        // SOCSO
        const socso = payroll.employeePayrollSocso
        this.form.setFieldsValue(pick(socso, this.socsoFields))
        this.form.setFieldsValue({ 'paySocso': socso.paySocso === 'Enable' })
        this.form.setFieldsValue({ 'payEis': socso.payEis === 'Enable' })
        // Editable tables
        this.paymentMethodList = payroll.employeePayrollPaymentMethods
        this.payrollList = payroll.employeePayrollPrevEmployerHistories

        for (const payrollItem of this.payrollList) {
          const updatedPickItem = {}
          for (const itemKey in payrollItem) {
            updatedPickItem[itemKey + payrollItem.id] = payrollItem[itemKey]
          }
         this.form.setFieldsValue(updatedPickItem)
        }
    },
    // (this.$refs.paymentEditableTable.validateTable() || this.$refs.payrollEditableTable.validateTable()) &&

    handleEdit () {
      this.$emit('handleEditable')
    },
    // remove reference on the data
    parseData (data) {
      return JSON.parse(JSON.stringify(data))
    },
    handleCancel () {
      if (this.payroll) {
        const payroll = this.parseData(this.payroll)
        this.updatePayrollForm(payroll)
      } else {
        this.form.resetFields()
        this.paymentMethodList = []
        this.payrollList = []
      }
      this.$emit('handleEditable')
    },
    convertToString (value) {
      if (value && value !== undefined) {
        if (value === true) {
          return 'Enable'
        } else { return 'Disable' }
      } else {
        return 'Disable'
      }
    },
    showNotification () {
      this.$notification.open({
        message: this.payroll ? this.$t('table.dialog.payroll-info-updated') : this.$t('table.dialog.payroll-info-added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },

    showInfo (values) {
      const _this = this
      this.$confirm({
        title: _this.$t('table.dialog.confirm-msg'),
        okText: 'Yes',
        cancelText: 'No',
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        async onOk () {
          const paymentList = _this.$refs.paymentEditableTable.paymentList()
          const paymentMethod = paymentList.map((item) => {
            return {
              id: item.id,
              bank: item.bank,
              accountNumber: item.accountNumber
            }
          })
          const payrollList = _this.$refs.payrollEditableTable.payrollList()
          const payrollHistory = payrollList.map((item) => {
            return {
              id: item.id,
              startDate: item.startDate,
              endDate: item.endDate,
              grossSalary: item.grossSalary,
              epfAmount: item.epfAmount,
              socsoAmount: item.socsoAmount,
              eisAmount: item.eisAmount,
              taxAmount: item.taxAmount
            }
          })
          const data = {
            'id': _this.payroll?.id || undefined,
            'employeeSetupId': _this.employeeId || undefined,
            'employeePayrollSalary': {
              'id': _this.payroll?.employeePayrollSalary?.id || undefined,
              'salaryType': _this.form.getFieldValue('salaryType'),
              'payFrequency': _this.form.getFieldValue('payFrequency'),
              'basicSalary': _this.form.getFieldValue('basicSalary')
            },
            'employeePayrollTax': {
              'id': _this.payroll?.employeePayrollTax?.id || undefined,
              'taxType': _this.form.getFieldValue('taxType') || '',
              'taxNumber': _this.form.getFieldValue('taxNumber') || '',
              'taxBranch': _this.form.getFieldValue('taxBranch') || '',
              'payTax': _this.convertToString(_this.form.getFieldValue('payTax')) || '',
              'selfDisabled': _this.convertToString(_this.form.getFieldValue('selfDisabled')) || '',
              'spouseDisabled': _this.convertToString(_this.form.getFieldValue('spouseDisabled')) || '',
              'borneByEmployer': _this.convertToString(_this.form.getFieldValue('borneByEmployer')) || ''
            },
            'employeePayrollPaymentMethods': paymentMethod,
            'employeePayrollEpf': {
              'id': _this.payroll?.employeePayrollEpf?.id || undefined,
              'epfType': _this.form.getFieldValue('epfType') || '',
              'epfNumber': _this.form.getFieldValue('epfNumber') || '',
              'payEpf': _this.convertToString(_this.form.getFieldValue('payEpf')) || ''
            },
            'employeePayrollSocso': {
              'id': _this.payroll?.employeePayrollSocso?.id || undefined,
              'socsoType': _this.form.getFieldValue('socsoType') || '',
              'socsoNumber': _this.form.getFieldValue('socsoNumber') || '',
              'paySocso': _this.convertToString(_this.form.getFieldValue('paySocso')) || '',
              'payEis': _this.convertToString(_this.form.getFieldValue('payEis')) || ''
            },
            'employeePayrollPrevEmployerHistories': payrollHistory
          }
          try {
            if (_this.payroll) {
              await _this.$store.dispatch('api/setup/employee/employeeSetup/payroll/updatePayroll', data)
            } else {
              await _this.$store.dispatch('api/setup/employee/employeeSetup/payroll/addPayroll', data)
            }
            _this.showNotification()
            _this.$emit('handleEditable')
            _this.$emit('titleIcon')
            _this.getEmployeePayroll()
          } catch (e) {
            _this.$message.error(e.response.data.message)
          }
          console.log(data)
        },

          onCancel () {
            console.log('Cancel')
          }
        })
      },
      handleSubmit () {
      console.log('execute handle submit')
      // validate required fields
      this.form.validateFields((err, values) => {
        if (!err) {
          this.error = false
        } else {
          this.error = true
        }
      })

      if (this.$refs.paymentEditableTable.validateTable()) {
        this.error = false
      } else {
        this.error = true
      }

      if (this.error === false) {
        this.showInfo()
      }
    }

  }
}
</script>

<style scoped>
.header {
  background-color: #e8e8e8;
  font-size: 15px;
  padding: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
