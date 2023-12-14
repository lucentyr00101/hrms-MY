<template>
  <a-card>
    <ChosenAlertBox
      permissionNameAdd="setup_payroll_commissions_add"
      permissionNameDelete="setup_payroll_commissions_delete"
      :isActive="true"
      :totalSelected="selectedItems.length"
      position="right"
      @open="modalHandler({ show: true, action: 'add' })"
      @delete="deleteData"
    />
    <s-table
      permissionName="setup_payroll_commissions_view"
      ref="table"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :row-selection="{ selectedRowKeys: selectedItems, onChange: onSelectChange }"
      :pagination="{
        showSizeChanger: true,
        showQuickJumper: true,
        'show-total': (total) => $tc('table.column.total-items', total)
      }"
    >
      <span slot="status" slot-scope="value, data">
        <a-switch
          :disabled="!$store.getters.permissions.includes('setup_payroll_commissions_update-status')"
          :defaultChecked="value === 'Enable'"
          @click="toggleStatus(data.id, value)"
        />
      </span>
      <span v-for="(item, itemIndex) in checkboxList" :key="itemIndex" :slot="item.key" slot-scope="value">
        <a-checkbox :checked="value === 'True'" disabled />
      </span>
      <span slot="action" slot-scope="value, data">
        <a
          v-action:setup_payroll_commissions_view-edit-details
          @click="modalHandler({ show: true, action: 'view', data })"
          >{{ $t('table.dialog.view') }}</a
        >
      </span>
    </s-table>
    <FormModal :modal="formModal" />
  </a-card>
</template>

<script>
import { i18nRender } from '@/locales'
import InfoCircle from '@/assets/info-circle.svg'

import ChosenAlertBox from '@/components/Table/ChosenAlertBox'
import FormModal from './form-modal.vue'

export default {
  name: 'SetupPayrollCommission',
  components: {
    ChosenAlertBox,
    FormModal
  },
  data() {
    return {
      formModal: { show: false },
      selectedItems: [],
      queryParam: {},
      currentData: [],
      selectedNestedKeys: [],
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const response = await this.$store.dispatch('api/setup/payroll/commission/fetchList', params)
        // console.log(response)
        this.currentData = response.data.data
        return response
      }
    }
  },
  computed: {
    columns() {
      return [
        {
          title: i18nRender('table.column.commissions-type'),
          dataIndex: 'payrollCommissionsType',
          key: 'payrollCommissionsType',
          ellipsis: true
        },
        {
          title: i18nRender('table.column.descriptions'),
          dataIndex: 'descriptions',
          ellipsis: true,
          key: 'descriptions'
        },
        { title: i18nRender('table.column.rate'), dataIndex: 'rate', key: 'rate' },
        {
          title: i18nRender('table.column.status'),
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        },
        { title: i18nRender('table.column.epf'), dataIndex: 'epf', key: 'epf', scopedSlots: { customRender: 'epf' } },
        {
          title: i18nRender('table.column.socso'),
          dataIndex: 'socso',
          key: 'socso',
          scopedSlots: { customRender: 'socso' }
        },
        { title: i18nRender('table.column.eis'), dataIndex: 'eis', key: 'eis', scopedSlots: { customRender: 'eis' } },
        { title: i18nRender('table.column.tax'), dataIndex: 'tax', key: 'tax', scopedSlots: { customRender: 'tax' } },
        {
          title: i18nRender('table.column.action'),
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    },
    checkboxList() {
      return [
        { key: 'epf', label: this.$t('table.column.epf') },
        { key: 'socso', label: this.$t('table.column.socso') },
        { key: 'eis', label: this.$t('table.column.eis') },
        { key: 'tax', label: this.$t('table.column.tax') }
      ]
    }
  },
  methods: {
    modalHandler(payload) {
      const { show = false, action = undefined, data = {} } = payload || {}
      this.formModal = { show, action, data }
    },
    onSelectChange(selectedItems) {
      this.selectedItems = [...selectedItems]
    },
    async toggleStatus(id, status) {
      try {
        await this.$store.dispatch('api/setup/payroll/commission/toggleStatus', {
          id,
          status: status === 'Enable' ? 'Disable' : 'Enable'
        })
        this.$notification.open({
          message:
            status === 'Enable'
              ? this.$t('notification.commission.disabled')
              : this.$t('notification.commission.enabled'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.$refs.table.refresh()
      } catch (error) {
        this.$refs.table.refresh()
        this.$message.error(error.response.data.message)
      }
    },
    async deleteData() {
      if (this.selectedItems.length > 0) {
        this.$confirm({
          title: this.$t('delete.confirm'),
          okText: i18nRender('table.dialog.yes'),
          cancelText: i18nRender('table.dialog.no'),
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
          onOk: async () => {
            try {
              await this.$store.dispatch('api/setup/payroll/commission/delete', { entityIds: this.selectedItems })
              this.$notification.open({
                message: this.$t('notification.commission.deleted'),
                icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
              })
              this.selectedItems = []
              this.$refs.table.refresh()
            } catch (error) {
              this.selectedItems = []
              this.$message.error(error.response.data.message)
            }
          },
          onCancel: () => {
            // console.log('Cancel')
          }
        })
      }
    },
    refreshTable() {
      this.$refs.table.refresh()
      this.modalHandler({ show: false })
    }
  }
}
</script>

<style scoped></style>
