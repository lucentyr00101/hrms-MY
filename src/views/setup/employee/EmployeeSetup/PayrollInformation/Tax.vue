<template>
  <div>
    <div class="header">{{ $t('table.column.tax') }}</div>
    <a-row>
      <a-col :span="8">
        <a-form-item :label="`${$t('setup.employee.tax-category')}: `" :wrapperCol="{ span: 12 }">
          <a-select
            :options="taxTypeDropdown"
            :disabled="editable"
            v-decorator="['taxType']"
            placeholder="Select"
            @change="handleSelectChange"
          />
        </a-form-item>
      </a-col>

      <a-col :span="8">
        <a-form-item :label="`${$t('setup.employee.tax-number')}: `" :wrapper-col="{ span: 12 }">
          <a-input :maxLength="25" :disabled="editable" v-decorator="['taxNumber']"> </a-input>
        </a-form-item>
      </a-col>

      <a-col :span="8">
        <a-form-item :label="`${$t('setup.employee.tax-branch')}: `" :wrapper-col="{ span: 12 }">
          <a-input :maxLength="25" :disabled="editable" v-decorator="['taxBranch']" placeholder="enter"> </a-input>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row style="margin-bottom: 30px">
      <!-- v-if="!editable" -->
      <a-col class="switch-col" :span="6">
        <a-form-item :label="`${$t('setup.employee.pay-tax')}: `" :label-col="{ span: 15 }">
          <a-switch v-decorator="['payTax', { valuePropName: 'checked' }]" :disabled="editable" />
        </a-form-item>
      </a-col>
      <a-col class="switch-col" :span="6">
        <a-form-item :label="`${$t('setup.employee.self-disabled')}: `" :label-col="{ span: 15 }">
          <a-switch v-decorator="['selfDisabled', { valuePropName: 'checked' }]" :disabled="editable" />
        </a-form-item>
      </a-col>
      <a-col class="switch-col" :span="6">
        <a-form-item :label="`${$t('setup.employee.spouse-disabled')}: `" :label-col="{ span: 15 }">
          <a-switch v-decorator="['spouseDisabled', { valuePropName: 'checked' }]" :disabled="editable" />
        </a-form-item>
      </a-col>
      <a-col class="switch-col" :span="6">
        <a-form-item :label="`${$t('setup.employee.borne-by-employer')}: `" :label-col="{ span: 15 }">
          <a-switch v-decorator="['borneByEmployer', { valuePropName: 'checked' }]" :disabled="editable" />
        </a-form-item>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'PayrollInfoTax',
  props: {
    form: { type: Object, default: null },
    editable: { type: Boolean, default: false }
  },
  created() {
    this.loadTaxType()
  },
  data() {
    return {
      taxTypeDropdown: [],
      loadTaxType: async () => {
        const data = await this.$store.dispatch('api/dropdown/fetchPayrollTaxTypeDropdown')
        data.data.payrollTaxTypeSmallResponses.forEach((item) => {
          this.taxTypeDropdown = [
            ...this.taxTypeDropdown,
            {
              value: item.taxType,
              label: item.taxType
            }
          ]
        })
        return this.taxTypeDropdown
      }
    }
  },
  methods: {
    handleSelectChange(e) {
      console.log(e)
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
