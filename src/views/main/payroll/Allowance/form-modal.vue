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
            v-decorator="['allowanceDate', { rules: [{ required: true, message: $t('error.date.required') }] }]"
          />
        </a-form-item>
        <a-form-item label="Sequence">
          <a-select
            show-search
            placeholder="Select"
            :disabled="isModalView"
            v-decorator="[
              'sequence',
              {
                rules: [{ required: true, message: $t('error.sequence.required') }]
              }
            ]"
          >
            <a-select-option
              v-for="(value, index) in dropdownsSequences"
              :key="index"
              :value="value"
              :disabled="isModalView">
              {{ value }}
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
        <a-form-item :label="$t('table.column.allowance-type')">
          <a-select
            show-search
            placeholder="Select"
            :disabled="isModalView"
            v-decorator="[
              'allowanceId',
              {
                rules: [{ required: true, message: $t('error.allowance-type.required') }]
              }
            ]"
          >
            <a-select-option
              v-for="(allowanceTypes, index) in dropdownsAllowanceTypes"
              :key="index"
              @click="(e) => handleAllowanceTypeChange(dropdownsAllowanceTypes, allowanceTypes.value)"
              :disabled="isModalView"
              :value="allowanceTypes.value">
              {{ allowanceTypes.label }}
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
            v-decorator="['descriptions']"
          >
          </a-input
        ></a-form-item>
        <a-form-item :label="`${$t('table.column.amount')}: `">
          <a-input
            :disabled="isModalView"
            placeholder="example"
            v-decorator="['amount']"
            type="number"
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
  name: 'MainPayrollAllowanceModal',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      dropdownsEmployees: [],
      dropdownsAllowanceTypes: [],
      dropdownsSequences: [],
      form: this.$form.createForm(this),
      fields: [
        'employeeId',
        'allowanceId',
        'sequence',
        'descriptions',
        'amount',
        'allowanceDate'
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
      return this.getParent('MainPayrollAllowance')
    },
    isModalView() {
      return this.modal?.action === 'view'
    },
    isModalEdit() {
      return this.modal?.action === 'edit'
    },
    modalTitle() {
      if (this.isModalView) {
        return this.$t('table.dialog.view-allowance')
      } else if (this.isModalEdit) {
        return this.$t('table.dialog.edit-allowance')
      }
      return this.$t('table.dialog.add-allowance')
    }
  },
  watch: {
    modal(params) {
      this.getDropdownsEmployees()
      this.getDropdownsSequences()
      this.getDropdownsAllowanceTypes()
      this.checkboxList.forEach(item => {
        item.checked = 'False'
      })
      if (params.show && params.action !== 'add' && params?.data) {
        this.fields.forEach((v) => this.form.getFieldDecorator(v))
        const { amount, allowanceDate, descriptions, sequence, employee, payrollAllowance, eis, epf, socso, tax } = params.data
        this.form.setFieldsValue({
          allowanceId: payrollAllowance.id,
          employeeId: employee.id,
          amount,
          allowanceDate: moment(allowanceDate),
          descriptions,
          sequence
        })
        this.handleAllowanceTypeChange([{
          value: payrollAllowance.id,
          eis,
          epf,
          socso,
          tax
        }], payrollAllowance.id)
      }
    }
  },
  methods: {
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
    handleAllowanceTypeChange(allowanceTypes, allowanceId) {
      const allowanceType = allowanceTypes.find(allowanceType => allowanceType.value === allowanceId)
      if (allowanceType) {
        this.checkboxList.forEach((item) => {
          const label = item.label.toLowerCase()
          item.checked = allowanceType[label] || 'False'
        })
      }
    },
    async getDropdownsSequences() {
      this.dropdownsSequences = []
      const { data } = await this.$store.dispatch('api/dropdown/fetchSequenceDropdown')
      data.sequenceType.forEach((item) => {
        this.dropdownsSequences.push(item.sequenceType)
      })
    },
    async getDropdownsEmployees() {
      this.dropdownsEmployees = []
      const employee = await this.$store.dispatch('api/dropdown/fetchActiveEmployeeDropdown')
      employee.data.employeeDetailSmallResponses.forEach((item) => {
        this.dropdownsEmployees.push({ value: item.id, label: item.fullName })
      })
    },
    async getDropdownsAllowanceTypes() {
      this.dropdownsAllowanceTypes = []
      const allowanceTypes = await this.$store.dispatch('api/dropdown/fetchAllowanceDropdown')
      allowanceTypes.data.allowanceType.forEach((item) => {
        this.dropdownsAllowanceTypes.push({
          value: item.id,
          label: item.allowanceType,
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
            ? this.$t('notification.payroll.allowance.updated')
            : this.$t('notification.payroll.allowance.added'),
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
            allowanceId: this.form.getFieldValue('allowanceId'),
            employeeId: this.form.getFieldValue('employeeId'),
            sequence: this.form.getFieldValue('sequence'),
            descriptions: this.form.getFieldValue('descriptions'),
            amount: this.form.getFieldValue('amount'),
            allowanceDate: this.formatDate(this.form.getFieldValue('allowanceDate'), 'YYYY-MM-DD'),
            epf: this.checkboxList[0].checked,
            socso: this.checkboxList[1].checked,
            eis: this.checkboxList[2].checked,
            tax: this.checkboxList[3].checked
          }
          try {
            await this.$store.dispatch(
              `api/main/payroll/allowance/${this.isModalEdit ? 'update' : 'add'}`,
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
