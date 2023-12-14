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

export default {
  name: 'AccountCenterModal',
  components: {
    Form
  },
  props: {
    data: { type: Object, default: () => ({ show: false }) }
  },
  data () {
    return {}
  },
  computed: {
    mainParent() { return this.getParent('AccountCenter') },
    formTitle() { return this.$t(`table.dialog.${this?.data?.action || 'view'}-account-center`) },
    component() {
      let component = 'Form'
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
