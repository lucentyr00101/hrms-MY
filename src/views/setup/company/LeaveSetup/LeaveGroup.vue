<template>
  <div>
    <chosen-alert-box
      permissionNameAdd="setup_company_leave-setup_leave-group_add"
      permissionNameDelete="setup_company_leave-setup_leave-group_delete"
      :isActive="true"
      position="right"
      :totalSelected="selectedRows.length"
      @delete="handleDelete()"
      @open="handleAdd()"
    />
    <s-table
      permissionName="setup_company_leave-setup_leave-group_view"
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
      <template slot="status" slot-scope="status, record">
        <a-switch
          :disabled="!$store.getters.permissions.includes('setup_company_leave-setup_leave-group_update-status')"
          :default-checked="record.status === 'Enable'"
          @change="(e)=>handleStatusChange(e,record)"
        />
      </template>
      <span slot="action" slot-scope="text, record">
        <a v-action:setup_company_leave-setup_leave-group_edit @click="handleEdit(record)">{{ $t('table.dialog.edit') }}</a>
      </span>
    </s-table>
    <leave-group :action="action" :currentRow="currentRow" @refreshTable="$refs.table.refresh(true)"/>
  </div>
</template>
<script>

import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import LeaveGroup from '@/components/Setup/Company/Leave/LeaveGroup.vue'
import InfoCircle from '@/assets/info-circle.svg'
import { i18nRender } from '@/locales'

export default {
  name: 'SetupCompanyLeaveGroup',
  components: { ChosenAlertBox, LeaveGroup },

  data () {
    return {
      selectedRows: [],
      currentRow: null,
      action: null,
      columns: [
        {
          title: i18nRender('table.column.leave-group'),
          dataIndex: 'leaveGroup',
          ellipsis: true
        },
        {
          title: i18nRender('table.column.descriptions'),
          dataIndex: 'descriptions',
          ellipsis: true
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
        const data = await this.$store.dispatch('api/setup/company/leaveGroup/fetchList', params)
        return data
      }
    }
  },
  computed: {
    rowSelection () {
      return {
      selectedRows: this.selectedRows,
      selectedRowKeys: this.selectedRows,
        onChange: (selectedRowKeys, _selectedRows) => {
          this.setSelectedRows(selectedRowKeys)
        }
      }
    }
  },
  methods: {
    getEmployeesAssigned(data) {
      if (Array.isArray(data)) {
        return data.reduce((a, b) => {
          return (a.employeesAssigned || 0) + (b.employeesAssigned || 0)
        }, 0)
      }
      return 0
    },
    async handleDelete() {
      if (this.selectedRows.length > 0) {
        this.$confirm({
          title: this.$t('table.dialog.delete-confirm'),
          okText: this.$t('table.dialog.yes'),
          cancelText: this.$t('table.dialog.no'),
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
          onOk: async () => {
            try {
              const { data } = await this.$store.dispatch('api/setup/company/leaveGroup/deleteLeaveGroup', { entityIds: this.selectedRows })
              const employeesAssigned = this.getEmployeesAssigned(data)
              if (employeesAssigned) {
                this.notificationConfirm(
                  this.$t(employeesAssigned === 1 ? 'table.dialog.delete-assigned-employee' : 'table.dialog.delete-assigned-employees', {
                    assigned: employeesAssigned
                  })
                )
                const employeesAssignedIds = data.map(value => value.id)
                this.selectedRows = this.selectedRows.filter(selectedRow => {
                  return employeesAssignedIds.includes(selectedRow)
                })
              } else {
                this.$notification.open({
                  message: this.$t('notification.leave-group.deleted'),
                  icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
                })
                this.selectedRows = []
              }
              this.$refs.table.refresh()
            } catch (error) {
              this.selectedRows = []
              this.notificationConfirm(error?.response?.data?.message)
            }
          }
        })
      }
    },
    async notificationConfirm (message) {
      this.$confirm({
        centered: true,
        title: message,
        okText: this.$t('table.dialog.okay.capitalized'),
        cancelButtonProps: { style: { display: 'none' } },
        onOk: () => {},
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />
      })
    },
    async handleStatusChange (checked, row) {
      try {
        await this.$store.dispatch('api/setup/company/leaveGroup/updateStatus', { id: row.id, status: checked ? 'Enable' : 'Disable' })
        this.$notification.open({
          message: checked ? i18nRender('notification.leave-group.enabled') : i18nRender('notification.leave-group.disabled'),
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
      this.$store.commit('modal/TOGGLE_ADD_LEAVE_GROUP_MODAL')
    },
    handleEdit (data) {
      this.action = 'edit'
      this.currentRow = data
      this.$store.commit('modal/TOGGLE_ADD_LEAVE_GROUP_MODAL')
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
