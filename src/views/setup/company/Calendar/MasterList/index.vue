<template>
  <div>
    <chosen-alert-box
      permissionNameAdd="setup_company_calendar_master-list_add"
      permissionNameDelete="setup_company_calendar_master-list_delete"
      :isActive="true"
      position="right"
      @open="modalHandler({ show: true, action: 'add' })"
      @delete="handleDelete(selectedRowKeys)"
      :totalSelected="selectedRowKeys.length"
    />
    <s-table
      permissionName="setup_company_calendar_master-list_view"
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
      <span slot="startDate" key="startDate" slot-scope="val"> {{ val | calendar }} </span>
      <span slot="endDate" key="endDate" slot-scope="val"> {{ val | calendar }}</span>
      <a-switch
        :disabled="!$store.getters.permissions.includes('setup_company_calendar_master-list_update-status')"
        key="status"
        slot="status"
        slot-scope="value, data"
        :default-checked="value === 'Enable'"
        @change="(e) => handleStatus(e, data)"
      />
      <span slot="action" slot-scope="value, data">
        <a v-action:setup_company_calendar_master-list_edit @click="modalHandler({ show: true, action: 'edit', data })">{{ $t('table.dialog.edit') }}</a>
      </span>
    </s-table>
    <FormModal :modal="formModal" @refreshTable="refreshTable" />
  </div>
</template>

<script>
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import FormModal from './form-modal.vue'
import columns from './columns'
import { i18nRender } from '@/locales'

export default {
  name: 'SetupCalendarMasterList',
  components: {
    ChosenAlertBox,
    FormModal
  },
  data() {
    return {
      selectedRowKeys: [],
      formModal: { show: false },
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const data = await this.$store.dispatch('api/setup/company/calendarMasterList/list', params)
        return data
      }
    }
  },
  computed: {
    columns() {
      return columns
    }
  },
  methods: {
    modalHandler(payload) {
      const { show = false, action = undefined, data = {} } = payload || {}
      this.formModal = { show, action, data }
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    refreshTable() {
      this.$refs.table.refresh()
      this.modalHandler({ show: false })
    },
    async handleStatus(checked, row) {
      try {
        await this.$store.dispatch('api/setup/company/calendarMasterList/toggleStatus', {
          id: row.id,
          status: checked ? 'Enable' : 'Disable'
        })
        this.$notification.open({
          message: checked ? this.$t('notification.holiday.enabled') : this.$t('notification.holiday.disabled'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.$refs.table.refresh(true)
      } catch (e) {
        this.$message.error(e.response.data.message)
      }
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
            await this.$store.dispatch('api/setup/company/calendarMasterList/delete', {
              entityIds: selectedKeys
            })

            this.$notification.open({
              message: this.$t('notification.holiday.deleted'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
            this.onSelectChange([])
            this.$refs.table.refresh()
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
        }
      })
    }
  }
}
</script>
