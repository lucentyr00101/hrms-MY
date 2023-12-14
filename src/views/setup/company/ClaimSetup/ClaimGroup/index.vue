<template>
  <div>
    <ChosenAlertBox
      permissionNameAdd="setup_company_claim-setup_claim-group_add"
      permissionNameDelete="setup_company_claim-setup_claim-group_delete"
      :isActive="true"
      position="right"
      @open="modalHandler({ show: true, action: 'add' })"
      @delete="handleDelete(selectedRowKeys)"
      :totalSelected="selectedRowKeys.length"
    />
    <s-table
      permissionName="setup_company_claim-setup_claim-group_view"
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
      <span slot="status" slot-scope="status, record">
        <a-switch
          :disabled="!$store.getters.permissions.includes('setup_company_claim-setup_claim-group_update-status')"
          :default-checked="status === 'Enable'"
          @change="(e) => handleStatusChange(e, record)"
        />
      </span>
      <span slot="action" slot-scope="value, data">
        <a v-action:setup_company_claim-setup_claim-group_edit @click="modalHandler({ show: true, action: 'edit', data })">{{ $t('table.dialog.edit') }}</a>
      </span>
    </s-table>
    <FormModal :modal="formModal" @refreshTable="refreshTable" />
  </div>
</template>

<script>
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import FormModal from './form-modal.vue'
import columns from './columns'
import InfoCircle from '@/assets/info-circle.svg'
import { i18nRender } from '@/locales'

export default {
  name: 'SetupCompanyClaimSetupGroup',
  components: { ChosenAlertBox, FormModal },
  data() {
    return {
      selectedRowKeys: [],
      formModal: { show: false },
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const data = await this.$store.dispatch('api/setup/company/claimGroup/list', params)
        return data
      }
    }
  },
  computed: {
    columns() {
      return columns
    }
  },
  methods: {
    modalHandler(payload) {
      const { show = false, action = undefined, data = {} } = payload || {}
      this.formModal = { show, action, data }
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    refreshTable() {
      this.$refs.table.refresh()
      this.modalHandler({ show: false })
    },
    async handleStatusChange(checked, row) {
      try {
        await this.$store.dispatch('api/setup/company/claimGroup/toggleStatus', {
          id: row.id,
          status: checked ? 'Enable' : 'Disable'
        })
        this.$notification.open({
          message: checked ? this.$t('notification.claim-group.enabled') : this.$t('notification.claim-group.disabled'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.$refs.table.refresh(true)
      } catch (e) {
        this.$message.error(e.response.data.message)
      }
    },
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
            const { data } = await this.$store.dispatch('api/setup/company/claimGroup/delete', {
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
              this.selectedRows = this.selectedRows.filter((selectedRow) => {
                return employeesAssignedIds.includes(selectedRow)
              })
            } else {
              this.$notification.open({
                message: this.$t('table.dialog.claim-group-deleted'),
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
    }
  }
}
</script>
