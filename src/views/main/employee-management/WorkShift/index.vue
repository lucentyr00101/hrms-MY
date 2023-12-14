<template>
  <div>
    <a-card class="antd-custom-table">
      <query-form
        :columns="columns"
        v-model="queryParam"
        @click="$refs.table.refresh(true)"
      />
    </a-card>
    <a-card class="antd-custom-table">
      <chosen-alert-box
        permissionNameAdd="main_employee-management_work-shift_add"
        permissionNameDelete="main_employee-management_work-shift_delete"
        :isActive="true"
        :totalSelected="selectedRowKeys.length"
        position="right"
        @open="handleAdd()"
        @delete="handleDelete(selectedRowKeys)"
      >
        <template v-slot:action-button>
          <a-button v-action:main_employee-management_work-shift_export type="secondary" @click="handleExport">
            {{ $t('table.dialog.export') }}
          </a-button>
        </template>
      </chosen-alert-box>
      <s-table
        permissionName="main_employee-management_work-shift_view"
        rowKey="id"
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        :pagination="{
          'show-total': (total, range) => $tc('table.column.total-items', total),
          showSizeChanger: true,
          showQuickJumper: true,
        }"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
      >
        <span slot="employeeNumber" slot-scope="text, record">
          {{ record.employee.employeeNumber }}
        </span>
        <span slot="employeeName" slot-scope="text, record">
          {{ record.employee.fullName }}
        </span>
        <span slot="department" slot-scope="text, record">
          {{ record.employee.department }}
        </span>
        <span slot="month" slot-scope="text, record">
          {{ record.month }}
        </span>
        <template slot="action" slot-scope="text, record">
          <a v-action:main_employee-management_work-shift_view-edit-details @click="handleEdit(record)">{{ $t('table.dialog.view') }}</a>
        </template>
      </s-table>
      <FormModal :action="action" :currentValue="currentValue" :dropdown="dropdown" :showModal="showModal" @closeModal="closeModal"/>
    </a-card>
  </div>
</template>

<script>
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import QueryForm from '@/components/Table/QueryForm.vue'
import FormModal from './form-modal.vue'
import InfoCircle from '@/assets/info-circle.svg'
import { type } from '@/api/dictionary'
import { workshift } from './columns'

export default {
  name: 'MainEmployeeMgmtWorkShift',
  components: { ChosenAlertBox, QueryForm, FormModal },
  data () {
    return {
      selectedRowKeys: [], // Check here to configure the default column
      showModal: false,
      dropdown: { employee: [], workShift: [] },
      action: null,
      currentValue: null,
      valueEnumsNumber: [],
      valueEnumsEmployeeName: ['All'],
      valueEnumsDepartment: [],
      valueEnumsMonth: ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      queryParam: {},
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, {
          ...(this.queryParam || {}),
          month: this.queryParam?.month || 'All',
          employeeName: this.queryParam?.employeeName || '',
          employeeNumber: this.queryParam?.employeeNumber || 'All',
          department: this.queryParam?.department || 'All',
          workHours: Math.floor(this.queryParam?.workHours) || null,
          workDaysCount: Math.floor(this.queryParam?.workDaysCount) || null
        })
        window.localStorage.setItem('MEW-Filter', JSON.stringify(params))
        const data = await this.$store.dispatch('api/main/employeeManagement/workShift/search', params)
        return {
          data
        }
      }
    }
  },
  async created () {
    const queryParam = window.localStorage.getItem('MEW-Filter')
    this.queryParam = queryParam ? JSON.parse(queryParam) : this.queryParam
    const workShift = await this.$store.dispatch('api/dropdown/fetchWorkShiftTypeDropdown')
    const employee = await this.$store.dispatch('api/dropdown/fetchEmployeeDropdown')
    workShift.data.workShiftTypeSmallResponses.forEach((item) => {
      this.dropdown.workShift.push({ id: item.id, value: item.workShiftType, label: item.workShiftType, workShiftHours: item.workShiftHours })
    })
    employee.data.employeeDetailSmallResponses.forEach((item) => {
      this.dropdown.employee.push({ id: item.id, value: item.fullName, label: item.fullName })
      this.valueEnumsEmployeeName.push(item.fullName)
    })
    this.valueEnumsEmployeeName = this.valueEnumsEmployeeName.filter((c, index) => {
        return this.valueEnumsEmployeeName.indexOf(c) === index
    })
    const items2 = await this.$store.dispatch('api/setup/dictionary/getDropdownValues', type.NUMBER)
    this.valueEnumsNumber = items2.employeeNumbers
    const items3 = await this.$store.dispatch('api/dropdown/fetchDepartmentDropdown')
    this.valueEnumsDepartment = this.generateSelectTreeList(items3?.data?.parentTree)
  },
  computed: {
    columns () {
      return workshift(this.valueEnumsNumber, this.valueEnumsEmployeeName, this.valueEnumsDepartment, this.valueEnumsMonth)
    }
  },
  methods: {
    async handleExport () {
      this.queryParam = {
        ...(this.queryParam || {}),
        page: undefined,
        size: undefined
      }
      await this.$store.dispatch('api/main/employeeManagement/workShift/exportData', this.queryParam)
    },
    handleAdd () {
      this.action = 'add'
      this.showModal = true
    },
    handleEdit (record) {
      this.currentValue = record
      this.action = 'view'
      this.showModal = true
    },
    async handleDelete(selectedKeys) {
      if (!selectedKeys.length) return
      this.$confirm({
        title: this.$t('delete.confirm'),
        okText: this.$t('table.dialog.yes'),
        cancelText: this.$t('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          try {
            await this.$store.dispatch('api/main/employeeManagement/workShift/delete', { entityIds: selectedKeys })
            this.$notification.open({
              message: this.$t('table.dialog.work-shift-deleted'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
            this.selectedRowKeys = []
            this.$refs.table.refresh()
          } catch (error) {
            this.selectedRowKeys = []
            this.$message.error(error.response.data.message)
          }
        }
      })
    },
    closeModal () {
      this.$refs.table.refresh(true)
      this.showModal = false
    },
    onSelectChange (selectedItems) {
      this.selectedRowKeys = selectedItems
    }
  }
}
</script>

<style scoped>

</style>
