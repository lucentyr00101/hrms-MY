<template>
  <div>
    <a-card class="antd-custom-table">
      <QueryForm :columns="filters" v-model="queryData" @click="$refs.table.refresh(true)" />
    </a-card>
    <a-card style="margin-top: 20px">
      <chosen-alert-box
        permissionNameAdd="main_payroll_deduction_add"
        permissionNameDelete="main_payroll_deduction_delete"
        :isActive="true"
        position="right"
        @open="modalHandler({ show: true, action: 'add' })"
        @delete="handleDelete(selectedRowKeys)"
        :totalSelected="selectedRowKeys.length"
      >
        <template v-slot:action-button>
          <a-button v-action:main_payroll_deduction_export type="secondary" @click="handleExport">
            {{ $t('table.dialog.export') }}
          </a-button>
        </template>
      </chosen-alert-box>
      <s-table
        permissionName="main_payroll_deduction_view"
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
        <span slot="action" slot-scope="value, data">
          <a v-action:main_payroll_deduction_edit @click="modalHandler({ show: true, action: 'view', data })">{{ $t('table.dialog.view') }}</a>
        </span>
      </s-table>
    </a-card>
    <FormModal :modal="formModal" @refreshTable="refreshTable" />
  </div>
</template>

<script>
import { filters, columns } from './columns'
import FormModal from './form-modal.vue'
// import { type } from '@/api/dictionary'
import QueryForm from '@/components/Table/QueryForm.vue'
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'MainPayrollDeduction',
  components: {
    QueryForm,
    ChosenAlertBox,
    FormModal
  },
  data() {
    return {
      queryData: null,
      dropdownsSequence: [],
      dropdownsDepartment: [],
      dropdownsEmployees: [],
      dropdownsDeductionTypes: [],
      selectedRowKeys: [],
      formModal: { show: false },
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, {
          month: this.queryData?.month || null,
          department: this.queryData?.department || 'All',
          sequenceType: this.queryData?.sequenceType || null,
          employeeName: this.queryData?.fullName || '',
          payrollDeductionId: this.queryData?.payrollDeductionId || null
        })
        window.localStorage.setItem('MPD-Filter', JSON.stringify(this.queryData))
        const data = await this.$store.dispatch('api/main/payroll/deduction/search', params)
        return data
      }
    }
  },
  computed: {
    filters() {
      return filters(this.dropdownsSequence, this.dropdownsDepartment, this.dropdownsEmployees, this.dropdownsDeductionTypes)
    },
    columns() {
      return columns()
    }
  },
  created() {
    const queryData = window.localStorage.getItem('MPD-Filter')
    this.queryData = queryData ? JSON.parse(queryData) : this.queryData
    this.getDropdownsSequences()
    this.getDropdownsDepartments()
    this.getDropdownsEmployees()
    this.getDropdownsDeductionTypes()
  },
  methods: {
    async handleExport() {
      const params = {
        month: this.queryData?.month || null,
        department: this.queryData?.department || 'All',
        sequenceType: this.queryData?.sequenceType || null,
        employeeName: this.queryData?.fullName || '',
        payrollDeductionId: this.queryData?.payrollDeductionId || null
      }
      await this.$store.dispatch('api/main/payroll/deduction/exportData', params)
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
    async getDropdownsSequences() {
      const sequence = await this.$store.dispatch('api/dropdown/fetchSequenceDropdown')
      sequence.data.sequenceType.forEach((item) => {
        this.dropdownsSequence.push(item.sequenceType)
      })
    },
    async getDropdownsDepartments() {
      const departments = await this.$store.dispatch('api/dropdown/fetchDepartmentDropdown')
      this.dropdownsDepartment = this.generateSelectTreeList(departments?.data?.parentTree)
      // this.dropdownsDepartment = await this.$store.dispatch('api/setup/dictionary/getDropdownValues', type.DEPARTMENT)
    },
    async getDropdownsEmployees() {
      const employee = await this.$store.dispatch('api/dropdown/fetchActiveEmployeeDropdown')
      employee.data.employeeDetailSmallResponses.forEach((item) => {
        this.dropdownsEmployees.push(item.fullName)
      })
    },
    async getDropdownsDeductionTypes() {
      const deductionTypes = await this.$store.dispatch('api/dropdown/fetchDeductionDropdown')
      deductionTypes.data.deductionTypes.forEach((item) => {
        this.dropdownsDeductionTypes.push({ value: item.id, label: item.deductionType })
      })
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
            await this.$store.dispatch('api/main/payroll/deduction/delete', {
              entityIds: selectedKeys
            })

            this.$notification.open({
              message: this.$t('notification.payroll.deduction.deleted'),
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
