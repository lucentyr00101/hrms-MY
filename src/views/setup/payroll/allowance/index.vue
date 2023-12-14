<template>
  <a-card>
    <ChosenAlertBox
      permissionNameAdd="setup_payroll_allowance_add"
      permissionNameDelete="setup_payroll_allowance_delete"
      :isActive="true"
      position="right"
      @open="modalHandler({ show: true, action: 'add' })"
      @delete="handleDelete(selectedRowKeys)"
      :totalSelected="selectedRowKeys.length"
    />

    <s-table
      permissionName="setup_payroll_allowance_view"
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
      <a-checkbox
        v-for="item in checkboxStatus"
        :slot="item"
        slot-scope="status"
        :key="item"
        :disabled="true"
        :checked="status === 'True'"
      />

      <span slot="status" slot-scope="value, data">
        <a-switch
          :disabled="!$store.getters.permissions.includes('setup_payroll_allowance_update-status')"
          :default-checked="value === 'Enable'"
          @change="(e) => toggleStatus(data.id, value)"
        />
      </span>

      <span slot="action" slot-scope="value, data">
        <a v-action:setup_payroll_allowance_view-edit-details @click="modalHandler({ show: true, action: 'view', data })">{{ $t('table.dialog.view') }}</a>
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
  name: 'SetupPayrollAllowance',
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
        const data = await this.$store.dispatch('api/setup/payroll/allowance/fetchList', params)
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
    async toggleStatus(id, status) {
      try {
        await this.$store.dispatch('api/setup/payroll/allowance/toggleStatus', {
          id,
          status: status === 'Enable' ? 'Disable' : 'Enable'
        })
        this.$notification.open({
          message:
            status === 'Enable'
              ? this.$t('notification.allowance.enabled')
              : this.$t('notification.allowance.disabled'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
      } catch (e) {
        this.$message.error(e.response.data.message)
      }
      this.$refs.table.refresh(true)
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
            await this.$store.dispatch('api/setup/payroll/allowance/delete', {
              entityIds: selectedKeys
            })

            this.$notification.open({
              message: this.$t('table.dialog.allowance-deleted'),
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
