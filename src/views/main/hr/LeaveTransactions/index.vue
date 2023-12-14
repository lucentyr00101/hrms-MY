<template>
  <div>
    <a-card class="antd-custom-table">
      <query-form :columns="columns" v-model="queryParam" @click="$refs.table.refresh(true)" />
    </a-card>
    <a-card class="antd-custom-table">
      <chosen-alert-box
        permissionNameAdd="main_hr_leave-transactions_add"
        permissionNameDelete="main_hr_leave-transactions_delete"
        :isActive="true"
        :totalSelected="selectedRowKeys.length"
        position="right"
        @open="handleAdd()"
        @delete="handleDelete(selectedRowKeys)"
      >
        <template v-slot:action-button>
          <a-button v-action:main_hr_leave-transactions_export type="secondary" @click="handleExport">
            {{ $t('table.dialog.export') }}
          </a-button>
        </template>
      </chosen-alert-box>
      <s-table
        permissionName="main_hr_leave-transactions_view"
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
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
      >
        <span slot="employeeNumber" slot-scope="text, record">
          {{ record.employeeSetup.employeeNumber }}
        </span>
        <span slot="employeeName" slot-scope="text, record">
          {{ record.employeeSetup.fullName }}
        </span>
        <span slot="department" slot-scope="text, record">
          {{ record.employeeSetup.department }}
        </span>
        <span slot="leaveType" slot-scope="text, record">
          {{ record.companyLeaveType.leaveType }}
        </span>
        <span slot="status" slot-scope="text">
          <span :style="{ backgroundColor: statusColorMap(text) }" class="status"></span>{{ text }}
        </span>
        <template slot="action" slot-scope="text, record">
          <a v-action:main_hr_leave-transactions_view-details @click="handleView(record)">{{ $t('table.dialog.view') }}</a>
        </template>
      </s-table>
      <add-leave-modal ref="addLeaveModal" :dropdown="dropdown" />
      <leave-details-modal ref="leaveDetailsModal" :model="model" />
      <reject-modal ref="rejectModal" :model="model" />
    </a-card>
  </div>
</template>

<script>
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import QueryForm from '@/components/Table/QueryForm.vue'
import AddLeaveModal from './AddLeaveModal.vue'
import LeaveDetailsModal from './LeaveDetailsModal.vue'
import rejectModal from './rejectModal.vue'
import InfoCircle from '@/assets/info-circle.svg'
import { type } from '@/api/dictionary'
import { leave } from './columns'

export default {
  name: 'MainHRLeaveTransactions',
  components: { ChosenAlertBox, QueryForm, AddLeaveModal, LeaveDetailsModal, rejectModal },
  data() {
    return {
      selectedRowKeys: [], // Check here to configure the default column
      showModal: false,
      dropdown: { employee: [], leaveType: [] },
      model: null,
      valueEnumsEmployeeNumber: [],
      valueEnumsEmployeeName: ['All'],
      valueEnumsDepartment: [],
      valueEnumsLeaveType: [],
      queryParam: {},
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }

        const params = Object.assign(_parameter, {
          ...(this.queryParam || {}),
          startDate: this.queryParam.startDate,
          employeeName: this.queryParam?.employeeName || 'All',
          approvalStatus: this.queryParam?.status || 'All',
          department: this.queryParam?.department || 'All',
          employeeNumber: this.queryParam?.employeeNumber || 'All',
          leaveType: this.queryParam?.leaveType || 'All'
        })
        window.localStorage.setItem('MHL-Filter', JSON.stringify(params))
        const data = await this.$store.dispatch('api/main/hr/leaveTransactions/search', params)
        return data
      }
    }
  },
  async created() {
    const queryParam = window.localStorage.getItem('MHL-Filter')
    this.queryParam = queryParam ? JSON.parse(queryParam) : this.queryParam
    const hasQuery = Object.keys(this.$route.query || {}).length
    if (hasQuery) {
      const urlQuery = this.$route.query
      this.queryParam = {}
      this.queryParam.startDate = urlQuery?.startDate
      this.queryParam.employeeName = urlQuery?.name
      this.queryParam.leaveType = urlQuery?.leaveType
    }
    const employee = await this.$store.dispatch('api/dropdown/fetchEmployeeWithLeaveDropdown')
    const leave = await this.$store.dispatch('api/setup/company/leaveSetting/listLeaveType')
    employee.data.employeeDetailSmallResponses.forEach((item) => {
      this.dropdown.employee.push({ id: item.id, value: item.fullName, label: item.fullName })
      this.valueEnumsEmployeeName.push(item.fullName)
    })
    leave.data.forEach((item) => {
      this.dropdown.leaveType.push({ id: item.id, value: item.companyLeaveType, label: item.companyLeaveType })
    })
    const items1 = await this.$store.dispatch('api/setup/dictionary/getDropdownValues', type.NUMBER)
    this.valueEnumsEmployeeNumber = items1.employeeNumbers
    const items2 = await this.$store.dispatch('api/dropdown/fetchDepartmentDropdown')
    this.valueEnumsDepartment = this.generateSelectTreeList(items2?.data?.parentTree)
    // this.valueEnumsDepartment = await this.$store.dispatch('api/setup/dictionary/getDropdownValues', type.DEPARTMENT)
    this.valueEnumsLeaveType = await this.$store.dispatch('api/setup/dictionary/getDropdownValues', type.LEAVE_TYPE)
  },
  computed: {
    columns() {
      return leave(
        this.valueEnumsEmployeeNumber,
        this.valueEnumsEmployeeName,
        this.valueEnumsDepartment,
        this.valueEnumsLeaveType
      )
    }
  },
  methods: {
    statusColorMap(status) {
      const map = {
        Pending: '#EB9514',
        Approved: '#3C9C1B',
        Rejected: '#D71E1E'
      }
      return map[status]
    },
    async handleExport() {
      this.queryParam = {
        ...(this.queryParam || {}),
        page: undefined,
        size: undefined
      }
      await this.$store.dispatch('api/main/hr/leaveTransactions/export', this.queryParam)
    },
    handleAdd() {
      this.$refs.addLeaveModal.view()
    },
    handleView(record) {
      console.log(record)
      this.model = record
      this.$refs.leaveDetailsModal.view()
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
            await this.$store.dispatch('api/main/hr/leaveTransactions/delete', { entityIds: selectedKeys })
            this.$notification.open({
              message: this.$t('table.dialog.leave-transaction-deleted'),
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
    closeModal() {
      this.$refs.table.refresh(true)
      this.showModal = false
    },
    onSelectChange(selectedItems) {
      this.selectedRowKeys = selectedItems
    }
  }
}
</script>

<style scoped>
.status {
  height: 6px;
  width: 6px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  right: 5px;
  top: -1px;
}
</style>
