<template>
  <div>
    <chosen-alert-box
      isActive
      :totalSelected="selectedRowKeys.length"
      position="right"
      @open="openAddCalendarModal"
      @delete="handleDelete(selectedRowKeys)"
    />
    <s-table
      :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
      rowKey="id"
      ref="calendarTable"
      size="default"
      :columns="columns"
      :data="loadData"
      :pagination="{
        'show-total': (total, range) => $tc('table.column.total-items', total),
        showSizeChanger: true,
        showQuickJumper: true
      }"
    >
      <a-switch slot="status" slot-scope="val, record" :default-checked="val === 'Enable'" @change="e => handleStatus(e, record)"/>
      <span slot="action" @click="openAddCalendarModal">
        <a>{{ $t('table.dialog.edit') }}</a>
      </span>
    </s-table>
    <AddCalendarModal @refreshTable="$refs.calendarTable.refresh()" />
  </div>
</template>

<script>
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import AddCalendarModal from '@/views/setup/company/Calendar/AddCalendarModal.vue'

export default {
  name: 'SetupCompanyCalendar',
  components: {
    ChosenAlertBox,
    AddCalendarModal
  },
  data () {
    return {
      selectedRowKeys: [], // Check here to configure the default column
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const data = await this.$store.dispatch('api/setup/company/calendar/fetchList', params)
        return data
      }
    }
  },
  computed: {
    columns () {
      return [
        {
          title: this.$t('table.column.calendar-name'),
          dataIndex: 'calendarName',
          key: 'calendarName'
        },
        {
          title: this.$t('table.column.descriptions'),
          dataIndex: 'descriptions',
          key: 'descriptions',
          ellipsis: true
        },
        {
          title: this.$t('table.column.status'),
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t('table.column.action'),
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    openAddCalendarModal () {
      this.$store.commit('modal/TOGGLE_ADD_CALENDAR_MODAL')
    },
    async handleStatus (checked, row) {
      try {
        await this.$store.dispatch('api/setup/company/calendar/updateStatus', { id: row.id, status: checked ? 'Enable' : 'Disable' })
        this.$notification.open({
          message: checked ? this.$t('notification.calendar.enabled') : this.$t('notification.calendar.disabled'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.$refs.calendarTable.refresh()
      } catch (e) {
        console.log(e)
        this.$message.error(e.response.data.message)
      }
    }
  }
}
</script>
