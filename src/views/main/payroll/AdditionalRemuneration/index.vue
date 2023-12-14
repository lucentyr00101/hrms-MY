<template>
  <div>
    <a-card id="filter">
      <a-row type="flex" :gutter="[8, 8]">
        <a-col :span="12">
          <a-row type="flex">
            <a-col class="name" flex="150px" :span="12">{{ $t('table.column.month') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <AppMonthPickerVue v-model="filter.month" placeholder="Select Month"/>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="12">
          <a-row type="flex">
            <a-col class="name" flex="150px" :span="12">{{ $t('table.column.sequence') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select v-model="filter.sequence" :options="sequenceTypeList" allow-clear placeholder="All"/>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="12">
          <a-row type="flex">
            <a-col class="name" flex="150px" :span="12">{{ $t('table.column.department') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-tree-select v-model="filter.department" :tree-data="departmentList" tree-default-expand-all allow-clear placeholder="All"/>
              <!-- <a-select v-model="filter.department" :options="departmentList" allow-clear placeholder="All"/> -->
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="12">
          <a-row type="flex">
            <a-col class="name" flex="150px" :span="12">{{ $t('table.column.employee') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select v-model="filter.employeeName" :options="employeeList" show-search allow-clear placeholder="example: Last Name, First Name"/>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="12">
          <a-row type="flex">
            <a-col class="name" flex="150px" :span="12">{{ $t('table.column.addtl-remu-type') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select v-model="filter.payrollAdditionalRemunerationId" :options="additionalRemunerationList" option-filter-prop="label" allow-clear placeholder="All"/>
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
        permissionNameAdd="main_payroll_additional-remuneration_add"
        permissionNameDelete="main_payroll_additional-remuneration_delete"
        :isActive="true"
        :totalSelected="selectedItems.length"
        position="right"
        @open="modalHandler({ show: true, action: 'add' })"
        @delete="deleteData"
      >
        <template v-slot:action-button>
          <a-button v-action:main_payroll_additional-remuneration_export type="secondary" :disabled="(currentData.length === 0)" @click="handleExport">
            {{ $t('table.dialog.export') }}
          </a-button>
        </template>
      </ChosenAlertBox>
      <s-table
        permissionName="main_payroll_additional-remuneration_view"
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
          <a v-action:main_payroll_additional-remuneration_edit @click="modalHandler({ show: true, action: 'view', data })">{{ $t('table.dialog.view') }}</a>
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

import AppMonthPickerVue from '@/components/tools/AppMonthPicker'
import ChosenAlertBox from '@/components/Table/ChosenAlertBox'
import FormModal from './form-modal.vue'

// const csvExporter = new ExportToCsv({
//   fieldSeparator: ',',
//   quoteStrings: '"',
//   decimalSeparator: '.',
//   showLabels: true,
//   showTitle: false,
//   filename: `Payroll_Additional_Remuneration_ExportedFile_${moment().format('YYYYMMDDHHmmss')}`,
//   useTextFile: false,
//   useBom: true,
//   useKeysAsHeaders: true
//   // headers: ['ID', 'Employee Name', etc.] <--- disable useKeysAsHeaders before use
// })

export default {
  name: 'MainPayrollAdditionalRemuneration',
  components: {
    AppMonthPickerVue,
    ChosenAlertBox,
    FormModal
  },
  data() {
    return {
      filter: { month: undefined, sequence: undefined, department: undefined, payrollAdditionalRemunerationId: undefined, employeeName: undefined },
      formModal: { show: false },
      selectedItems: [],
      queryParam: {},
      currentData: [],
      selectedNestedKeys: [],
      sequenceTypeList: [],
      departmentList: [],
      additionalRemunerationList: [],
      employeeList: [],
      loadData: async (parameter) => {
        const { month, sequence, department, payrollAdditionalRemunerationId, employeeName } = this.filter
        const { pageNo, pageSize } = parameter
        const _parameter = {
          date: (month?.date) ? this.formatDate(month.date, 'YYYY-MM-DD') : undefined,
          sequence,
          department,
          payrollAdditionalRemunerationId,
          employeeName,
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const response = await this.$store.dispatch('api/main/payroll/additionalRemuneration/fetchList', params)
        // console.log(response)
        this.currentData = response.data.data.map((item) => ({
          employeeNumber: item?.employee?.employeeNumber,
          employee: item?.employee?.fullName,
          department: item?.employee?.department,
          additionalRemunerationType: item?.payrollAdditionalRemuneration?.payrollAdditionalRemunerationType,
          remarks: item?.descriptions,
          sequence: item?.sequence,
          amount: item?.amount
        }))
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
        { title: i18nRender('table.column.addtl-remu-type'), dataIndex: 'payrollAdditionalRemuneration.payrollAdditionalRemunerationType', key: 'additional-remuneration-type', ellipsis: true },
        { title: i18nRender('table.column.remarks'), dataIndex: 'descriptions', key: 'remarks', ellipsis: true },
        { title: i18nRender('table.column.sequence'), dataIndex: 'sequence', key: 'sequence' },
        { title: i18nRender('table.column.amount'), dataIndex: 'amount', key: 'amount' },
        { title: i18nRender('table.column.action'), dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  methods: {
    initiate() {
      // Set Filter
      const filter = window.localStorage.getItem('MPAR-Filter')
      this.filter = (filter) ? JSON.parse(filter) : this.filter

      this.getSequenceTypeList()
      this.getDepartmentList()
      this.getAdditionalRemunerationList()
      this.getEmployeeList()
    },
    async getSequenceTypeList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchSequenceDropdown')
        this.sequenceTypeList = list?.data?.sequenceType.map((item) => ({ value: item.sequenceType || item.id, label: item.sequenceType }))
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
    async getAdditionalRemunerationList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchPayrollAdditionalRemunerationDropdown')
        this.additionalRemunerationList = list?.data?.payrollAdditionalRemunerationTypes.map((item) => ({ value: item.id, label: item.payrollAdditionalRemunerationType, data: { epf: item.epf, socso: item.socso, eis: item.eis, tax: item.tax } }))
      } catch (error) {
        throw error
      }
    },
    async getEmployeeList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchActiveEmployeeDropdown')
        this.employeeList = list?.data?.employeeDetailSmallResponses.map((item) => ({ value: item.fullName, label: item.fullName }))
      } catch (error) {
        throw error
      }
    },
    resetFilter() {
      this.filter = { month: undefined, sequence: undefined, department: undefined, payrollAdditionalRemunerationId: undefined, employeeName: undefined }
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
      const { month, sequence, department, payrollAdditionalRemunerationId, employeeName } = this.filter
      const _parameter = {
        date: (month?.date) ? this.formatDate(month.date, 'YYYY-MM-DD') : undefined,
        sequence,
        department,
        payrollAdditionalRemunerationId,
        employeeName
      }
      try {
        const response = await this.$store.dispatch('api/main/payroll/additionalRemuneration/exportList', _parameter)
        const fileData = new Blob([ response ], { type: 'application/octet-stream' }) // Use this if the responseType is not blob like arraybuffer.
        const fileURL = window.URL.createObjectURL(fileData)
        const fileLink = document.createElement('a')
              fileLink.href = fileURL
              fileLink.setAttribute('download', `Payroll_Additional_Remuneration_ExportedFile_${moment().format('YYYYMMDDHHmmss')}.csv`)
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
              await this.$store.dispatch('api/main/payroll/additionalRemuneration/delete', { entityIds: this.selectedItems })
              this.$notification.open({
                message: this.$t('notification.additional-remuneration.deleted'),
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
      window.localStorage.setItem('MPAR-Filter', JSON.stringify(this.filter))
      this.getSequenceTypeList()
      this.getDepartmentList()
      this.getAdditionalRemunerationList()
      this.getEmployeeList()
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
