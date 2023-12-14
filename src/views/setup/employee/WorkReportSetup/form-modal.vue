<template>
  <div>
    <a-modal
      :title="modalTitle"
      :width="800"
      v-model="modal.show"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      @cancel="closeModal()"
    >
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
        <a-form-item :label="`${$t('table.column.work-report-type')}: `">
          <a-input
            :maxLength="25"
            v-decorator="[
              'workReportType',
              {
                rules: [{ required: true, message: $t('error.work-report-type.required') }]
              }
            ]"
            :disabled="modal?.action === 'view'"
          />
        </a-form-item>
        <a-form-item :label="`${$t('table.column.descriptions')}: `">
          <a-input
            type="textarea"
            mode="tags"
            :maxLength="100"
            style="width: 100%"
            :disabled="modal?.action === 'view'"
            v-decorator="['descriptions']"
          />
        </a-form-item>
        <a-form-item :label="`${$t('table.column.compulsory')}?: `">
          <a-switch v-model="compulsory" :default-checked="modal?.action === 'add'" @change="(e) => handleStatus(e)" />
          <p style="line-height: 1.2rem; margin: 0; color: grey">Employees will be required to submit their report before they are able to update their work status.</p>
        </a-form-item>
        <a-form-item :label="`${$t('table.column.department')}: `">
          <a-select
            v-decorator="['department', { rules: [{ required: true, message: $t('error.department.required') }] }]"
            :options="departmentList"
            placeholder="Select"
            :disabled="modal?.action === 'view'"
          />
        </a-form-item>

        <a-form-item :label="`${$t('table.column.trigger')}: `">
          <a-select
            v-decorator="['trigger', { rules: [{ required: compulsory, message: $t('error.trigger.required') }] }]"
            :options="triggerList.map((item) => ({ label: item, value: item }))"
            placeholder="Select"
            :disabled="modal?.action === 'view'"
          />
          <p style="line-height: 1.2rem; margin: 0; color: grey">Select when to apply this condition. ie, if During Time Out, employees are required to submit their daily report before they are able to Time Out.</p>
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 12, offset: 17 }" :style="{ margin: '20px 0 0 0' }">
          <a-button
            v-if="modal?.action === 'view'"
            class="confirm-btn"
            type="primary"
            @click="mainParent?.modalHandler({ ...modal, action: 'edit' })"
            >{{ $t('table.dialog.edit') }}</a-button
          >
          <a-button
            v-else-if="/add|edit/gi.test(modal?.action)"
            class="confirm-btn"
            type="primary"
            @click="handleSubmit()"
            >{{ $t('table.dialog.confirm') }}</a-button
          >
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'AllowanceModal',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      compulsory: true,
      form: this.$form.createForm(this),
      fields: ['workReportType', 'descriptions', 'department', 'trigger'],
      departmentList: [],
      triggerList: ['Time In', 'Time Out', 'Start Break', 'End Break', 'All']
    }
  },
  computed: {
    mainParent() {
      return this.getParent('SetupEmployeeWorkReportSetup')
    },
    modalTitle() {
      return this.modal?.action === 'edit'
        ? this.$t('table.dialog.edit-work-report-type')
        : this.$t('table.dialog.add-work-report-type')
    }
  },
  watch: {
    modal(to) {
      if (to.show) {
        this.getDepartmentList()
        if (/view|edit/gi.test(to.action) && to?.data) {
          this.fields.forEach((v) => this.form.getFieldDecorator(v))
          const { workReportType, descriptions, compulsory, department, trigger } = to.data
          this.compulsory = compulsory
          this.form.setFieldsValue({ workReportType, descriptions, department, trigger })
        }
      }
    }
  },
  methods: {
    handleStatus(status) {
      this.compulsory = status
    },
    async getDepartmentList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchDepartmentDropdown')
        this.departmentList = list?.data?.parentTree.map((item) => ({ value: item.name || item.id, label: item.name }))
      } catch (error) {
        throw error
      }
    },
    closeModal() {
      this.compulsory = true
      this.form.resetFields()
    },
    handleSubmit(result) {
      this.form.validateFields((err, values) => !err && this.showInfo(result))
    },
    showNotification() {
      this.$notification.open({
        message:
          this.modal.action === 'edit'
            ? this.$t('notification.work-report-type.updated')
            : this.$t('notification.work-report-type.added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo() {
      this.$confirm({
        title: this.$t('table.dialog.confirm-msg'),
        okText: 'Yes',
        cancelText: 'No',
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          const data = {
            ...(this.modal.action === 'edit' ? { id: this.modal.data.id } : {}),
            workReportType: this.form.getFieldValue('workReportType'),
            descriptions: this.form.getFieldValue('descriptions'),
            compulsory: this.compulsory,
            department: this.form.getFieldValue('department'),
            trigger: this.form.getFieldValue('trigger')
          }
          try {
            await this.$store.dispatch(
              `api/setup/employee/workReportSetup/${this.modal.action === 'edit' ? 'update' : 'add'}`,
              data
            )
            this.showNotification()
            this.closeModal()
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
          this.$emit('refreshTable')
        },
        onCancel: () => {}
      })
    }
  }
}
</script>
