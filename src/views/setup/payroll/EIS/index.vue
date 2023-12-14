<template>
  <a-card>
    <div v-show="!EISModal">
      <ChosenAlertBox
        permissionNameAdd="setup_payroll_eis_add"
        permissionNameDelete="setup_payroll_eis_delete"
        :isActive="true"
        position="right"
        :totalSelected="selectedRowKeys.length"
        @open="openEISModal()"
        @delete="handleDelete(selectedRowKeys)"
      />
      <s-table
        permissionName="setup_payroll_eis_view"
        ref="table"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :pagination="{
          showSizeChanger: true,
          showQuickJumper: true,
          'show-total': (total, range) => $tc('table.column.total-items', total)
        }"
      >
        <span slot="status" slot-scope="status, record">
          <a-switch
            :disabled="!$store.getters.permissions.includes('setup_payroll_eis_update-status')"
            :default-checked="status === 'Enable'"
            @change="(e) => handleStatusChange(e, record)"
          />
        </span>
        <span slot="action" slot-scope="text, record">
          <a v-action:setup_payroll_eis_view-edit-details @click="openEISModal(record)">{{
            $t('table.dialog.view')
          }}</a>
        </span>
      </s-table>
    </div>
    <EISModal :model="mdl" @refreshTable="$refs.table.refresh()" />
  </a-card>
</template>

<script>
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import { i18nRender } from '@/locales'
import EISModal from './EisModal'
import InfoCircle from '@/assets/info-circle.svg'
const columns = [
  {
    title: i18nRender('table.column.eis-type'),
    dataIndex: 'eisType',
    key: 'eisType',
    ellipsis: true
  },
  {
    title: i18nRender('table.column.descriptions'),
    dataIndex: 'descriptions',
    key: 'descriptions',
    ellipsis: true
  },
  {
    title: i18nRender('table.column.status'),
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: i18nRender('table.column.action'),
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'EIS',
  components: { ChosenAlertBox, EISModal },
  computed: {
    EISModal: {
      get() {
        return this.$store.state.modal.EISModal
      },
      set() {
        // just to prevent error log when @cancel
      }
    }
  },
  data() {
    return {
      columns,
      selectedRowKeys: [],
      mdl: null,
      fields: ['eisType', 'descriptions'],
      loadData: async (parameter) => {
        console.log('para', parameter)
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const data = await this.$store.dispatch('api/setup/payroll/eis/fetchList', params)
        return data
      }
    }
  },
  methods: {
    openEISModal(data) {
      this.$store.commit('modal/TOGGLE_EIS_MODAL')
      this.mdl = { ...data }
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    async handleStatusChange(checked, row) {
      try {
        await this.$store.dispatch('api/setup/payroll/eis/updateStatus', {
          id: row.id,
          status: checked ? 'Enable' : 'Disable'
        })
        this.$notification.open({
          message: checked ? this.$t('notification.eis.enabled') : this.$t('notification.eis.disabled'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.$refs.table.refresh(true)
      } catch (e) {
        this.$message.error(e.response.data.message)
      }
    },
    async handleDelete(keys) {
      if (this.totalSelected === 0) return
      this.$confirm({
        centered: true,
        title: i18nRender('delete.confirm'),
        cancelText: i18nRender('table.dialog.no'),
        onOk: async () => {
          await this.$store.dispatch('api/setup/payroll/eis/deleteEis', { entityIds: keys })

          this.$refs.table.refresh(true)

          this.$notification['success']({
            message: i18nRender('notification.eis-type-deleted')
          })
          this.selectedRowKeys = []
        },
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />
      })
    }
  }
}
</script>
