<template>
  <div>
    <a-card id="filter">
      <a-row type="flex" :gutter="[8, 8]">
        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="100px" :span="12">{{ $t('table.column.join-date') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-date-picker v-model="filter.date" placeholder="Select Date"/>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="150px" :span="12">{{ $t('table.column.employee') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select v-model="filter.employeeName" :options="employeeList" show-search allow-clear placeholder="example: Last Name, First Name"/>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="170px" :span="12">{{ $t('table.column.employee-number') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select v-model="filter.employeeNumber" :options="employeeNumberList" show-search allow-clear placeholder="All"/>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="100px" :span="12">{{ $t('table.column.department') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-tree-select v-model="filter.department" :tree-data="departmentList" tree-default-expand-all allow-clear placeholder="All"/>
              <!-- <a-select v-model="filter.department" :options="departmentList" allow-clear placeholder="All"/> -->
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="150px" :span="12">{{ $t('table.column.leave-group') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select v-model="filter.leaveGroupId" :options="leaveGroupList" option-filter-prop="label" allow-clear placeholder="All"/>
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
        permissionNameDelete="main_hr_leave-balance_delete"
        :isActive="false"
        :totalSelected="selectedItems.length"
        position="right"
        @open="modalHandler({ show: true, action: 'add' })"
        @delete="deleteData"
      >
        <template v-slot:action-button>
          <a-button v-action:main_hr_leave-balance_export type="secondary" :disabled="(currentData.length === 0)" @click="handleExport">
            {{ $t('table.dialog.export') }}
          </a-button>
        </template>
      </ChosenAlertBox>
      <s-table
        permissionName="main_hr_leave-balance_view"
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
        <span slot="action" slot-scope="value, data">
          <a v-action:main_hr_leave-balance_edit @click="getDetails(data)">{{ $t('table.dialog.view') }}</a>
        </span>
      </s-table>
      <FormModal :modal="formModal" />
    </a-card>
  </div>
</template>

<script>
import { i18nRender } from '@/locales'
// import { ExportToCsv } from 'export-to-csv'
import moment from 'moment'
import InfoCircle from '@/assets/info-circle.svg'

import ChosenAlertBox from '@/components/Table/ChosenAlertBox'
import FormModal from './form-modal.vue'

// const csvExporter = new ExportToCsv({
//   fieldSeparator: ',',
//   quoteStrings: '"',
//   decimalSeparator: '.',
//   showLabels: true,
//   showTitle: false,
//   filename: `HR_LeaveBalance_${moment().format('YYYYMMDDHHmmss')}`,
//   useTextFile: false,
//   useBom: true,
//   useKeysAsHeaders: true
//   // headers: ['ID', 'Employee Name', etc.] <--- disable useKeysAsHeaders before use
// })

export default {
  name: 'MainHRLeaveBalance',
  components: {
    ChosenAlertBox,
    FormModal
  },
  data() {
    return {
      filter: { date: undefined, employeeName: undefined, employeeNumber: undefined, department: undefined, leaveGroupId: undefined },
      formModal: { show: false },
      selectedItems: [],
      queryParam: {},
      currentData: [],
      selectedNestedKeys: [],
      employeeList: [],
      employeeNumberList: [],
      departmentList: [],
      leaveGroupList: [],
      loadData: async (parameter) => {
        const { date, employeeName, employeeNumber, department, leaveGroupId } = this.filter
        const { pageNo, pageSize } = parameter
        const _parameter = {
          joinDate: (date) ? this.formatDate(date, 'YYYY-MM-DD') : undefined,
          employeeName,
          employeeNumber,
          department,
          leaveGroupId,
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const response = await this.$store.dispatch('api/main/hr/leaveBalance/fetchList', params)
        if (response?.data?.data) {
          response.data.data = response.data.data.map((item) => ({ id: item?.employee?.id, ...item }))
          this.currentData = response.data.data
        }
        return response
      }
    }
  },
  computed: {
    columns() {
      return [
        { title: i18nRender('table.column.employee-number'), dataIndex: 'employee.employeeNumber', key: 'employee-number' },
        { title: i18nRender('table.column.employee'), dataIndex: 'employee.fullName', key: 'employee-full-name', ellipsis: true },
        { title: i18nRender('table.column.department'), dataIndex: 'employee.department', key: 'employee-department', ellipsis: true },
        { title: i18nRender('table.column.join-date'), dataIndex: 'employeeWorkInfo.joinDate', key: 'joinDate' },
        { title: i18nRender('table.column.leave-group'), dataIndex: 'employeeWorkInfo.companyLeaveGroup.leaveGroup', key: 'leaveGroup' },
        { title: i18nRender('table.column.action'), dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  methods: {
    initiate() {
      // Set Filter
      const filter = window.localStorage.getItem('MHRLB-Filter')
      this.filter = (filter) ? JSON.parse(filter) : this.filter

      this.getEmployeeList()
      this.getEmployeeNumberList()
      this.getDepartmentList()
      this.getLeaveGroupList()
    },
    async getEmployeeList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchEmployeeDropdown')
        this.employeeList = list?.data?.employeeDetailSmallResponses.map((item) => ({ value: item.fullName, label: item.fullName }))
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
    async getLeaveGroupList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchLeaveGroupDropdown')
        this.leaveGroupList = list?.data?.companyLeaveGroup.map((item) => ({ value: item.id, label: item.leaveGroup }))
      } catch (error) {
        throw error
      }
    },
    async getDetails(data) {
      try {
        const details = await this.$store.dispatch('api/main/hr/leaveBalance/fetchDetails', { id: data.id })
        this.modalHandler({ show: true, action: 'view', data: { id: data.id, ...details.data } })
      } catch (error) {
        throw error
      }
    },
    resetFilter() {
      this.filter = { date: undefined, employeeName: undefined, employeeNumber: undefined, department: undefined, leaveGroupId: undefined }
      this.refreshTable()
    },
    modalHandler(payload) {
      const { show = false, action = undefined, data = {} } = payload || {}
      this.formModal = { show, action, data }
    },
    onSelectChange(selectedItems) {
      this.selectedItems = [ ...selectedItems ]
    },
    async handleExport() {
      // if (this.currentData.length > 0) { csvExporter.generateCsv(this.currentData) }
      const { date, employeeName, employeeNumber, department, leaveGroupId } = this.filter
      const _parameter = {
        joinDate: (date) ? this.formatDate(date, 'YYYY-MM-DD') : undefined,
        employeeName,
        employeeNumber,
        department,
        leaveGroupId
      }
      try {
        const response = await this.$store.dispatch('api/main/hr/leaveBalance/exportList', _parameter)
        const fileData = new Blob([ response ], { type: 'application/octet-stream' }) // Use this if the responseType is not blob like arraybuffer.
        const fileURL = window.URL.createObjectURL(fileData)
        const fileLink = document.createElement('a')
              fileLink.href = fileURL
              fileLink.setAttribute('download', `HR_LeaveBalance_${moment().format('YYYYMMDDHHmmss')}.csv`)
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
              await this.$store.dispatch('api/main/hr/leaveBalance/delete', { entityIds: this.selectedItems })
              this.$notification.open({
                message: this.$t('notification.leave-balance.deleted'),
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
      window.localStorage.setItem('MHRLB-Filter', JSON.stringify(this.filter))
      this.getEmployeeList()
      this.getEmployeeNumberList()
      this.getDepartmentList()
      this.getLeaveGroupList()
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

  @media (max-width: 788px) {
    #filter .name {
      text-align: left;
    }
  }
</style>
