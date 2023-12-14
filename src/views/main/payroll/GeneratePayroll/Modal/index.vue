<template>
  <a-modal
    :title="formTitle"
    :width="data.width || 700"
    v-model="data.show"
    :cancelButtonProps="{ style: { display: 'none' } }"
    :okButtonProps="{ style: { display: 'none' } }"
    @cancel="closeModal"
  >
    <component :is="component" :modal="data"/>
  </a-modal>
</template>

<script>
import Form from './Form'
import Verify from './Verify'
import ViewSummary from './ViewSummary'
import ViewSummaryEmployee from './ViewSummaryEmployee'
import moment from 'moment'

export default {
  name: 'MainPayrollGeneratePayrollModal',
  components: {
    Form,
    Verify,
    ViewSummary,
    ViewSummaryEmployee
  },
  props: {
    data: { type: Object, default: () => ({ show: false, width: 700 }) }
  },
  data () {
    return {}
  },
  computed: {
    mainParent() { return this.getParent('MainPayrollGeneratePayroll') },
    formTitle() {
      if (/viewSummary|viewEmployee/ig.test(this.data?.action)) {
        return `${this.$t('table.dialog.view-payroll-summary')} - ${ moment(this.data?.data?.fromDate).format('YYYY') } ${ moment(this.data?.data?.fromDate).format('MMMM') } ${ this.data?.data?.sequence }`
      } else {
        return this.$t(`table.dialog.${this?.data?.action || 'view'}-generate-payroll`)
      }
    },
    component() {
      let component = 'ViewSummary'
      if (/viewEmployee/ig.test(this.data?.action)) { component = 'ViewSummaryEmployee' }
      if (/add|update/ig.test(this.data?.action)) { component = 'Form' }
      if (/verify/ig.test(this.data?.action)) { component = 'Verify' }
      return component
    }
  },
  methods: {
    closeModal() {}
  },
  created() {}
}
</script>

<style></style>
