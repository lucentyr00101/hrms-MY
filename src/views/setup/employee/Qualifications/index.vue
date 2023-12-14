<template>
  <a-card>
    <ChosenAlertBox
      permissionNameAdd="setup_employee_qualifications_add"
      permissionNameDelete="setup_employee_qualifications_delete"
      :isActive="true"
      :totalSelected="selectedRowKeys.length"
      position="right"
      @open="modalHandler({ show: true, action: 'add' })"
      @delete="handleDelete(selectedRowKeys)"
    />
    <s-table
      permissionName="setup_employee_qualifications_view"
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
      <a slot="name" slot-scope="text">{{ text }}</a>
      <span slot="action" slot-scope="value, data">
        <a v-action:setup_employee_qualifications_edit @click="modalHandler({ show: true, action: 'edit', data })">{{ $t('table.dialog.edit') }}</a>
      </span>
    </s-table>
    <FormModal :modal="formModal" @refreshTable="refreshTable" />
  </a-card>
</template>

<script>
import ChosenAlertBox from '@/components/Table/ChosenAlertBox'
import InfoCircle from '@/assets/info-circle.svg'
import { i18nRender } from '@/locales'
import FormModal from './form-modal.vue'

const columns = [
  {
    id: 1,
    title: i18nRender('table.column.qualifications'),
    dataIndex: 'qualifications',
    key: 'qualifications',
    ellipsis: true,
    scopedSlots: { customRender: 'qualifications' }
  },
  {
    id: 2,
    title: i18nRender('table.column.descriptions'),
    dataIndex: 'descriptions',
    key: 'descriptions',
    ellipsis: true
  },

  {
    title: i18nRender('table.column.action'),
    scopedSlots: { customRender: 'action' },
    key: 'action',
    width: '10%'
  }
]

export default {
  name: 'SetupEmployeeQualifications',
  components: { ChosenAlertBox, FormModal },

  data() {
    return {
      formModal: { show: false },
      columns,
      selectedRowKeys: [], // Check here to configure the default column
      mdl: null,
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const data = await this.$store.dispatch('api/setup/employee/qualifications/fetchList', params)
        return data
      }
    }
  },
  computed: {},
  methods: {
    refreshTable() {
      this.$refs.table.refresh()
      this.modalHandler({ show: false })
    },
    modalHandler(payload) {
      const { show = false, action = undefined, data = {} } = payload || {}
      this.formModal = { show, action, data }
    },
    getEmployeesAssigned(data) {
      if (Array.isArray(data)) {
        return data.reduce((a, b) => {
          return (a.employeesAssigned || 0) + (b.employeesAssigned || 0)
        }, 0)
      }
      return 0
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
    handleDelete(keys) {
      if (keys === 0) return
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
            const { data } = await this.$store.dispatch('api/setup/employee/qualifications/delete', {
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
                message: this.$t('notification.qualification.deleted'),
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
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    }
  }
}
</script>

<style scoped>
.ant-alert >>> .ant-alert-description {
  margin-left: auto;
}
.add-button {
  margin-bottom: 16px;
  margin-left: auto;
}
</style>
