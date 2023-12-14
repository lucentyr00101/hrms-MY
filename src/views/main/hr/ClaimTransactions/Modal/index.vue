<template>
  <a-modal
    :title="formTitle"
    :width="900"
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
  name: 'MainHRClaimTransactionsModal',
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
    mainParent() { return this.getParent('MainHRClaimTransactions') },
    formTitle() { return this.$t(`table.dialog.${this?.data?.action || 'view'}-claim-transactions`) },
    component() { return (/add|update/ig.test(this.data?.action)) ? 'Form' : 'Details' }
  },
  methods: {
    closeModal() {}
  },
  created() {}
}
</script>

<style></style>
