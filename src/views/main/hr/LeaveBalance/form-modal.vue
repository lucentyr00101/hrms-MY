<template>
  <div>
    <a-modal
      :title="formTitle"
      :width="1000"
      v-model="modal.show"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      @cancel="closeModal"
    >
      <a-row class="details-holder" type="flex" :gutter="[80, 8]">
        <a-col v-for="(item, index) of details" :key="index" :span="12">
          <span class="label">{{ item?.label }}:</span>
          <span class="value">{{ item?.value || '--' }}</span>
        </a-col>
      </a-row>

      <div :style="{ display: 'flex', justifyContent: 'flex-end', margin: '20px 0 0' }">
        <a-button v-if="modal?.action === 'view'" class="confirm-btn" type="primary" :disabled="(modal?.data?.employeeLeaveBalances && Array.isArray(modal?.data?.employeeLeaveBalances) && modal?.data?.employeeLeaveBalances.length === 0)" @click="mainParent?.modalHandler({ ...modal, action: 'update' })">{{ $t('table.dialog.edit') }}</a-button>
        <a-button v-else-if="/add|update/ig.test(modal?.action)" class="confirm-btn" type="primary" :disabled="(modal?.data?.employeeLeaveBalances && Array.isArray(modal?.data?.employeeLeaveBalances) && modal?.data?.employeeLeaveBalances.length === 0)" @click="handleSubmit">{{ $t('table.dialog.confirm') }}</a-button>
      </div>

      <a-form
        class="custom-form"
        :form="form"
        @submit="handleSubmit"
      >
        <a-table
          :columns="leave.columns"
          :data-source="leave.data"
          :scroll="{ x: (leave.cols.length * 250) }"
          :pagination="false"
          :style="{ margin: '20px 0 0' }"
        >
          <div v-for="col in leave.cols" :key="col" :slot="col" slot-scope="value, data">
            <a-form-item v-if="/update/ig.test(modal?.action)">
              <a-input
                v-decorator="[
                  `${col}/${data.key}`,
                  {
                    rules: [
                      { required: true, message: $t('error.leave.required') },
                      { max: 10, message: $t('error.max-10-numerical-characters') }
                    ]
                  }
                ]"
                type="number"
                min="0"
                step="1"
              />
            </a-form-item>
            <template v-else>{{ value }}</template>
          </div>
        </a-table>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'MainHRLeaveBalanceModal',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data () {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this)
      // fields: []
    }
  },
  computed: {
    mainParent() { return this.getParent('MainHRLeaveBalance') },
    formTitle() {
      const title = this.$t('table.dialog.view-leave-details')
      return title
    },
    details() {
      const { employee, employeeWorkInfo } = this.modal?.data || {}
      return [
        { label: 'Employee Number', value: employee?.employeeNumber },
        { label: 'Department', value: employee?.department },
        { label: 'Employee', value: employee?.fullName },
        { label: 'Join Date', value: employeeWorkInfo?.joinDate },
        { label: 'Leave Group', value: employeeWorkInfo?.companyLeaveGroup?.leaveGroup }
      ]
    },
    leave() {
      const leaveData = {
        columns: [
          { title: '', dataIndex: 'title', key: 'title', width: '120px', fixed: 'left' }
        ],
        data: [
          // { key: 0, title: 'Balance' },
          // { key: 1, title: 'Forfeited' },
          // { key: 1, title: 'Entitled' }
        ],
        cols: []
      }
      if (this.modal?.data?.employeeLeaveBalances && Array.isArray(this.modal?.data?.employeeLeaveBalances) && this.modal?.data?.employeeLeaveBalances.length > 0) {
        leaveData.data = [
          { key: 0, title: 'Balance' },
          { key: 1, title: 'Forfeited' },
          { key: 2, title: 'Entitled' }
        ]

        this.modal.data.employeeLeaveBalances.forEach((item) => {
          const { id, leaveTypeStatus, companyLeaveType, balance, forfeited, entitledDays } = item

          if (leaveTypeStatus === 'Enable') {
            leaveData.columns = [
              ...leaveData.columns,
              {
                title: `${companyLeaveType}${(/leave/ig.test(companyLeaveType)) ? '' : ' Leave'}`,
                dataIndex: id,
                key: id,
                scopedSlots: { customRender: id }
              }
            ]

            leaveData.data[0] = { ...leaveData.data[0], [id]: balance }
            leaveData.data[1] = { ...leaveData.data[1], [id]: forfeited }
            leaveData.data[2] = { ...leaveData.data[2], [id]: entitledDays }

            leaveData.cols = [ ...leaveData.cols, id ]
          }
        })

        leaveData.cols.forEach((item) => {
          this.form.getFieldDecorator(`${item}/0`)
          this.form.getFieldDecorator(`${item}/1`)
          this.form.getFieldDecorator(`${item}/2`)

          this.form.setFieldsValue({
            [`${item}/0`]: String(leaveData.data[0][item]),
            [`${item}/1`]: String(leaveData.data[1][item]),
            [`${item}/2`]: String(leaveData.data[2][item])
          })
        })
      }
      return leaveData
    }
  },
  watch: {
    modal(to) {
      if (to.show) {
        if (/view|update/ig.test(to.action) && to?.data) {
          // const { date, sequence, employee, descriptions, amount, payrollAdditionalRemuneration } = to.data
          // this.form.setFieldsValue({ date: moment(date), sequence, employee: employee.fullName, payrollAdditionalRemunerationId: payrollAdditionalRemuneration.id, remarks: descriptions, amount: String(amount) })
        }
      }
    }
  },
  methods: {
    closeModal() {
      this.form.resetFields()
    },
    handleSubmit(result) {
      this.form.validateFields((err, values) => !err && this.showInfo(result))
    },
    showNotification() {
      this.$notification.open({
        message: (this.modal.action === 'update') ? this.$t('notification.leave-balance.updated') : this.$t('notification.leave-balance.added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo() {
      this.$confirm({
        title: this.$t('save.confirm'),
        okText: 'Yes',
        cancelText: 'No',
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          const data = { ...((this.modal.action === 'update') ? { employeeId: this.modal.data.id } : {}) }
          this.leave.cols.forEach((item) => {
            data.employeeLeaveBalances = [
              ...((data?.employeeLeaveBalances) ? data.employeeLeaveBalances : []),
              {
                leaveBalanceId: item,
                balance: Number(this.form.getFieldValue(`${item}/0`)),
                forfeited: Number(this.form.getFieldValue(`${item}/1`)),
                entitledDays: Number(this.form.getFieldValue(`${item}/2`))
              }
            ]
          })
          // console.log(data)
          try {
            await this.$store.dispatch(`api/main/hr/leaveBalance/${this.modal.action}`, data)
            this.showNotification()
            this.closeModal()
            this.mainParent.refreshTable()
          } catch (error) {
            this.$message.error(error.response.data.message)
          }
        },
        onCancel: () => {
          // console.log('Cancel')
        }
      })
    }
  },
  created () {
    // this.fields.forEach(v => this.form.getFieldDecorator(v))
  }
}
</script>

<style>
.checkboxForm .ant-form-item-control{
  width: 150px;
}

.ant-modal-body {
  padding: 24px 54px;
}

.details-holder .ant-col {
  display: flex;
}

.details-holder .label {
  display: inline-block;
  min-width: 150px;
}

.details-holder .value {
  display: inline-block;
  overflow: hidden;
}

.custom-form .ant-form-item {
  margin: 0;
}

/* .custom-form .ant-form-explain {
  display: none;
} */
</style>
