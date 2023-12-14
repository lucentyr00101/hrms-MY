<template>
  <div>
    <div class="header">{{ $t('table.column.epf') }}</div>
    <a-row>
      <a-col :span="8">
        <a-form-item :label="`${$t('setup.employee.epf-number')}: `" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['epfNumber']" :maxLength="25" :disabled="editable" />
        </a-form-item>
      </a-col>

      <a-col :span="8">
        <a-form-item :label="`${$t('setup.employee.epf-group')}: `" :wrapper-col="{ span: 12 }">
          <a-select
            v-decorator="['epfType']"
            :options="epfTypeDropdown"
            :width="80"
            :disabled="editable"
            @change="(e) => handleSelectChange(e)"
          />
        </a-form-item>
      </a-col>

      <a-col :span="8">
        <a-form-item :label="`${$t('setup.employee.pay-epf')}: `">
          <a-switch v-decorator="['payEpf', { valuePropName: 'checked' }]" :disabled="editable" />
        </a-form-item>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'PayrollInfoEPF',
  props: {
    form: { type: Object, default: null },
    editable: { type: Boolean, default: true }
  },
  data() {
    return {
      epfTypeDropdown: [],
      loadEpfType: async () => {
        const data = await this.$store.dispatch('api/dropdown/fetchPayrollEpfTypeDropdown')
        data.data.payrollEpfTypeSmallResponses.forEach((item) => {
          this.epfTypeDropdown = [
            ...this.epfTypeDropdown,
            {
              value: item.epfType,
              label: item.epfType
            }
          ]
        })
        return this.epfTypeDropdown
      }
    }
  },
  created() {
    this.loadEpfType()
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
