<template>
  <div>
    <a-modal
      :title="modalTitle"
      v-model="modal.show"
      :width="600"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      :maskClosable="false"
      @cancel="closeModal()"
    >
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="Date" width="100%">
          <a-date-picker
            style="width: 100%"
            :disabled="modal?.action === 'view'"
            placeholder="Date"
            v-decorator="['bonusDate', { rules: [{ required: true, message: 'Date is required.' }] }]"
          />
        </a-form-item>
        <a-form-item label="Sequence">
          <a-select
            show-search
            placeholder="Select"
            v-decorator="[
              'sequence',
              {
                rules: [{ required: true, message: 'Sequence is required' }]
              }
            ]"
          >
            <a-select-option
              v-for="(value, index) in enumsSequence"
              :key="index"
              :value="value"
              :disabled="modal?.action === 'view'"
              @click="handleSelectChangeSequence(value)"
              >{{ value }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('table.column.employee')">
          <a-select
            show-search
            placeholder="Select"
            v-decorator="[
              'employeeName',
              {
                rules: [{ required: true, message: $t('error.employee.required') }]
              }
            ]"
          >
            <a-select-option
              v-for="(employees, index) in enumeEmployees"
              :key="index"
              :disabled="modal?.action === 'view'"
              :value="employees.value + index"
              @click="handleSelectChangeEmployee(employees)"
              >{{ employees.label }}</a-select-option
            >
          </a-select>
        </a-form-item>

        <a-form-item :label="`${$t('table.column.remarks')}:`">
          <a-input
            :maxLength="100"
            type="textarea"
            :disabled="modal?.action === 'view'"
            :rows="3"
            mode="tags"
            v-decorator="['description']"
          >
          </a-input
        ></a-form-item>
        <a-form-item :label="`${$t('table.column.wages')}: `">
          <a-input-number style="width: 100%" :disabled="true" v-decorator="['wages']" />
        </a-form-item>
        <!-- <a-form-item label="Bonus Rate">
          <a-input
            type="number"
            style="width: 100%"
            :disabled="modal?.action === 'view'"
            min="0"
            step="0.1"
            v-decorator="[
              'bonusRate',
              {
                rules: [{ max: 6, message: $t('error.max-6-numerical-characters') }]
              }
            ]"
          />
        </a-form-item> -->
        <a-form-item :label="`${$t('table.column.amount')}: `">
          <a-input :disabled="modal?.action === 'view'" v-decorator="['amount']" />
        </a-form-item>
        <a-form-item>
          <a-checkbox-group v-decorator="['taxCheckboxStatus']" style="margin-left: 150px; width: 100%">
            <a-row>
              <a-col :span="6">
                <a-checkbox :disabled="modal?.action === 'view'" value="epf"> {{ $t('table.column.epf') }} </a-checkbox>
              </a-col>
              <a-col :span="6">
                <a-checkbox :disabled="modal?.action === 'view'" value="socso"> {{ $t('table.column.socso') }} </a-checkbox>
              </a-col>
              <a-col :span="6">
                <a-checkbox :disabled="modal?.action === 'view'" value="eis"> {{ $t('table.column.eis') }} </a-checkbox>
              </a-col>
              <a-col :span="6">
                <a-checkbox :disabled="modal?.action === 'view'" value="tax"> {{ $t('table.column.tax') }} </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
        <div style="display: flex; align-items: center; justify-content: right; padding-right: 40px">
          <a-form-item>
            <a-button
              v-if="modal?.action === 'view'"
              class="confirm-btn"
              type="primary"
              @click="mainParent?.modalHandler({ ...modal, action: 'edit' })"
              >{{ $t('table.dialog.edit') }}</a-button
            >
            <a-button
              v-else-if="/add|edit/gi.test(modal?.action)"
              class="confirm-btn"
              type="primary"
              @click="handleSubmit()"
              >{{ $t('table.dialog.confirm') }}</a-button
            >
          </a-form-item>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'
import moment from 'moment'
export default {
  name: 'MainPayrollBonusModal',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      enumeEmployees: [],
      enumsSequence: [],
      employee: null,
      sequence: null,
      lastName: null,
      firstName: null,
      form: this.$form.createForm(this),
      fields: [
        'employeeName',
        'lastName',
        'firstName',
        'sequence',
        'description',
        'bonusRate',
        'amount',
        'bonusDate',
        'wages',
        'taxCheckboxStatus'
      ]
    }
  },
  computed: {
    mainParent() {
      return this.getParent('MainPayrollBonus')
    },
    modalTitle() {
      return this.modal?.action === 'view'
        ? this.$t('table.dialog.view-bonus')
        : this.modal?.action === 'edit'
        ? this.$t('table.dialog.update-bonus')
        : this.$t('table.dialog.add-bonus')
    }
  },
  watch: {
    modal(params) {
      this.initializeData()
      if (params.show && params.action !== 'add' && params?.data) {
        this.fields.forEach((v) => this.form.getFieldDecorator(v))
        const { amount, bonusDate, bonusRate, description, sequence, employee, eis, epf, socso, tax } = params.data
        this.form.setFieldsValue({
          amount,
          bonusDate: moment(bonusDate),
          bonusRate,
          description,
          sequence,
          employeeName: employee.fullName,
          wages: employee.wages,
          taxCheckboxStatus: [
            ...((epf === 'True') ? ['epf'] : []),
            ...((socso === 'True') ? ['socso'] : []),
            ...((eis === 'True') ? ['eis'] : []),
            ...((tax === 'True') ? ['tax'] : [])
          ]
        })
        if (employee.fullName) {
          const Fname = employee.fullName.split(',')
          this.lastName = Fname[0].trim()
          this.firstName = Fname[1].trim()
        }
      }
    }
  },
  methods: {
    handleSelectChangeEmployee(data) {
      this.employee = data.id
      if (data.value) {
        const Fname = data.value.split(',')
        this.lastName = Fname[0].trim()
        this.firstName = Fname[1].trim()
        this.form.setFieldsValue({ wages: data.wages })
      }
    },
    handleSelectChangeSequence(data) {
      this.sequence = data
    },
    async initializeData() {
      this.enumeEmployees = []
      this.enumsSequence = []
      const { data } = await this.$store.dispatch('api/dropdown/fetchSequenceDropdown')
      data.sequenceType.forEach((item) => {
        this.enumsSequence.push(item.sequenceType)
      })
      const employee = await this.$store.dispatch('api/dropdown/fetchActiveEmployeeDropdown')
      employee.data.employeeDetailSmallResponses.forEach((item) => {
        this.enumeEmployees.push({ id: item.id, value: item.fullName, label: item.fullName, wages: item.wages })
      })
    },
    handleSubmit() {
      this.form.validateFields((err, values) => !err && this.showInfo())
    },
    showNotification() {
      this.$notification.open({
        message:
          this.modal.action === 'edit'
            ? this.$t('notification.payroll.bonus.updated')
            : this.$t('notification.payroll.bonus.added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo() {
      this.$confirm({
        title: this.$t('table.dialog.confirm-msg'),
        okText: this.$t('table.dialog.yes'),
        cancelText: this.$t('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          const [epf, socso, eis, tax] = this.form.getFieldValue('taxCheckboxStatus') ? this.form.getFieldValue('taxCheckboxStatus') : []
          const data = {
            ...(this.modal.action === 'edit' ? { id: this.modal.data.id } : {}),
            lastName: this.lastName,
            firstName: this.firstName,
            sequence: this.form.getFieldValue('sequence'),
            description: this.form.getFieldValue('description') || '',
            bonusRate: this.form.getFieldValue('bonusRate'),
            amount: this.form.getFieldValue('amount'),
            bonusDate: this.form.getFieldValue('bonusDate'),
            epf: epf ? 'True' : 'False',
            socso: socso ? 'True' : 'False',
            eis: eis ? 'True' : 'False',
            tax: tax ? 'True' : 'False'
          }
          try {
            await this.$store.dispatch(
              `api/main/payroll/bonus/${this.modal.action === 'edit' ? 'update' : 'add'}`,
              data
            )
            this.$emit('refreshTable')
            this.showNotification()
            this.closeModal()
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
        }
      })
    },
    closeModal() {
      this.form.resetFields()
    }
  }
}
</script>
