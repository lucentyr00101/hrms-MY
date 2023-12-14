<template>
  <div>
    <a-card class="antd-custom-table">
      <QueryForm :columns="filters" v-model="queryData" @click="$refs.table.refresh(true)" />
    </a-card>
    <a-card style="margin-top: 20px">
      <chosen-alert-box
        permissionNameAdd="main_payroll_allowance_add"
        permissionNameDelete="main_payroll_allowance_delete"
        :isActive="true"
        position="right"
        @open="modalHandler({ show: true, action: 'add' })"
        @delete="handleDelete(selectedRowKeys)"
        :totalSelected="selectedRowKeys.length"
      >
        <template v-slot:action-button>
          <a-button v-action:main_payroll_allowance_export type="secondary" @click="handleExport">
            {{ $t('table.dialog.export') }}
          </a-button>
        </template>
      </chosen-alert-box>
      <s-table
        permissionName="main_payroll_allowance_view"
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
          <a v-action:main_payroll_allowance_edit @click="modalHandler({ show: true, action: 'view', data })">{{ $t('table.dialog.view') }}</a>
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
  name: 'MainPayrollAllowance',
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
      dropdownsAllowanceTypes: [],
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
          payrollAllowanceType: this.queryData?.payrollAllowanceType || null
        })
        window.localStorage.setItem('MPA-Filter', JSON.stringify(this.queryData))
        const data = await this.$store.dispatch('api/main/payroll/allowance/search', params)
        return data
      }
    }
  },
  computed: {
    filters() {
      return filters(
        this.dropdownsSequence,
        this.dropdownsDepartment,
        this.dropdownsEmployees,
        this.dropdownsAllowanceTypes
      )
    },
    columns() {
      return columns()
    }
  },
  created() {
    const queryData = window.localStorage.getItem('MPA-Filter')
    this.queryData = queryData ? JSON.parse(queryData) : this.queryData
    this.getDropdownsSequences()
    this.getDropdownsDepartments()
    this.getDropdownsEmployees()
    this.getDropdownsAllowanceTypes()
  },
  methods: {
    async handleExport() {
      const params = {
        month: this.queryData?.month || null,
        department: this.queryData?.department || 'All',
        sequenceType: this.queryData?.sequenceType || null,
        employeeName: this.queryData?.fullName || '',
        payrollAllowanceType: this.queryData?.payrollAllowanceType || null
      }
      await this.$store.dispatch('api/main/payroll/allowance/exportData', params)
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
    async getDropdownsAllowanceTypes() {
      const allowanceTypes = await this.$store.dispatch('api/dropdown/fetchAllowanceDropdown')
      allowanceTypes.data.allowanceType.forEach((item) => {
        this.dropdownsAllowanceTypes.push({ value: item.allowanceType, label: item.allowanceType })
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
            await this.$store.dispatch('api/main/payroll/allowance/delete', {
              entityIds: selectedKeys
            })

            this.$notification.open({
              message: this.$t('notification.payroll.allowance.deleted'),
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
