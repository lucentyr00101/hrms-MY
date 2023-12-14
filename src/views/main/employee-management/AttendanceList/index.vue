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
        permissionNameAdd="main_employee-management_attendance-lists_add"
        permissionNameDelete="main_employee-management_attendance-lists_delete"
        :isActive="true"
        :totalSelected="selectedRowKeys.length"
        position="right"
        @open="openModal()"
        @delete="handleDelete(selectedRowKeys)"
      >
        <template v-slot:action-button>
          <a-button v-action:main_employee-management_attendance-lists_export type="secondary" @click="handleExport">
            {{ $t('table.dialog.export') }}
          </a-button>
        </template>
      </chosen-alert-box>
      <s-table
        permissionName="main_employee-management_attendance-lists_view"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
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
      >
        <span slot="employeeNumber" slot-scope="text, record">{{ record.employee.employeeNumber }}</span>
        <span slot="fullName" slot-scope="text, record">{{ record.employee.fullName }}</span>
        <span slot="department" slot-scope="text, record">{{ record.employee.department ? record.employee.department : '-' }}</span>
        <span slot="workTimeDuration" slot-scope="text, record">{{ record.workTimeDuration ? record.workTimeDuration : '-' }}</span>
        <span slot="attendanceType" slot-scope="text, record">{{ record.otHour ? record.otHour : '-' }}</span>
        <span slot="finalWorkTimeDuration" slot-scope="text, record">{{ record.finalWorkTimeDuration ? record.finalWorkTimeDuration : '-' }}</span>
        <span slot="time" slot-scope="text, record">{{ record.createdTime | moment }}</span>

        <span slot="status">
          <a-badge color="#f50"/>
          Modified
          <a-badge color="#87d068" text="Approved" />
          <a-badge color="gold" text="Pending" />
        </span>
        <span slot="status" slot-scope="status, record">
          <p v-if="record.status === 'Approved'" ><a-badge color="#87d068" :text="`${$t('table.column.approved')}`"></a-badge></p>
          <p v-else-if="record.status === 'Pending'" ><a-badge color="gold" :text="`${$t('table.column.pending')}`"></a-badge></p>
          <p v-else-if="record.status === 'Rejected'" ><a-badge color="red" :text="`${$t('table.column.rejected')}`"></a-badge></p>
          <p v-else-if="record.status === 'Modified'" ><a-badge color="#f50" :text="`${$t('table.column.modified')}`"></a-badge></p>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a v-action:main_employee-management_attendance-lists_view-details @click="handleViewAttendanceLists(record)">{{ $t('table.column.view') }}</a>
            <a-divider type="vertical" />
            <a v-action:main_employee-management_attendance-lists_edit @click="handleEditModal(record)">{{ $t('table.dialog.edit') }}</a>
          </template>
        </span>
      </s-table>
      <add-attendance-modal :showModal="showModal" @closeModal="closeModal" @refreshTable="$refs.table.refresh()"/>
      <view-attendance-modal :model="mdl" @refreshTable="$refs.table.refresh()"/>
      <edit-attendance-modal :model="mdl" @success="handleEditSuccess"/>
    </a-card>
  </div>
</template>

<script>
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import QueryForm from '@/components/Table/QueryForm.vue'
import AddAttendanceModal from './AddAttendanceModal.vue'
import ViewAttendanceModal from './ViewAttendanceModal.vue'
import EditAttendanceModal from './EditAttendanceModal.vue'
import InfoCircle from '@/assets/info-circle.svg'
import { type } from '@/api/dictionary'

export default {
  name: 'MainEmployeeMgmtAttendanceList',
  components: { ChosenAlertBox, QueryForm, AddAttendanceModal, ViewAttendanceModal, EditAttendanceModal },

  data () {
    return {
      selectedRowKeys: [], // Check here to configure the default column
      mdl: null,
      queryData: [],
      showModal: false,
      showViewModal: false,
      queryParam: {},
      valueEnumsNumber: {},
      valueEnumsDepartment: [],
      valueEnumsEmployee: [],
      valueEnumsAttendanceType: [],
      loadEmployeeNumberDropdown: async () => {
        const numberItems = await this.$store.dispatch('api/setup/dictionary/getDropdownValues', type.NUMBER)
        this.valueEnumsNumber = numberItems.employeeNumbers
      },
      loadDepartmentDropdown: async () => {
        const data = await this.$store.dispatch('api/setup/employee/employeeSetup/workInformation/dropdownDepartment')
        this.valueEnumsDepartment = this.generateTree(data.data.parentTree)
      },
      loadAttendanceTypeDropdown: async () => {
        const attendanceItems = await this.$store.dispatch('api/setup/dictionary/getDropdownValues', type.ATTENDANCE)
        this.valueEnumsAttendanceType = attendanceItems?.employeeSetupAttendanceTypes?.map(employeeSetupAttendanceType => ({
          label: employeeSetupAttendanceType.attendanceType,
          value: employeeSetupAttendanceType.attendanceType
        }))
      },
      loadEmployeeDropdown: async () => {
        const employee = await this.$store.dispatch('api/dropdown/fetchActiveEmployeeDropdown')
        this.valueEnumsEmployee = employee.data.employeeDetailSmallResponses.map(({ fullName }) => fullName)
      },
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const { timeStartPicker, ..._params } = this.queryParam
        const params = Object.assign(_parameter, {
          ..._params,
          time: timeStartPicker
        })
        window.localStorage.setItem('MEMA-Filter', JSON.stringify(this.queryParam))
        const data = await this.$store.dispatch('api/main/employeeManagement/attendanceList/searchAttendance', params)
        return { data }
      }
    }
  },
  async created () {
    const queryParam = window.localStorage.getItem('MEMA-Filter')
    this.queryParam = queryParam ? JSON.parse(queryParam) : this.queryParam
    this.loadEmployeeNumberDropdown()
    this.loadDepartmentDropdown()
    this.loadAttendanceTypeDropdown()
    this.loadEmployeeDropdown()
  },
  computed: {
    columns () {
      return [
        {
          id: 1,
          title: this.$t('table.column.employee-number'),
          dataIndex: 'employeeNumber',
          key: 'employeeNumber',
          order: 2,
          scopedSlots: { customRender: 'employeeNumber' },
          sorter: true,
          valueType: 'select',
          valueEnums: this.valueEnumsNumber
        },
        {
          id: 2,
          title: this.$t('table.column.employee'),
          dataIndex: 'employeeName',
          key: 'employeeName',
          order: 3,
          scopedSlots: { customRender: 'fullName' },
          sorter: true,
          valueType: 'select',
          valueEnums: this.valueEnumsEmployee,
          ellipsis: true
        },
        {
          id: 3,
          title: this.$t('table.column.department'),
          dataIndex: 'department',
          key: 'department',
          order: 4,
          scopedSlots: { customRender: 'department' },
          sorter: true,
          valueType: 'tree',
          valueEnums: this.valueEnumsDepartment,
          ellipsis: true
        },
        {
          id: 4,
          title: this.$t('table.column.work-time-durations'),
          dataIndex: 'workTimeDurations',
          key: 'workTimeDurations',
          valueType: 'date',
          hideInSearch: true,
          scopedSlots: { customRender: 'workTimeDuration' }
        },
        {
          id: 5,
          formLabel: this.$t('table.column.attendance'),
          title: this.$t('table.column.oTHours'),
          dataIndex: 'attendanceType',
          key: 'attendanceType',
          order: 5,
          scopedSlots: { customRender: 'attendanceType' },
          api: true,
          sorter: true,
          valueType: 'select',
          valueEnums: this.valueEnumsAttendanceType
        },
        {
          id: 6,
          title: this.$t('table.column.final-work-time-durations'),
          dataIndex: 'finalWorkTimeDuration',
          key: 'finalWorkTimeDuration',
          hideInSearch: true,
          scopedSlots: { customRender: 'finalWorkTimeDuration' }
        },
        {
          id: 7,
          formLabel: this.$t('table.column.time'),
          title: this.$t('table.column.created-time'),
          dataIndex: 'time',
          key: 'time',
          valueType: 'dateTimeOnly',
          startPlaceholder: this.$t('error.date-time.select'),
          order: 1,
          ellipsis: true,
          scopedSlots: { customRender: 'time' }
        },
        {
          id: 8,
          title: this.$t('table.column.status'),
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
          hideInSearch: true
        },
        {
          id: 9,
          title: this.$t('table.column.action'),
          dataIndex: 'action',
          key: 'action',
          hideInSearch: true,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    async handleEditSuccess () {
      this.$refs.table.refresh()
      await this.$nextTick()
    },
    generateTree (data) {
      return data.reduce((list, item) => {
        const id = item.id
        const obj = {
          id,
          ...item,
          label: item.name,
          key: item.id,
          value: item.name
        }
        item.children?.length > 0 && (obj.children = this.generateTree(item.children))
        list.push(obj)
        return list
      }, [])
    },
    handleViewAttendanceLists (data) {
      this.$store.commit('modal/TOGGLE_VIEW_ATTENDANCE_MODAL')
      this.mdl = { ...data }
    },
    handleEditModal(data) {
      this.$store.commit('modal/TOGGLE_EDIT_ATTENDANCE_MODAL')
      this.mdl = { ...data }
    },
    closeViewModal () {
      this.showViewModal = false
    },
    async handleExport () {
      await this.$store.dispatch('api/main/employeeManagement/attendanceList/exportData', this.queryParam)
    },
    handleDelete(selectedKeys) {
      if (!selectedKeys.length) return
      this.$confirm({
        title: this.$t('delete.confirm'),
        okText: this.$t('table.dialog.yes'),
        cancelText: this.$t('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          try {
            await this.$store.dispatch('api/main/employeeManagement/attendanceList/deleteAttendance', {
              entityIds: selectedKeys
            })

            this.$notification.open({
              message: this.$t('table.dialog.attendance-deleted'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
            this.onSelectChange([])
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
          this.$refs.table.refresh()
        }
      })
    },

    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },

    onPageChange (val) {
      console.log(val)
    },

    queryValue (val) {
      // TODO - handle table query api call
      console.log(val)

      // Sample Query checking
      for (let i = 0; i < this.data.length; i++) {
        if (val.employeeLastName === this.data[i].employeeLastName) {
          this.queryData = []
          this.queryData[i] = this.data[i]
          console.log(this.queryData)
        }
      }
    },
    openModal () {
      this.showModal = true
    },
    closeModal () {
      this.showModal = false
    }
  }
}
</script>

<style scoped>
.ant-badge {
  display: flex;
  align-items: center;
}
.ant-badge >>> .ant-badge-status-dot {
  top: 1px;
}
</style>
