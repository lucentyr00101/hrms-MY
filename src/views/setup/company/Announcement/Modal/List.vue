<template>
  <a-table
    ref="table"
    rowKey="id"
    :columns="columns"
    :data-source="modal.data.list"
    :pagination="false"
  >
    <span slot="acknowledgeTime" slot-scope="value">{{ (value) ? formatDate(value) : '' }}</span>
  </a-table>
</template>

<script>
import { i18nRender } from '@/locales'

export default {
  name: 'SetupCompanyAnnouncementAcknowledgedList',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data () {
    return {}
  },
  computed: {
    mainParent() { return this.getParent('SetupCompanyAnnouncement') },
    columns() {
      return [
        { title: i18nRender('table.column.employee'), dataIndex: 'employeeSetup.fullName', key: 'employee' },
        { title: i18nRender('table.column.department'), dataIndex: 'employeeSetup.department', key: 'department' },
        { title: i18nRender('table.column.acknowledge-time'), dataIndex: 'acknowledgeTime', key: 'acknowledgeTime', scopedSlots: { customRender: 'acknowledgeTime' } }
      ]
    }
  },
  watch: {},
  methods: {},
  created() {}
}
</script>

<style></style>
