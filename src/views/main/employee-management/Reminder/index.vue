<template>
  <div>
    <a-card class="antd-custom-table">
      <query-form
        :columns="columns"
        v-model="queryParam"
        @click="$refs.table.refresh(true)"
      />
    </a-card>
    <a-card class="antd-custom-table">
      <chosen-alert-box
        permissionNameAdd="main_employee-management_reminder_add"
        permissionNameDelete="main_employee-management_reminder_delete"
        :isActive="true"
        position="right"
        :totalSelected="selectedRowKeys.length"
        @delete="handleDelete(selectedRowKeys)"
        @open="handleLevelModal"
      />
      <s-table
        permissionName="main_employee-management_reminder_view"
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
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
      >
        <span slot="reminderName" slot-scope="text, record">
          {{ record?.employeeSetupReminder?.reminderName }}
        </span>
        <span slot="status" slot-scope="status, record">
          <a-switch
            :disabled="!$store.getters.permissions.includes('main_employee-management_reminder_update-status')"
            :checked="record.status === 'Enable' ? true : false"
            @change="(e) => handleStatusChange(e, record)"
          />
        </span>
        <span slot="daysArray" slot-scope="text, record" class="daysArray">
          <span v-for="(rec, index) in record.daysArray" :key="index">{{ rec }}<span>, </span></span>
        </span>
        <span slot="action" slot-scope="text, record">
          <a v-action:main_employee-management_reminder_edit @click="handleLevelModal(record)">{{ $t('table.dialog.edit') }}</a>
          <a-divider type="vertical" />
          <a v-action:main_employee-management_reminder_delete @click="handleDelete([record.id])">{{ $t('table.top.delete') }}</a>
        </span>
      </s-table>
    </a-card>
    <FormModal
      ref="formModal"
      :model="mdl"
      @refreshTable="$refs.table.refresh(true)"
    />
  </div>
</template>
<script>

import QueryForm from '@/components/Table/QueryForm'
import ChosenAlertBox from '@/components/Table/ChosenAlertBox'
import FormModal from './form-modal.vue'
import { i18nRender } from '@/locales'
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'MainEmployeeMgmtReminder',
  components: { QueryForm, ChosenAlertBox, FormModal },
  data () {
    return {
      mdl: null,
      dropdown: [],
      selectedRowKeys: [],
      queryParam: {},
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const data = await this.$store.dispatch('api/main/employeeManagement/reminder/search', params)
        return {
          data
        }
      }
    }
  },
  async created () {
    const employee = await this.$store.dispatch('api/dropdown/fetchEmployeeSetupReminderDropdown')
    employee.data.reminder.forEach((item) => {
      this.dropdown.push({ id: item.id, value: item.reminderName, label: item.reminderName })
    })
  },
  computed: {
    columns() {
      return [
        {
          title: i18nRender('table.column.reminder-name'),
          dataIndex: 'reminderName',
          key: 'reminderName',
          ellipsis: true,
          scopedSlots: { customRender: 'reminderName' }
        },
        {
          title: i18nRender('table.column.reminder-message'),
          dataIndex: 'employeeSetupReminder.reminderMessage',
          key: 'reminderMessage',
          hideInSearch: true,
          ellipsis: true
        },
        {
          title: i18nRender('table.column.status'),
          dataIndex: 'status',
          key: 'status',
          hideInSearch: true,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: i18nRender('table.column.days'),
          dataIndex: 'daysArray',
          key: 'days',
          hideInSearch: true,
          ellipsis: true,
          scopedSlots: { customRender: 'daysArray' }
        },
        {
          title: i18nRender('table.column.when-to-send'),
          dataIndex: 'trigger',
          key: 'trigger',
          hideInSearch: true
        },
        {
          title: i18nRender('table.column.action'),
          dataIndex: 'action',
          key: 'action',
          hideInSearch: true,
          width: 140,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    i18nRender,
    async handleStatusChange (checked, row) {
      try {
        await this.$store.dispatch('api/main/employeeManagement/reminder/updateStatus', { id: row.id, status: checked ? 'Enable' : 'Disable' })
        this.$notification.open({
          message: i18nRender('notification.reminder.status'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.$refs.table.refresh(true)
      } catch (e) {
        this.$message.error(e.response)
      }
    },
    handleLevelModal(data) {
      this.mdl = { ...data }
      this.$refs.formModal.view()
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
            await this.$store.dispatch('api/main/employeeManagement/reminder/delete', { entityIds: selectedKeys })
            this.$notification.open({
              message: this.$t('notification.reminder-setup.deleted'),
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
    },
    onSelectChange (selectedItems) {
      this.selectedRowKeys = selectedItems
    }
  }
}
</script>

<style >
.daysArray span:last-child span {
  display: none;
}
</style>
