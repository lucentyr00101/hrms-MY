<template>
  <a-modal
    :okText="$t('table.dialog.confirm')"
    :cancelButtonProps="{ style: 'display: none;' }"
    :visible="value"
    :destroyOnClose="true"
    :title="action2 === 'edit' ? $t('table.dialog.edit-employee-deduction') : $t('table.dialog.add-employee-deduction')"
    :confirm-loading="loading"
    @cancel="closeModal"
    @ok="showConfirm"
    :width="700"
  >
    <a-form :form="form" layout="horizontal" :label-col="{ span: 7 }" :wrapper-col="{ span: 15 }">
      <a-form-item :label="$t('table.column.deduction-type')">
        <a-select
          v-decorator="[
            'deductionType',
            {
              rules: [{ required: true, message: $t('error.deduction-type.required') }],
              initialValue: action2 === 'edit' ? currentValue?.deductionType : ''
            }
          ]"
        >
          <a-select-option
            v-for="(deductionTypes, index) in deductionTypeDropdown"
            :key="index"
            :value="deductionTypes.id"
            @click="(e) => handleSelectChange(e, deductionTypes)"
            >{{ deductionTypes.deductionType }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('table.column.sequence')">
        <a-select
          :options="sequenceTypeDropdown"
          v-decorator="[
            'sequence',
            {
              rules: [{ required: true, message: $t('error.sequence.required') }],
              initialValue: action2 === 'edit' ? currentValue.sequence : ''
            }
          ]"
        />
      </a-form-item>
      <a-form-item :label="$t('table.column.amount')">
        <a-input
          :maxLength="10"
          @change="onChange"
          @blur="onBlur"
          v-decorator="[
            'amount',
            {
              rules: [{ required: true, message: $t('error.amount.required') }, { validator: validate }],
              initialValue: action2 === 'edit' ? currentValue.amount : ''
            }
          ]"
        />
      </a-form-item>
      <a-row>
        <a-col :span="18" :push="7">
          <a-row :style="{ marginLeft: '40px;' }">
            <a-col :span="10">
              <a-form-item style="width: 150%">
                <a-date-picker
                  placeholder="From Date"
                  :disabled-date="disabledStartDate"
                  v-model="startValue"
                  v-decorator="[
                    'fromDate',
                    {
                      rules: [{ required: true, message: 'From Date is required.' }, { validator: validateDate }],
                      initialValue: action2 === 'edit' ? currentValue.fromDate : ''
                    }
                  ]"
                />
              </a-form-item> </a-col
            >&nbsp;
            <a-col :span="1" :style="{ textAlign: 'center', marginTop: '9px' }">
              <span> - </span>
            </a-col>
            <a-col :span="10">
              <a-form-item style="width: 150%">
                <a-date-picker
                  placeholder="To Date"
                  :disabled-date="disabledEndDate"
                  v-model="endValue"
                  v-decorator="[
                    'toDate',
                    {
                      rules: [{ required: true, message: 'To Date is required.' }, { validator: validateDate }],
                      initialValue: action2 === 'edit' ? currentValue.toDate : ''
                    }
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="6" :pull="15">
          <a-row style="margin-left: 11px">
            <a-col :span="2" :style="{ textAlign: 'right', marginTop: '9px' }">
              <span class="ant-form-item-required"></span>
            </a-col>
            <a-col :span="22">
              <a-form-item :label="`${$t('table.column.date')} `"></a-form-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row style="width: 440px; margin-left: 180px">
        <a-col v-for="i in checkboxList" :key="i.key" :span="8">
          <a-form-item style="margin-bottom: 0px" class="checkboxForm">
            <a-checkbox
              @change="(e) => handleChange(e, i)"
              v-decorator="[`${i.label}`]"
              :checked="i.checked === 'True'"
              style="margin-left: 0px"
            >
              {{ i.label }}
            </a-checkbox>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'
import moment from 'moment'
import { i18nRender } from '@/locales'
export default {
  name: 'EmployeeSetupAddDeduction',
  props: {
    value: Boolean,
    actionModal: {
      type: String,
      default: () => null
    },
    currentValue: {
      type: Object,
      default: () => null
    }
  },
  created() {
    this.loadDeductionType()
    this.loadSequenceType()
    this.$watch('currentValue', async () => {
      this.checkboxList[0].checked = this.currentValue.epf
      this.checkboxList[1].checked = this.currentValue.eis
      this.checkboxList[2].checked = this.currentValue.socso
      this.checkboxList[3].checked = this.currentValue.tax
    })
  },
  data() {
    return {
      loading: false,
      form: this.$form.createForm(this),
      deductionType: null,
      deductionTypeDropdown: [],
      sequenceTypeDropdown: [],
      action: null,
      loadDeductionType: async () => {
        const data = await this.$store.dispatch('api/dropdown/fetchDeductionDropdown')
        this.deductionTypeDropdown = data.data.deductionTypes
      },
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
      startValue: null,
      endValue: null
    }
  },
  computed: {
    checkboxList() {
      return [
        // initialize default checked
        { key: 0, label: this.$t('table.column.epf'), checked: 'False' },
        { key: 1, label: this.$t('table.column.eis'), checked: 'False' },
        { key: 2, label: this.$t('table.column.socso'), checked: 'False' },
        { key: 3, label: this.$t('table.column.tax'), checked: 'False' }
      ]
    },
    action2: {
      get() {
        return this.actionModal
      },
      set() {
        // just to prevent error
      }
    }
  },
  watch: {
    'currentValue.deductionType'(val) {
      this.deductionType = val
    }
  },
  methods: {
    disabledStartDate(startValue) {
      const endValue = this.endValue
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    closeModal() {
      this.$emit('input', false)
      this.$emit('closeModal')
      this.checkboxList.forEach((item) => {
        item.checked = 'False'
      })
    },
    handleChange(e, data) {
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
    handleSelectChange(e, data) {
      this.deductionType = data.deductionType
      this.checkboxList[0].checked = data.epf
      this.checkboxList[1].checked = data.eis
      this.checkboxList[2].checked = data.socso
      this.checkboxList[3].checked = data.tax
    },
    async showConfirm() {
      try {
        await this.form.validateFields()
        this.$confirm({
          centered: true,
          title: i18nRender('save.confirm'),
          okText: i18nRender('table.dialog.yes'),
          cancelText: i18nRender('table.dialog.no'),
          onOk: () => this.handleSubmit(),
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />
        })
      } catch (e) {}
    },
    handleSubmit() {
      if (this.action2 === 'add') {
        const data = {
          deductionId: Math.floor(Math.random() * 1000),
          employeeSetupId: this.$parent.employee.data.id,
          deductionType: this.deductionType ? this.deductionType : this.currentValue.deductionType,
          sequence: this.form.getFieldValue('sequence'),
          amount: this.form.getFieldValue('amount'),
          fromDate: moment(this.form.getFieldValue('fromDate')).format('YYYY-MM-DD').toString(),
          toDate: moment(this.form.getFieldValue('toDate')).format('YYYY-MM-DD').toString(),
          epf: this.checkboxList[0].checked,
          eis: this.checkboxList[1].checked,
          socso: this.checkboxList[2].checked,
          tax: this.checkboxList[3].checked
        }
        this.$parent.data.push(data)
        this.$notification.open({
          message: this.$t('table.dialog.deduction-added'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
      } else {
        const newArray = this.$parent.data.map((obj) => {
          if (obj.id === this.currentValue.id) {
            return {
              ...obj,
              deductionType: this.deductionType ? this.deductionType : this.currentValue.deductionType,
              sequence: this.form.getFieldValue('sequence'),
              amount: this.form.getFieldValue('amount'),
              fromDate: moment(this.form.getFieldValue('fromDate')).format('YYYY-MM-DD').toString(),
              toDate: moment(this.form.getFieldValue('toDate')).format('YYYY-MM-DD').toString(),
              epf: this.checkboxList[0].checked,
              eis: this.checkboxList[1].checked,
              socso: this.checkboxList[2].checked,
              tax: this.checkboxList[3].checked
            }
          }
          return obj
        })
        this.$parent.data = newArray
        this.$notification.open({
          message: this.$t('table.dialog.deduction-updated'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
      }
      this.closeModal()
    },
    validate(rule, value, callback) {
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
    validateDate(rule, value, callback) {
      const this_ = this
      var startD
      var endD
      startD = this_.form.getFieldValue('fromDate')
      endD = this_.form.getFieldValue('toDate')

      if (rule.field === 'fromDate') {
        if (endD) {
          if (startD > endD) {
            callback(new Error(this.$t('error.start-date.later')))
          }
        }
      } else {
        if (startD) {
          if (endD < startD) {
            callback(new Error(this.$t('error.end-date.earlier')))
          }
        }
      }
      callback()
    },
    onChange(e) {
      const value = e.target
      const reg = /^-?[0-9]*(\.[0-9]*)?$/
      if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
        this.value = value
        const amount = e.target.id
        this.form.setFieldsValue({ [amount]: this.value })
      }
    },
    onBlur(e) {
      // const amount = e.target.id
      // const value = this.form.getFieldValue(amount)
      // if (isNaN(value)) this.form.setFieldsValue({ [amount]: value.replace(/[^\d]/g, '') })
    }
  }
}
</script>

<style>
.checkboxForm .ant-form-item-control {
  width: 150px;
}
</style>
