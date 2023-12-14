<template>
  <!-- Salary section-->
  <div>
    <div class="header">{{ $t('table.column.salary') }}</div>
    <a-row type="flex" justify="start" style="margin-left: 80px">
      <a-col :span="8">
        <a-form-item
          :label="`${$t('setup.employee.salary-type')}: `"
          :labelCol="{ span: 12 }"
          :wrapperCol="{ span: 12 }"
        >
          <a-select
            :disabled="editable"
            :options="salaryTypeDropdown"
            v-decorator="['salaryType', { rules: [{ required: true, message: $t('error.salary-type.required') }] }]"
            placeholder="Select"
            @change="handleSelectChange"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          :label="`${$t('setup.employee.basic-salary')}: `"
          :labelCol="{ span: 12 }"
          :wrapperCol="{ span: 12 }"
        >
          <a-input
            :disabled="editable"
            :maxLength="10"
            @change="onChange"
            @blur="onBlur"
            v-decorator="[
              'basicSalary',
              {
                rules: [{ required: true, message: $t('error.basic-salary.required') }, { validator: validate }]
              }
            ]"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row style="margin-left: 80px">
      <a-col :span="8">
        <a-form-item
          :label="`${$t('setup.employee.pay-frequency')}: `"
          :labelCol="{ span: 12 }"
          :wrapperCol="{ span: 12 }"
        >
          <a-select
            :disabled="editable"
            :options="frequencyTypeDropdown"
            placeholder="Select"
            v-decorator="['payFrequency', { rules: [{ required: true, message: $t('error.pay-frequency.required') }] }]"
            @change="handleSelectChange"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'PayrollInfoSalary',
  props: {
    form: { type: Object, default: null },
    editable: { type: Boolean, default: true },
    payrollInfo: { type: Object, default: null }
  },
  created() {
    this.loadSalaryType()
    this.loadFrequencyType()
  },
  data() {
    return {
      salaryTypeDropdown: [],
      frequencyTypeDropdown: [],
      loadSalaryType: async () => {
        const data = await this.$store.dispatch('api/dropdown/fetchSalaryTypeDropdown')
        data.data.salaryTypes.forEach((item) => {
          this.salaryTypeDropdown = [
            ...this.salaryTypeDropdown,
            {
              value: item.salaryType,
              label: item.salaryType
            }
          ]
        })
        return this.salaryTypeDropdown
      },
      loadFrequencyType: async () => {
        const data = await this.$store.dispatch('api/dropdown/fetchFrequencyTypeDropdown')
        data.data.frequencyTypes.forEach((item) => {
          this.frequencyTypeDropdown = [
            ...this.frequencyTypeDropdown,
            {
              value: item.frequencyType,
              label: item.frequencyType
            }
          ]
        })
        return this.frequencyTypeDropdown
      }
    }
  },
  methods: {
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
      const amount = e.target.id
      const value = this.form.getFieldValue(amount)

      if (value && isNaN(value)) this.form.setFieldsValue({ [amount]: value.replace(/[^\d]/g, '') })
    },
    handleSelectChange(e) {
      console.log(e)
    },
    validate(rule, value, callback) {
      const regex = /^\d*\.?\d*$/
      const regexDp = /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/

      if (value && !regex.test(value)) {
        callback(new Error('Should be number'))
      } else {
        if (value && !regexDp.test(value)) {
          callback(new Error('Up to 2 decimal places only.'))
        } else {
          callback()
        }
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
