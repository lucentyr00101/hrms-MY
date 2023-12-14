<template>
  <div>
    <a-card>
      <chosen-alert-box
        permissionNameAdd="setup_employee_work-shift-setup_add"
        permissionNameDelete="setup_employee_work-shift-setup_delete"
        :isActive="true"
        :totalSelected="selectedRowKeys.length"
        position="right"
        @open="openAddWorkShiftSetupModal()"
        @delete="handleDelete(selectedRowKeys)"
      />
      <s-table
        permissionName="setup_employee_work-shift-setup_view"
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
        <span slot="workShiftRate" slot-scope="text, record" v-if="record.workShiftRate === '1.0'">Morning</span>
        <span slot="workShiftRate" slot-scope="text, record" v-else-if="record.workShiftRate === '1.2'">Afternoon</span>
        <span slot="workShiftRate" slot-scope="text, record" v-else-if="record.workShiftRate === '1.25'">Night</span>
        <span slot="time" slot-scope="text, record">{{ record.startTime | moment('HH:mm') }} - {{ record.endTime | moment('HH:mm') }}</span>
        <span slot="action" slot-scope="text, record">
          <a v-action:setup_employee_work-shift-setup_edit @click="handleEdit(record)">{{ $t('table.dialog.edit') }}</a>
        </span>
      </s-table>
    </a-card>
    <add-work-shift-setup-modal @refreshTable="$refs.table.refresh()" :currency="lateDeductionCurrencyValue"/>
    <edit-work-shift-setup-modal @refreshTable="$refs.table.refresh()" :currency="lateDeductionCurrencyValue" :model="mdl"/>
  </div>
</template>

<script>
// import moment from 'moment'
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import AddWorkShiftSetupModal from './AddWorkShiftSetupModal.vue'
import EditWorkShiftSetupModal from './EditWorkShiftSetupModal.vue'
import { i18nRender } from '@/locales'

const columns = [
  {
    id: 1,
    title: i18nRender('table.column.work-shift-type'),
    dataIndex: 'workShiftType',
    key: 'workShiftType',
    ellipsis: true,
    scopedSlots: { customRender: 'workShiftType' }
  },
  {
    id: 2,
    title: i18nRender('table.dialog.work-shift-rate'),
    dataIndex: 'workShiftRate',
    key: 'workShiftRate',
    scopedSlots: { customRender: 'workShiftRate' }
  },
  {
    id: 3,
    title: i18nRender('table.column.time'),
    dataIndex: 'time',
    key: 'time',
    ellipsis: true,
    scopedSlots: { customRender: 'time' }
  },
  {
    id: 4,
    title: i18nRender('table.column.remarks'),
    dataIndex: 'remarks',
    key: 'remarks',
    ellipsis: true,
    scopedSlots: { customRender: 'remarks' }
  },

  {
    title: i18nRender('table.column.action'),
    scopedSlots: { customRender: 'action' },
    key: 'action'
  }
]

export default {
  name: 'SetupEmployeeWorkShiftSetup',
  components: { ChosenAlertBox, AddWorkShiftSetupModal, EditWorkShiftSetupModal },

  data () {
    return {
      columns,
      selectedRowKeys: [], // Check here to configure the default column
      mdl: null,
      expandedRowKeys: [],
      lateDeductionCurrencyValue: null,
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const data = await this.$store.dispatch('api/setup/employee/workShiftSetup/fetchList', params)
        const workShiftSetupData = data.data.data
        workShiftSetupData.forEach((item) => {
          const date = '2022-12-12 '
          item.startTime = date + item.startTime
          item.endTime = date + item.endTime
        })
        return data
      }
    }
  },
  async created () {
    const { data } = await this.$store.dispatch('api/dropdown/fetchLateDeductionCurrencyDropdown')
    this.lateDeductionCurrencyValue = data.lateDeductionCurrencyTypeResponse.lateDeductionCurrencyValue
    console.log(this.lateDeductionCurrencyValue)
  },
  methods: {
    showNotification () {
      this.$notification.open({
        message: i18nRender('notification.work-shift-setup.deleted'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    handleDelete(selectedKeys) {
      if (!selectedKeys.length) return
      const _this = this
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

        async onOk() {
          try {
            await _this.$store.dispatch('api/setup/employee/workShiftSetup/deleteAddWorkShiftSetup', {
              entityIds: selectedKeys
            })

            _this.showNotification()
            _this.onSelectChange([])
            _this.$refs.table.refresh()
          } catch (e) {
            console.log(e)
            _this.$message.error(e.response.data.message)
          }
        }
      })
    },
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    openAddWorkShiftSetupModal () {
      this.$store.commit('modal/TOGGLE_ADD_WORK_SHIFT_SETUP_MODAL')
    },
    handleEdit (data) {
      this.$store.commit('modal/TOGGLE_EDIT_WORK_SHIFT_SETUP_MODAL')
      this.mdl = { ...data }
    }
  }
}
</script>
