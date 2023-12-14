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
                v-model="filter.contributionReportType"
                placeholder="All"
              >
                <a-select-option v-for="(contributionReport, index) in contributionReportTypeList" :key="index" :value="contributionReport">{{ contributionReport }}</a-select-option>
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
        <a-button v-action:reports_contribution-report_export class="export" type="primary" :disabled="(currentData.length === 0)" @click="handleExport">{{ $t('table.dialog.export') }}</a-button>
      </div>
    </a-card>
    <div class="total-cards">
      <div v-if="contributionReportType === 'All' || contributionReportType === 'EPF'" class="total-card">
        <span class="bold">{{ $t('table.card.total-epf-amount') }}: </span> {{ currentData?.data?.totalEpf }}
      </div>
      <div v-if="contributionReportType === 'All' || contributionReportType === 'HRDF'" class="total-card">
        <span class="bold">{{ $t('table.card.total-hrdf-amount') }}: </span> {{ currentData?.data?.totalHrdf }}
      </div>
      <div v-if="contributionReportType === 'All' || contributionReportType === 'Socso'" class="total-card">
        <span class="bold">{{ $t('table.card.total-socso-amount') }}: </span> {{ currentData?.data?.totalSocso }}
      </div>
      <div v-if="contributionReportType === 'All' || contributionReportType === 'EIS'" class="total-card">
        <span class="bold">{{ $t('table.card.total-eis-amount') }}: </span> {{ currentData?.data?.totalEis }}
      </div>
    </div>
    <a-card>
      <s-table
        permissionName="reports_contribution-report_view"
        ref="table"
        rowKey="payrollSummaryId"
        :columns="columns"
        :data="loadData"
        :pagination="{
          showSizeChanger: true,
          showQuickJumper: true,
          'show-total': (total) => $tc('table.column.total-items', total)
        }"
      >
        <span slot="action" slot-scope="value, data">
          <a @click="handleView(data)">{{ $t('table.dialog.view-payslip') }}</a>
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
  name: 'ReportsContribution',
  components: {
    DetailsModal
  },
  data() {
    return {
      filter: { month: [], contributionReportType: 'All', filterByEnums: undefined },
      filterBy: ['Departments', 'Employee Selection'],
      filterByEnums: [],
      valuefilterBy: 'Departments',
      mdl: null,
      queryParam: {},
      currentData: [],
      employeeList: [],
      departmentList: [],
      contributionReportType: 'All',
      contributionReportTypeList: [],
      contributionReportTypeListStatic: ['EPF', 'Socso', 'EIS', 'HRDF'],
      loadData: async (parameter) => {
        const { month, contributionReportType, filterByEnums } = this.filter
        const { pageNo, pageSize } = parameter
        const _parameter = {
          shortFromDate: month.length !== 0 ? moment(month[0]).format('YYYY-MM-DD') : undefined,
          shortToDate: month.length !== 0 ? moment(month[1]).format('YYYY-MM-DD') : undefined,
          contributionReportType: contributionReportType !== undefined ? contributionReportType : 'All',
          departments: this.valuefilterBy === 'Departments' ? filterByEnums : undefined,
          employees: this.valuefilterBy === 'Employee Selection' ? filterByEnums : undefined,
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const response = await this.$store.dispatch('api/reports/contributionReport/fetchList', params)
        this.currentData = response
        return this.currentData
      }
    }
  },
  computed: {
    columns() {
      return [
        { title: this.$t('table.column.employee-number'), dataIndex: 'employee.employeeNumber', key: 'employee-number', ellipsis: true },
        { title: this.$t('table.column.employee'), dataIndex: 'employee.fullName', key: 'employee-full-name', ellipsis: true },
        { title: this.$t('table.column.from'), dataIndex: 'fromDate', key: 'employee-from-date' },
        { title: this.$t('table.column.to'), dataIndex: 'toDate', key: 'employee-to-date' },
        { title: 'EPF', dataIndex: 'epf', key: 'employee-epf' },
        { title: 'SOCSO', dataIndex: 'socso', key: 'employee-socso' },
        { title: 'EIS', dataIndex: 'eis', key: 'employee-eis' },
        { title: 'HRDF', dataIndex: 'hrdf', key: 'employee-hrdf' },
        { title: this.$t('table.column.action'), dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  methods: {
    initiate() {
      // Set Filter
      const filter = window.localStorage.getItem('RCOR-Filter')
      this.filter = (filter) ? JSON.parse(filter) : this.filter
      this.valuefilterBy = window.localStorage.getItem('RCOR-Filter-By') ? window.localStorage.getItem('RCOR-Filter-By') : this.valuefilterBy
      this.contributionReportType = window.localStorage.getItem('RCOR-Filter-LRT') ? window.localStorage.getItem('RCOR-Filter-LRT') : this.contributionReportType
      if (!this.contributionReportType.includes(this.contributionReportType)) {
        this.contributionReportType = 'All'
      }
      this.getEmployeeList()
      this.getDepartmentList()
      this.getContributionReportTypeList()
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
    async getContributionReportTypeList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchContributionReportTypeDropdown')
        this.contributionReportTypeList = list.data
      } catch (error) {
        throw error
      }
    },
    async handleView (record) {
      const details = await this.$store.dispatch('api/main/payroll/generalPayroll/viewSummary', record.payrollSummaryId)
      this.mdl = details
      console.log(this.mdl)
      this.$refs.detailsModal.view()
    },
    async handleExport() {
      const { month, contributionReportType, filterByEnums } = this.filter
      const _parameter = {
        shortFromDate: month.length !== 0 ? moment(month[0]).format('YYYY-MM-DD') : undefined,
        shortToDate: month.length !== 0 ? moment(month[1]).format('YYYY-MM-DD') : undefined,
        contributionReportType: contributionReportType !== undefined ? contributionReportType : 'All',
        departments: this.valuefilterBy === 'Departments' ? filterByEnums : undefined,
        employees: this.valuefilterBy === 'Employee Selection' ? filterByEnums : undefined
      }
      try {
        const response = await this.$store.dispatch('api/reports/contributionReport/exportList', _parameter)
        const fileData = new Blob([ response ], { type: 'application/octet-stream' }) // Use this if the responseType is not blob like arraybuffer.
        const fileURL = window.URL.createObjectURL(fileData)
        const fileLink = document.createElement('a')
              fileLink.href = fileURL
              fileLink.setAttribute('download', `ContributionReport_${moment().format('YYYYMMDDHHmmss')}.csv`)
              fileLink.click()
      } catch (error) {
        throw error
      }
    },
    refreshTable() {
      window.localStorage.setItem('RCOR-Filter', JSON.stringify(this.filter))
      window.localStorage.setItem('RCOR-Filter-By', this.valuefilterBy)
      window.localStorage.setItem('RCOR-Filter-LRT', this.filter.contributionReportType)
      this.contributionReportType = this.filter.contributionReportType
      if (!this.contributionReportType.includes(this.contributionReportType)) {
        this.contributionReportType = 'All'
      }
      this.getEmployeeList()
      this.getDepartmentList()
      this.getContributionReportTypeList()
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
