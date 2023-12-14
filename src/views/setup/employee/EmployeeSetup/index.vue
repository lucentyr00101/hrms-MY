<template>
  <div>
    <a-card class="antd-custom-table">
      <query-form :columns="columns" v-model="queryParam" @click="$refs.table.refresh(true)" />
    </a-card>
    <a-card class="antd-custom-table">
      <chosen-alert-box
        permissionNameAdd="setup_employee_employee-setup_add"
        :isActive="true"
        position="right"
        :hideAlert="true"
        :totalSelected="selectedRows.length"
        @open="handleAdd"
      >
        <template v-slot:action-button>
          <a-button v-action:setup_employee_employee-setup_export type="secondary" @click="handleExport">
            {{ $t('table.dialog.export') }}
          </a-button>
        </template>
      </chosen-alert-box>
      <s-table
        permissionName="setup_employee_employee-setup_view"
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
        <span slot="department" slot-scope="text, record">
          {{ record.employeeSetupWorkInfoResponse?.department }}
        </span>
        <span slot="joinDate" slot-scope="text, record">
          {{ record.employeeSetupWorkInfoResponse?.joinDate }}
        </span>
        <span slot="lastName" slot-scope="text, record">
          {{ text }}
          <a-tooltip v-if="record?.employeeSetupResignationResponse?.status === 'Pending'">
            <template slot="title">
              {{ $t('setup-employee.resignation-approval') }}
            </template>
            <a-icon type="info-circle" class="infor-circle-red" />
          </a-tooltip>
          <a-tooltip v-if="record?.employeeSetupPayrollResponse === null">
            <template slot="title"> {{ $t('setup-employee.no-payroll-information') }} </template>
            <a-icon type="info-circle" />
          </a-tooltip>
        </span>
        <span slot="status" slot-scope="text">
          <employee-status :status="text" />
        </span>
        <span slot="action" slot-scope="text, record">
          <a v-action:setup_employee_employee-setup_view-button @click="handleEdit(record)">{{ $t('view') }}</a>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import { i18nRender } from '@/locales'
import QueryForm from '@/components/Table/QueryForm.vue'
import EmployeeStatus from './EmployeeStatus.vue'
import { EMPLOYEE_STATUS_VALUE_NAME } from '@/constant/enum'
import { type } from '@/api/dictionary'

export default {
  name: 'UserRoles',
  components: { ChosenAlertBox, QueryForm, EmployeeStatus },
  data() {
    return {
      data: [],
      selectedRows: [],
      queryData: [],
      valueEnumsLastname: {},
      valueEnumsNumber: {},
      valueEnumsDepartment: [],
      valueEnumsEmail: {},
      queryParam: {},
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const params = Object.assign({
          ...(this.queryParam || {}),
          page: pageNo - 1,
          size: pageSize,
          joinDate: this.queryParam?.joinDate,
          lastName: this.queryParam?.lastName || 'All',
          status: this.queryParam?.status || 'All',
          department: this.queryParam?.department || 'All',
          employeeNumber: this.queryParam?.employeeNumber || 'All',
          email: this.queryParam?.email || 'All'
        })
        window.localStorage.setItem('SEE-Filter', JSON.stringify(params))
        const data = await this.$store.dispatch('api/setup/employee/employeeSetup/search', params)
        return {
          data
        }
      }
    }
  },
  async created() {
    const queryParam = window.localStorage.getItem('SEE-Filter')
    this.queryParam = queryParam ? JSON.parse(queryParam) : this.queryParam
    console.log(this.queryParam)
    const items1 = await this.$store.dispatch('api/setup/dictionary/getDropdownValues', type.LASTNAME)
    this.valueEnumsLastname = items1.employeeLastNames.filter((c, index) => {
      return items1.employeeLastNames.indexOf(c) === index
    })
    const items2 = await this.$store.dispatch('api/setup/dictionary/getDropdownValues', type.NUMBER)
    this.valueEnumsNumber = items2.employeeNumbers
    const items3 = await this.$store.dispatch('api/dropdown/fetchDepartmentDropdown')
    this.valueEnumsDepartment = this.generateSelectTreeList(items3?.data?.parentTree)
    // const items3 = await this.$store.dispatch('api/setup/dictionary/getDropdownValues', type.DEPARTMENT)
    // this.valueEnumsDepartment = items3
    const items4 = await this.$store.dispatch('api/setup/dictionary/getDropdownValues', type.EMAIL)
    this.valueEnumsEmail = items4
  },
  computed: {
    columns() {
      return [
        {
          id: 1,
          title: i18nRender('table.column.employee-number'),
          dataIndex: 'employeeNumber',
          key: 'employeeNumber',
          order: 5,
          sorter: true,
          valueType: 'select',
          valueEnums: this.valueEnumsNumber
        },
        {
          id: 2,
          title: i18nRender('table.column.employee-last-name'),
          dataIndex: 'lastName',
          key: 'lastName',
          order: 2,
          scopedSlots: { customRender: 'lastName' },
          sorter: true,
          valueType: 'select',
          valueEnums: this.valueEnumsLastname
        },
        {
          id: 3,
          title: i18nRender('table.column.employee-first-name'),
          dataIndex: 'firstName',
          key: 'firstName',
          hideInSearch: true,
          sorter: true
        },
        {
          id: 4,
          title: i18nRender('table.column.employee-nickname'),
          dataIndex: 'nickName',
          key: 'nickName',
          hideInSearch: true,
          sorter: true
        },
        {
          id: 5,
          title: i18nRender('table.column.department'),
          dataIndex: 'department',
          key: 'department',
          order: 4,
          scopedSlots: { customRender: 'department' },
          valueType: 'tree',
          valueEnums: this.valueEnumsDepartment,
          ellipsis: true
        },
        {
          id: 6,
          title: i18nRender('table.column.join-date'),
          dataIndex: 'joinDate',
          key: 'joinDate',
          order: 1,
          scopedSlots: { customRender: 'joinDate' },
          valueType: 'date',
          datePlaceholder: 'Select Date',
          sorter: true,
          ellipsis: true
        },
        {
          id: 7,
          title: i18nRender('table.column.email'),
          dataIndex: 'email',
          key: 'email',
          order: 6,
          sorter: true,
          valueType: 'select',
          valueEnums: this.valueEnumsEmail,
          ellipsis: true
        },
        {
          id: 8,
          title: i18nRender('table.column.status'),
          dataIndex: 'status',
          key: 'status',
          order: 3,
          scopedSlots: { customRender: 'status' },
          valueType: 'select',
          valueEnums: EMPLOYEE_STATUS_VALUE_NAME
        },
        {
          title: i18nRender('table.column.action'),
          scopedSlots: { customRender: 'action' },
          key: 'action',
          hideInSearch: true
        }
      ]
    }
  },
  methods: {
    async handleExport() {
      this.queryParam = {
        ...(this.queryParam || {}),
        page: undefined,
        size: undefined
      }
      await this.$store.dispatch('api/setup/employee/employeeSetup/exportData', this.queryParam)
    },
    handleAdd() {
      this.$store.commit('api/setup/employee/employeeSetup/SET_EMPLOYEE', {})
      this.$router.push({ name: 'setup-employee-employee-setup-add' })
    },
    handleEdit(data) {
      this.$router.push({ name: 'setup-employee-employee-setup-view-employee-information', params: { id: data.id } })
    }
  }
}
</script>

<style scoped>
.ant-alert >>> .ant-alert-description {
  margin-left: auto;
}
.infor-circle-red {
  color: red;
  margin-right: 5px;
}
</style>
