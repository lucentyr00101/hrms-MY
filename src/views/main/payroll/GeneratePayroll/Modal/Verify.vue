<template>
  <div class="generate-payroll verify">
    <a-row id="filter" type="flex" :gutter="[50, 8]">
      <a-col class="action-holder" :span="24">
        <a-button @click="processPayroll" type="primary">{{ $t('table.dialog.process-payroll') }}</a-button>
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item @click="deletePayslip">{{ $t('table.top.delete') }}</a-menu-item>
            <a-menu-item @click="deleteAll">{{ $t('table.dialog.delete-all') }}</a-menu-item>
          </a-menu>
          <a-button type="primary" icon="ellipsis" :style="{ margin: '0 0 0 10px' }"></a-button>
        </a-dropdown>
      </a-col>
      <a-col class="input-holder" :span="12">
        <span class="name">{{ $t('table.column.employee') }}:</span>
        <a-select class="input" placeholder="Select" :defaultValue="modal?.data['0']?.employeeSetup?.fullName">
          <a-select-option
            v-for="(employ, index) in modal?.data"
            :key="index"
            :value="employ?.employeeSetup?.fullName"
            @click="handleSelectChange(employ)"
            class="emp-payslip"
            >{{ employ?.employeeSetup?.employeeNumber }} - {{ employ?.employeeSetup?.fullName }}</a-select-option
          >
        </a-select>
      </a-col>
      <a-col class="input-holder" :span="12">
        <a-switch :checked="confirm === 'Yes' ? true : false" @change="(e) => handleStatusChange(e)" />
        <span class="name" :style="{ margin: '0 0 0 10px' }">{{ $t('payroll.mark-current-payslip') }}</span>
      </a-col>
      <a-col class="input-holder" :span="12">
        <span class="name">{{ $t('table.dialog.confirmed') }}:</span>
        <a-progress :percent="confirm === 'Yes' ? 100 : 50" status="normal" />
      </a-col>
    </a-row>
    <a-form :form="form">
      <a-row type="flex">
        <a-icon :style="{ fontSize: '22px', marginTop: '3px' }" type="caret-left" />
        <div class="netpay-wrapper">
          <p class="item">
            <span class="name"
              >{{
                employee ? employee?.employeeSetup?.employeeNumber : modal?.data['0']?.employeeSetup?.employeeNumber
              }}
              - {{ employee ? employee?.employeeSetup?.fullName : modal?.data['0']?.employeeSetup?.fullName }}</span
            >
            <a-form-item v-if="/updateVerify/gi.test(modal?.action)">
              <a-input
                @keypress="isNumber($event)"
                :maxLength="11"
                v-decorator="[
                  'netPay',
                  {
                    rules: [
                      { required: true, message: $tc('isRequired', 'Net Pay') },
                      { validator: noWhitespaceAllowed, message: $t('error.code.no-space') }
                    ],
                    initialValue: employee ? employee?.netIncome : modal?.data['0']?.netIncome
                  }
                ]"
              />
            </a-form-item>
            <span v-else class="value">{{ employee ? employee?.netIncome : modal?.data['0']?.netIncome }}</span>
          </p>
        </div>
        <a-icon :style="{ fontSize: '22px', marginTop: '3px' }" type="caret-right" />
      </a-row>
      <a-row class="details" type="flex" :gutter="[50, 8]">
        <a-col class="details-holder" :span="24">
          <p class="title">{{ $t('table.card.income-and-deduction') }}</p>
          <div class="details-wrapper">
            <p
              v-show="item.value !== 0 && item.value !== null"
              v-for="(item, index) in incomeAndDeduction"
              :key="index"
              :class="['item', item.type]"
            >
              <span class="name">{{ item.name }}</span>
              <a-form-item v-if="/updateVerify/gi.test(modal?.action)">
                <a-input
                  @keypress="isNumber($event)"
                  :maxLength="11"
                  v-decorator="[
                    `data1${index}`,
                    {
                      rules: [
                        { required: true, message: $tc('isRequired', item.name) },
                        { validator: noWhitespaceAllowed, message: $t('error.code.no-space') }
                      ],
                      initialValue: item.value
                    }
                  ]"
                />
              </a-form-item>
              <span v-else class="value">{{ item.value }}</span>
            </p>
          </div>
        </a-col>
      </a-row>
      <a-row class="details" type="flex" :gutter="[50, 8]">
        <div :style="{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', width: '97%' }">
          <a-button
            v-if="modal?.action === 'viewVerify'"
            type="primary"
            :style="{ width: '66px' }"
            @click="mainParent?.modalHandler({ ...modal, action: 'updateVerify' })"
            >{{ $t('table.dialog.edit') }}</a-button
          >
          <a-button
            v-else-if="/updateVerify/gi.test(modal?.action)"
            class="confirm-btn"
            type="primary"
            @click="handleSubmit"
            >{{ $t('table.dialog.confirm') }}</a-button
          >
        </div>
      </a-row>
      <a-row class="details" type="flex" :gutter="[50, 8]">
        <a-col class="details-holder" :span="12">
          <p class="title">{{ $t('table.column.employee-contribution') }}</p>
          <div class="details-wrapper">
            <p v-for="(item, index) in employeeContribution" :key="index" :class="['item', item.type]">
              <span class="name">{{ item.name }}</span>
              <a-form-item v-if="/updateVerify/gi.test(modal?.action)">
                <a-input
                  @keypress="isNumber($event)"
                  :maxLength="11"
                  v-decorator="[
                    `data2${index}`,
                    {
                      rules: [
                        { required: true, message: $tc('isRequired', item.name) },
                        { validator: noWhitespaceAllowed, message: $t('error.code.no-space') }
                      ],
                      initialValue: item.value
                    }
                  ]"
                />
              </a-form-item>
              <span v-else class="value">{{ item.value }}</span>
            </p>
          </div>
        </a-col>
        <a-col class="details-holder" :span="12">
          <p class="title">{{ $t('table.column.employer-contribution') }}</p>
          <div class="details-wrapper">
            <p
              v-show="item.value !== 0 && item.value !== null"
              v-for="(item, index) in employerContribution"
              :key="index"
              :class="['item', item.type]"
            >
              <span class="name">{{ item.name }}</span>
              <a-form-item v-if="/updateVerify/gi.test(modal?.action)">
                <a-input
                  @keypress="isNumber($event)"
                  :maxLength="11"
                  v-decorator="[
                    `data3${index}`,
                    {
                      rules: [
                        { required: true, message: $tc('isRequired', item.name) },
                        { validator: noWhitespaceAllowed, message: $t('error.code.no-space') }
                      ],
                      initialValue: item.value
                    }
                  ]"
                />
              </a-form-item>
              <span v-else class="value">{{ item.value }}</span>
            </p>
          </div>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
import { noWhitespaceAllowed } from '@/utils/validators'
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'MainPayrollGeneratePayrollVerify',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      confirm: this.modal?.data['0']?.isConfirmed,
      employee: null
    }
  },
  computed: {
    mainParent() {
      return this.getParent('MainPayrollGeneratePayroll')
    },
    incomeAndDeduction() {
      return [
        {
          name: this.$t('table.dialog.basic-salary'),
          value: this.employee ? this.employee?.basicSalary : this.modal?.data['0']?.basicSalary || 0,
          type: 'credit'
        },
        {
          name: this.$t('table.dialog.commissions'),
          value: this.employee ? this.employee?.commissions : this.modal?.data['0']?.commissions || 0,
          type: 'credit'
        },
        {
          name: this.$t('table.dialog.bonus'),
          value: this.employee ? this.employee?.bonus : this.modal?.data['0']?.bonus || 0,
          type: 'credit'
        },
        {
          name: this.$t('table.dialog.allowance'),
          value: this.employee ? this.employee?.allowance : this.modal?.data['0']?.allowance || 0,
          type: 'credit'
        },
        {
          name: this.$t('table.dialog.additional-remuneration'),
          value: this.employee
            ? this.employee?.additionalRemuneration
            : this.modal?.data['0']?.additionalRemuneration || 0,
          type: 'credit'
        },
        {
          name: this.$t('table.dialog.overtime'),
          value: this.employee ? this.employee?.overtimePremiums : this.modal?.data['0']?.overtimePremiums || 0,
          type: 'credit'
        },
        {
          name: this.$t('table.dialog.work-shift'),
          value: this.employee ? this.employee?.workShiftPremiums : this.modal?.data['0']?.workShiftPremiums || 0,
          type: 'credit'
        },
        {
          name: this.$t('table.dialog.rest-day'),
          value: this.employee ? this.employee?.restDayPremiums : this.modal?.data['0']?.restDayPremiums || 0,
          type: 'credit'
        },
        {
          name: this.$t('table.column.holiday'),
          value: this.employee ? this.employee?.holidayPremiums : this.modal?.data['0']?.holidayPremiums || 0,
          type: 'credit'
        },
        {
          name: this.$t('table.dialog.claims'),
          value: this.employee ? this.employee?.claims : this.modal?.data['0']?.claims || 0,
          type: 'credit'
        },
        {
          name: this.$t('table.dialog.deduction'),
          value: this.employee ? this.employee?.deductions : this.modal?.data['0']?.deductions || 0,
          type: 'debit'
        },
        {
          name: this.$t('table.dialog.unpaid-leave'),
          value: this.employee
            ? this.employee?.unpaidLeave !== null
              ? this.employee?.unpaidLeave
              : 0
            : (this.modal?.data['0']?.unpaidLeave !== null ? this.modal?.data['0']?.unpaidLeave : 0) || 0,
          type: 'debit'
        },
        {
          name: this.$t('table.dialog.late'),
          value: this.employee ? this.employee?.lateDeduction : this.modal?.data['0']?.lateDeduction || 0,
          type: 'debit'
        },
        {
          name: this.$t('table.dialog.undertime'),
          value: this.employee ? this.employee?.underTimeDeduction : this.modal?.data['0']?.underTimeDeduction || 0,
          type: 'debit'
        },
        {
          name: this.$t('table.dialog.loans'),
          value: this.employee ? this.employee?.loans : this.modal?.data['0']?.loans || 0,
          type: 'debit'
        }
      ]
    },
    employeeContribution() {
      return [
        {
          name: 'EPF',
          value: this.employee
            ? this.employee?.epfEmployeeContribution
            : this.modal?.data['0']?.epfEmployeeContribution || 0
        },
        {
          name: 'SOCSO',
          value: this.employee
            ? this.employee?.socsoEmployeeContribution
            : this.modal?.data['0']?.socsoEmployeeContribution || 0
        },
        {
          name: 'EIS',
          value: this.employee
            ? this.employee?.eisEmployeeContribution
            : this.modal?.data['0']?.eisEmployeeContribution || 0
        },
        {
          name: 'Tax',
          value: this.employee
            ? this.employee?.taxPerCutoffEmployee !== null
              ? this.employee?.taxPerCutoffEmployee
              : 0
            : (this.modal?.data['0']?.taxPerCutoffEmployee !== null
                ? this.modal?.data['0']?.taxPerCutoffEmployee
                : 0) || 0
        }
      ]
    },
    employerContribution() {
      return [
        {
          name: 'EPF',
          value: this.employee
            ? this.employee?.epfEmployerContribution
            : this.modal?.data['0']?.epfEmployerContribution || 0
        },
        {
          name: 'SOCSO',
          value: this.employee
            ? this.employee?.socsoEmployerContribution
            : this.modal?.data['0']?.socsoEmployerContribution || 0
        },
        {
          name: 'EIS',
          value: this.employee
            ? this.employee?.eisEmployerContribution
            : this.modal?.data['0']?.eisEmployerContribution || 0
        },
        {
          name: 'Tax',
          value: this.employee
            ? this.employee?.taxPerCutoffEmployer !== null
              ? this.employee?.taxPerCutoffEmployer
              : 0
            : (this.modal?.data['0']?.taxPerCutoffEmployer !== null
                ? this.modal?.data['0']?.taxPerCutoffEmployer
                : 0) || 0
        }
      ]
    }
  },
  methods: {
    noWhitespaceAllowed,
    isNumber: function (event) {
      if (!/^(\d)*(\.)?([0-9]{1})?$/.test(event.key)) return event.preventDefault()
    },
    handleSelectChange(emp) {
      console.log(emp)
      this.employee = emp
      this.confirm = emp.isConfirmed
    },
    async handleStatusChange(checked) {
      try {
        this.confirm = checked ? 'Yes' : 'No'
        await this.$store.dispatch('api/main/payroll/generalPayroll/confirm', {
          id: this.employee ? this.employee?.id : this.modal?.data['0']?.id,
          isConfirmed: checked ? 'Yes' : 'No'
        })
        this.mainParent.getVerify()
      } catch (e) {
        this.$message.error(e.response)
      }
    },
    async processPayroll() {
      try {
        await this.$store.dispatch('api/main/payroll/generalPayroll/processPayroll', { id: this.modal?.data.id })
        this.mainParent.summary.status = 'Complete'
        this.mainParent.getSummary()
        this.$notification.open({
          message: this.$t('notification.generate-payroll.completed'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
      } catch (e) {
        this.$message.error(e.response)
      }
    },
    async deletePayslip() {
      try {
        await this.$store.dispatch('api/main/payroll/generalPayroll/deletePayslip', {
          payrollSummaryId: this.modal?.data.id,
          employeeSetupId: this.employee ? this.employee?.employeeSetup?.id : this.modal?.data['0']?.employeeSetup?.id
        })
        this.mainParent.getSummary()
        this.$notification.open({
          message: this.$t('notification.generate-payroll-payslip.deleted'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
      } catch (e) {
        this.$message.error(e.response)
      }
    },
    async deleteAll() {
      try {
        await this.$store.dispatch('api/main/payroll/generalPayroll/deleteAll', { id: this.modal?.data.id })
        this.mainParent.getSummary()
        this.$notification.open({
          message: this.$t('notification.generate-payroll.deleted'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
      } catch (e) {
        this.$message.error(e.response)
      }
    },
    handleSubmit(result) {
      this.form.validateFields((err, values) => !err && this.showInfo(result))
    },
    showNotification() {
      this.$notification.open({
        message: this.$t('notification.generate-payroll-payslip.updated'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo() {
      this.$confirm({
        title: this.$t('save.confirm'),
        okText: 'Yes',
        cancelText: 'No',
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          const data = {
            id: this.employee ? this.employee?.id : this.modal?.data['0']?.id,
            grossSalary: this.form.getFieldValue('netPay'),
            basicSalary: this.form.getFieldValue('data10'),
            overtimePremiums: this.form.getFieldValue('data15'),
            workShiftPremiums: this.form.getFieldValue('data16'),
            restDayPremiums: this.form.getFieldValue('data17'),
            holidayPremiums: this.form.getFieldValue('data18'),
            claims: this.form.getFieldValue('data19'),
            allowance: this.form.getFieldValue('data13'),
            deductions: this.form.getFieldValue('data110'),
            additionalRemuneration: this.form.getFieldValue('data14'),
            bonus: this.form.getFieldValue('data12'),
            commissions: this.form.getFieldValue('data11'),
            unpaidLeave: this.form.getFieldValue('data111'),
            lateDeduction: this.form.getFieldValue('data112'),
            underTimeDeduction: this.form.getFieldValue('data113'),
            loans: this.form.getFieldValue('data114'),
            epfEmployeeContribution: this.form.getFieldValue('data20'),
            socsoEmployeeContribution: this.form.getFieldValue('data21'),
            eisEmployeeContribution: this.form.getFieldValue('data22'),
            taxPerCutoffEmployee: this.form.getFieldValue('data23'),
            epfEmployerContribution: this.form.getFieldValue('data30'),
            socsoEmployerContribution: this.form.getFieldValue('data31'),
            eisEmployerContribution: this.form.getFieldValue('data32'),
            taxPerCutoffEmployer: this.form.getFieldValue('data33')
          }
          console.log(data)
          try {
            await this.$store.dispatch('api/main/payroll/generalPayroll/verifyUpdate', data)
            this.showNotification()
            this.mainParent.getSummary()
            this.mainParent.refreshTable()
          } catch (error) {
            this.$message.error(error.response.data.message)
          }
        },
        onCancel: () => {
          // console.log('Cancel')
        }
      })
    }
  }
}
</script>

<style>
.ant-modal-body {
  padding-top: 0;
}

.emp-payslip:last-child {
  display: none;
}

.item .ant-form-item {
  margin-bottom: 0;
}

.verify .input-holder {
  display: flex;
  align-items: center;
}

.verify .input-holder .name {
  min-width: 90px;
}

.verify .input-holder .input {
  width: 100%;
}

.verify .netpay-wrapper {
  width: 95%;
  height: 26px;
  border-radius: 10px;
  background: rgba(196, 196, 196, 0.3);
  margin-bottom: 15px;
}

.verify .netpay-wrapper .item {
  display: flex;
  justify-content: space-between;
  padding: 2px 40px;
}

.verify .details {
  margin: 0 !important;
}

.verify .details .details-holder .title {
  margin: 0;
  font-weight: 700;
  font-size: 14px;
}

.verify .details .details-holder .details-wrapper {
  width: 100%;
  margin: 10px 0;
  border-radius: 10px;
  overflow: hidden;
}

.verify .details .details-holder .details-wrapper .item {
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 5px 40px;
  background-color: #e6f7ff;
}

.verify .details .details-holder .details-wrapper .item:first-child {
  padding-top: 10px;
}

.verify .details .details-holder .details-wrapper .item:last-child {
  padding-bottom: 10px;
}

.verify .details .details-holder .details-wrapper .item.credit {
  background-color: rgba(90, 216, 166, 0.3);
}

.verify .details .details-holder .details-wrapper .item.debit {
  background-color: rgba(237, 28, 36, 0.38);
}
</style>
