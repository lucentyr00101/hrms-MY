<template>
  <a-card>
    <chosen-alert-box
      permissionNameAdd="setup_employee_attendance-setup_add"
      permissionNameDelete="setup_employee_attendance-setup_delete"
      :isActive="true"
      :totalSelected="selectedRowKeys.length"
      position="right"
      @open="openAddModal()"
      @delete="handleDelete(selectedRowKeys)"
    />
    <s-table
      permissionName="setup_employee_attendance-setup_view"
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
      <template slot="statusName" slot-scope="text, record">
        <a-tag :color="record.color.toLowerCase()">
          {{ text }}
        </a-tag>
      </template>
      <template slot="isPublish" slot-scope="text">
        {{ text === 'Yes' ? $t('table.dialog.yes') : $t('table.dialog.no') }}
      </template>
      <template slot="action" slot-scope="text, record">
        <a v-action:setup_employee_attendance-setup_edit @click="handleEdit(record)">{{ $t('table.dialog.edit') }}</a>
      </template>
    </s-table>
    <add-attendance-setup-modal @refreshTable="$refs.table.refresh()" />
    <edit-attendance-setup-modal @refreshTable="$refs.table.refresh()" :model="mdl" />
  </a-card>
</template>

<script>
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'

import { i18nRender } from '@/locales'
import AddAttendanceSetupModal from './AddAttendanceSetupModal.vue'
import EditAttendanceSetupModal from './EditAttendanceSetupModal.vue'
import columns from './columns'
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'SetupEmployeeAttendanceSetup',
  components: { ChosenAlertBox, AddAttendanceSetupModal, EditAttendanceSetupModal },

  data() {
    return {
      selectedRowKeys: [], // Check here to configure the default column
      mdl: null,
      queryParam: {},
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const data = await this.$store.dispatch('api/setup/employee/attendanceSetup/fetchList', params)
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
    async handleDelete(entityIds) {
      this.$confirm({
        centered: true,
        title: i18nRender('save.confirm'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          if (entityIds.length) {
            try {
              await this.$store.dispatch('api/setup/employee/attendanceSetup/deleteAttendance', { entityIds })
              this.$notification.open({
                message: i18nRender('notification.attendance-type.deleted'),
                icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
              })
              this.$refs.table.refresh()
              this.selectedRowKeys = []
            } catch (e) {
              console.log(e)
              this.$message.error(e?.response?.data?.message || 'Something went wrong')
            }
          }
        }
      })
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    openAddModal() {
      this.$store.commit('modal/TOGGLE_ADD_ATTENDANCE_SETUP_MODAL')
    },
    handleEdit(data) {
      this.$store.commit('modal/TOGGLE_EDIT_ATTENDANCE_SETUP_MODAL')
      this.mdl = { ...data }
    }
  }
}
</script>

<style scoped></style>
