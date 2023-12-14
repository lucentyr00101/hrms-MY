<template>
  <a-card>
    <ChosenAlertBox
      permissionNameAdd="setup_payroll_deduction_add"
      permissionNameDelete="setup_payroll_deduction_delete"
      :isActive="true"
      position="right"
      @open="modalHandler({ show: true, action: 'add' })"
      @delete="handleDelete(selectedRowKeys)"
      :totalSelected="selectedRowKeys.length"
    />
    <s-table
      permissionName="setup_payroll_deduction_view"
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
      <a-switch
        :disabled="!$store.getters.permissions.includes('setup_payroll_deduction_update-status')"
        key="status"
        slot="status"
        slot-scope="val, record"
        :default-checked="val == 'Enable' ? true : false"
        @change="(e) => handleStatusChange(e, record)"
      />

      <a-checkbox
        v-for="item in checkboxStatus"
        :slot="item"
        slot-scope="status"
        :key="item"
        :disabled="true"
        :checked="status === 'True'"
      />

      <span slot="action" slot-scope="value, data">
        <a v-action:setup_payroll_deduction_view-edit-details @click="modalHandler({ show: true, action: 'view', data })">{{ $t('table.dialog.view') }}</a>
      </span>
    </s-table>
    <FormModal :modal="formModal" @refreshTable="refreshTable" />
  </a-card>
</template>

<script>
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import FormModal from './form-modal.vue'
import columns from './columns'
import { i18nRender } from '@/locales'

export default {
  name: 'SetupPayrollDeduction',
  components: { ChosenAlertBox, FormModal },
  data() {
    return {
      checkboxStatus: ['epf', 'socso', 'eis', 'tax'],
      selectedRowKeys: [],
      formModal: { show: false },
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const data = await this.$store.dispatch('api/setup/payroll/deduction/fetchList', params)
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
    async handleStatusChange(checked, row) {
      try {
        await this.$store.dispatch('api/setup/payroll/deduction/toggleStatus', {
          id: row.id,
          status: checked ? 'Enable' : 'Disable'
        })
        this.$notification.open({
          message: checked ? this.$t('notification.deduction.enabled') : this.$t('notification.deduction.disabled'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.$refs.table.refresh(true)
      } catch (e) {
        this.$message.error(e.response.data.message)
      }
    },
    refreshTable() {
      this.$refs.table.refresh()
      this.modalHandler({ show: false })
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
            await this.$store.dispatch('api/setup/payroll/deduction/delete', {
              entityIds: selectedKeys
            })

            this.$notification.open({
              message: this.$t('table.dialog.deduction-deleted'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
            this.onSelectChange([])
            this.$refs.table.refresh()
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
        }
      })
    }
  }
}
</script>
