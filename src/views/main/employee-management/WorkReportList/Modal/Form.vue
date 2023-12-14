<template>
  <a-form :form="form" :label-col="{ span: 7 }" :wrapper-col="{ span: 15 }" @submit="handleSubmit">
    <a-form-item :label="`${$t('table.column.employee')}: `">
      <a-select
        v-decorator="[
          'employee',
          {
            rules: [{ required: true, message: $t('error.employee.required') }]
          }
        ]"
        :options="mainParent.employeeList"
        show-search
        placeholder="Select"
        :disabled="modal?.action === 'view'"
      />
    </a-form-item>

    <a-form-item :label="`${$t('table.column.report-type')}: `">
      <a-select
        v-decorator="[
          'reportType',
          {
            rules: [{ required: true, message: $t('error.report-type.required') }]
          }
        ]"
        :options="mainParent.reportTypeList"
        placeholder="Select"
        :disabled="modal?.action === 'view'"
      />
    </a-form-item>

    <a-form-item :label="`${$t('table.column.contents')}: `" :style="{ margin: 0 }">
      <a-input
        v-decorator="[
          'contents',
          {
            rules: [{ required: true, message: $t('error.contents.required') }]
          }
        ]"
        type="textarea"
        :maxLength="100"
        style="width: 100%"
        placeholder="Autoheight based on content lines="
        :disabled="modal?.action === 'view'"
      />
    </a-form-item>
    <p :style="{ margin: '0 55px 24px 0', textAlign: 'right' }">
      {{ form.getFieldValue('contents')?.length || 0 }} / 100
    </p>

    <a-form-item :label="`${$t('table.column.attached')} (optional): `">
      <a-upload
        :file-list="fileList"
        v-decorator="[
          'attached',
          {
            rules: [
              // { required: true, message: $t('error.attached.required') },
              { validator: validateFile }
            ]
          }
        ]"
        :multiple="true"
        list-type="picture"
        accept="image/png, image/jpeg, image/jpg"
        :remove="handleRemove"
        :before-upload="beforeUpload"
      >
        <a-button icon="upload">{{ $t('table.dialog.click-to-upload') }}</a-button>
      </a-upload>
    </a-form-item>

    <div :style="{ display: 'flex', justifyContent: 'flex-end', margin: '20px 50px 0' }">
      <!-- <a-button :style="{ marginRight: '20px' }" @click="closeModal">{{ $t('table.dialog.cancel') }}</a-button> -->
      <a-button
        v-if="modal?.action === 'view'"
        class="confirm-btn"
        type="primary"
        @click="mainParent?.modalHandler({ ...modal, action: 'update' })"
        >{{ $t('table.dialog.edit') }}</a-button
      >
      <a-button
        v-else-if="/add|update/gi.test(modal?.action)"
        class="confirm-btn"
        type="primary"
        @click="handleSubmit"
        >{{ $t('table.dialog.confirm') }}</a-button
      >
    </div>
  </a-form>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'MainEmployeeMngWorkReportListForm',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      fileList: [],
      fields: ['employee', 'reportType', 'contents', 'attached']
    }
  },
  computed: {
    mainParent() {
      return this.getParent('MainEmployeeMngWorkReportList')
    }
  },
  watch: {
    modal: {
      deep: true,
      handler(to) {
        if (to.show) {
          this.initiate()
        } else {
          this.closeModal()
        }
      }
    }
  },
  methods: {
    initiate() {
      this.mainParent.getEmployeeList()
      this.mainParent.getReportTypeList()
      this.applyFormData()
    },
    applyFormData() {
      if (/view|update/gi.test(this?.modal?.action) && this?.modal?.data) {
        const { employee, reportType, contents, attachments } = this?.modal?.data || {}
        this.form.setFieldsValue({ employee, reportType, contents })
        this.fileList = attachments.map((item) => ({
          uid: item.id,
          name: item.fileOriginName || String(item).slice(item.lastIndexOf('/') + 1, item.lastIndexOf('?')),
          url: item.fileLink
        }))
      }
    },
    validateFile(rule, value, callback) {
      // if (this.fileList.length === 0) {
      //   callback(new Error(this.$t('error.attached.required')))
      //   return false
      // }
      if (this.fileList.length > 5) {
        callback(new Error(this.$t('error.up-to-5-files-attached-only.required')))
        return false
      }
      callback()
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList.length > 0 ? newFileList : []
    },
    beforeUpload(file) {
      const isFileExist = Boolean((this.fileList || []).find((item) => item.name === file.name))
      this.fileList = [...(this.fileList || []), ...(!isFileExist ? [file] : [])]
      return false
    },
    closeModal() {
      this.$store.commit('modal/TOGGLE_ALLOWANCE_MODAL')
      this.form.resetFields()
      this.fileList = []
    },
    handleSubmit(result) {
      this.form.validateFields((err, values) => !err && this.showInfo(result))
    },
    showNotification() {
      this.$notification.open({
        message:
          this.modal.action === 'update'
            ? this.$t('notification.work-report-list.updated')
            : this.$t('notification.work-report-list.added'),
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
          const data = new FormData()
          const employeeManagementWorkReportAddParam = {
            employeeId: String(this.form.getFieldValue('employee')).split('/')[0],
            workReportId: String(this.form.getFieldValue('reportType')).split('/')[0],
            contents: this.form.getFieldValue('contents')
          }
          data.append(
            'employeeManagementWorkReportAddParam',
            new Blob([JSON.stringify(employeeManagementWorkReportAddParam)], { type: 'application/json' })
          )
          this.fileList.forEach((item) => {
            data.append(`attachments`, item)
          })
          // FormData
          // const formData = {}
          // for (const key of data.keys()) {
          //     // console.log(`${key}:`, data.get(key))
          //     formData[key] = data.get(key)
          // }
          // console.log(formData)
          try {
            await this.$store.dispatch(`api/main/employeeManagement/workReportList/${this.modal.action}`, data)
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
  created() {
    this.fields.forEach((v) => this.form.getFieldDecorator(v))
    this.initiate()
  }
}
</script>

<style>
.checkboxForm .ant-form-item-control {
  width: 150px;
}

.ant-upload-list-item-name {
  width: 90%;
}
</style>
