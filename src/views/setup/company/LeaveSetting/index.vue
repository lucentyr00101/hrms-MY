<template>
  <div>
    <a-card>
      {{ $t('table.column.leave-group') }}:
      <a-select
        show-search
        placeholder="Select"
        :options="leaveGroupDropdown"
        :value="companyLeaveGroupId"
        @change="handleLeaveGroupChange"
        style="width: 120px"
      />
      <a-tabs v-model="companyLeaveTypeId">
        <a-tab-pane :key="el.id" :tab="handleTabNames(el.companyLeaveType)" v-for="el in leaveTypeList">
          <chosen-alert-box
            permissionNameAdd="setup_company_leave-setting_add"
            permissionNameDelete="setup_company_leave-setting_delete"
            :totalSelected="selectedRowKeys.length"
            :isActive="true"
            position="right"
            @open="handleAdd"
            @delete="handleDelete(selectedRowKeys)"
          />
          <s-table
            permissionName="setup_company_leave-setting_view"
            :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
            rowKey="id"
            :ref="`table_${el.id}`"
            size="default"
            :columns="columns"
            :data="loadData"
            :pagination="{
              'show-total': (total, range) => $tc('table.column.total-items', total),
              showSizeChanger: true,
              showQuickJumper: true
            }"
          >
            <span slot="action" key="action" slot-scope="val, record">
              <a v-action:setup_company_leave-setting_edit id="edit" key="edit" @click="handleEdit(record)">{{
                $t('table.dialog.edit')
              }}</a>
            </span>
          </s-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <leave-setting-modal ref="leaveSettingModal" @refreshTable="refreshData" :mdl="mdl" />
  </div>
</template>

<script>
import { i18nRender } from '@/locales'
import LeaveSettingModal from './LeaveSettingModal.vue'
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import InfoCircle from '@/assets/info-circle.svg'

const columns = [
  {
    title: i18nRender('table.column.from-service-year'),
    dataIndex: 'fromServiceYear',
    key: 'fromServiceYear'
  },
  {
    title: i18nRender('table.column.to-service-year'),
    dataIndex: 'toServiceYear',
    key: 'toServiceYear',
    ellipsis: true
  },
  {
    title: i18nRender('table.column.entitiled-days'),
    dataIndex: 'entitledDays',
    key: 'entitledDays',
    ellipsis: true
  },

  {
    title: i18nRender('table.column.action'),
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  components: { LeaveSettingModal, ChosenAlertBox },
  name: 'SetupCompanyLeaveSetting',
  data() {
    return {
      columns,

      leaveTypeList: [],
      selectedRowKeys: [],
      leaveGroupDropdown: [],
      mdl: null,
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize,
          companyLeaveTypeId: this.companyLeaveTypeId,
          companyLeaveGroupId: this.companyLeaveGroupId
        }

        const params = Object.assign(_parameter, this.queryParam)
        const data = await this.$store.dispatch('api/setup/company/leaveSetting/list', params)
        return data
      },
      companyLeaveTypeId: null,
      companyLeaveGroupId: null
    }
  },

  async created() {
    const { data } = await this.$store.dispatch('api/dropdown/fetchLeaveGroupDropdown')
    const dropdownData = data?.companyLeaveGroup || []
    this.leaveGroupDropdown = dropdownData?.map((el) => ({
      value: el.id,
      label: el.leaveGroup
    }))

    const res = await this.$store.dispatch('api/setup/company/leaveSetting/listLeaveType')
    this.leaveTypeList = res.data
    this.companyLeaveTypeId = this.leaveTypeList[0] ? this.leaveTypeList[0].id : null
    this.companyLeaveGroupId = dropdownData[0] ? dropdownData[0].id : null
  },
  watch: {
    companyLeaveTypeId() {
      this.refreshData()
    },
    companyLeaveGroupId() {
      this.refreshData()
    }
  },

  methods: {
    handleTabNames(data) {
      let name
      switch (data) {
        case 'Sick Leave':
          name = this.$t('dashboard.analysis.leave.sick-leave')
          break
        case 'Medical Leave':
          name = this.$t('table.column.medical-leave')
          break
        case 'Annual Leave':
          name = this.$t('table.column.annual-leave')
          break
        case 'Unpaid Leave':
          name = this.$t('table.column.unpaid-leave')
          break
        case 'Vacation Leave':
          name = this.$t('dashboard.analysis.leave.vacation-leave')
          break

        default:
          break
      }
      return name
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleEdit(data) {
      this.mdl = data
      this.$store.commit('modal/TOGGLE_LEAVE_SETTING_MODAL')
    },
    handleAdd() {
      this.$store.commit('modal/TOGGLE_LEAVE_SETTING_MODAL')
      this.mdl = { companyLeaveTypeId: this.companyLeaveTypeId, companyLeaveGroupId: this.companyLeaveGroupId }
    },
    handleLeaveGroupChange(id) {
      this.companyLeaveGroupId = id
    },
    refreshData() {
      setTimeout(() => {
        const refValue = `table_` + this.companyLeaveTypeId
        this.$refs[refValue][0].refresh()
      }, 500)
    },
    handleDelete(selectedKeys) {
      if (!selectedKeys.length) return
      this.$confirm({
        title: this.$t('table.dialog.delete-confirm'),
        okText: this.$t('table.dialog.yes'),
        cancelText: this.$t('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          try {
            await this.$store.dispatch('api/setup/company/leaveSetting/delete', {
              entityIds: selectedKeys
            })

            this.$notification.open({
              message: this.$t('notification.leave-setting.deleted'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
            this.onSelectChange([])
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
          this.refreshData()
        }
      })
    }
  }
}
</script>
