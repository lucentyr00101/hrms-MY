<template>
  <a-modal
    :title="modalTitle"
    v-model="modal.show"
    :width="700"
    :cancelButtonProps="{ style: { display: 'none' } }"
    :okButtonProps="{ style: { display: 'none' } }"
    :maskClosable="false"
    @cancel="closeModal()"
  >
    <a-form :form="form" layout="horizontal" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
      <a-form-item :label="$t('table.column.assets-type')">
        <a-input
          :disabled="isDisabled"
          :maxLength="25"
          v-decorator="[
            'assetType',
            {
              rules: [{ required: true, message: $t('error.assets-type.required') }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item :label="$t('table.column.assets-name')">
        <a-input
          :disabled="isDisabled"
          :maxLength="25"
          v-decorator="[
            'assetName',
            {
              rules: [{ required: true, message: $t('error.assets-name.required') }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item :label="$t('table.column.serial-number')">
        <a-input
          :disabled="isDisabled"
          :maxLength="25"
          v-decorator="[
            'serialNumber',
            {
              rules: [{ required: true, message: $t('error.serial-number.required') }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item :label="$t('table.column.value')">
        <a-input
          :disabled="isDisabled"
          @change="onChange"
          :maxLength="10"
          style="width: 100%"
          v-decorator="[
            'value',
            {
              rules: [{ required: true, message: $t('error.value.required') }, { validator: validate }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item :label="$t('table.column.remark')">
        <a-textarea
          :disabled="isDisabled"
          :autoSize="{ minRows: 3, maxRows: 6 }"
          :maxLength="100"
          v-decorator="['remarks']"
        />
      </a-form-item>
      <a-form-item :label="$t('table.dialog.attachment')">
        <a-upload
          :file-list="fileList"
          :disabled="isDisabled"
          @change="handleChange"
          v-decorator="['attachments']"
          list-type="picture"
          accept="image/png, image/jpeg, image/jpg"
          :multiple="true"
          :remove="handleRemove"
          :before-upload="beforeUpload"
        >
          <a-button> <a-icon type="upload" /> {{ $t('table.dialog.click-to-upload') }} </a-button>
        </a-upload>
      </a-form-item>
      <div :style="{ display: 'flex', justifyContent: 'flex-end', margin: '20px 25px 0' }">
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
          @click="validateForm"
          >{{ $t('table.dialog.confirm') }}</a-button
        >
      </div>
    </a-form>
  </a-modal>
</template>

<script>
import { i18nRender } from '@/locales'

export default {
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      result: '',
      value: '',
      image: null,
      status: 'Available',
      loading: false,
      form: this.$form.createForm(this),
      fileList: [],
      fields: ['assetType', 'assetName', 'serialNumber', 'value', 'remarks']
    }
  },
  watch: {
    modal(to) {
      if (to.show) {
        if (/view|edit/gi.test(to.action) && to?.data) {
          this.fields.forEach((v) => this.form.getFieldDecorator(v))
          const { assetType, assetName, serialNumber, value, remarks, status, attachments } = to.data
          this.status = status
          this.form.setFieldsValue({ assetType, assetName, serialNumber, value, remarks })
          this.fileList = attachments.map((item) => ({
            uid: item.id,
            name: item.fileOriginName || String(item).slice(item.lastIndexOf('/') + 1, item.lastIndexOf('?')),
            fileLink: item.fileLink
          }))
        }
      }
    }
  },
  computed: {
    mainParent() {
      return this.getParent('SetupCompanyAssetsSetup')
    },
    modalTitle() {
      return this.modal?.action === 'view'
        ? this.$t('table.dialog.view-assets')
        : this.modal?.action === 'edit'
        ? this.$t('table.dialog.edit-assets')
        : this.$t('table.dialog.add-assets')
    },
    isDisabled() {
      return this.modal?.action === 'view'
    }
  },
  methods: {
    closeModal() {
      this.fileList = []
      this.status = 'Available'
      this.form.resetFields()
    },
    handleChange(info) {
      this.attachments = info.attachments
    },
    onChange(e) {
      const { value } = e.target
      this.result = value.replace(/[^0-9.]/gi, '')
      e.target.value = this.result
    },
    validate(rule, value, callback) {
      const regex = /^\d*\.?\d*$/
      const regexDp = /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/

      if (value && !regex.test(value)) {
        callback(new Error(this.$t('error.nan')))
      } else {
        if (value && !regexDp.test(value)) {
          callback(new Error(this.$t('error.2dp')))
        } else if (value > 9999999.99) {
          callback(new Error(this.$t('error.upto10char')))
        } else {
          callback()
        }
      }
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
    validateForm() {
      this.form.validateFields((err, values) => !err && this.handleSubmit())
    },
    async handleSubmit() {
      this.$confirm({
        title: () => (
          <div class="confirm-modal-title">
            <div>
              <img src="/icons/info-dialog.svg" style="margin-right:10px" />
              <span>Are you sure you want to confirm this?</span>
            </div>
          </div>
        ),
        okText: 'Yes',
        cancelText: 'No',
        icon: 'none',
        onOk: async () => {
          try {
            this.loading = true
            const formData = new FormData()
            const previousAttachmentLinks = this.fileList.filter((item) => item?.fileLink).map((item) => item?.fileLink)
            const data = {
              ...(this.modal.action === 'edit' ? { id: this.modal.data.id } : {}),
              assetType: this.form.getFieldValue('assetType'),
              assetName: this.form.getFieldValue('assetName'),
              serialNumber: this.form.getFieldValue('serialNumber'),
              status: this.status || 'Available',
              value: this.form.getFieldValue('value'),
              remarks: this.form.getFieldValue('remarks'),
              ...(previousAttachmentLinks.length > 0 ? { previousAttachmentLinks } : {})
            }
            formData.append(
              this.modal.action === 'edit' ? 'companyAssetUpdateParam' : 'companyAssetAddParam',
              new Blob([JSON.stringify(data)], { type: 'application/json' })
            )
            this.fileList.forEach((item) => {
              if (!item?.fileLink) {
                formData.append(`attachments`, item)
              }
            })
            try {
              await this.$store.dispatch(
                `api/setup/company/assetSetup/${this.modal.action === 'edit' ? 'update' : 'add'}`,
                formData
              )
              this.$notification.open({
                message:
                  this.modal.action === 'edit'
                    ? i18nRender('notification.assets.updated')
                    : i18nRender('notification.assets.added'),
                icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
              })
              this.closeModal()
              this.$emit('refreshTable')
            } catch (e) {
              this.$message.error(e.response.data.message)
            }
          } finally {
            this.loading = false
          }
        }
      })
    }
  }
}
</script>
