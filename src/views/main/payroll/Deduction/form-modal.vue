<template>
  <div>
    <a-modal
      :title="modalTitle"
      v-model="modal.show"
      :width="700"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      :maskClosable="false"
      @cancel="closeModal()"
    >
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="Date" width="100%">
          <a-month-picker
            style="width: 100%"
            :disabled="isModalView"
            placeholder="Date"
            v-decorator="['deductionDate', { rules: [{ required: true, message: $t('error.date.required') }] }]"
          />
        </a-form-item>
        <a-form-item label="Sequence">
          <a-select
            show-search
            placeholder="Select"
            :disabled="isModalView"
            v-decorator="[
              'sequenceId',
              {
                rules: [{ required: true, message: $t('error.sequence.required') }]
              }
            ]"
          >
            <a-select-option
              v-for="(sequence, index) in dropdownsSequences"
              :key="index"
              :value="sequence.value"
              :disabled="isModalView">
              {{ sequence.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('table.column.employee')">
          <a-select
            show-search
            placeholder="Select"
            :disabled="isModalView"
            v-decorator="[
              'employeeId',
              {
                rules: [{ required: true, message: $t('error.employee.required') }]
              }
            ]"
          >
            <a-select-option
              v-for="(employees, index) in dropdownsEmployees"
              :key="index"
              :disabled="isModalView"
              :value="employees.value">
              {{ employees.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('table.column.deduction-type')">
          <a-select
            show-search
            placeholder="Select"
            :disabled="isModalView"
            v-decorator="[
              'payrollDeductionId',
              {
                rules: [{ required: true, message: $t('error.deduction-type.required') }]
              }
            ]"
          >
            <a-select-option
              v-for="(deductionTypes, index) in dropdownsDeductionTypes"
              :key="index"
              @click="(e) => handleDeductionTypeChange(dropdownsDeductionTypes, deductionTypes.value)"
              :disabled="isModalView"
              :value="deductionTypes.value">
              {{ deductionTypes.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="`${$t('table.column.remarks')}:`">
          <a-input
            type="textarea"
            :disabled="isModalView"
            :rows="3"
            mode="tags"
            placeholder="Autosize height based on content lines="
            :maxLength="100"
            v-decorator="['remarks']"
          >
          </a-input
        ></a-form-item>
        <a-form-item :label="`${$t('table.column.deduction-ref1')}: `">
          <a-input
            :disabled="isModalView"
            :maxLength="25"
            placeholder="example"
            v-decorator="['firstRef']"
          />
        </a-form-item>
        <a-form-item :label="`${$t('table.column.deduction-ref2')}: `">
          <a-input
            :disabled="isModalView"
            :maxLength="25"
            placeholder="example"
            v-decorator="['secondRef']"
          />
        </a-form-item>
        <a-form-item :label="`${$t('table.column.amount')}: `">
          <a-input
            :maxLength="10"
            @change="onChange"
            :disabled="isModalView"
            v-decorator="[
              'amount',
              {
                rules: [
                  { required: true, message: $t('error.amount.required') }, { validator: validate }
                ]
              },
            ]"
          />
        </a-form-item>
        <a-row type="flex" style="width: 440px; margin-left: 160px">
          <a-col v-for="(item, itemIndex) in checkboxList" :key="itemIndex" :span="6">
            <a-form-item style="margin-bottom: 0px" class="checkboxForm">
              <a-checkbox
                @change="(e) => handleChange(item)"
                :checked="item.checked === 'True'"
                style="display: flex; align-items: center; margin-left: 0px"
                v-decorator="[item.label.toLowerCase()]"
                :disabled="isModalView"
              >
                {{ item.label }}
              </a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>
        <div style="display: flex; align-items: center; justify-content: right; padding-right: 40px">
          <a-form-item>
            <a-button
              v-if="isModalView"
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
  name: 'MainPayrollDeductionModal',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      dropdownsEmployees: [],
      dropdownsDeductionTypes: [],
      dropdownsSequences: [],
      form: this.$form.createForm(this),
      fields: [
        'employeeId',
        'payrollDeductionId',
        'sequenceId',
        'remarks',
        'amount',
        'deductionDate',
        'firstRef',
        'secondRef',
        'epf',
        'socso',
        'eis',
        'tax'
      ],
      checkboxList: [
        { key: 0, label: this.$t('table.column.epf'), checked: 'False' },
        { key: 1, label: this.$t('table.column.socso'), checked: 'False' },
        { key: 2, label: this.$t('table.column.eis'), checked: 'False' },
        { key: 3, label: this.$t('table.column.tax'), checked: 'False' }
      ]
    }
  },
  computed: {
    mainParent() {
      return this.getParent('MainPayrollDeduction')
    },
    isModalView() {
      return this.modal?.action === 'view'
    },
    isModalEdit() {
      return this.modal?.action === 'edit'
    },
    modalTitle() {
      if (this.isModalView) {
        return this.$t('table.dialog.view-deduction')
      } else if (this.isModalEdit) {
        return this.$t('table.dialog.edit-deduction')
      }
      return this.$t('table.dialog.add-deduction')
    }
  },
  watch: {
    async modal(params) {
      const employees = this.getDropdownsEmployees()
      const sequences = this.getDropdownsSequences()
      const deductions = this.getDropdownsDeductionTypes()
      await Promise.all([employees, sequences, deductions])
      this.checkboxList.forEach(item => {
        item.checked = 'False'
      })
      if (params.show && params.action !== 'add' && params?.data) {
        this.fields.forEach((v) => this.form.getFieldDecorator(v))
        const { amount, deductionDate, remarks, sequence, employee, payrollDeduction, firstRef, secondRef, eis, epf, socso, tax } = params.data
        this.form.setFieldsValue({
          payrollDeductionId: payrollDeduction.id,
          employeeId: employee.id,
          amount,
          deductionDate: moment(deductionDate),
          remarks,
          firstRef,
          secondRef,
          sequenceId: this.dropdownsSequences.find(x => x.label === sequence).value
        })
        this.handleDeductionTypeChange([{
          value: payrollDeduction.id,
          eis,
          epf,
          socso,
          tax
        }], payrollDeduction.id)
      }
    }
  },
  methods: {
    onChange (e) {
      const value = e.target
      const reg = /^-?[0-9]*(\.[0-9]*)?$/
      if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
        this.value = value
        const amount = e.target.id
        this.form.setFieldsValue({ [amount]: this.value })
      }
    },
    validate (rule, value, callback) {
      const regex = /^\d*\.?\d*$/
      const regexDp = /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/

      if (value && !regex.test(value)) {
        callback(new Error(this.$t('error.nan')))
      } else {
        if (value && !regexDp.test(value)) {
          callback(new Error(this.$t('error.2dp')))
        } else {
          callback()
        }
      }
    },
    handleChange(data) {
      this.checkboxList.forEach((item) => {
        if (item.key === data.key) {
          if (item.checked === 'False') {
            item.checked = 'True'
          } else {
            item.checked = 'False'
          }
        }
      })
    },
    handleDeductionTypeChange(deductionTypes, payrollDeductionId) {
      const deductionType = deductionTypes.find(deductionType => deductionType.value === payrollDeductionId)
      if (deductionType) {
        this.checkboxList.forEach((item) => {
          const label = item.label.toLowerCase()
          item.checked = deductionType[label] || 'False'
        })
      }
    },
    async getDropdownsSequences() {
      this.dropdownsSequences = []
      const { data } = await this.$store.dispatch('api/dropdown/fetchSequenceDropdown')
      data.sequenceType.forEach((item) => {
        this.dropdownsSequences.push({ value: item.id, label: item.sequenceType })
      })
    },
    async getDropdownsEmployees() {
      this.dropdownsEmployees = []
      const employee = await this.$store.dispatch('api/dropdown/fetchActiveEmployeeDropdown')
      employee.data.employeeDetailSmallResponses.forEach((item) => {
        this.dropdownsEmployees.push({ value: item.id, label: item.fullName })
      })
    },
    async getDropdownsDeductionTypes() {
      this.dropdownsDeductionTypes = []
      const deductionTypes = await this.$store.dispatch('api/dropdown/fetchDeductionDropdown')
      deductionTypes.data.deductionTypes.forEach((item) => {
        this.dropdownsDeductionTypes.push({
          value: item.id,
          label: item.deductionType,
          eis: item.eis,
          epf: item.epf,
          socso: item.socso,
          tax: item.tax
        })
      })
    },
    handleSubmit() {
      this.form.validateFields((err, values) => !err && this.showInfo())
    },
    showNotification() {
      this.$notification.open({
        message: this.isModalEdit
            ? this.$t('notification.payroll.deduction.updated')
            : this.$t('notification.payroll.deduction.added'),
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
          const data = {
            ...(this.isModalEdit ? { id: this.modal.data.id } : {}),
            payrollDeductionId: this.form.getFieldValue('payrollDeductionId'),
            employeeId: this.form.getFieldValue('employeeId'),
            sequenceId: this.form.getFieldValue('sequenceId'),
            remarks: this.form.getFieldValue('remarks'),
            amount: this.form.getFieldValue('amount'),
            firstRef: this.form.getFieldValue('firstRef'),
            secondRef: this.form.getFieldValue('secondRef'),
            deductionDate: this.formatDate(this.form.getFieldValue('deductionDate'), 'YYYY-MM-DD'),
            epf: this.checkboxList[0].checked,
            socso: this.checkboxList[1].checked,
            eis: this.checkboxList[2].checked,
            tax: this.checkboxList[3].checked
          }
          try {
            await this.$store.dispatch(
              `api/main/payroll/deduction/${this.isModalEdit ? 'update' : 'add'}`,
              data
            )
            this.showNotification()
            this.closeModal()
            this.$emit('refreshTable')
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
