<template>
  <a-card>
    <chosen-alert-box
      permissionNameAdd="security_roles_add"
      permissionNameDelete="security_roles_more_delete"
      :isActive="true"
      :totalSelected="selectedRowKeys.length"
      position="right"
      @open="openAddRoleModal()"
      @delete="handleDelete(selectedRowKeys)"
    />
    <s-table
      permissionName="security_roles_view"
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
      <span slot="status" slot-scope="status,record">
        <a-switch
          :disabled="!$store.getters.permissions.includes('security_roles_update-status')"
          :default-checked="status === 'Enable'"
          @change="(e)=>handleStatusChange(e,record)"
        />
      </span>
      <span key="action" slot="action" slot-scope="val,record">
        <a v-action:security_roles_rename @click="handleEdit(record)">{{ $t('table.dialog.rename') }}</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a v-action:security_roles_more class="ant-dropdown-link">
            {{ $t('table.dialog.more') }} <a-icon type="down" />
          </a>
          <down-outlined />
          <a-menu slot="overlay">
            <a-menu-item>
              <a v-action:security_roles_more_permissions @click="handlePermissions(record)">{{ $t('table.dialog.permission') }}</a>
            </a-menu-item>
            <a-menu-item>
              <a v-action:security_roles_more_data-access @click="handleDataAccess(record)">{{ $t('table.dialog.data-access') }}</a>
            </a-menu-item>
            <a-menu-item>
              <a v-action:security_roles_more_delete @click="handleDelete([record.id])">{{ $t('table.dialog.delete') }}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>
    <add-role-modal
      @refreshTable="$refs.table.refresh(true)"
      :model="mdl"
      @clearModel="mdl = null"
    />
    <DataAccess
      v-model="showDataAccess"
      :model="mdl"
      @clearModel="mdl = null"
      @refreshTable="$refs.table.refresh()"
    />
    <Permissions
      ref="permissionModal"
      :userType="userType"
      :model="mdl"
      @refreshTable="$refs.table.refresh()"
    />
  </a-card>
</template>

<script>
// import { getServiceList } from '@/api/manage'

import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import AddRoleModal from './AddRoleModal.vue'
import { i18nRender } from '@/locales'
import InfoCircle from '@/assets/info-circle.svg'
import DataAccess from '@/components/UserRoles/DataAccess'
import Permissions from '@/components/UserRoles/Permissions'
// import { getServiceList } from '@/api/manage'

const columns = [
  {
    id: 1,
    title: i18nRender('table.column.role-name'),
    dataIndex: 'name',
    key: 'roleName',
    scopedSlots: { customRender: 'name' }
  },
  {
    id: 2,
    title: i18nRender('table.column.remark'),
    dataIndex: 'remarks',
    key: 'remark',
    ellipsis: true
  },
  {
    id: 3,
    title: i18nRender('table.column.status'),
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  },

  {
    title: i18nRender('table.column.action'),
    scopedSlots: { customRender: 'action' },
    key: 'action'
  }
]

export default {
  name: 'UserRoles',
  components: { ChosenAlertBox, AddRoleModal, DataAccess, Permissions },

  data () {
    return {
      columns,
      userType: 'Admin',
      showDataAccess: false,
      selectedRowKeys: [], // Check here to configure the default column
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const data = await this.$store.dispatch('api/security/roles/fetchList', params)
        return data
      },
      mdl: null,
      showModal: false
    }
  },
  methods: {
    handleDataAccess (record) {
      this.mdl = { ...record }
      this.showDataAccess = true
    },
    handlePermissions (record) {
      this.$refs.permissionModal.open()
      this.mdl = { ...record }
    },
    handleEdit (record) {
      this.mdl = { ...record }
      this.openAddRoleModal()
    },
    handleDelete (ids) {
      this.$confirm({
        centered: true,
        title: i18nRender('role.delete.confirm'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          await this.$store.dispatch('api/security/roles/deleteRoles', { entityIds: [...ids] })
          this.selectedRowKeys = []
          this.$refs.table.refresh()
          this.$notification.open({
            message: i18nRender('notification.role.deleted'),
            icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
          })
        }
      })
    },
    async handleStatusChange (checked, row) {
      try {
        await this.$store.dispatch('api/security/roles/updateStatus', { id: row.id, status: checked ? 'Enable' : 'Disable' })
        this.$notification.open({
          message: checked ? i18nRender('notification.role.enabled') : i18nRender('notification.role.disabled'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.$refs.table.refresh(true)
      } catch (e) {
        this.$message.error(e.response.data.message)
      }
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    onPageChange (val) {
      console.log(val)
    },
    openAddRoleModal () {
        this.$store.commit('modal/TOGGLE_ADD_ROLE_MODAL')
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
