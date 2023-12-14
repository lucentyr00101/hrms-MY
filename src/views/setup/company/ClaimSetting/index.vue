<template>
  <a-card>
    <span :style="{ margin: '0 5px 0 0' }">{{ $t('table.top.claim-group') }}: </span>
    <a-select v-model="claimGroup" :options="claimTypeList" placeholder="Select" :style="{ width: '200px' }"/>
    <ChosenAlertBox
      permissionNameAdd="setup_company_claim-setting_add"
      permissionNameDelete="setup_company_claim-setting_delete"
      :isActive="true"
      :totalSelected="selectedItems.length"
      position="right"
      @open="modalHandler({ action: 'add' })"
      @delete="deleteData"
    />
    <s-table
      permissionName="setup_company_claim-setting_view"
      ref="table"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :row-selection="{ selectedRowKeys: selectedItems, onChange: onSelectChange }"
      :pagination="{
        showSizeChanger: true,
        showQuickJumper: true,
        'show-total': (total) => $tc('table.column.total-items', total)
      }"
    >
      <span slot="action" slot-scope="value, data">
        <a v-action:setup_company_claim-setting_edit @click="modalHandler({ action: 'update', data })">{{ $t('table.dialog.edit') }}</a>
      </span>
    </s-table>
    <FormModal :modal="formModal" />
  </a-card>
</template>

<script>
import { i18nRender } from '@/locales'
import InfoCircle from '@/assets/info-circle.svg'

import ChosenAlertBox from '@/components/Table/ChosenAlertBox'
import FormModal from './form-modal.vue'

export default {
  name: 'SetupCompanyClaimSetting',
  components: {
    ChosenAlertBox,
    FormModal
  },
  data() {
    return {
      formModal: { show: false },
      selectedItems: [],
      queryParam: {},
      currentData: [],
      selectedNestedKeys: [],
      claimGroup: undefined,
      claimTypeList: [],
      loadData: async (parameter) => {
        let data = { data: { data: [], totalElements: 0, totalPages: 0 } }
        if (this.claimGroup) {
          const { pageNo, pageSize } = parameter
          const _parameter = {
            page: pageNo - 1,
            size: pageSize,
            claimGroupId: this.claimGroup
          }
          const params = Object.assign(_parameter, this.queryParam)
          const response = await this.$store.dispatch('api/setup/company/claimSetting/fetchList', params)
          // console.log(response)
          data = response
          this.currentData = response?.data?.data
        }
        return data
      }
    }
  },
  computed: {
    columns() {
      return [
        { title: i18nRender('table.column.claim-type'), dataIndex: 'companyClaimType.claimType', key: 'claimType' },
        { title: i18nRender('table.column.per-visit-limit'), dataIndex: 'perVisitLimit', key: 'perVisitLimit' },
        { title: i18nRender('table.column.monthly-limit'), dataIndex: 'monthlyLimit', key: 'monthlyLimit' },
        { title: i18nRender('table.column.yearly-limit'), dataIndex: 'yearlyLimit', key: 'yearlyLimit' },
        { title: i18nRender('table.column.action'), dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  watch: {
    claimGroup() {
      this.$refs.table.refresh(true)
    }
  },
  methods: {
    initiate() {
      this.getClaimGroupList()
    },
    async getClaimGroupList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchClaimGroupDropdown')
        this.claimTypeList = list?.data?.companyClaimGroups.map((item) => ({ value: item.id, label: item.companyClaimGroup }))
        this.claimGroup = this.claimGroup || this.claimTypeList?.[0]?.value
      } catch (error) {
        throw error
      }
    },
    modalHandler(payload) {
      const { show = false, action = undefined, data = {} } = payload || {}
      this.formModal = { show: ((/add|update/ig.test(action) && !!this.claimGroup) || show), action, claimGroup: this.claimGroup, data }
    },
    onSelectChange(selectedItems) {
      this.selectedItems = [ ...selectedItems ]
    },
    async deleteData() {
      if (this.selectedItems.length > 0) {
        this.$confirm({
          title: this.$t('delete.confirm'),
          okText: 'Yes',
          cancelText: 'No',
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
          onOk: async () => {
            try {
              await this.$store.dispatch('api/setup/company/claimSetting/delete', { entityIds: this.selectedItems })
              this.$notification.open({
                message: this.$t('notification.claim-settings.deleted'),
                icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
              })
              this.selectedItems = []
              this.$refs.table.refresh()
            } catch (error) {
              this.selectedItems = []
              this.$message.error(error.response.data.message)
            }
          },
          onCancel: () => {
            // console.log('Cancel')
          }
        })
      }
    },
    refreshTable() {
      this.getClaimGroupList()
      this.$refs.table.refresh()
      this.modalHandler({ show: false })
    }
  },
  created() {
    this.initiate()
  }
}
</script>

<style scoped></style>
