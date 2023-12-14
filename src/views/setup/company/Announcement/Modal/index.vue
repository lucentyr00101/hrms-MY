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
import List from './List'

export default {
  name: 'SetupCompanyAnnouncementModal',
  components: {
    Form,
    Details,
    List
  },
  props: {
    data: { type: Object, default: () => ({ show: false }) }
  },
  data () {
    return {}
  },
  computed: {
    mainParent() { return this.getParent('SetupCompanyAnnouncement') },
    formTitle() { return this.$t(`table.dialog.${this?.data?.action || 'view'}-announcement`) },
    component() {
      let component = 'Details'
      if (/add|update/ig.test(this.data?.action)) { component = 'Form' }
      if (/list/ig.test(this.data?.action)) { component = 'List' }
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
