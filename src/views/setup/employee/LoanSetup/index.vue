<template>
  <a-card>
    <ChosenAlertBox
      permissionNameAdd="setup_employee_loan-setup_add"
      permissionNameDelete="setup_employee_loan-setup_delete"
      :isActive="true"
      :totalSelected="selectedItems.length"
      position="right"
      @open="modalHandler({ show: true, action: 'add' })"
      @delete="deleteData"
    />
    <s-table
      permissionName="setup_employee_loan-setup_view"
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
      <span slot="interestRate" slot-scope="value">{{ value }} &percnt;</span>
      <span slot="action" slot-scope="value, data">
        <a v-action:setup_employee_loan-setup_edit @click="modalHandler({ show: true, action: 'update', data })">{{ $t('table.dialog.edit') }}</a>
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
  name: 'SetupEmployeeLoanSetup',
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
        const response = await this.$store.dispatch('api/setup/employee/loanSetup/fetchList', params)
        // console.log(response)
        this.currentData = response.data.data
        return response
      }
    }
  },
  computed: {
    columns() {
      return [
        { title: i18nRender('table.column.loan-type'), dataIndex: 'loanType', key: 'loanType', ellipsis: true },
        { title: i18nRender('table.column.terms'), dataIndex: 'terms', key: 'terms' },
        { title: i18nRender('table.column.interest-rates'), dataIndex: 'interestRate', key: 'interestRate', scopedSlots: { customRender: 'interestRate' } },
        { title: i18nRender('table.column.auto-repayment'), dataIndex: 'autoRepayment', key: 'autoRepayment', ellipsis: true },
        { title: i18nRender('table.column.remarks'), dataIndex: 'remarks', key: 'remarks', ellipsis: true },
        { title: i18nRender('table.column.action'), dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  methods: {
    modalHandler(payload) {
      const { show = false, action = undefined, data = {} } = payload || {}
      this.formModal = { show, action, data }
    },
    onSelectChange(selectedItems) {
      this.selectedItems = [ ...selectedItems ]
    },
    async deleteData() {
      if (this.selectedItems.length > 0) {
        this.$confirm({
          title: this.$t('delete.confirm'),
          okText: 'Yes',
          cancelText: 'No',
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
          onOk: async () => {
            try {
              await this.$store.dispatch('api/setup/employee/loanSetup/delete', { entityIds: this.selectedItems })
              this.$notification.open({
                message: this.$t('notification.loan-setup.deleted'),
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
