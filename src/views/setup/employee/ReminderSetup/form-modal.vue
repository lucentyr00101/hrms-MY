<template>
  <a-modal
    :title="!model?.id ? $t('table.dialog.add-reminder') : $t('table.dialog.edit-reminder')"
    :width="500"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :okText="$t('table.dialog.confirm')"
  >
    <a-form :form="form" style="padding: 5px">
      <a-form-item
        :label="$t('table.column.reminder-name')"
        labelAlign="left"
        style="display: flex; flex-direction: column"
      >
        <a-input
          style="width: 100%"
          :maxLength="25"
          v-decorator="['reminderName', { rules: [{ required: true, message: $t('error.reminder-name.required') }] }]"
        />
      </a-form-item>
      <a-form-item
        :label="$t('table.column.reminder-message')"
        labelAlign="left"
        style="display: flex; flex-direction: column"
        has-feedback
      >
        <a-textarea
          :maxLength="100"
          :placeholder="$t('example')"
          v-decorator="['reminderMessage', { rules: [{ required: true, message: $t('error.reminder-message.required') }] }]"
        />
      </a-form-item>
      <p :style="{ margin: '-24px 0px 24px 0px', textAlign: 'right' }">{{ form.getFieldValue('reminderMessage')?.length || 0 }} / 100</p>
      <a-form-item :label="$t('table.column.on-off')" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }">
        <a-switch
          :checked="model?.status === 'Enable' ? true : false"
          v-decorator="['status']"
          @change="(e) => handleStatusChange(e)"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'
import pick from 'lodash.pick'

const fields = ['reminderName', 'reminderMessage', 'status']

export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this)
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
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  methods: {
    view() {
      this.visible = true
    },
    handleStatusChange(checked) {
      this.model.status = checked ? 'Enable' : 'Disable'
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
          try {
            const data = {
              reminderName: this.form.getFieldValue('reminderName'),
              reminderMessage: this.form.getFieldValue('reminderMessage'),
              status: this.form.getFieldValue('status') ? 'Enable' : 'Disable'
            }
            const res = !this.model.id
              ? await this.$store.dispatch('api/setup/employee/reminderSetup/add', data)
              : await this.$store.dispatch('api/setup/employee/reminderSetup/update', { id: this.model.id, ...data })
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
