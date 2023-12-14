<template>
  <div>
    <a-modal
      :title="editAction ? ((editAction && disabled) ? $t('table.dialog.view-commission') : $t('table.dialog.update-commission')) : $t('table.dialog.add-commission')"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      v-model="commissionsModal"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      @cancel="closeModal()"
    >
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
        <a-form-item :label="`${$t('table.column.date')}: `">
          <a-date-picker
            :disabled="disabled"
            v-decorator="['date', { rules: [{ required: true, message: $tc('isRequired', $t('table.column.date')) }] }]"
            placeholder="Select date"
            format="YYYY/MM/DD"
            style="width: 100%"
          >
          </a-date-picker>
        </a-form-item>
        <a-form-item :label="`${$t('table.column.sequence-type')}: `">
          <a-select
            :disabled="disabled"
            :maxLength="25"
            v-decorator="[
              'sequence',
              { rules: [{ required: true, message: $tc('isRequired', $t('table.column.sequence-type')) }] }
            ]"
            :options="sequenceTypeDropdown"
            placeholder="example"
          />
        </a-form-item>
        <a-form-item :label="`${$t('table.column.employee')}: `">
          <a-select
            :disabled="disabled"
            show-search
            :maxLength="25"
            v-decorator="[
              'employee',
              { rules: [{ required: true, message: $tc('isRequired', $t('table.column.employee')) }] }
            ]"
            :options="employeeDropdown"
            placeholder="example"
          />
        </a-form-item>
        <a-form-item :label="`${$t('table.column.commissions-type')}: `">
          <a-select
            :disabled="disabled"
            :maxLength="25"
            @change="handleCommissionTypeChange"
            v-decorator="[
              'commissionsId',
              { rules: [{ required: true, message: $tc('isRequired', $t('table.column.commissions-type')) }] }
            ]"
            placeholder="example"
            :options="commissionDropdown"
        /></a-form-item>
        <a-form-item :label="`${$t('table.column.remarks')}: `" :style="{ margin: 0 }">
          <a-textarea
            :disabled="disabled"
            placeholder="Autosize height based on content lines="
            :auto-size="{ minRows: 2, maxRows: 6 }"
            :maxLength="100"
            style="width: 100%"
            v-decorator="['descriptions']"
          />
          <p :style="{ margin: 0, textAlign: 'right' }">{{ form.getFieldValue('descriptions')?.length || 0 }} / 100</p>
        </a-form-item>
        <a-form-item :label="`${$t('table.column.work-unit')}: `">
          <a-input
            :disabled="disabled"
            :auto-size="{ minRows: 2, maxRows: 6 }"
            :maxLength="8"
            style="width: 100%"
            type="number"
            min="0"
            step="1"
            placeholder="example"
            @change="amountChange"
            v-decorator="[
              'workUnit',
              { rules: [{ required: true, message: $tc('isRequired', $t('table.column.work-unit')) }, { pattern: /^(\d{1,8}|\d{1,8}\.\d{1,2})$/ig, message: $t('error.max-8-and-2-numerical-characters') }] }
            ]"
          />
        </a-form-item>
        <a-form-item :label="`${$t('table.column.rate')}: `">
          <a-input
            disabled
            :auto-size="{ minRows: 2, maxRows: 6 }"
            :maxLength="100"
            style="width: 100%"
            @change="amountChange"
            v-decorator="['rate']"
            placeholder="example"
          />
        </a-form-item>
        <a-form-item :label="`${$t('table.column.amount')}: `">
          <span>{{ amount }}</span>
        </a-form-item>
        <a-form-item>
          <a-checkbox-group v-decorator="['taxCheckboxStatus']" style="margin-left: 67%; width: 100%">
            <a-row>
              <a-col :span="6">
                <a-checkbox :disabled="disabled" value="epf"> {{ $t('table.column.epf') }} </a-checkbox>
              </a-col>
              <a-col :span="6">
                <a-checkbox :disabled="disabled" value="socso"> {{ $t('table.column.socso') }} </a-checkbox>
              </a-col>
              <a-col :span="6">
                <a-checkbox :disabled="disabled" value="eis"> {{ $t('table.column.eis') }} </a-checkbox>
              </a-col>
              <a-col :span="6">
                <a-checkbox :disabled="disabled" value="tax"> {{ $t('table.column.tax') }} </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
        <div :style="{ display: 'flex', justifyContent: 'flex-end', margin: '20px 120px 0' }">
          <a-button type="primary" v-if="editAction && disabled" @click="disabled = false">{{ $t('table.dialog.edit') }}</a-button>
          <a-button type="primary" v-if="!disabled" @click="handleSubmit">{{ $t('table.dialog.confirm') }}</a-button>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { i18nRender } from '@/locales'

import InfoCircle from '@/assets/info-circle.svg'
// import pick from 'lodash.pick'
import moment from 'moment'
import { taxCheckboxList } from '@/views/setup/payroll/AdditionalRemuneration/index.vue'

export default {
  name: 'CommissionsModal',
  props: {
    mdl: { type: Object, default: null }
  },
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      sequenceTypeDropdown: [],
      employeeDropdown: [],
      commissionDropdown: [],
      amount: null,
      disabled: false,
      model: null,
      loadSequenceType: async () => {
        const data = await this.$store.dispatch('api/dropdown/fetchSequenceDropdown')
        data.data.sequenceType.forEach((item) => {
          this.sequenceTypeDropdown = [
            ...this.sequenceTypeDropdown,
            {
              value: item.sequenceType,
              label: item.sequenceType
            }
          ]
        })
        return this.sequenceTypeDropdown
      },
      loadEmployee: async () => {
        const data = await this.$store.dispatch('api/dropdown/fetchActiveEmployeeDropdown')
        data.data.employeeDetailSmallResponses.forEach((item) => {
          this.employeeDropdown = [
            ...this.employeeDropdown,
            {
              value: item.fullName,
              label: item.fullName
            }
          ]
        })
        return this.employeeDropdown
      },
      loadCommission: async () => {
        const data = await this.$store.dispatch('api/dropdown/fetchPayrollCommissionsDropdown')
        data.data.payrollCommissionsType.forEach((item) => {
          this.commissionDropdown = [
            ...this.commissionDropdown,
            {
              value: item.id,
              label: item.payrollCommissionsType
            }
          ]
        })
        return this.commissionDropdown
      }
    }
  },
  created() {
    this.loadSequenceType()
    this.loadEmployee()
    this.loadCommission()
  },
  computed: {
    commissionsModal: {
      get() {
        return this.$store.state.modal.commissionsModal
      },
      set() {
        // just to prevent error log when @cancel
      }
    },
    editAction() {
      return this.model && this.model.id
    }
  },
  watch: {
    mdl(val) {
      this.$nextTick(() => {
        this.model = val
        this.disabled = true
        const { commissionsDate, sequence, employeeSetup, payrollCommissions, descriptions, workUnit, amount, epf, socso, eis, tax } = val
        this.form.setFieldsValue({
          date: moment(commissionsDate),
          sequence,
          employee: employeeSetup.fullName,
          commissionsId: payrollCommissions.id,
          descriptions,
          workUnit: String(workUnit),
          rate: String(payrollCommissions.rate),
          taxCheckboxStatus: [
            ...((epf === 'True') ? ['epf'] : []),
            ...((socso === 'True') ? ['socso'] : []),
            ...((eis === 'True') ? ['eis'] : []),
            ...((tax === 'True') ? ['tax'] : [])
          ]
        })
        this.amount = amount
      })
    }
  },
  methods: {
    async handleCommissionTypeChange(id) {
      const res = await this.$store.dispatch('api/setup/payroll/commission/detail', { id })
      const data = res.data
      this.amountChange()
      this.form.setFieldsValue({
        rate: data.rate,
        taxCheckboxStatus: taxCheckboxList.filter((el) => res.data[el] === 'True')
      })
    },
    amountChange() {
      this.$nextTick(() => {
        const workUnit = this.form.getFieldValue('workUnit')
        const rate = this.form.getFieldValue('rate')
        if (workUnit && rate) {
          this.amount = (parseFloat(workUnit) * parseFloat(rate)).toFixed(2)
        }
      })
    },
    closeModal() {
      this.$store.commit('modal/TOGGLE_COMMISSIONS_MODAL')
      this.model = null
      this.disabled = false
      this.form.resetFields()
    },
    handleSubmit() {
      this.form.validateFields((err, values) => !err && this.showInfo(values))
    },
    showNotification() {
      this.$notification.open({
        message: (this.editAction) ? this.$t('notification.main-payroll-commission.updated') : this.$t('notification.main-payroll-commission.added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo(values) {
      this.$confirm({
        title: i18nRender('table.dialog.confirm-msg'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          const { date, sequence, employee, commissionsId, descriptions, workUnit, rate, taxCheckboxStatus } = values
          const splitted = employee.split(',')
          const firstName = splitted ? splitted[1].trim() : ''
          const lastName = splitted ? splitted[0].trim() : ''
          const data = {
            id: this.mdl?.id || undefined,
            commissionsDate: moment(date).format('YYYY-MM-DD'),
            sequence,
            firstName,
            lastName,
            commissionsId,
            descriptions,
            workUnit: Number(workUnit).toFixed(2),
            rate: Number(rate),
            amount: Number(this.amount).toFixed(2),
            epf: (taxCheckboxStatus.includes('epf')) ? 'True' : 'False',
            socso: (taxCheckboxStatus.includes('socso')) ? 'True' : 'False',
            eis: (taxCheckboxStatus.includes('eis')) ? 'True' : 'False',
            tax: (taxCheckboxStatus.includes('tax')) ? 'True' : 'False'
          }
          // console.log(data)
          try {
            await this.$store.dispatch(`api/main/payroll/commission/${(this.editAction) ? 'update' : 'add'}`, data)
            this.showNotification()
            this.closeModal()
            this.$emit('refreshTable')
          } catch (e) {
            this.$message.error(e.response.data.message)
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

<style lang="less" scoped></style>
