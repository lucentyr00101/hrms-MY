<template>
  <a-card>
    <div v-show="!TaxModal">
      <chosen-alert-box
        permissionNameAdd="setup_payroll_tax_add"
        permissionNameDelete="setup_payroll_tax_delete"
        :isActive="true"
        position="right"
        :totalSelected="selectedRowKeys.length"
        @open="handleTaxView()"
        @delete="handleDelete(selectedRowKeys)"
      />
      <s-table
        permissionName="setup_payroll_tax_view"
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
        <a-switch
          :disabled="!$store.getters.permissions.includes('setup_payroll_tax_update-status')"
          key="status"
          slot="status"
          slot-scope="val, record"
          :default-checked="val === 'Enable'"
          @change="(e) => handleStatusChange(e, record)"
        />
        <span slot="action" slot-scope="text, record">
          <a v-action:setup_payroll_tax_view-edit-details @click="openTaxModal(record)">{{
            $t('table.dialog.view')
          }}</a>
        </span>
      </s-table>
    </div>
    <TaxModal :model="mdl" @refreshTable="$refs.table.refresh()" />
  </a-card>
</template>

<script>
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import TaxModal from './TaxModal.vue'
import { i18nRender } from '@/locales'
import InfoCircle from '@/assets/info-circle.svg'

const data = []
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    TaxType: `Tax - ${i}`,
    descriptions: `Hello Tax - ${i}`,
    status: true,
    taxDetails: [
      {
        key: '1',
        salaryMin: Math.ceil(Math.random() * 100),
        salaryMax: Math.ceil(Math.random() * 10000),
        editable: false,
        baseTaxAmount: Math.ceil(Math.random() * 1000),
        taxRate: `${Math.ceil(Math.random() * 100)} %`
      },
      {
        key: '2',
        salaryMin: Math.ceil(Math.random() * 100),
        salaryMax: Math.ceil(Math.random() * 10000),
        editable: false,
        baseTaxAmount: Math.ceil(Math.random() * 1000),
        taxRate: `${Math.ceil(Math.random() * 100)} %`
      }
    ]
  })
}

const columns = [
  {
    title: i18nRender('table.column.tax-type'),
    dataIndex: 'taxType',
    key: 'TaxType',
    ellipsis: true
  },
  {
    title: i18nRender('table.column.descriptions'),
    dataIndex: 'descriptions',
    key: 'descriptions',
    ellipsis: true
  },
  {
    title: i18nRender('table.column.status'),
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: i18nRender('table.column.action'),
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  components: { ChosenAlertBox, TaxModal },
  name: 'SetupPayrollTax',
  data() {
    return {
      data,
      columns,
      selectedRowKeys: [],
      mdl: null,
      queryParam: {},
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const data = await this.$store.dispatch('api/setup/payroll/tax/fetchList', params)
        return data
      }
    }
  },
  computed: {
    TaxModal: {
      get() {
        return this.$store.state.modal.setupPayrollTaxView
      },
      set() {
        // just to prevent error log when @cancel
      }
    }
  },
  methods: {
    openTaxModal(data) {
      this.$store.commit('modal/TOGGLE_SETUP_PAYROLL_TAX_VIEW')
      console.log(data)
      this.mdl = { ...data }
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    async handleStatusChange(checked, row) {
      try {
        await this.$store.dispatch('api/setup/payroll/tax/updateStatus', {
          id: row.id,
          status: checked ? 'Enable' : 'Disable'
        })
        this.$notification.open({
          message: checked ? i18nRender('notification.tax.enabled') : i18nRender('notification.tax.disabled'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.$refs.table.refresh(true)
      } catch (e) {
        this.$message.error(e.response)
      }
    },
    async handleDelete(keys) {
      if (this.totalSelected === 0) return
      this.$confirm({
        centered: true,
        title: i18nRender('delete.confirm'),
        cancelText: i18nRender('table.dialog.no'),
        onOk: async () => {
          await this.$store.dispatch('api/setup/payroll/tax/deleteTax', { entityIds: keys })
          this.$refs.table.refresh(true)
          this.$notification['success']({
            message: i18nRender('notification.tax.deleted')
          })
          this.selectedRowKeys = []
        },
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />
      })
    },
    handleTaxView(data) {
      this.$store.commit('modal/TOGGLE_SETUP_PAYROLL_TAX_VIEW')
      this.taxVal = data
    }
  }
}
</script>
