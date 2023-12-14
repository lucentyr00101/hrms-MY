<template>
  <div>
    <a-modal
      destroyOnClose
      class="user-modal"
      :title="!model ? $t('table.dialog.add-user') : $t('table.dialog.edit-user')"
      :width="800"
      :maskClosable="false"
      v-model="addUserModal"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      @cancel="closeModal()"
    >
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
        <a-spin :spinning="loading">
          <a-form-item label="Employee: ">
            <a-select
              :disabled="model"
              showSearch
              optionFilterProp="children"
              :options="_employeesList"
              v-decorator="['employee', { rules: [{ required: true, message: $t('error.employee.select') }] }]"
              placeholder="Choose an employee"
            />
          </a-form-item>
          <a-form-item label="Roles Name:">
            <a-select
              optionFilterProp="children"
              style="width: 100%"
              mode="multiple"
              :options="_rolesList"
              v-decorator="['roles', { rules: [{ required: true, message: $t('error.roles.select') }] }]"
            />
          </a-form-item>
        </a-spin>
        <a-form-item :wrapperCol="{ span: 1, offset: 18 }">
          <a-button class="confirm-btn" type="primary" @click="showInfo">{{ $t('table.dialog.confirm') }}</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { i18nRender } from '@/locales'
import pick from 'lodash.pick'
import InfoCircle from '@/assets/info-circle.svg'

const fields = ['employee', 'roles']
export default {
  name: 'AddUserModal',
  props: {
    data: { type: Array, default: null },
    roles: { type: Array, default: null },
    model: { type: Object, default: () => null }
  },
  watch: {
    async addUserModal(value) {
      if (value) {
        this.loading = true
        const fetchEmployees = this.$store.dispatch('api/setup/employee/employeeSetup/fetchEmployeeDropdown')
        const fetchRoles = this.$store.dispatch('api/security/roles/fetchList', { page: 0, size: 99999 })
        const [employees, roles] = await Promise.all([fetchEmployees, fetchRoles])
        this.employeesList = employees.data.employeeDetailSmallResponses
        this.rolesList = roles.data.data
        this.loading = false
        if (this.model) {
          const employee = this.employeesList.find((emp) => emp.email === this.model.email)
          const roles = this.model.grantedRoles.map((role) => role.id)
          this.form.setFieldsValue({
            employee: employee.id,
            roles
          })
        }
      }
    }
  },
  data() {
    return {
      selectedRoles: [],
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'addUser' }),
      employeesList: [],
      rolesList: [],
      loading: false
    }
  },
  computed: {
    addUserModal: {
      get() {
        return this.$store.state.modal.addUserModal
      },
      set() {
        // just to prevent error log when @cancel
      }
    },
    _employeesList() {
      return this.employeesList.map((employee) => {
        return {
          value: employee.id,
          label: employee.fullName
        }
      })
    },
    _rolesList() {
      return this.rolesList.map((role) => {
        return {
          value: role.id,
          label: role.name
        }
      })
    }
  },
  created() {
    fields.forEach((v) => this.form.getFieldDecorator(v))
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  methods: {
    closeModal() {
      this.$store.commit('modal/TOGGLE_ADD_USER_MODAL')
      this.$emit('clearModel')
      this.form.resetFields()
    },
    showNotification() {
      const message = !this.model ? i18nRender('notification.user.added') : i18nRender('notification.user.updated')
      this.$notification.open({
        message,
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo() {
      const _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$confirm({
            title: i18nRender('table.dialog.confirm-msg'),
            okText: i18nRender('table.dialog.yes'),
            cancelText: i18nRender('table.dialog.no'),
            icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
            async onOk() {
              const employee = _this.employeesList.find((_employee) => _employee.id === values.employee)
              const data = {
                ...(_this.model ? { id: _this.model.id } : {}),
                employeeId: employee.id,
                email: employee.email,
                employeeName: employee.fullName,
                status: 'Enable',
                grantedRoles: [...values.roles]
              }
              try {
                !_this.model
                  ? await _this.$store.dispatch('api/security/users/addUser', data)
                  : await _this.$store.dispatch('api/security/users/updateUser', data)
                _this.showNotification()
                _this.closeModal()
                _this.$emit('refreshTable')
              } catch (e) {
                _this.$message.error(e.response.data.message)
              }
            },
            onCancel() {
              console.log('Cancel')
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
