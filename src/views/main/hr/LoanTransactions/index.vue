<template>
  <div>
    <a-card class="antd-custom-table loan-transaction-filters">
      <QueryForm :columns="filters" v-model="queryData" @click="$refs.table.refresh(true)" />
    </a-card>
    <a-card style="margin-top: 20px">
      <chosen-alert-box
        permissionNameAdd="main_hr_loan-transactions_add"
        permissionNameDelete="main_hr_loan-transactions_delete"
        :isActive="true"
        position="right"
        @open="modalHandler({ show: true, action: 'add' })"
        @delete="handleDelete(selectedRowKeys)"
        :totalSelected="selectedRowKeys.length"
      >
        <template v-slot:action-button>
          <a-button v-action:main_hr_loan-transactions_export type="secondary" @click="handleExport">
            {{ $t('table.dialog.export') }}
          </a-button>
        </template>
      </chosen-alert-box>
      <s-table
        permissionName="main_hr_loan-transactions_view"
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
        <span slot="interestRate" slot-scope="value">
          <div>{{ value || 0 }} %</div>
        </span>
        <span slot="status" slot-scope="value">
          <div v-if="value === 'Approved'">
            <a-badge color="#87d068" :text="`${$t('table.column.approved')}`"></a-badge>
          </div>
          <div v-else-if="value === 'Pending'">
            <a-badge color="gold" :text="`${$t('table.column.pending')}`"></a-badge>
          </div>
          <div v-else-if="value === 'Rejected'">
            <a-badge color="#f50" :text="`${$t('table.dialog.rejected')}`"></a-badge>
          </div>
        </span>
        <span slot="action" slot-scope="value, data">
          <a
            v-action:main_hr_loan-transactions_view-details
            @click="modalHandler({ show: true, action: 'view', data })"
            >{{ $t('table.dialog.view') }}</a
          >
        </span>
      </s-table>
    </a-card>
    <FormModal :modal="formModal" @refreshTable="refreshTable" />
  </div>
</template>

<script>
import { filters, columns } from './columns'
import FormModal from './form-modal.vue'
import QueryForm from '@/components/Table/QueryForm.vue'
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import InfoCircle from '@/assets/info-circle.svg'
import moment from 'moment'

export default {
  name: 'MainHRLoanTransactions',
  components: {
    QueryForm,
    ChosenAlertBox,
    FormModal
  },
  data() {
    return {
      queryData: null,
      dropdownsLoanType: [],
      dropdownsDepartment: [],
      dropdownsEmployees: [],
      selectedRowKeys: [],
      formModal: { show: false },
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const filter = {
          ...this.queryData,
          ...{
            dateTime: this.queryData?.fromDate
              ? [moment(this.queryData?.fromDate), moment(this.queryData?.toDate)]
              : null
          }
        }
        window.localStorage.setItem('MHRLT-Filter', JSON.stringify(filter))
        const params = Object.assign(_parameter, this.queryForm)
        const data = await this.$store.dispatch('api/main/hr/loanTransactions/search', params)
        return data
      }
    }
  },
  computed: {
    queryForm() {
      const filters = {
        fromDate: this.queryData?.fromDate || null,
        toDate: this.queryData?.toDate || null,
        employeeName: this.queryData?.employeeName || null,
        approvalStatus: this.queryData?.approvalStatus || null,
        loanType: this.queryData?.loanType || null,
        department: this.queryData?.department || null,
        employeeNumber: this.queryData?.employeeNumber || null
      }
      Object.keys(filters).map((key) => {
        filters[key] = filters[key] === 'All' ? null : filters[key]
      })
      return filters
    },
    filters() {
      return filters(this.dropdownsLoanType, this.dropdownsDepartment, this.dropdownsEmployees)
    },
    columns() {
      return columns()
    }
  },
  created() {
    const queryData = window.localStorage.getItem('MHRLT-Filter')
    this.queryData = queryData ? JSON.parse(queryData) : this.queryData
    this.getDropdownLoanType()
    this.getDropdownsDepartments()
    this.getDropdownsEmployees()
  },
  methods: {
    async handleExport() {
      await this.$store.dispatch('api/main/hr/loanTransactions/export', this.queryForm)
    },
    refreshTable() {
      this.$refs.table.refresh()
      this.modalHandler({ show: false })
    },
    modalHandler(payload) {
      const { show = false, action = undefined, data = {} } = payload || {}
      this.formModal = { show, action, data }
    },
    onSelectChange(selectedItems) {
      this.selectedRowKeys = selectedItems
    },
    async getDropdownLoanType() {
      const {
        data: { loanType }
      } = await this.$store.dispatch('api/dropdown/fetchLoanTypeDropdown')
      this.dropdownsLoanType = loanType?.map((item) => ({ id: item.id, value: item.loanType, label: item.loanType }))
    },
    async getDropdownsDepartments() {
      const departments = await this.$store.dispatch('api/dropdown/fetchDepartmentDropdown')
      this.dropdownsDepartment = this.generateSelectTreeList(departments?.data?.parentTree)
    },
    async getDropdownsEmployees() {
      const employee = await this.$store.dispatch('api/dropdown/fetchEmployeeDropdown')
      this.dropdownsEmployees = employee?.data?.employeeDetailSmallResponses.map((item) => ({
        id: item.id,
        value: item.fullName,
        label: item.fullName,
        number: item.employeeNumber
      }))
    },
    handleDelete(selectedKeys) {
      if (!selectedKeys.length) return
      this.$confirm({
        title: this.$t('table.dialog.delete-confirm'),
        okText: this.$t('table.dialog.yes'),
        cancelText: this.$t('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          try {
            await this.$store.dispatch('api/main/hr/loanTransactions/delete', {
              entityIds: selectedKeys
            })

            this.$notification.open({
              message: this.$t('notification.loan-transaction.deleted'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
            this.onSelectChange([])
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
          this.$refs.table.refresh()
        }
      })
    }
  }
}
</script>

<style lang="less">
.loan-transaction-filters {
  @media (max-width: 1596px) {
    .ant-calendar-picker-input.ant-input {
      max-width: 310px !important;
    }
  }
}
</style>
