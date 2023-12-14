<template>
  <div>
    <a-modal
      :title="!model?.id ? $t('table.dialog.add-reminder') : $t('table.dialog.edit-reminder')"
      :width="600"
      :visible="visible"
      @cancel="handleCancel"
      :cancelButtonProps="{ style: { display: 'none' } }"
    >
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item :label="$t('table.dialog.select-reminder')">
          <a-select
            show-search
            placeholder="Select"
            :options="mainParent?.dropdown.map((item) => ({ value: item.id, label: item.label }))"
            v-decorator="[
              'reminderId',
              {
                rules: [{ required: true, message: $t('error.reminder.required') }]
              }
            ]"
          >
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('table.dialog.select-days')">
          <a-select
            mode="multiple"
            style="width: 100%"
            placeholder="Select"
            @change="handleDaysTimeFreqChange"
            v-decorator="[
              'daysArray',
              {
                rules: [
                  { required: checkTrigger ? false : true, message: $t('error.days.required') },
                  { validator: validateDays }
                ]
              }
            ]"
            :disabled="checkTrigger ? true : false"
          >
            <a-select-option v-for="(workDay, index) in workDays" :key="index" :value="workDay">{{
              workDay
            }}</a-select-option>
          </a-select>
          <p style="line-height: 1.2rem; margin: 0; color: grey">{{ $t('main-reminder.choose-which-day') }}</p>
        </a-form-item>
        <a-form-item :label="$t('table.dialog.select-time')">
          <a-time-picker
            :open.sync="open"
            placeholder="Select"
            style="width: 100%"
            @change="handleDaysTimeFreqChange"
            v-decorator="[
              'time',
              {
                rules: [{ required: checkTrigger ? false : true, message: $t('error.time.required') }]
              }
            ]"
            :disabled="checkTrigger ? true : false"
          >
            <a-button slot="addon" size="small" type="primary" @click="handleClose"> {{ $t('ok') }} </a-button>
          </a-time-picker>
          <p style="line-height: 1.2rem; margin: 0; color: grey">{{ $t('main-reminder.choose-time-reminder') }}</p>
        </a-form-item>
        <a-form-item :label="$t('table.dialog.select-frequency')">
          <a-select
            show-search
            placeholder="Select"
            @change="handleDaysTimeFreqChange"
            v-decorator="[
              'frequency',
              {
                rules: [{ required: checkTrigger ? false : true, message: $t('error.frequency.required') }]
              }
            ]"
            :disabled="checkTrigger ? true : false"
          >
            <a-select-option v-for="(fre, index) in frequency" :key="index" :value="fre">{{ fre }}</a-select-option>
          </a-select>
          <p style="line-height: 1.2rem; margin: 0; color: grey">
            {{ $t('main-reminder.choose-frequency') }}
          </p>
        </a-form-item>
        <a-form-item :label="$t('table.column.trigger')">
          <a-select
            show-search
            placeholder="Select"
            @change="handleTriggerChange"
            v-decorator="[
              'trigger',
              {
                rules: [{ required: checkDaysTimeFreq ? false : true, message: $t('error.trigger.required') }]
              }
            ]"
            :disabled="checkDaysTimeFreq ? true : false"
          >
            <a-select-option v-for="(tri, index) in trigger" :key="index" :value="tri">{{ tri }}</a-select-option>
          </a-select>
          <p style="line-height: 1.2rem; margin: 0; color: grey">{{ $t('main-reminder.action-reminder') }}</p>
        </a-form-item>
        <a-form-item :label="$t('table.column.on-off')">
          <a-switch
            :checked="model?.status === 'Enable' ? true : false"
            v-decorator="['status']"
            @change="(e) => handleStatusChange(e)"
          />
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button v-if="!model?.id" @click="handleReset">{{ $t('table.dialog.reset') }}</a-button>
        <a-button type="primary" @click="handleSubmit">{{ $t('table.dialog.confirm') }}</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'
import pick from 'lodash.pick'
import moment from 'moment'

const fields = ['reminderId', 'daysArray', 'time', 'frequency', 'trigger', 'status']

export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      frequency: ['Daily', 'Weekly', 'Monthly'],
      trigger: ['Time In', 'Time Out', 'Start Break'],
      open: false,
      checkDaysTimeFreq: null,
      checkTrigger: null
    }
  },
  computed: {
    mainParent() {
      return this.getParent('MainEmployeeMgmtReminder')
    }
  },
  props: {
    model: {
      type: Object,
      default: () => null
    }
  },
  created() {
    fields.forEach((v) => this.form.getFieldDecorator(v))
    this.$watch('model', () => {
      console.log(this.model)
      this.model && this.form.setFieldsValue(pick(this.model, fields))
      this.checkDaysTimeFreq = Object.keys(this.model).length !== 0 ? (this.model?.trigger ? null : true) : null
      console.log(this.checkDaysTimeFreq)
      this.checkTrigger = this.model?.trigger
      this.form.setFieldsValue({
        reminderId: this.model?.employeeSetupReminder?.id,
        time: this.model?.time ? moment(this.model?.time, 'HH:mm:ss') : null
      })
    })
  },
  methods: {
    view() {
      this.visible = true
    },
    validateDays(rule, value, callback) {
      var frequency = this.form.getFieldValue('frequency')
      var days = this.form.getFieldValue('daysArray')?.length
      if (!value) {
        return callback()
      }
      if (frequency === 'Weekly' || frequency === 'Monthly') {
        if (days > 1) {
          callback(new Error(this.$t('error.days.match')))
        }
      }
      callback()
    },
    handleStatusChange(checked) {
      this.model.status = checked ? 'Enable' : 'Disable'
    },
    handleDaysTimeFreqChange() {
      this.checkDaysTimeFreq = true
      this.$nextTick(() => {
        this.form.validateFields(['trigger'], { force: true })
      })
    },
    handleTriggerChange() {
      this.checkTrigger = true
      this.$nextTick(() => {
        this.form.validateFields(['daysArray', 'time', 'frequency'], { force: true })
      })
    },
    handleOpenChange(open) {
      this.open = open
    },
    handleClose() {
      this.open = false
    },
    handleReset() {
      this.checkDaysTimeFreq = false
      this.checkTrigger = false
      this.form.resetFields()
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        !errors && this.showInfo()
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.visible = false
      this.checkDaysTimeFreq = null
      this.checkTrigger = null
    },
    showNotification(message) {
      this.$notification.open({
        message,
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    closeModal() {
      this.visible = false
      this.form.resetFields()
    },
    showInfo() {
      this.$confirm({
        title: this.$t('table.dialog.confirm-msg'),
        okText: this.$t('table.dialog.yes'),
        cancelText: this.$t('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          console.log(this.form.getFieldValue('time'))
          try {
            const data = {
              reminderId: this.form.getFieldValue('reminderId'),
              ...(!this.checkTrigger ? { daysArray: this.form.getFieldValue('daysArray') } : {}),
              ...(!this.checkTrigger ? { time: moment(this.form.getFieldValue('time')).format('HH:mm:ss') } : {}),
              ...(!this.checkTrigger ? { frequency: this.form.getFieldValue('frequency') } : {}),
              ...(!this.checkDaysTimeFreq ? { trigger: this.form.getFieldValue('trigger') } : {}),
              status: this.form.getFieldValue('status') ? 'Enable' : 'Disable'
            }
            const res = !this.model.id
              ? await this.$store.dispatch('api/main/employeeManagement/reminder/add', data)
              : await this.$store.dispatch('api/main/employeeManagement/reminder/update', {
                  id: this.model.id,
                  ...data
                })
            if (res.success) {
              this.closeModal()
              this.$emit('refreshTable')
              !this.model.id
                ? this.showNotification(this.$t('notification.reminder-setup.added'))
                : this.showNotification(this.$t('notification.reminder-setup.updated'))
            }
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
        }
      })
    }
  }
}
</script>
