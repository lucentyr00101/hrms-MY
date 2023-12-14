<template>
  <div>
    <a-card id="filter">
      <a-row type="flex" :gutter="[8, 8]">
        <a-col :span="12">
          <a-row type="flex">
            <a-col class="name" flex="100px" :span="12">{{ $t('table.column.month') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-range-picker v-model="filter.month" />
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="12">
          <a-row type="flex">
            <a-col class="name" flex="100px" :span="12">{{ $t('table.column.report-type') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select
                v-model="filter.loanReportType"
                placeholder="All"
              >
                <a-select-option v-for="(loanReport, index) in loanReportTypeList" :key="index" :value="loanReport">{{ loanReport }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="12">
          <a-row type="flex">
            <a-col class="name" flex="100px" :span="12">{{ $t('table.column.filter-by') }}:</a-col>
            <a-col class="input filter-by" flex="auto" :span="12">
              <a-radio-group :options="filterBy" :default-value="valuefilterBy" @change="onChangeFilterBy" />
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="12">
          <a-row type="flex">
            <a-col class="name" flex="100px" :span="12">{{ valuefilterBy === 'Departments' ? $t('table.column.department') : $t('table.column.employee') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select
                mode="multiple"
                style="width: 100%"
                v-model="filter.filterByEnums"
              >
                <a-select-option v-for="(filterByEn, index) in filterByEnums" :key="index" :value="filterByEn">{{ filterByEn }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <div class="action-holder">
        <a-button class="query" type="primary" @click="refreshTable">{{ $t('preview') }}</a-button>
        <a-button v-action:reports_loan-report_export class="export" type="primary" :disabled="(currentData.length === 0)" @click="handleExport">{{ $t('table.dialog.export') }}</a-button>
      </div>
    </a-card>
    <div class="total-cards">
      <div v-if="loanReportType === 'All' || loanReportType === 'Loan Amount'" class="total-card">
        <span class="bold">{{ $t('table.card.total-loan-amount') }}: </span> {{ currentData?.data?.totalLoanAmount }}
      </div>
      <div v-if="loanReportType === 'All' || loanReportType === 'Application'" class="total-card">
        <span class="bold">{{ $t('table.card.total-application') }}: </span> {{ currentData?.data?.totalApplication }}
      </div>
      <div v-if="loanReportType === 'All' || loanReportType === 'Approve'" class="total-card">
        <span class="bold">{{ $t('table.card.total-approve') }}: </span> {{ currentData?.data?.totalApproved }}
      </div>
      <div v-if="loanReportType === 'All' || loanReportType === 'Reject'" class="total-card">
        <span class="bold">{{ $t('table.card.total-reject') }}: </span> {{ currentData?.data?.totalReject }}
      </div>
      <div v-if="loanReportType === 'All' || loanReportType === 'Pending'" class="total-card">
        <span class="bold">{{ $t('table.card.total-pending') }}: </span> {{ currentData?.data?.totalPending }}
      </div>
    </div>
    <a-card>
      <s-table
        permissionName="reports_loan-report_view"
        ref="table"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :pagination="{
          showSizeChanger: true,
          showQuickJumper: true,
          'show-total': (total) => $tc('table.column.total-items', total)
        }"
      >
        <span slot="action" slot-scope="value, data">
          <a @click="handleView(data)">{{ $t('table.dialog.view-application') }}</a>
        </span>
      </s-table>
      <details-modal ref="detailsModal" :model="mdl"/>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import DetailsModal from './DetailsModal.vue'

export default {
  name: 'ReportsLoan',
  components: {
    DetailsModal
  },
  data() {
    return {
      filter: { month: [], loanReportType: 'All', filterByEnums: undefined },
      filterBy: ['Departments', 'Employee Selection'],
      filterByEnums: [],
      valuefilterBy: 'Departments',
      mdl: null,
      queryParam: {},
      currentData: [],
      employeeList: [],
      departmentList: [],
      loanReportType: 'All',
      loanReportTypeList: [],
      loanReportTypeListStatic: ['Loan Amount', 'Application', 'Approve', 'Reject', 'Pending'],
      loadData: async (parameter) => {
        const { month, loanReportType, filterByEnums } = this.filter
        const { pageNo, pageSize } = parameter
        const _parameter = {
          shortFromDate: month.length !== 0 ? moment(month[0]).format('YYYY-MM-DD') : undefined,
          shortToDate: month.length !== 0 ? moment(month[1]).format('YYYY-MM-DD') : undefined,
          loanReportType: loanReportType !== undefined ? loanReportType : 'All',
          departments: this.valuefilterBy === 'Departments' ? filterByEnums : undefined,
          employees: this.valuefilterBy === 'Employee Selection' ? filterByEnums : undefined,
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const response = await this.$store.dispatch('api/reports/loanReport/fetchList', params)
        this.currentData = response
        return this.currentData
      }
    }
  },
  computed: {
    columns() {
      return [
        { title: this.$t('table.column.employee-number'), dataIndex: 'employeeNumber', key: 'employee-number', ellipsis: true },
        { title: this.$t('table.column.employee'), dataIndex: 'employee', key: 'employee-full-name', ellipsis: true },
        { title: this.$t('table.column.date'), dataIndex: 'date', key: 'employee-date' },
        { title: this.$t('table.column.loan-amount'), dataIndex: 'loanAmount', key: 'employee-loan-amount' },
        { title: this.$t('table.column.repayment-bal'), dataIndex: 'loanBalance', key: 'employee-repayment-bal' },
        { title: this.$t('table.column.rate'), dataIndex: 'interestRate', key: 'employee-rate' },
        { title: this.$t('table.column.status'), dataIndex: 'approvalStatus', key: 'employee-status' },
        { title: this.$t('table.column.action'), dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  methods: {
    initiate() {
      // Set Filter
      const filter = window.localStorage.getItem('RLOR-Filter')
      this.filter = (filter) ? JSON.parse(filter) : this.filter
      this.valuefilterBy = window.localStorage.getItem('RLOR-Filter-By') ? window.localStorage.getItem('RLOR-Filter-By') : this.valuefilterBy
      this.loanReportType = window.localStorage.getItem('RLOR-Filter-LRT') ? window.localStorage.getItem('RLOR-Filter-LRT') : this.loanReportType
      if (!this.loanReportTypeListStatic.includes(this.loanReportType)) {
        this.loanReportType = 'All'
      }
      this.getEmployeeList()
      this.getDepartmentList()
      this.getLoanReportTypeList()
    },
    onChangeFilterBy(e) {
      this.filter.filterByEnums = []
      this.valuefilterBy = e.target.value
      if (e.target.value === 'Departments') {
        this.filterByEnums = this.departmentList
      } else {
        this.filterByEnums = this.employeeList
      }
    },
    async getEmployeeList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchActiveEmployeeDropdown')
        this.employeeList = list?.data?.employeeDetailSmallResponses.map((item) => (item.fullName))
        this.employeeList = this.employeeList.filter((c, index) => {
          return this.employeeList.indexOf(c) === index
        })
        if (this.valuefilterBy === 'Employee Selection') {
          this.filterByEnums = this.employeeList
        }
      } catch (error) {
        throw error
      }
    },
    async getDepartmentList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchDepartmentNamesDropdown')
        this.departmentList = list.data
        if (this.valuefilterBy === 'Departments') {
          this.filterByEnums = this.departmentList
        }
      } catch (error) {
        throw error
      }
    },
    async getLoanReportTypeList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchLoanReportTypeDropdown')
        this.loanReportTypeList = list.data
      } catch (error) {
        throw error
      }
    },
    handleView (record) {
      console.log(record)
      this.mdl = record
      this.$refs.detailsModal.view()
    },
    async handleExport() {
      const { month, loanReportType, filterByEnums } = this.filter
      const _parameter = {
        shortFromDate: month.length !== 0 ? moment(month[0]).format('YYYY-MM-DD') : undefined,
        shortToDate: month.length !== 0 ? moment(month[1]).format('YYYY-MM-DD') : undefined,
        loanReportType: loanReportType !== undefined ? loanReportType : 'All',
        departments: this.valuefilterBy === 'Departments' ? filterByEnums : undefined,
        employees: this.valuefilterBy === 'Employee Selection' ? filterByEnums : undefined
      }
      try {
        const response = await this.$store.dispatch('api/reports/loanReport/exportList', _parameter)
        const fileData = new Blob([ response ], { type: 'application/octet-stream' }) // Use this if the responseType is not blob like arraybuffer.
        const fileURL = window.URL.createObjectURL(fileData)
        const fileLink = document.createElement('a')
              fileLink.href = fileURL
              fileLink.setAttribute('download', `LoanReport_${moment().format('YYYYMMDDHHmmss')}.csv`)
              fileLink.click()
      } catch (error) {
        throw error
      }
    },
    refreshTable() {
      window.localStorage.setItem('RLOR-Filter', JSON.stringify(this.filter))
      window.localStorage.setItem('RLOR-Filter-By', this.valuefilterBy)
      window.localStorage.setItem('RLOR-Filter-LRT', this.filter.loanReportType)
      this.loanReportType = this.filter.loanReportType
      if (!this.loanReportTypeListStatic.includes(this.loanReportType)) {
        this.loanReportType = 'All'
      }
      this.getEmployeeList()
      this.getDepartmentList()
      this.getLoanReportTypeList()
      this.$refs.table.refresh()
    }
  },
  created() {
    this.initiate()
  }
}
</script>

<style lang="less" scoped>
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

  #filter .action-holder .export {
    margin: 0 10px;
  }

  #filter .filter-by {
    margin-top: 4px;
  }

  [data-theme='realdark'] {
    .total-card {
      background-color: #141414;
    }
  }

  .total-cards {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 20px
  }
  .total-card {
    background-color: white;
    width: 20%;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-weight: 500;
    font-size: 16px;
    .bold {
      font-weight: bolder;
      margin-right: 5px;
    }
  }

  .total-card:not(:last-child) {
    margin-right: 20px;
  }

  @media (max-width: 1200px) {
    .total-cards {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 15px;
    }
    .total-card {
      justify-content: left;
      width: 80%;
    }
  }

  @media (max-width: 788px) {
    #filter .name {
      text-align: left;
    }
  }
</style>
