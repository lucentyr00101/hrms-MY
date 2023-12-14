<template>
  <a-card>
    <chosen-alert-box
      permissionNameAdd="setup_payroll_additional-remuneration_add"
      permissionNameDelete="setup_payroll_additional-remuneration_delete"
      :isActive="true"
      :totalSelected="selectedRowKeys.length"
      position="right"
      @open="openAddRoleModal()"
      @delete="handleDelete(selectedRowKeys)"
    />
    <s-table
      permissionName="setup_payroll_additional-remuneration_view"
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
      <template :slot="item" v-for="item in taxCheckboxList" slot-scope="status">
        <a-checkbox :key="item" :disabled="true" :checked="status === 'True'" />
      </template>
      <span slot="status" slot-scope="status, record">
        <a-switch
          :disabled="!$store.getters.permissions.includes('setup_payroll_additional-remuneration_update-status')"
          :default-checked="status === 'Enable'"
          @change="(e) => handleStatusChange(e, record)"
        />
      </span>
      <template slot="action" slot-scope="status, record">
        <a v-action:setup_payroll_additional-remuneration_view-edit-details @click="handleEdit(record)">{{ $t('table.dialog.view') }}</a>
      </template>
    </s-table>
    <addl-remun-modal @refreshTable="$refs.table.refresh(true)" :mdl="mdl" />
  </a-card>
</template>

<script>
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import { fetchAddtlRemunList, deleteAddtlRemun, updateAddtlRemunStatus } from '@/api/setup/payroll/addtl-remun'
import { i18nRender } from '@/locales'
import AddlRemunModal from './AddlRemunModal.vue'

import InfoCircle from '@/assets/info-circle.svg'
export const taxCheckboxList = ['epf', 'socso', 'eis', 'tax']
const columns = [
  {
    id: 1,
    title: i18nRender('table.dialog.addtl-remu-type'),
    dataIndex: 'payrollAdditionalRemunerationType',
    key: 'payrollAdditionalRemunerationType',
    ellipsis: true,
    scopedSlots: { customRender: 'payrollAdditionalRemunerationType' }
  },
  {
    id: 2,
    title: i18nRender('table.column.descriptions'),
    dataIndex: 'descriptions',
    key: 'descriptions',
    ellipsis: true
  },
  {
    id: 3,
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
    scopedSlots: { customRender: 'action' },
    key: 'action'
  }
]

export default {
  name: 'SetupPayrollAdditionalRemuneration',
  components: { ChosenAlertBox, AddlRemunModal },

  data() {
    return {
      taxCheckboxList,
      columns,
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
        const data = await fetchAddtlRemunList(params)
        return data
      },
      mdl: null
    }
  },
  computed: {},
  methods: {
    async handleDelete(keys) {
      if (this.totalSelected === 0) return
      this.$confirm({
        centered: true,
        title: i18nRender('delete.confirm'),
        cancelText: i18nRender('table.dialog.no'),
        onOk: async () => {
          await deleteAddtlRemun({ entityIds: keys })
          this.$refs.table.refresh(true)

          this.$notification['success']({
            message: i18nRender('notification.addtl-remu-type-deleted')
          })
          this.selectedRowKeys = []
        },
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />
      })
    },
    async handleStatusChange(checked, row) {
      try {
        await updateAddtlRemunStatus({
          id: row.id,
          status: checked ? 'Enable' : 'Disable'
        })
        this.$notification.success({
          message: checked
            ? i18nRender('notification.addtl-remu-type-enabled')
            : i18nRender('notification.addtl-remu-type-disabled')
        })
        this.$refs.table.refresh(true)
      } catch (e) {
        this.$message.error(e.response.data.message)
      }
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    handleEdit(val) {
      this.$store.commit('modal/TOGGLE_ADDTL_REMUN_MODAL')
      this.mdl = { ...val }
    },
    openAddRoleModal() {
      this.$store.commit('modal/TOGGLE_ADDTL_REMUN_MODAL')
    }
  }
}
</script>
