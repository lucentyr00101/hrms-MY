<template>
  <div>
    <a-card class="antd-custom-table">
      <query-form :columns="columns" v-model="queryParam" @click="$refs.table.refresh(true)" />
    </a-card>
    <a-card class="antd-custom-table">
      <chosen-alert-box
        permissionNameAdd="setup_company_assets-setup_add"
        permissionNameDelete="setup_company_assets-setup_delete"
        :isActive="true"
        :totalSelected="selectedRowKeys.length"
        position="right"
        @open="modalHandler({ show: true, action: 'add' })"
        @delete="handleDelete(selectedRowKeys)"
      >
        <template v-slot:action-button>
          <a-button v-action:setup_company_assets-setup_export type="secondary" @click="handleExport">
            {{ $t('table.dialog.export') }}
          </a-button>
        </template>
      </chosen-alert-box>
      <s-table
        permissionName="setup_company_assets-setup_view"
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
        <template v-slot:status="status">
          <span :class="status === 'Allocated' ? 'allocated' : ''">{{ status }}</span>
        </template>
        <span slot="action" slot-scope="value, data">
          <a v-action:setup_company_assets-setup_view-edit-details @click="modalHandler({ show: true, action: 'view', data })">{{ $t('table.dialog.view') }}</a>
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
import columns from './columns'
import FormModal from './form-modal.vue'
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'SetupCompanyAssetsSetup',
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
      formModal: { show: false },
      queryParam: {},
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, {
          assetName: this.queryParam?.assetName || null,
          assetType: this.queryParam?.assetType || null,
          serialNumber: this.queryParam?.serialNumber || null,
          status: this.queryParam?.status || null,
          value: this.queryParam?.value || null
        })
        window.localStorage.setItem('SCAS-Filter', JSON.stringify(this.queryParam))
        const data = await this.$store.dispatch('api/setup/company/assetSetup/search', params)
        return { data }
      }
    }
  },
  computed: {
    columns() {
      return columns
    }
  },
  created() {
    const queryParam = window.localStorage.getItem('SCAS-Filter')
    this.queryParam = queryParam ? JSON.parse(queryParam) : this.queryParam
  },
  methods: {
    async handleExport() {
      await this.$store.dispatch('api/setup/company/assetSetup/exportData', this.queryParam)
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    refreshTable() {
      this.$refs.table.refresh()
      this.modalHandler({ show: false })
    },
    modalHandler(payload) {
      const { show = false, action = undefined, data = {} } = payload || {}
      this.formModal = { show, action, data }
    },
    async handleDelete (selectedKeys) {
      if (!selectedKeys.length) return
      this.$confirm({
        title: this.$t('delete.confirm'),
        okText: this.$t('table.dialog.yes'),
        cancelText: this.$t('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          try {
            await this.$store.dispatch('api/setup/company/assetSetup/deleteData', { entityIds: selectedKeys })
            this.$notification.open({
              message: this.$t('notification.assets.deleted'),
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
    }
  }
}
</script>

<style scoped>
.allocated {
  color: #52c41a;
}
</style>
