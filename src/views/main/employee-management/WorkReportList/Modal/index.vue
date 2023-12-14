<template>
  <a-modal
    :title="formTitle"
    :width="700"
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
import Details from './Details'

export default {
  name: 'MainEmployeeMngWorkReportListModal',
  components: {
    Form,
    Details
  },
  props: {
    data: { type: Object, default: () => ({ show: false }) }
  },
  data () {
    return {}
  },
  computed: {
    mainParent() { return this.getParent('MainEmployeeMngWorkReportList') },
    formTitle() { return this.$t(`table.dialog.${this?.data?.action || 'view'}-work-report-list`) },
    component() {
      let component = 'Details'
      if (/add|update/ig.test(this.data?.action)) { component = 'Form' }
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
