<template>
  <div>
    <a-card id="filter">
      <a-row type="flex" :gutter="[24, 8]">
        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="100px" :span="12">{{ $t('table.column.month') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-month-picker
                v-model="filter.month"
                format="MMM"
                dropdown-class-name="app-month-picker"
              />
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="150px" :span="12">{{ $t('table.column.employee') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select
                v-model="filter.employeeName"
                :options="employeeList"
                show-search
                allow-clear
                placeholder="All"
              />
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="150px" :span="12">{{ $t('table.column.approval-status') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select v-model="filter.approvalStatus" :options="statusList" allow-clear placeholder="All" />
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="100px" :span="12">{{ $t('table.column.department') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-tree-select
                v-model="filter.department"
                :tree-data="departmentList"
                tree-default-expand-all
                allow-clear
                placeholder="All"
              />
              <!-- <a-select v-model="filter.department" :options="departmentList" allow-clear placeholder="All"/> -->
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="150px" :span="12">{{ $t('table.column.employee-number') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select
                v-model="filter.employeeNumber"
                :options="employeeNumberList"
                show-search
                allow-clear
                placeholder="All"
              />
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="150px" :span="12">{{ $t('table.column.claim-status') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select v-model="filter.claimStatus" :options="statusList" allow-clear placeholder="All" />
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="100px" :span="12">{{ $t('table.column.claim-type') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select v-model="filter.claimType" :options="claimTypeList" allow-clear placeholder="All" />
            </a-col>
          </a-row>
        </a-col>
      </a-row>

      <div class="action-holder">
        <a-button class="reset" type="default" @click="resetFilter">{{ $t('reset') }}</a-button>
        <a-button class="query" type="primary" @click="refreshTable">{{ $t('query') }}</a-button>
      </div>
    </a-card>

    <a-card>
      <ChosenAlertBox
        permissionNameAdd="main_hr_claim-transactions_add"
        permissionNameDelete="main_hr_claim-transactions_delete"
        :isActive="true"
        :totalSelected="selectedItems.length"
        position="right"
        @open="modalHandler({ show: true, action: 'add' })"
        @delete="deleteData"
      >
        <template v-slot:action-button>
          <a-button v-action:main_hr_claim-transactions_export type="secondary" :disabled="currentData.length === 0" @click="handleExport">
            {{ $t('table.dialog.export') }}
          </a-button>
        </template>
      </ChosenAlertBox>
      <s-table
        permissionName="main_hr_claim-transactions_view"
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
        <span class="status" slot="approvalStatus" slot-scope="value">
          <span :class="['point', `${String(value).toLowerCase()}`]"></span>
          <span>{{ value }}</span>
        </span>
        <span class="status" slot="claimApprovalStatus" slot-scope="value">
          <span :class="['point', `${String(value).toLowerCase()}`]"></span>
          <span>{{ value }}</span>
        </span>
        <span slot="action" slot-scope="value, data">
          <a v-action:main_hr_claim-transactions_view-details @click="getDetails(data)">{{ $t('table.dialog.view') }}</a>
        </span>
      </s-table>
      <Modal :data="modalData" />
    </a-card>
  </div>
</template>

<script>
import { i18nRender } from '@/locales'
// import { ExportToCsv } from 'export-to-csv'
import moment from 'moment'
import InfoCircle from '@/assets/info-circle.svg'

import AppMonthPickerVue from '@/components/tools/AppMonthPicker'
import ChosenAlertBox from '@/components/Table/ChosenAlertBox'
import Modal from './Modal'

// const csvExporter = new ExportToCsv({
//   fieldSeparator: ',',
//   quoteStrings: '"',
//   decimalSeparator: '.',
//   showLabels: true,
//   showTitle: false,
//   filename: `HR_ClaimTransactions_${moment().format('YYYYMMDDHHmmss')}`,
//   useTextFile: false,
//   useBom: true,
//   useKeysAsHeaders: true
//   // headers: ['ID', 'Employee Name', etc.] <--- disable useKeysAsHeaders before use
// })

export default {
  name: 'MainHRClaimTransactions',
  components: {
    AppMonthPickerVue,
    ChosenAlertBox,
    Modal
  },
  data() {
    return {
      filter: {
        month: undefined,
        employeeName: undefined,
        employeeNumber: undefined,
        department: undefined,
        approvalStatus: undefined,
        claimStatus: undefined,
        claimType: undefined
      },
      modalData: { show: false },
      selectedItems: [],
      queryParam: {},
      currentData: [],
      selectedNestedKeys: [],
      employeeList: [],
      employeeNumberList: [],
      departmentList: [],
      statusList: [],
      claimTypeList: [],
      loadData: async (parameter) => {
        const { month, employeeName, employeeNumber, department, approvalStatus, claimStatus, claimType } = this.filter
        const { pageNo, pageSize } = parameter
        const _parameter = {
          month: month ? moment(month).format('MMMM') : undefined,
          employeeName: String(employeeName).includes('/') ? String(employeeName).split('/')[1] : employeeName,
          employeeNumber,
          department,
          approvalStatus,
          claimStatus,
          claimType: String(claimType).includes('/') ? String(claimType).split('/')[1] : claimType,
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const response = await this.$store.dispatch('api/main/hr/claimTransactions/fetchList', params)
        this.currentData = response.data.data
        return response
      }
    }
  },
  computed: {
    columns() {
      return [
        {
          title: i18nRender('table.column.employee-number'),
          dataIndex: 'employee.employeeNumber',
          key: 'employee-number'
        },
        { title: i18nRender('table.column.employee'), dataIndex: 'employee.fullName', key: 'employee-full-name', ellipsis: true },
        { title: i18nRender('table.column.department'), dataIndex: 'employee.department', key: 'employee-department', ellipsis: true },
        { title: i18nRender('table.column.claim-type'), dataIndex: 'companyClaimType.claimType', key: 'claimType', ellipsis: true },
        { title: i18nRender('table.column.month'), dataIndex: 'claimsFor', key: 'claimsFor' },
        { title: i18nRender('table.column.amount'), dataIndex: 'claimAmount', key: 'claimAmount' },
        {
          title: i18nRender('table.column.approve-amount'),
          dataIndex: 'approvedClaimAmount',
          key: 'approvedClaimAmount'
        },
        {
          title: i18nRender('table.column.approval-status'),
          dataIndex: 'approvalStatus',
          key: 'approvalStatus',
          scopedSlots: { customRender: 'approvalStatus' }
        },
        {
          title: i18nRender('table.column.claim-status'),
          dataIndex: 'claimApprovalStatus',
          key: 'claimApprovalStatus',
          scopedSlots: { customRender: 'claimApprovalStatus' }
        },
        {
          title: i18nRender('table.column.action'),
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    initiate() {
      // Set Filter
      const filter = window.localStorage.getItem('MHRCT-Filter')
      const hasFilter = Object.keys(JSON.parse(filter) || {}).length > 0
      this.filter = hasFilter ? JSON.parse(filter) : this.filter

      const hasQuery = Object.keys(this.$route.query || {}).length

      if (hasQuery) {
        const urlQuery = this.$route.query
        this.filter = {}
        this.filter.claimType = urlQuery?.claimType
        this.filter.employeeName = urlQuery?.name
        this.filter.employeeNumber = urlQuery?.employeeNumber
        this.filter.month = urlQuery?.month
        this.filter.claimStatus = urlQuery?.claimApprovalStatus
      }

      this.getEmployeeList()
      this.getEmployeeNumberList()
      this.getDepartmentList()
      this.getStatusList()
      this.getClaimTypeList()
    },
    async getEmployeeList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchActiveEmployeeDropdown')
        this.employeeList = list?.data?.employeeDetailSmallResponses.map((item) => ({
          value: `${item.id}/${item.fullName}`,
          label: item.fullName
        }))
      } catch (error) {
        throw error
      }
    },
    async getEmployeeNumberList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchEmployeeNumberDropdown')
        this.employeeNumberList = list?.data?.employeeNumbers
          .filter((item) => item !== 'All')
          .map((item) => ({ value: item, label: item }))
      } catch (error) {
        throw error
      }
    },
    async getDepartmentList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchDepartmentDropdown')
        this.departmentList = this.generateSelectTreeList(list?.data?.parentTree)
        // this.departmentList = list?.data.filter((item) => (item !== 'All')).map((item) => ({ value: item, label: item })) // api/dropdown/fetchDepartmentNamesDropdown
      } catch (error) {
        throw error
      }
    },
    async getStatusList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchApprovalStatusDropdown')
        this.statusList = list?.data.filter((item) => item !== 'All').map((item) => ({ value: item, label: item }))
      } catch (error) {
        throw error
      }
    },
    async getClaimTypeList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchClaimTypeDropdown')
        this.claimTypeList = list?.data?.companyClaimType.map((item) => ({
          value: `${item.id}/${item.companyClaimType}`,
          label: item.companyClaimType,
          customRequirements: item.companyCustomRequirements
        }))
      } catch (error) {
        throw error
      }
    },
    async getDetails(data) {
      try {
        const details = await this.$store.dispatch('api/main/hr/claimTransactions/fetchDetails', { id: data.id })
        this.modalHandler({ show: true, action: 'view', data: { id: data.id, ...details.data } })
      } catch (error) {
        throw error
      }
    },
    resetFilter() {
      this.filter = {
        month: undefined,
        employeeName: undefined,
        employeeNumber: undefined,
        department: undefined,
        approvalStatus: undefined,
        claimStatus: undefined,
        claimType: undefined
      }
      this.refreshTable()
    },
    modalHandler(payload) {
      const { show = false, action = undefined, data = {} } = payload || {}
      this.modalData = { show, action, data }
    },
    onSelectChange(selectedItems) {
      this.selectedItems = [...selectedItems]
    },
    async handleExport() {
      // if (this.currentData.length > 0) { csvExporter.generateCsv(this.currentData) }
      const { month, employeeName, employeeNumber, department, approvalStatus, claimStatus, claimType } = this.filter
      const _parameter = {
        month: month ? moment(month).format('MMMM') : undefined,
        employeeName: String(employeeName).split('/')[1],
        employeeNumber,
        department,
        approvalStatus,
        claimStatus,
        claimType: String(claimType).split('/')[1]
      }
      try {
        const response = await this.$store.dispatch('api/main/hr/claimTransactions/exportList', _parameter)
        const fileData = new Blob([response], { type: 'application/octet-stream' }) // Use this if the responseType is not blob like arraybuffer.
        const fileURL = window.URL.createObjectURL(fileData)
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `HR_ClaimTransactions_${moment().format('YYYYMMDDHHmmss')}.csv`)
        fileLink.click()
      } catch (error) {
        throw error
      }
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
              await this.$store.dispatch('api/main/hr/claimTransactions/delete', { entityIds: this.selectedItems })
              this.$notification.open({
                message: this.$t('notification.claim-transactions.deleted'),
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
      window.localStorage.setItem('MHRCT-Filter', JSON.stringify(this.filter))
      this.getEmployeeList()
      this.getEmployeeNumberList()
      this.getDepartmentList()
      this.getStatusList()
      this.getClaimTypeList()
      this.$refs.table.refresh()
      this.modalHandler({ show: false })
    }
  },
  created() {
    this.initiate()
  }
}
</script>

<style scoped>
#filter {
  margin: 0 0 20px 0;
}

#filter .name {
  padding: 5px 10px;
  text-align: right;
}

#filter .input > * {
  width: 100%;
}

#filter .action-holder {
  margin-top: 10px;
  text-align: right;
}

#filter .action-holder .reset {
  margin: 0 10px;
}

.status {
  display: flex;
  align-items: center;
  text-transform: capitalize;
}

.status .point {
  display: inline-block;
  margin: 0 5px 0 0;
  width: 5px;
  height: 5px;
  background-color: #000;
  border-radius: 100%;
}

.status .point.rejected {
  background-color: #ff4d4f;
}

.status .point.approved,
.status .point.claimed {
  background-color: #52c41a;
}

.status .point.pending {
  background-color: #faad14;
}

@media (max-width: 788px) {
  #filter .name {
    text-align: left;
  }
}

.app-month-picker .ant-calendar-month-panel-header {
  display: none;
}
</style>
