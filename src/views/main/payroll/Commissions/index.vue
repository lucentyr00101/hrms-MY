<template>
  <div>
    <a-card class="antd-custom-table">
      <query-form :columns="queryColumns" v-model="queryParam" return-key @click="$refs.table.refresh(true)" />
    </a-card>
    <a-card class="antd-custom-table">
      <chosen-alert-box
        permissionNameAdd="main_payroll_commissions_add"
        permissionNameDelete="main_payroll_commissions_delete"
        :isActive="true"
        :totalSelected="selectedRowKeys.length"
        position="right"
        @open="handleAdd()"
        @delete="handleDelete"
      >
        <template v-slot:action-button>
          <a-button v-action:main_payroll_commissions_export type="secondary" :disabled="(currentData.length === 0)" @click="handleExport">
            {{ $t('table.dialog.export') }}
          </a-button>
        </template></chosen-alert-box
      >
      <s-table
        permissionName="main_payroll_commissions_view"
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
        <span slot="status" slot-scope="status, record">
          <a-switch :default-checked="status === 'Enable'" @change="(e) => handleStatusChange(e, record)" />
        </span>
        <template slot="action" slot-scope="status, record">
          <a v-action:main_payroll_commissions_edit @click="handleEdit(record)">{{ $t('table.dialog.view') }}</a>
        </template>
      </s-table>
      <commission-modal @refreshTable="$refs.table.refresh(true)" :mdl="mdl" />
    </a-card>
  </div>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'

import { i18nRender } from '@/locales'
import CommissionModal from './CommissionModal.vue'
import QueryForm from '@/components/Table/QueryForm.vue'
import moment from 'moment'
import { downloadFromBlob } from '@/utils/util'

export default {
  name: 'MainSetupCommission',
  components: { ChosenAlertBox, CommissionModal, QueryForm },
  data() {
    return {
      selectedRowKeys: [], // Check here to configure the default column
      currentData: [],
      queryParam: {},
      mdl: null,
      sequenceTypeDropdown: {},
      employeeDropdown: {},
      commissionDropdown: {},
      departmentDropdown: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        for (const key in this.queryParam) { this.queryParam[key] = ((/all/ig.test(this.queryParam[key])) ? undefined : this.queryParam[key]) }
        const params = Object.assign(_parameter, this.queryParam)
        const data = await this.$store.dispatch('api/main/payroll/commission/search', {
          ...params,
          month: ((params.month) ? moment(params.month).format('MMMM') : undefined),
          payrollCommissionsId: ((params.payrollCommissionsId) ? params.payrollCommissionsId.split('/')[0] : undefined)
        })
        this.currentData = data?.data?.data
        return data
      },
      loadSequenceType: async () => {
        const data = await this.$store.dispatch('api/dropdown/fetchSequenceDropdown')
        data.data.sequenceType.forEach((item) => {
          this.sequenceTypeDropdown = { ...this.sequenceTypeDropdown, [item.sequenceType]: item.sequenceType }
        })
      },
      loadEmployee: async () => {
        const data = await this.$store.dispatch('api/dropdown/fetchActiveEmployeeDropdown')
        data.data.employeeDetailSmallResponses.forEach((item) => {
          this.employeeDropdown = { ...this.employeeDropdown, [item.fullName]: item.fullName }
        })
      },
      loadCommission: async () => {
        const data = await this.$store.dispatch('api/dropdown/fetchPayrollCommissionsDropdown')
        data.data.payrollCommissionsType.forEach((item) => {
          this.commissionDropdown = { ...this.commissionDropdown, [`${item.id}/${item.payrollCommissionsType}`]: item.payrollCommissionsType }
        })
      },
      loadDepartment: async () => {
        const data = await this.$store.dispatch('api/dropdown/fetchDepartmentDropdown')
        this.departmentDropdown = this.generateSelectTreeList(data?.data?.parentTree)
        // data.data.forEach((item) => { this.departmentDropdown = { ...this.departmentDropdown, [item]: item } }) // api/dropdown/fetchDepartmentNamesDropdown
      }
    }
  },
  created() {
    this.initiate()
    this.loadSequenceType()
    this.loadEmployee()
    this.loadCommission()
    this.loadDepartment()
  },
  computed: {
    columns() {
      return [
        {
          title: i18nRender('table.column.employee-number'),
          dataIndex: 'employeeSetup.employeeNumber',
          key: 'employeeSetup.employeeNumber'
        },
        {
          title: i18nRender('table.column.employee'),
          dataIndex: 'employeeSetup.fullName',
          key: 'employeeSetup.fullName'
        },
        {
          title: i18nRender('table.column.department'),
          dataIndex: 'employeeSetup.department',
          key: 'employeeSetup.department',
          ellipsis: true
        },
        {
          title: i18nRender('table.column.commissions-type'),
          dataIndex: 'payrollCommissions.payrollCommissionsType',
          key: 'commissionType'
        },
        {
          title: i18nRender('table.column.remarks'),
          dataIndex: 'descriptions',
          key: 'remark',
          ellipsis: true
        },
        {
          title: i18nRender('table.column.sequence-type'),
          dataIndex: 'sequence',
          key: 'sequence'
        },
        {
          title: i18nRender('table.column.work-unit'),
          dataIndex: 'workUnit',
          key: 'workUnit'
        },
        {
          title: i18nRender('table.column.rate'),
          dataIndex: 'payrollCommissions.rate',
          key: 'rate'
        },
        {
          title: i18nRender('table.column.amount'),
          dataIndex: 'amount',
          key: 'amount'
        },
        {
          title: i18nRender('table.column.action'),
          scopedSlots: { customRender: 'action' },
          key: 'action'
        }
      ]
    },
    queryColumns() {
      return [
        {
          title: i18nRender('table.column.month'),
          dataIndex: 'month',
          valueType: 'date',
          dateType: 'month',
          datePlaceholder: 'Select Month'
        },
        {
          title: i18nRender('table.column.sequence-type'),
          dataIndex: 'sequenceType',
          valueType: 'select',
          valueEnums: this.sequenceTypeDropdown
        },
        {
          title: i18nRender('table.column.department'),
          dataIndex: 'department',
          valueType: 'tree',
          valueEnums: this.departmentDropdown
        },
        {
          title: i18nRender('table.column.employee'),
          dataIndex: 'employeeName',
          valueType: 'select',
          valueEnums: this.employeeDropdown
        },
        {
          title: i18nRender('table.column.commission-type'),
          dataIndex: 'payrollCommissionsId',
          valueType: 'select',
          valueEnums: this.commissionDropdown
        }
      ]
    }
  },
  watch: {
    queryParam: {
      deep: true,
      handler(to) {
        window.localStorage.setItem('MPC-Filter', JSON.stringify(to))
      }
    }
  },
  methods: {
    initiate() {
      // Set Filter
      const filter = window.localStorage.getItem('MPC-Filter')
      this.queryParam = (filter) ? JSON.parse(filter) : this.queryParam
    },
    async handleDelete(keys) {
      if (this.selectedRowKeys.length > 0) {
        this.$confirm({
          title: this.$t('delete.confirm'),
          okText: 'Yes',
          cancelText: 'No',
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
          onOk: async () => {
            try {
              await this.$store.dispatch('api/main/payroll/commission/deleteCommission', { entityIds: this.selectedRowKeys })
              this.$notification.open({
                message: this.$t('notification.main-payroll-commission.deleted'),
                icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
              })
              this.selectedRowKeys = []
              this.$refs.table.refresh()
            } catch (error) {
              this.selectedRowKeys = []
              this.$message.error(error.response.data.message)
            }
          },
          onCancel: () => {
            // console.log('Cancel')
          }
        })
      }
    },
    async handleExport() {
      const res = await this.$store.dispatch('api/main/payroll/commission/exportData', this.queryParam)
      downloadFromBlob(res, `Payroll_Commission_${moment().format('YYYYMMDDHHmmss')}.csv`)
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleAdd() {
      this.$store.commit('modal/TOGGLE_COMMISSIONS_MODAL')
    },
    handleEdit(record) {
      this.$store.commit('modal/TOGGLE_COMMISSIONS_MODAL')
      this.mdl = { ...record }
    }
  }
}
</script>

<style scoped>
.ant-alert >>> .ant-alert-description {
  margin-left: auto;
}
.add-button {
  margin-bottom: 16px;
  margin-left: auto;
}
</style>
