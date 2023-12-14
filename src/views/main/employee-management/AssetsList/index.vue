<template>
  <div>
    <a-card class="antd-custom-table">
      <QueryForm :columns="columns" v-model="queryParam" @click="$refs.table.refresh(true)" />
    </a-card>
    <a-card class="antd-custom-table">
      <chosen-alert-box
        permissionNameAdd="main_employee-management_assets-lists_add"
        permissionNameDelete="main_employee-management_assets-lists_delete"
        :isActive="true"
        :totalSelected="selectedRowKeys.length"
        position="right"
        @open="modalHandler({ show: true, action: 'add' })"
        @delete="handleDelete(selectedRowKeys)"
      >
        <template v-slot:action-button>
          <a-button v-action:main_employee-management_assets-lists_export type="secondary" @click="handleExport">
            {{ $t('table.dialog.export') }}
          </a-button>
        </template>
      </chosen-alert-box>
      <s-table
        permissionName="main_employee-management_assets-lists_view"
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
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <span slot="action" slot-scope="value, data">
          <a v-action:main_employee-management_assets-lists_view-details @click="modalHandler({ show: true, action: 'view', data })">{{ $t('table.dialog.view') }}</a>
          <a-divider type="vertical" />
          <a v-action:main_employee-management_assets-lists_edit @click="modalHandler({ show: true, action: 'edit', data })">{{ $t('table.dialog.edit') }}</a>
        </span>
      </s-table>
    </a-card>
    <FormModal :modal="formModal" @refreshTable="refreshTable" />
  </div>
</template>

<script>
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import { STable } from '@/components'
import QueryForm from '@/components/Table/QueryForm'
import { columns } from './columns'
// import { type } from '@/api/dictionary'
import InfoCircle from '@/assets/info-circle.svg'
import FormModal from './form-modal.vue'

export default {
  name: 'MainEmployeeMgmtAssetsList',
  components: {
    ChosenAlertBox,
    QueryForm,
    STable,
    FormModal
  },
  data() {
    return {
      selectedRowKeys: [],
      currentRow: null,
      departmentEnums: [],
      dropdown: { employee: [], assetSetup: [], allAssetsSetup: [] },
      queryParam: null,
      formModal: { show: false },
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const filters = Object.assign(_parameter, this.queryForm)
        window.localStorage.setItem('MEMA-Filter', JSON.stringify(this.queryParam))
        const data = await this.$store.dispatch('api/main/employeeManagement/assetsLists/search', filters)
        return { data: data }
      }
    }
  },
  computed: {
    columns() {
      return columns(this.departmentEnums, this.dropdown.employee, this.dropdown.allAssetsSetup)
    },
    queryForm() {
      const query = this.queryParam
      const filters = {
        employeeName: query?.employee?.fullName || null,
        employeeNumber: query?.employee?.employeeNumber || null,
        department: query?.employee?.department || null,
        assetType: query?.companyAsset?.assetType || null,
        assetName: query?.companyAsset?.assetName || null,
        serialNumber: query?.companyAsset?.serialNumber || null,
        value: query?.companyAsset?.value || null
      }
      Object.keys(filters).map((key) => {
        filters[key] = filters[key] === 'All' ? null : filters[key]
      })
      return filters
    }
  },
  async created() {
    const queryParam = window.localStorage.getItem('MEMA-Filter')
    this.queryParam = queryParam ? JSON.parse(queryParam) : this.queryParam
    const employee = await this.$store.dispatch('api/dropdown/fetchEmployeeDropdown')
    const departments = await this.$store.dispatch('api/dropdown/fetchDepartmentDropdown')
    this.departmentEnums = this.generateSelectTreeList(departments?.data?.parentTree)

    this.dropdown.employee = employee.data.employeeDetailSmallResponses.map((item) => ({
      id: item.id,
      value: item.fullName,
      label: item.fullName,
      number: item.employeeNumber
    }))

    this.loadAssets()
  },
  methods: {
    async loadAssets() {
      const allAssets = await this.$store.dispatch('api/dropdown/fetchAllCompanyAssetsDropdown')
      this.dropdown.allAssetsSetup = allAssets.data.companyAsset.map((item) => ({
        id: item.id,
        value: item.companyAsset,
        label: item.companyAsset,
        assetName: item.assetsName,
        assetType: item.assetsType,
        serialNumber: item.serialNumber,
        assetValue: item.value
      }))
    },
    async handleExport() {
      await this.$store.dispatch('api/main/employeeManagement/assetsLists/export', this.queryForm)
    },
    refreshTable() {
      this.$refs.table.refresh()
      this.modalHandler({ show: false })
      this.loadAssets()
    },
    modalHandler(payload) {
      const { show = false, action = undefined, data = {} } = payload || {}
      this.formModal = { show, action, data }
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
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
            await this.$store.dispatch('api/main/employeeManagement/assetsLists/delete', {
              entityIds: selectedKeys
            })

            this.$notification.open({
              message: this.$t('notification.assets.deleted'),
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
