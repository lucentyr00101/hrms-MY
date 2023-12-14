<template>
  <a-form :form="form" :label-col="{ span: 7 }" :wrapper-col="{ span: 15 }" @submit="handleSubmit">
    <a-form-item :label="`${$t('table.column.title')}: `">
      <a-input
        v-decorator="[
          'title',
          {
            rules: [{ required: true, message: $t('error.title.required') }]
          }
        ]"
        :maxLength="25"
        style="width: 100%"
        :disabled="modal?.action === 'view'"
      />
    </a-form-item>

    <a-form-item :label="`${$t('table.column.content')}: `" :style="{ margin: 0 }">
      <a-input
        v-decorator="[
          'content',
          {
            rules: [{ required: true, message: $t('error.content.required') }]
          }
        ]"
        type="textarea"
        :maxLength="100"
        style="width: 100%"
        :disabled="modal?.action === 'view'"
      />
    </a-form-item>
    <p :style="{ margin: '0 55px 24px 0', textAlign: 'right' }">
      {{ form.getFieldValue('content')?.length || 0 }} / 100
    </p>

    <a-form-item :label="`${$t('table.column.attached')} ${$t('table.dialog.optional2')}: `">
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
        <a-button icon="upload">{{ $t('table.dialog.upload') }}</a-button>
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
import { i18nRender } from '@/locales'

export default {
  name: 'SetupCompanyAnnouncementForm',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      fileList: [],
      fields: ['title', 'content', 'attached']
    }
  },
  computed: {
    mainParent() {
      return this.getParent('SetupCompanyAnnouncement')
    }
  },
  watch: {
    modal: {
      deep: true,
      handler(to) {
        if (to.show) {
          this.applyFormData()
        } else {
          this.closeModal()
        }
      }
    }
  },
  methods: {
    initiate() {
      this.applyFormData()
    },
    applyFormData() {
      if (/view|update/gi.test(this?.modal?.action) && this?.modal?.data) {
        const { title, content, attachments } = this?.modal?.data || {}
        this.form.setFieldsValue({ title, content })
        this.fileList = attachments.map((item) => ({
          uid: item.id,
          name: item.fileOriginName || String(item).slice(item.lastIndexOf('/') + 1, item.lastIndexOf('?')),
          fileLink: item.fileLink
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
            ? this.$t('notification.announcement.updated')
            : this.$t('notification.announcement.added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo() {
      this.$confirm({
        title: this.$t('save.confirm'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          const data = new FormData()
          const previousAttachmentLinks = this.fileList.filter((item) => item?.fileLink).map((item) => item?.fileLink)
          const companyAnnouncementParam = {
            ...(this.modal.action === 'update' ? { id: this.modal.data.id } : {}),
            title: this.form.getFieldValue('title'),
            content: this.form.getFieldValue('content'),
            ...(previousAttachmentLinks.length > 0 ? { previousAttachmentLinks } : {})
          }
          data.append(
            this.modal.action === 'update' ? 'companyAnnouncementUpdateParam' : 'companyAnnouncementAddParam',
            new Blob([JSON.stringify(companyAnnouncementParam)], { type: 'application/json' })
          )
          this.fileList.forEach((item) => {
            if (!item?.fileLink) {
              data.append(`attachments`, item)
            }
          })
          // FormData
          // const formData = {}
          // for (const key of data.keys()) {
          //     // console.log(`${key}:`, data.get(key))
          //     formData[key] = data.get(key)
          // }
          // console.log(formData)
          try {
            await this.$store.dispatch(`api/setup/company/announcement/${this.modal.action}`, data)
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
