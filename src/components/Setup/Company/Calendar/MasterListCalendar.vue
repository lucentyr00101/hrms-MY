<template>
  <div>
    <chosen-alert-box
      isActive
      :totalSelected="selectedRowKeys.length"
      position="right"
      @open="openMasterListModal()"
      @delete="handleDelete(selectedRowKeys)"
    />
    <s-table
      :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
      rowKey="id"
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :pagination="{
        'show-total': (total, range) => $tc('table.column.total-items', total),
        showSizeChanger: true,
        showQuickJumper: true
      }"
    >
      <span slot="startDate" key="startDate" slot-scope="val"> {{ val | calendar }} </span>
      <span slot="endDate" key="endDate" slot-scope="val"> {{ val | calendar }}</span>
      <a-switch key="status" slot="status" slot-scope="val, record" :default-checked="val === 'Enable'" @change="e => handleStatus(e, record)"/>
      <span slot="action" key="action" slot-scope="val, record">
        <a id="edit" @click="openMasterListModal(record)" >{{ $t('table.dialog.edit') }}</a>
      </span>
    </s-table>
    <MasterListModal :model="mdl" @refreshTable="$refs.table.refresh()"/>
  </div>
</template>

<script>
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import MasterListModal from '@/views/setup/company/Calendar/MasterListModal'

export default {
  name: 'MasterListCalendar',
  components: {
    ChosenAlertBox,
    MasterListModal
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
        const data = await this.$store.dispatch('api/setup/company/calendarMasterList/fetchList', params)
        return data
      },
      mdl: null
    }
  },
  computed: {
    columns () {
      return [
        {
          title: this.$t('table.column.holiday'),
          dataIndex: 'holiday',
          key: 'holiday'
        },
        {
          title: this.$t('table.column.date-from'),
          dataIndex: 'fromDate',
          key: 'start_date',
          scopedSlots: { customRender: 'startDate' }
        },
        {
          title: this.$t('table.column.date-to'),
          dataIndex: 'toDate',
          key: 'end_date',
          scopedSlots: { customRender: 'endDate' }
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
      this.selectedRowKeys = selectedRowKeys
    },
    openMasterListModal (data) {
      this.$store.commit('modal/TOGGLE_MASTER_LIST_MODAL')
      this.mdl = { ...data }
    },
    async handleStatus (checked, row) {
      try {
        // api/setup/company/calendarMasterList/fetchList
        await this.$store.dispatch('api/setup/company/calendarMasterList/updateStatus', { id: row.id, status: checked ? 'Enable' : 'Disable' })
        this.$notification.open({
          message: checked ? this.$t('notification.holiday.enabled') : this.$t('notification.holiday.disabled'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.$refs.table.refresh(true)
      } catch (e) {
        this.$message.error(e.response.data.message)
      }
    }
  }
}

</script>
