<template>
  <div>
    <a-card class="antd-custom-table">
      <QueryForm :columns="filters" v-model="queryData" @click="$refs.table.refresh(true)" />
    </a-card>

    <a-card style="margin-top: 20px">
      <chosen-alert-box
        permissionNameAdd="main_payroll_bonus_add"
        permissionNameDelete="main_payroll_bonus_delete"
        :isActive="true"
        position="right"
        @open="modalHandler({ show: true, action: 'add' })"
        @delete="handleDelete(selectedRowKeys)"
        :totalSelected="selectedRowKeys.length"
      >
        <template v-slot:action-button>
          <a-button v-action:main_payroll_bonus_export type="secondary" @click="handleExport">
            {{ $t('table.dialog.export') }}
          </a-button>
        </template>
      </chosen-alert-box>
      <s-table
        permissionName="main_payroll_bonus_view"
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
          <a v-action:main_payroll_bonus_edit @click="modalHandler({ show: true, action: 'view', data })">{{
            $t('table.dialog.view')
          }}</a>
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
import { i18nRender } from '@/locales'

export default {
  name: 'MainPayrollBonus',
  components: {
    QueryForm,
    ChosenAlertBox,
    FormModal
  },
  data() {
    return {
      queryData: null,
      enumsSequence: [],
      enumsDepartment: [],
      enumsEmployees: [],
      selectedRowKeys: [],
      formModal: { show: false },
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, {
          month: this.queryData?.month === 'All' ? null : this.queryData?.month,
          department: this.queryData?.department || 'All',
          sequenceType: this.queryData?.sequenceType || null,
          employeeName: this.queryData?.fullName || ''
        })

        window.localStorage.setItem('MPB-Filter', JSON.stringify(this.queryData))
        const data = await this.$store.dispatch('api/main/payroll/bonus/search', params)
        return data
      }
    }
  },
  computed: {
    filters() {
      return filters(this.enumsSequence, this.enumsDepartment, this.enumsEmployees)
    },
    columns() {
      return columns()
    }
  },
  created() {
    this.initializeData()
  },
  methods: {
    async handleExport() {
      const params = {
        month: this.queryData?.month || null,
        department: this.queryData?.department || 'All',
        sequenceType: this.queryData?.sequenceType || null,
        employeeName: this.queryData?.fullName || ''
      }
      await this.$store.dispatch('api/main/payroll/bonus/exportData', params)
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
    async initializeData() {
      const queryData = window.localStorage.getItem('MPB-Filter')
      this.queryData = queryData ? JSON.parse(queryData) : this.queryData

      const sequence = await this.$store.dispatch('api/dropdown/fetchSequenceDropdown')
      sequence.data.sequenceType.map(({ sequenceType }) => this.enumsSequence.push(sequenceType))

      const departments = await this.$store.dispatch('api/dropdown/fetchDepartmentDropdown')
      this.enumsDepartment = this.generateSelectTreeList(departments?.data?.parentTree)
      // this.enumsDepartment = await this.$store.dispatch('api/setup/dictionary/getDropdownValues', type.DEPARTMENT)

      const employee = await this.$store.dispatch('api/dropdown/fetchActiveEmployeeDropdown')
      employee.data.employeeDetailSmallResponses.map(({ fullName }) => this.enumsEmployees.push(fullName))
    },
    handleDelete(selectedKeys) {
      if (!selectedKeys.length) return
      this.$confirm({
        title: () => (
          <div class="confirm-modal-title">
            <div>
              <img src="/icons/info-dialog.svg" style="margin-right: 10px;" />
              <span>{i18nRender('delete.confirm')}</span>
            </div>
          </div>
        ),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: 'none',

        onOk: async () => {
          try {
            await this.$store.dispatch('api/main/payroll/bonus/delete', {
              entityIds: selectedKeys
            })

            this.$notification.open({
              message: this.$t('notification.payroll.bonus.deleted'),
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
