<template>
  <div>
    <a-modal
      :title="modalTitle"
      v-model="modal.show"
      :width="700"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      :maskClosable="false"
      @cancel="closeModal()"
    >
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }">
        <a-form-item :label="$t('table.column.title')">
          <a-input
            :disabled="isModalView"
            :maxLength="25"
            v-decorator="[
              'title',
              {
                rules: [{ required: true, message: $t('error.type-name.required') }]
              }
            ]"
          />
        </a-form-item>
        <a-form-item :label="$t('table.column.descriptions')">
          <a-textarea
            :autoSize="{ minRows: 3, maxRows: 6 }"
            :maxLength="100"
            :disabled="isModalView"
            v-decorator="[
              'descriptions',
              {
                rules: [{ required: true, message: $t('error.descriptions.required') }]
              }
            ]"
          />
        </a-form-item>
        <a-form-item :label="$t('table.dialog.attachment') + ' (optional)'">
          <a-upload
            :file-list="fileList"
            :disabled="isModalView"
            v-decorator="[
              'attachments',
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
            <a-button icon="upload">Upload</a-button>
          </a-upload>
        </a-form-item>
        <div style="display: flex; align-items: center; justify-content: right; padding-right: 20px">
          <a-form-item>
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
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { i18nRender } from '@/locales'
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'ModalSetupCompanyLibrary',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      fileList: [],
      fields: ['title', 'descriptions']
    }
  },
  watch: {
    async modal(params) {
      if (params.show) {
        this.loading = true
        const data = await this.$store.dispatch('api/setup/company/calendarMasterList/fetchActiveList')
        this.dataSource = data.data
        this.loading = false
      }
      if (params.show && params.action !== 'add' && params?.data) {
        this.fields.forEach((v) => this.form.getFieldDecorator(v))
        const { title, descriptions, attachments } = params.data
        this.form.setFieldsValue({
          title,
          descriptions
        })
        this.fileList = attachments.map((item) => ({
          uid: item.id,
          name: item.fileOriginName || String(item).slice(item.lastIndexOf('/') + 1, item.lastIndexOf('?')),
          fileLink: item.fileLink
        }))
      }
    }
  },
  computed: {
    isModalView() {
      return this.modal?.action === 'view'
    },
    mainParent() {
      return this.getParent('SetupCompanyLibrary')
    },
    modalTitle() {
      return this.modal?.action === 'view'
        ? this.$t('table.dialog.view-library')
        : this.modal?.action === 'edit'
        ? this.$t('table.dialog.edit-library')
        : this.$t('table.dialog.add-library')
    }
  },
  methods: {
    validateFile(rule, value, callback) {
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
      this.form.resetFields()
      this.fileList = []
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleSubmit() {
      if (this.attachments != null && this.attachments?.length > 5) {
        this.$notification.open({
          message: this.$t('error.5attachments'),
          icon: <a-icon type="close-circle" theme="twoTone" two-tone-color="#ff0000" />
        })
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) this.form.validateFields((err, values) => !err && this.showInfo())
      })
    },
    showNotification() {
      this.$notification.open({
        message:
          this.modal.action === 'edit'
            ? this.$t('notification.library.updated')
            : this.$t('notification.library.added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo() {
      this.$confirm({
        title: i18nRender('table.dialog.confirm-msg'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          const formData = new FormData()
          const previousAttachmentLinks = this.fileList.filter((item) => item?.fileLink).map((item) => item?.fileLink)
          const data = {
            ...(this.modal.action === 'edit' ? { id: this.modal.data.id } : {}),
            title: this.form.getFieldValue('title'),
            descriptions: this.form.getFieldValue('descriptions'),
            ...(previousAttachmentLinks.length > 0 ? { previousAttachmentLinks } : {})
          }
          formData.append(
            this.modal.action === 'edit' ? 'companyLibraryUpdateParam' : 'companyLibraryAddParam',
            new Blob([JSON.stringify(data)], { type: 'application/json' })
          )
          this.fileList.forEach((item) => {
            if (!item?.fileLink) {
              formData.append(`attachments`, item)
            }
          })
          try {
            await this.$store.dispatch(
              `api/setup/company/library/${this.modal.action === 'edit' ? 'update' : 'add'}`,
              formData
            )
            this.showNotification()
            this.closeModal()
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
          this.$emit('refreshTable')
        }
      })
    }
  }
}
</script>
