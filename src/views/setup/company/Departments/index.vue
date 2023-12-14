<template>
  <div>
    <a-card>
      <chosen-alert-box
        permissionNameAdd="setup_company_departments_add"
        permissionNameDelete="setup_company_departments_delete"
        :isActive="true"
        :totalSelected="selectedRowKeys.length"
        position="right"
        @open="openAddDepartmentModal()"
        @delete="handleDelete(selectedRowKeys)"
      />
      <s-table
        permissionName="setup_company_departments_view"
        ref="table"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :pagination="{
          showSizeChanger: true,
          showQuickJumper: true,
          'show-total': (total, range) => $tc('table.column.total-items', total)
        }"
      >
        <span slot="action" slot-scope="text, record">
          <a v-action:setup_company_departments_edit @click="handleEdit(record)">{{ $t('table.dialog.edit') }}</a>
        </span>
      </s-table>
    </a-card>
    <add-department-modal @refreshTable="$refs.table.refresh()" />
    <edit-department-modal :model="mdl" @refreshTable="$refs.table.refresh()" />
  </div>
</template>

<script>
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import AddDepartmentModal from './AddDepartmentModal.vue'
import InfoCircle from '@/assets/info-circle.svg'
import EditDepartmentModal from './EditDepartmentModal.vue'
import { i18nRender } from '@/locales'

const columns = [
  {
    title: i18nRender('table.column.department'),
    dataIndex: 'departmentName',
    key: 'department',
    ellipsis: true
  },
  {
    title: i18nRender('table.column.descriptions'),
    dataIndex: 'descriptions',
    ellipsis: true,
    key: 'descriptions'
  },
  {
    title: i18nRender('table.column.action'),
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  components: { AddDepartmentModal, ChosenAlertBox, EditDepartmentModal },
  name: 'SetupCompanyLeaveSetup',
  data() {
    return {
      columns,
      mdl: null,
      selectedRowKeys: [],
      queryParam: {},
      currentData: [],
      selectedNestedKeys: [],
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const data = await this.$store.dispatch('api/setup/company/department/fetchList', params)
        this.currentData = data.items
        return data
      }
    }
  },
  methods: {
    handleEdit(data) {
      this.$store.commit('modal/TOGGLE_EDIT_DEPARTMENT_MODAL')
      this.mdl = { ...data }
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    openAddDepartmentModal() {
      this.$store.commit('modal/TOGGLE_ADD_DEPARTMENT_MODAL')
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
            const { data } = await this.$store.dispatch('api/setup/company/department/delete', {
              entityIds: selectedKeys
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
              this.selectedRowKeys = this.selectedRowKeys.filter((selectedRow) => {
                return employeesAssignedIds.includes(selectedRow)
              })
            } else {
              this.$notification.open({
                message: this.$t('notification.department.deleted'),
                icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
              })
              this.onSelectChange([])
            }
          } catch (error) {
            if (error?.response?.data?.message) this.$message.error(error?.response?.data?.message)
          }
          this.$refs.table.refresh()
        }
      })
    }
  }
}
</script>

<style scoped>
.add-button {
  margin-bottom: 16px;
  margin-left: auto;
}
</style>
