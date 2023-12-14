<template>
  <div>
    <a-card>
      <chosen-alert-box
        permissionNameAdd="security_users_add"
        permissionNameDelete="security_users_more_delete"
        isActive
        position="right"
        :totalSelected="selectedRowKeys.length"
        @open="openAddUser()"
        @delete="handleDelete(selectedRowKeys)"
      />
      <s-table
        permissionName="security_users_view"
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
        <span key="roles" slot="roles" slot-scope="roles">
          <a-tag style="margin: 5px" v-for="(role, i) in roles" :key="i" :color="role.roleColor">
            {{ role.name }}
          </a-tag>
        </span>
        <a-switch
          :disabled="!$store.getters.permissions.includes('security_users_update-status')"
          key="status"
          slot="status"
          slot-scope="val, record"
          :default-checked="val === 'Enable'"
          @change="(e) => handleStatus(e, record)"
        />
        <span key="action" slot="action" slot-scope="val, record">
          <a v-action:security_users_edit @click="openAddUser(record)">{{ $t('table.dialog.edit') }}</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a v-action:security_users_more class="ant-dropdown-link"> {{ $t('table.dialog.more') }} <a-icon type="down" /> </a>
            <down-outlined />
            <a-menu slot="overlay">
              <a-menu-item>
                <a v-action:security_users_more_reset-password @click="openResetPassword(record.email)">{{ $t('table.dialog.reset-password') }}</a>
              </a-menu-item>
              <a-menu-item>
                <a v-action:security_users_more_delete @click="handleDelete([record.id])">{{ $t('table.dialog.delete') }}</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </s-table>
      <AddUserModal @clearModel="mdl = null" :model="mdl" @refreshTable="$refs.table.refresh()" />
      <reset-password-modal :id="currentId" @clearId="currentId = ''" :apiUrl="apiUrl" />
    </a-card>
  </div>
</template>

<script>
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import AddUserModal from './AddUserModal.vue'
import ResetPasswordModal from '../Account/ResetPasswordModal.vue'
import { i18nRender } from '@/locales'
import InfoCircle from '@/assets/info-circle.svg'

const columns = [
  {
    title: i18nRender('table.column.email'),
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: i18nRender('table.column.employee-name'),
    dataIndex: 'employeeName',
    key: 'employee'
  },
  {
    title: i18nRender('table.column.role-name'),
    dataIndex: 'grantedRoles',
    key: 'roles',
    scopedSlots: { customRender: 'roles' }
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
  components: { AddUserModal, ChosenAlertBox, ResetPasswordModal },
  name: 'Users',
  data() {
    return {
      columns,
      currentId: '',
      selectedRowKeys: [], // Check here to configure the default column
      queryParam: {},
      apiUrl: 'api/security/users/resetPassword',
      // 加载数据方法 必须为 Promise 对象
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const data = await this.$store.dispatch('api/security/users/fetchList', params)
        return data
      },
      mdl: null
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  methods: {
    start() {},
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    handleEdit() {},
    async handleDelete(ids) {
      this.$confirm({
        centered: true,
        title: i18nRender('delete.confirm'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          await this.$store.dispatch('api/security/users/deleteUsers', { entityIds: [...ids] })
          this.selectedRowKeys = []
          this.$refs.table.refresh()
          this.$notification.open({
            message: i18nRender('notification.user.deleted'),
            icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
          })
        }
      })
    },
    openAddUser(data) {
      this.$store.commit('modal/TOGGLE_ADD_USER_MODAL')
      if (data) {
        this.mdl = { ...data }
      }
    },
    openResetPassword(id) {
      this.currentId = id
      this.$store.commit('modal/TOGGLE_RESET_PASSWORD_MODAL')
    },
    async handleStatus(checked, record) {
      try {
        await this.$store.dispatch('api/security/users/updateStatus', {
          id: record.id,
          status: checked ? 'Enable' : 'Disable'
        })
        this.$notification.open({
          message: checked ? i18nRender('notification.user.enabled') : i18nRender('notification.user.disabled'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.$refs.table.refresh(true)
      } catch (e) {
        this.$message.error(e.response.data.message)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.info-container {
  width: 100%;
  background-color: #e6f7ff;
  border: 1px solid #bae7ff;
  padding: 10px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  .info-left {
    display: flex;
    align-items: center;
    gap: 5px;
    span {
      color: #1890ff;
    }
  }

  .info-right {
    display: flex;
    align-items: center;
    .ant-btn {
      background: none;
      border: none;
      color: #1890ff;
    }
  }
}
</style>
