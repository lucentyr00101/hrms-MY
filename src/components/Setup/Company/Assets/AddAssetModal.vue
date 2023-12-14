<template>
  <a-modal
    centered
    :okText="$t('table.dialog.confirm')"
    :cancelButtonProps="{ style: 'display: none;' }"
    :visible="addAssetModal"
    :destroyOnClose="true"
    :title="currentRow ? $t('table.dialog.edit-type') : $t('table.dialog.add-assets')"
    :confirm-loading="loading"
    @ok="showConfirm()"
    @cancel="closeModal"
  >
    <a-form :form="form" layout="horizontal" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
      <a-form-item :label="$t('table.column.assets-type')">
        <a-input
          :maxLength="25"
          v-decorator="[
            'assetType',
            {
              rules: [{ required: true, message: $t('error.assets-type.required') }],
              initialValue: currentRow && currentRow.typeName,
            },
          ]"
        />
      </a-form-item>
      <a-form-item :label="$t('table.column.assets-name')">
        <a-input
          :maxLength="25"
          v-decorator="[
            'assetName',
            {
              rules: [{ required: true, message: $t('error.assets-name.required') }],
              initialValue: currentRow && currentRow.code,
            },
          ]"
        />
      </a-form-item>
      <a-form-item :label="$t('table.column.serial-number')">
        <a-input
          :maxLength="25"
          v-decorator="[
            'serialNumber',
            {
              rules: [{ required: true, message: $t('error.serial-number.required') }],
              initialValue: currentRow && currentRow.code,
            },
          ]"
        />
      </a-form-item>
      <a-form-item :label="$t('table.column.value')">
        <a-input
          @change="onChange"
          :maxLength="10"
          style="width: 100%;"
          v-decorator="[
            'value',
            {
              rules: [
                { required: true, message: $t('error.value.required')}, {validator: validate}
              ],
              initialValue: currentRow && currentRow.sort
            }
          ]"
        />
      </a-form-item>
      <a-form-item :label="$t('table.column.remark')">
        <a-textarea
          :autoSize="{ minRows: 3, maxRows: 6 }"
          :maxLength="100"
          v-decorator="['remarks', { initialValue: currentRow && currentRow.remarks }]"
        />
      </a-form-item>
      <a-form-item :label="$t('table.dialog.attachment')">
        <a-upload
          name="file"
          accept="image/*"
          @change="handleChange"
          v-decorator="['attachments']"
          :beforeUpload="() => false"
        >
          <a-button> <a-icon type="upload" /> {{ $t('table.dialog.click-to-upload') }} </a-button>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { i18nRender } from '@/locales'
import { mapGetters } from 'vuex'
import { noWhitespaceAllowed } from '@/utils/validators'
import InfoCircle from '@/assets/info-circle.svg'

export default {
  props: {
    currentRow: {
      type: Object,
      default: () => null
    }
  },
  watch: {
    currentRow (val) {
      console.log('val', val)
    }
  },
  data () {
    return {
      result: '',
      value: '',
      image: null,
      loading: false,
      form: this.$form.createForm(this, { name: 'addDictType' }),
      attachments: [],
      error1: true,
      error2: true
    }
  },
  computed: {
    ...mapGetters('modal', ['addAssetModal'])
  },
  methods: {
    closeModal () {
      this.$store.commit('modal/TOGGLE_ADD_ASSET_MODAL')
      this.$emit('closeModal')
    },
    handleChange(info) {
      this.attachments = info.fileList
    },
    onChange (e) {
      const { id, value } = e.target
      this.result = value.replace(/[^0-9.]/gi, '')
      e.target.value = this.result
      console.log(id)
    },
    validate (rule, value, callback) {
      const regex = /^\d*\.?\d*$/
      const regexDp = /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/

      if (value && !regex.test(value)) {
        callback(new Error(this.$t('error.nan')))
      } else {
        if (value && !regexDp.test(value)) {
          callback(new Error(this.$t('error.2dp')))
        } else {
          callback()
        }
      }
    },
    noWhitespaceAllowed,
    showConfirm (result) {
      this.form.validateFields((err) => {
        if (err) {
          this.error1 = true
        } else {
          this.error1 = false
        }
      })
      if (this.attachments.length > 10) {
        this.error2 = true
        this.$notification.open({
          message: i18nRender('error.10images'),
          icon: <a-icon type="close-circle" theme="twoTone" two-tone-color="#ff0000" />
        })
      } else {
        this.error2 = false
      }
      // if both validation has no error
      if (!this.error1 && !this.error2) {
        this.$confirm({
          centered: true,
          title: i18nRender('save.confirm'),
          okText: i18nRender('table.dialog.yes'),
          cancelText: i18nRender('table.dialog.no'),
          onOk: () => this.handleSubmit(result),
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />
        })
      }
    },
    async handleSubmit () {
      try {
        this.loading = true
        const data = {
          assetType: this.form.getFieldValue('assetType'),
          assetName: this.form.getFieldValue('assetName'),
          serialNumber: this.form.getFieldValue('serialNumber'),
          status: 'Available',
          value: this.form.getFieldValue('value'),
          remarks: this.form.getFieldValue('remarks')
        }
        const blob = new Blob([JSON.stringify(data)], {
          type: 'application/json'
        })
        const formData = new FormData()
        formData.append('companyAssetAddParam', blob)
        this.attachments.forEach(r =>
        formData.append('attachments', r.originFileObj)
        )
        try {
          await this.$store.dispatch('api/setup/company/assetSetup/add', formData)
          this.$notification.open({
            message: i18nRender('notification.assets.added'),
            icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
          })
          this.closeModal()
          this.$emit('refreshTable')
        } catch (e) {
          this.$message.error(e.response.data.message)
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
