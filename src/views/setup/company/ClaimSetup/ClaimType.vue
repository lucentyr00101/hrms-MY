<template>
  <div>
    <ChosenAlertBox
      permissionNameAdd="setup_company_claim-setup_claim-type_add"
      permissionNameDelete="setup_company_claim-setup_claim-type_delete"
      :totalSelected="selectedRowKeys.length"
      :isActive="true"
      position="right"
      @open="openClaimTypeModal"
      @delete="handleClaimTypeDelete(selectedRowKeys)"
    />

    <s-table
      permissionName="setup_company_claim-setup_claim-type_view"
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
        <a-switch
          :disabled="!$store.getters.permissions.includes('setup_company_claim-setup_claim-type_update-status')"
          :default-checked="status === 'Enable'"
          @change="(e) => handleStatusChange(e, record)"
        />
      </span>
      <span slot="limited" slot-scope="text">
        {{ text === 'Enable' ? $t('table.dialog.yes') : $t('table.dialog.no') }}
      </span>
      <span slot="action" key="action" slot-scope="val, record">
        <a v-action:setup_company_claim-setup_claim-type_view-edit-details id="edit" key="edit" @click="openEditClaimTypeModal(record)">{{ $t('table.dialog.view') }}</a>
      </span>
    </s-table>
    <claim-type-modal @refreshTable="$refs.table.refresh()" :mdl="mdl" ref="customEditableTable" />
  </div>
</template>

<script>
import { ref } from 'vue'
import InfoCircle from '@/assets/info-circle.svg'
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import { i18nRender } from '@/locales'
import ClaimTypeModal from './ClaimTypeModal.vue'
const columns = [
  {
    title: i18nRender('table.column.claim-type'),
    dataIndex: 'claimType',
    key: 'claimType',
    ellipsis: true
  },
  {
    title: i18nRender('table.column.descriptions'),
    dataIndex: 'descriptions',
    key: 'descriptions',
    ellipsis: true
  },
  {
    title: i18nRender('table.column.limited'),
    dataIndex: 'limited',
    key: 'limited',
    ellipsis: true,
    scopedSlots: { customRender: 'limited' }
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
  name: 'ClaimTypeTable',
  components: { ChosenAlertBox, ClaimTypeModal },
  data() {
    return {
      columns,
      selectedRowKeys: [],
      action: null,
      mdl: null,

      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const data = await this.$store.dispatch('api/setup/company/claimType/fetchClaimTypeList', params)
        return data
      }
    }
  },
  setup() {
    return {
      activeKey: ref('1')
    }
  },
  methods: {
    openClaimTypeModal() {
      this.$store.commit('modal/TOGGLE_CLAIM_TYPE_MODAL')
    },
    getEmployeesAssigned(data) {
      if (Array.isArray(data)) {
        return data.reduce((a, b) => {
          return (a.employeesAssigned || 0) + (b.employeesAssigned || 0)
        }, 0)
      }
      return 0
    },
    async handleStatusChange(checked, row) {
      try {
        await this.$store.dispatch('api/setup/company/claimType/claimTypeToggleStatus', {
          id: row.id,
          status: checked ? 'Enable' : 'Disable'
        })
        this.$notification.open({
          message: checked ? this.$t('notification.claim-type-enabled') : this.$t('notification.claim-type-disabled'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
      } catch (e) {
        this.$message.error(e.response.data.message)
      }
    },
    openEditClaimTypeModal(data) {
      this.$store.commit('modal/TOGGLE_CLAIM_TYPE_MODAL')
      this.mdl = { ...data }
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    async notificationConfirm(message) {
      this.$confirm({
        centered: true,
        title: message,
        okText: this.$t('table.dialog.okay'),
        cancelButtonProps: { style: { display: 'none' } },
        onOk: () => {},
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />
      })
    },
    async handleClaimTypeDelete(keys) {
      if (this.totalSelected === 0) return
      this.$confirm({
        centered: true,
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
            const { data } = await this.$store.dispatch('api/setup/company/claimType/claimTypeDelete', {
              entityIds: keys
            })
            const employeesAssigned = this.getEmployeesAssigned(data)

            if (employeesAssigned) {
              this.notificationConfirm(
                this.$t(
                  employeesAssigned === 1
                    ? 'table.dialog.delete-assigned-employee'
                    : 'table.dialog.delete-assigned-employees',
                  {
                    assigned: employeesAssigned
                  }
                )
              )
              const employeesAssignedIds = data.map((value) => value.id)
              this.selectedRows = this.selectedRows.filter((selectedRow) => {
                return employeesAssignedIds.includes(selectedRow)
              })
            } else {
              this.$notification.open({
                message: this.$t('notification.claim-type-deleted'),
                icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
              })
              this.onSelectChange([])
            }
          } catch (error) {
            if (error?.response?.data?.message) this.$message.error(error?.response?.data?.message)
          }

          this.$refs.table.refresh(true)
          this.selectedRowKeys = []
        }
      })
    }
  }
}
</script>
