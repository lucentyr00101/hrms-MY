<template>
  <div>
    <chosen-alert-box
      permissionNameAdd="setup_company_leave-setup_leave-type_add"
      permissionNameDelete="setup_company_leave-setup_leave-type_delete"
      :isActive="true"
      position="right"
      :totalSelected="selectedRows.length"
      @delete="handleDelete()"
      @open="handleAdd()"
    />
    <s-table
      permissionName="setup_company_leave-setup_leave-type_view"
      :row-selection="rowSelection"
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
      <template slot="limited" slot-scope="text">
        {{ text | yesAndNo }}
      </template>
      <template slot="unpaidLeave" slot-scope="text">
        {{ text | yesAndNo }}
      </template>
      <template slot="status" slot-scope="status, record">
        <a-switch
          :disabled="!$store.getters.permissions.includes('setup_company_leave-setup_leave-type_update-status')"
          :default-checked="record.status === 'Enable'"
          @change="(e)=>handleStatusChange(e,record)"
        />
      </template>
      <span slot="action" slot-scope="text, record">
        <a v-action:setup_company_leave-setup_leave-type_view-edit-details @click="handleEdit(record)">{{ $t('table.dialog.view') }}</a>
      </span>
    </s-table>
    <leave-type :action="action" :currentRow="currentRow" @refreshTable="$refs.table.refresh(true)"/>
  </div>
</template>
<script>

import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import LeaveType from '@/components/Setup/Company/Leave/LeaveType.vue'
import InfoCircle from '@/assets/info-circle.svg'
import { i18nRender } from '@/locales'

export default {
  name: 'TypeCompanyLeaveType',
  components: { ChosenAlertBox, LeaveType },

  data () {
    return {
      selectedRows: [],
      currentRow: null,
      action: null,
      columns: [
        {
          title: i18nRender('table.column.leave-type'),
          dataIndex: 'leaveType',
          ellipsis: true
        },
        {
          title: i18nRender('table.column.gender'),
          dataIndex: 'gender',
          ellipsis: true
        },
        {
          title: i18nRender('table.column.descriptions'),
          dataIndex: 'descriptions',
          ellipsis: true
        },
        {
          title: i18nRender('table.column.limited'),
          dataIndex: 'limited',
          scopedSlots: { customRender: 'limited' }
        },
        {
          title: i18nRender('table.column.unpaid-leave'),
          dataIndex: 'unpaidLeave',
          scopedSlots: { customRender: 'unpaidLeave' }
        },
        {
          title: i18nRender('table.column.status'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: i18nRender('table.column.action'),
          dataIndex: 'id',
          scopedSlots: { customRender: 'action' }
        }
      ],
      queryParam: {},
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const data = await this.$store.dispatch('api/setup/company/leaveType/fetchList', params)
        return data
      }
    }
  },
  computed: {
    rowSelection () {
      return {
        onChange: (selectedRowKeys, _selectedRows) => {
          this.setSelectedRows(selectedRowKeys)
        }
      }
    }
  },
  methods: {
    async handleDelete() {
      if (this.selectedRows.length > 0) {
        this.$confirm({
          title: this.$t('table.dialog.delete-confirm'),
          okText: this.$t('table.dialog.yes'),
          cancelText: this.$t('table.dialog.no'),
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
          onOk: async () => {
            try {
              await this.$store.dispatch('api/setup/company/leaveType/deleteLeaveType', { entityIds: this.selectedRows })
              this.$notification.open({
                message: this.$t('notification.leave-type.deleted'),
                icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
              })
              this.selectedRows = []
              this.$refs.table.refresh()
            } catch (error) {
              this.selectedRows = []
              this.$confirm({
                centered: true,
                title: error?.response?.data?.message,
                okText: this.$t('table.dialog.okay'),
                cancelButtonProps: { style: { display: 'none' } },
                onOk: () => {},
                icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />
              })
            }
          }
        })
      }
    },
    async handleStatusChange (checked, row) {
      try {
        await this.$store.dispatch('api/setup/company/leaveType/updateStatus', { id: row.id, status: checked ? 'Enable' : 'Disable' })
        this.$notification.open({
          message: checked ? i18nRender('notification.leave-type.enabled') : i18nRender('notification.leave-type.disabled'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.$refs.table.refresh(true)
      } catch (e) {
        this.$message.error(e.response)
      }
    },
    setSelectedRows (data) {
      this.selectedRows = data
    },
    onPageChange (val) {
      console.log(val)
    },
    handleAdd () {
      this.action = 'add'
      this.currentRow = null
      this.$store.commit('modal/TOGGLE_ADD_LEAVE_TYPE_MODAL')
    },
    handleEdit (data) {
      this.action = 'edit'
      this.currentRow = data
      this.$store.commit('modal/TOGGLE_ADD_LEAVE_TYPE_MODAL')
    }
  }
}
</script>

<style scoped>

.add-button {
  margin-bottom: 16px;
  margin-left: auto;
}
</style>
