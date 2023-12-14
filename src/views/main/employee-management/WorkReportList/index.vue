<template>
  <div>
    <a-card id="filter">
      <a-row type="flex" :gutter="[50, 8]">
        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="110px" :span="12">{{ $t('table.column.time') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-range-picker v-model="filter.dateTimeRange" show-time allow-clear/>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="110px" :span="12">{{ $t('table.column.employee') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select v-model="filter.employeeName" :options="workReportEmployeeList" show-search allow-clear placeholder="All"/>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="150px" :span="12">{{ $t('table.column.employee-number') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select v-model="filter.employeeNumber" :options="employeeNumberList" show-search allow-clear placeholder="All"/>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="110px" :span="12">{{ $t('table.column.department') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-tree-select v-model="filter.department" :tree-data="departmentList" tree-default-expand-all allow-clear placeholder="All"/>
              <!-- <a-select v-model="filter.department" :options="departmentList" allow-clear placeholder="All"/> -->
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="110px" :span="12">{{ $t('table.column.report-type') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select v-model="filter.reportType" :options="employeeWorkReportTypeList" show-search allow-clear placeholder="All"/>
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
        permissionNameAdd="main_employee-management_work-report-lists_add"
        permissionNameDelete="main_employee-management_work-report-lists_delete"
        :isActive="true"
        :totalSelected="selectedItems.length"
        position="right"
        @open="modalHandler({ show: true, action: 'add' })"
        @delete="deleteData"
      >
        <template v-slot:action-button>
          <a-button v-action:main_employee-management_work-report-lists_export type="secondary" :disabled="(currentData.length === 0)" @click="handleExport">
            {{ $t('table.dialog.export') }}
          </a-button>
        </template>
      </ChosenAlertBox>
      <s-table
        permissionName="main_employee-management_work-report-lists_view"
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
        <span slot="createdTime" slot-scope="value">{{ (value) ? formatDate(value) : '' }}</span>
        <span slot="action" slot-scope="value, data">
          <a v-action:main_employee-management_work-report-lists_view-details class="action-button" @click="getDetails('view', data)">{{ $t('table.dialog.view') }}</a>
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

import ChosenAlertBox from '@/components/Table/ChosenAlertBox'
import Modal from './Modal'

// const csvExporter = new ExportToCsv({
//   fieldSeparator: ',',
//   quoteStrings: '"',
//   decimalSeparator: '.',
//   showLabels: true,
//   showTitle: false,
//   filename: `Employee_Management_WorkReportLists_${moment().format('YYYYMMDDHHmmss')}`,
//   useTextFile: false,
//   useBom: true,
//   useKeysAsHeaders: true
//   // headers: ['ID', 'Employee Name', etc.] <--- disable useKeysAsHeaders before use
// })

export default {
  name: 'MainEmployeeMngWorkReportList',
  components: {
    ChosenAlertBox,
    Modal
  },
  data() {
    return {
      filter: { dateTimeRange: undefined, employeeName: undefined, employeeNumber: undefined, department: undefined, reportType: undefined },
      modalData: { show: false },
      selectedItems: [],
      queryParam: {},
      currentData: [],
      selectedNestedKeys: [],
      workReportEmployeeList: [],
      employeeList: [],
      employeeNumberList: [],
      departmentList: [],
      employeeWorkReportTypeList: [],
      reportTypeList: [],
      loadData: async (parameter) => {
        const { dateTimeRange, employeeName, employeeNumber, department, reportType } = this.filter
        const { pageNo, pageSize } = parameter
        const _parameter = {
          fromDate: (dateTimeRange?.[0]) ? this.formatDate(dateTimeRange[0], 'YYYY-MM-DD HH:mm:ss') : undefined,
          toDate: (dateTimeRange?.[1]) ? this.formatDate(dateTimeRange[1], 'YYYY-MM-DD HH:mm:ss') : undefined,
          employeeName: String(employeeName).split('/')[1],
          employeeNumber,
          department,
          workReportType: String(reportType).split('/')[1],
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const response = await this.$store.dispatch('api/main/employeeManagement/workReportList/fetchList', params)
        // console.log(response)
        this.currentData = response.data.data
        return response
      }
    }
  },
  computed: {
    columns() {
      return [
        { title: i18nRender('table.column.employee-number'), dataIndex: 'employeeSetup.employeeNumber', key: 'employeeNumber' },
        { title: i18nRender('table.column.employee'), dataIndex: 'employeeSetup.fullName', key: 'employeeFullName', ellipsis: true },
        { title: i18nRender('table.column.department'), dataIndex: 'employeeSetup.department', key: 'department', ellipsis: true },
        { title: i18nRender('table.column.created-time'), dataIndex: 'createdTime', key: 'createdTime', ellipsis: true, scopedSlots: { customRender: 'createdTime' } },
        { title: i18nRender('table.column.report-type'), dataIndex: 'employeeSetupWorkReport.workReportType', key: 'reportType' },
        { title: i18nRender('table.column.action'), dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  methods: {
    initiate() {
      // Set Filter
      const filter = window.localStorage.getItem('MEMWRL-Filter')
      this.filter = (filter) ? JSON.parse(filter) : this.filter

      this.getWorkReportEmployeeList()
      this.getEmployeeNumberList()
      this.getDepartmentList()
      this.getEmployeeWorkReportTypeList()
    },
    async getWorkReportEmployeeList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchEmployeeManagementWorkReportEmployeesDropdown')
        this.workReportEmployeeList = list?.data.map((item) => ({ value: `${item.id}/${item.fullName}`, label: item.fullName }))
      } catch (error) {
        throw error
      }
    },
    async getEmployeeList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchActiveEmployeeDropdown')
        this.employeeList = list?.data?.employeeDetailSmallResponses.map((item) => ({ value: `${item.id}/${item.fullName}`, label: item.fullName }))
      } catch (error) {
        throw error
      }
    },
    async getEmployeeNumberList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchEmployeeNumberDropdown')
        this.employeeNumberList = list?.data?.employeeNumbers.filter((item) => (item !== 'All')).map((item) => ({ value: item, label: item }))
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
    async getEmployeeWorkReportTypeList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchEmployeeManagementWorkReportTypeDropdown')
        this.employeeWorkReportTypeList = list?.data?.employeeSetupWorkReportTypes.map((item) => ({ value: `${item.id}/${item.workReportType}`, label: item.workReportType }))
      } catch (error) {
        throw error
      }
    },
    async getReportTypeList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchWorkReportTypeDropdown')
        this.reportTypeList = list?.data?.employeeSetupWorkReportTypes.map((item) => ({ value: `${item.id}/${item.workReportType}`, label: item.workReportType }))
      } catch (error) {
        throw error
      }
    },
    async getDetails(action, data) {
      try {
        const details = await this.$store.dispatch('api/main/employeeManagement/workReportList/fetchDetails', { id: data.id })
        this.modalHandler({ show: true, action, data: { id: data.id, ...details.data } })
      } catch (error) {
        throw error
      }
    },
    resetFilter() {
      this.filter = { dateTimeRange: undefined, employeeName: undefined, employeeNumber: undefined, department: undefined, reportType: undefined }
      this.refreshTable()
    },
    modalHandler(payload) {
      const { show = false, action = undefined, data = {} } = payload || {}
      this.modalData = { show, action, data }
    },
    onSelectChange(selectedItems) {
      this.selectedItems = [ ...selectedItems ]
    },
    async handleExport() {
      // if (this.currentData.length > 0) { csvExporter.generateCsv(this.currentData) }
      const { dateTimeRange, employeeName, employeeNumber, department, reportType } = this.filter
      const _parameter = {
        fromDate: (dateTimeRange?.[0]) ? this.formatDate(dateTimeRange[0], 'YYYY-MM-DD HH:mm:ss') : undefined,
        toDate: (dateTimeRange?.[1]) ? this.formatDate(dateTimeRange[1], 'YYYY-MM-DD HH:mm:ss') : undefined,
        employeeName: String(employeeName).split('/')[1],
        employeeNumber,
        department,
        workReportType: String(reportType).split('/')[1]
      }
      try {
        const response = await this.$store.dispatch('api/main/employeeManagement/workReportList/exportList', _parameter)
        const fileData = new Blob([ response ], { type: 'application/octet-stream' }) // Use this if the responseType is not blob like arraybuffer.
        const fileURL = window.URL.createObjectURL(fileData)
        const fileLink = document.createElement('a')
              fileLink.href = fileURL
              fileLink.setAttribute('download', `Employee_Management_WorkReportLists_${moment().format('YYYYMMDDHHmmss')}.csv`)
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
              await this.$store.dispatch('api/main/employeeManagement/workReportList/delete', { entityIds: this.selectedItems })
              this.$notification.open({
                message: this.$t('notification.work-report-list.deleted'),
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
      window.localStorage.setItem('MEMWRL-Filter', JSON.stringify(this.filter))
      this.getWorkReportEmployeeList()
      this.getEmployeeNumberList()
      this.getDepartmentList()
      this.getEmployeeWorkReportTypeList()
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
    width: 100% !important;
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
    background-color: #FF4D4F;
  }

  .status .point.approved, .status .point.claimed {
    background-color: #52C41A;
  }

  .status .point.pending {
    background-color: #FAAD14;
  }

  @media (max-width: 788px) {
    #filter .name {
      text-align: left;
    }
  }
</style>
