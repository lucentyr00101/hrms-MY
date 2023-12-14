<template>
  <div>
    <div class="header">{{ $t('table.column.socso') }}</div>
    <a-row>
      <a-col :span="12">
        <a-form-item :label="`${$t('setup.employee.sosco-number')}: `" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['socsoNumber']" :maxLength="25" :disabled="editable" />
        </a-form-item>
      </a-col>

      <a-col :span="12">
        <a-form-item :label="`${$t('setup.employee.sosco-category')}: `" :wrapper-col="{ span: 12 }">
          <a-select
            :options="socsoTypeDropdown"
            v-decorator="['socsoType']"
            :width="80"
            :disabled="editable"
            @change="(e) => handleSelectChange(e)"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row>
      <a-col :span="12">
        <a-form-item :label="`${$t('setup.employee.pay-sosco')} `">
          <a-switch v-decorator="['paySocso', { valuePropName: 'checked' }]" :disabled="editable" />
        </a-form-item>
      </a-col>

      <a-col :span="12">
        <a-form-item :label="`${$t('setup.employee.pay-eis')} `">
          <a-switch v-decorator="['payEis', { valuePropName: 'checked' }]" :disabled="editable" />
        </a-form-item>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'PayrollInfoSOCSO',
  props: {
    form: { type: Object, default: null },
    editable: { type: Boolean, default: true }
  },
  data() {
    return {
      socsoTypeDropdown: [],
      loadSocsoType: async () => {
        const data = await this.$store.dispatch('api/dropdown/fetchPayrollSocsoTypeDropdown')
        data.data.payrollSocsoTypeSmallResponses.forEach((item) => {
          this.socsoTypeDropdown = [
            ...this.socsoTypeDropdown,
            {
              value: item.socsoType,
              label: item.socsoType
            }
          ]
        })
        return this.socsoTypeDropdown
      }
    }
  },
  created() {
    this.loadSocsoType()
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
