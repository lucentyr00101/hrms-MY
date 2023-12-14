<template>
  <a-card>
    <ChosenAlertBox
      permissionNameAdd="setup_payroll_overtime_add"
      permissionNameDelete="setup_payroll_overtime_delete"
      :isActive="true"
      position="right"
      @open="openOvertimeModal({ show: true, action: 'add' })"
      @delete="showDeleteInfo()"
      :totalSelected="selectedRowKeys.length"
    />
    <s-table
      permissionName="setup_payroll_overtime_view"
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

      <span slot="status" slot-scope="status, record">
        <a-switch
          :disabled="!$store.getters.permissions.includes('setup_payroll_overtime_update-status')"
          :default-checked="status === 'Enable'"
          @change="(e) => handleStatusChange(e, record)"
        />
      </span>
      <span slot="action" slot-scope="value, data">
        <a
          v-action:setup_payroll_overtime_view-edit-details
          @click="openOvertimeModal({ show: true, action: 'view', data })"
          >{{ $t('table.dialog.view') }}</a
        >
      </span>
    </s-table>
    <OvertimeModal :modal="formModal" />
  </a-card>
</template>

<script>
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import OvertimeModal from './OvertimeModal.vue'
import { i18nRender } from '@/locales'
import InfoCircle from '@/assets/info-circle.svg'

const checkboxStatus = ['epf', 'socso', 'eis', 'tax']

const columns = [
  {
    title: i18nRender('table.column.overtime-type'),
    dataIndex: 'payrollOvertimeType',
    key: 'payrollOvertimeType',
    ellipsis: true
  },
  {
    title: i18nRender('table.column.descriptions'),
    dataIndex: 'descriptions',
    key: 'descriptions',
    ellipsis: true
  },
  {
    title: i18nRender('table.column.rate'),
    dataIndex: 'rate',
    key: 'rate'
  },
  {
    title: i18nRender('table.column.unit-type'),
    dataIndex: 'unitType',
    key: 'unitType'
  },
  {
    title: i18nRender('table.column.status'),
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: i18nRender('table.column.epf'),
    dataIndex: 'epf',
    key: 'epf',
    scopedSlots: { customRender: 'epf' }
  },
  {
    title: i18nRender('table.column.socso'),
    dataIndex: 'socso',
    key: 'socso',
    scopedSlots: { customRender: 'socso' }
  },
  {
    title: i18nRender('table.column.eis'),
    dataIndex: 'eis',
    key: 'eis',
    scopedSlots: { customRender: 'eis' }
  },
  {
    title: i18nRender('table.column.tax'),
    dataIndex: 'tax',
    key: 'tax',
    scopedSlots: { customRender: 'tax' }
  },
  {
    title: i18nRender('table.column.action'),
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'SetupPayrollOvertime',
  components: { ChosenAlertBox, OvertimeModal },
  data() {
    return {
      columns,
      checkboxStatus,
      formModal: { show: false },
      selectedRowKeys: [],
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const data = await this.$store.dispatch('api/setup/payroll/overtime/fetchOvertimeList', params)

        return data
      }
    }
  },
  methods: {
    refreshTable() {
      this.$refs.table.refresh()
      this.openOvertimeModal({ show: false })
    },
    openOvertimeModal(payload) {
      const { show = false, action = undefined, data = {} } = payload || {}
      this.formModal = { show, action, data }
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    async handleStatusChange(checked, row) {
      try {
        await this.$store.dispatch('api/setup/payroll/overtime/updateStatus', {
          id: row.id,
          status: checked ? 'Enable' : 'Disable'
        })
        this.$notification.open({
          message: checked
            ? i18nRender('notification.overtime-status.enable')
            : i18nRender('notification.overtime-status.disable'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.$refs.table.refresh(true)
      } catch (e) {
        this.$message.error(e.response)
      }
    },
    showDeleteInfo() {
      const _this = this
      this.$confirm({
        title: _this.$t('delete.confirm'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,

        async onOk() {
          _this.handleDelete()
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    async handleDelete() {
      try {
        await this.$store.dispatch('api/setup/payroll/overtime/deleteOvertime', {
          entityIds: this.selectedRowKeys
        })
        this.$notification.open({
          message: this.$t('notification.overtime.deleted'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.$refs.table.refresh(true)
      } catch (err) {
        this.$message.error(err.response.data.message)
      }
    }
  }
}
</script>
