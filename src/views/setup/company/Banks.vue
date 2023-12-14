<template>
  <div>
    <div class="antd-custom-table">
      <chosen-alert-box
        permissionNameAdd="setup_company_banks_add"
        permissionNameDelete="setup_company_banks_delete"
        :isActive="true"
        position="right"
        :totalSelected="selectedRowKeys.length"
        @delete="handleDelete(selectedRowKeys)"
        @open="handleAdd()"
      />
      <s-table
        permissionName="setup_company_banks_view"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
        rowKey="id"
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        :pagination="{
          'show-total': (total) => $tc('table.column.total-items', total),
          showSizeChanger: true,
          showQuickJumper: true
        }"
      >
        <span slot="action" slot-scope="text, record">
          <a v-action:setup_company_banks_edit @click="handleEdit(record)">{{ $t('table.dialog.edit') }}</a>
        </span>
      </s-table>
    </div>
    <bank :action="action" :currentRow="currentRow" @refreshTable="$refs.table.refresh(true)" />
  </div>
</template>

<script>
import { STable } from '@/components'
import QueryForm from '@/components/Table/QueryForm'
import ChosenAlertBox from '@/components/Table/ChosenAlertBox'
import { i18nRender } from '@/locales'
import Bank from '@/components/Setup/Company/Banks/Bank.vue'
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'SetupCompanyBanks',
  components: {
    QueryForm,
    STable,
    ChosenAlertBox,
    Bank
  },
  data() {
    return {
      selectedRowKeys: [],
      currentRow: null,
      action: null,
      columns: [
        { title: i18nRender('table.column.bank-name'), dataIndex: 'bankName' },
        { title: i18nRender('table.column.descriptions'), dataIndex: 'descriptions', ellipsis: true },
        {
          title: i18nRender('table.column.action'),
          dataIndex: 'id',
          hideInSearch: true,
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
        const data = await this.$store.dispatch('api/setup/company/banks/fetchList', params)
        return data
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
    async notificationConfirm(message) {
      this.$confirm({
        centered: true,
        title: message,
        okText: this.$t('table.dialog.okay'),
        cancelButtonProps: { style: { display: 'none' } },
        onOk: () => {},
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />
      })
    },
    handleDelete(selectedKeys) {
      if (!selectedKeys.length) return
      this.$confirm({
        title: () => (
          <div class="confirm-modal-title">
            <div>
              <img src="/icons/info-dialog.svg" style="margin-right: 10px;" />
              <span>{i18nRender('delete.confirm')}</span>
            </div>
          </div>
        ),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: 'none',
        onOk: async () => {
          try {
            const { data } = await this.$store.dispatch('api/setup/company/banks/delete', {
              entityIds: selectedKeys
            })
            const employeesAssigned = this.getEmployeesAssigned(data)
            if (employeesAssigned) {
              this.notificationConfirm(
                this.$t(
                  employeesAssigned === 1
                    ? 'table.dialog.delete-assigned-employee'
                    : 'table.dialog.delete-assigned-employees',
                  {
                    assigned: employeesAssigned
                  }
                )
              )
              const employeesAssignedIds = data.map((value) => value.id)
              this.selectedRowKeys = this.selectedRowKeys.filter((selectedRow) => {
                return employeesAssignedIds.includes(selectedRow)
              })
            } else {
              this.$notification.open({
                message: this.$t('notification.banks.deleted'),
                icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
              })
              this.onSelectChange([])
            }
          } catch (error) {
            if (error?.response?.data?.message) this.$message.error(error?.response?.data?.message)
          }
          this.$refs.table.refresh()
        }
      })
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    onPageChange(val) {
      console.log(val)
    },
    handleAdd() {
      this.action = 'add'
      this.$store.commit('modal/TOGGLE_ADD_BANK_MODAL')
    },
    handleEdit(data) {
      this.action = 'edit'
      this.currentRow = data
      this.$store.commit('modal/TOGGLE_ADD_BANK_MODAL')
    }
  }
}
</script>
