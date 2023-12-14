<template>
  <a-form :form="form" :label-col="{ span: 7 }" :wrapper-col="{ span: 15 }" @submit="handleSubmit">
    <a-form-item :label="`${$t('table.column.logo-upload')}: `">
      <a-upload
        :file-list="fileList"
        v-decorator="[
          'logoUpload',
          {
            rules: [
              { required: true, message: $t('error.logo.required') }
              // { validator: validateFile }
            ]
          }
        ]"
        list-type="picture"
        accept="image/png, image/jpeg, image/jpg"
        :remove="handleRemove"
        :before-upload="beforeUpload"
      >
        <a-button icon="upload">Click to Upload</a-button>
      </a-upload>
    </a-form-item>

    <a-form-item :label="`${$t('table.column.countries')}: `">
      <a-select
        v-decorator="[
          'countries',
          {
            rules: [
              { required: true, message: $t('error.countries.required') }
            ]
          }
        ]"
        :options="countriesList"
        placeholder="Select"
        show-search
        :disabled="modal?.action === 'view'"
      />
    </a-form-item>

    <a-form-item :label="`${$t('table.column.company-name')}: `">
      <a-input
        v-decorator="[
          'companyName',
          {
            rules: [
              { required: true, message: $t('error.company-name.required') }
            ]
          }
        ]"
        :maxLength="50"
        style="width: 100%"
        placeholder="example"
        :disabled="modal?.action === 'view'"
      />
    </a-form-item>

    <a-form-item :label="`${$t('table.column.remarks')}: `" :style="{ margin: 0 }">
      <a-input
        v-decorator="['remarks']"
        type="textarea"
        :maxLength="100"
        style="width: 100%"
        placeholder="Autoheight based on content lines="
        :disabled="modal?.action === 'view'"
      />
    </a-form-item>
    <p :style="{ margin: '0 55px 24px 0', textAlign: 'right' }">{{ form.getFieldValue('remarks')?.length || 0 }} / 100</p>

    <div :style="{ display: 'flex', justifyContent: 'flex-end', margin: '20px 50px 0' }">
      <!-- <a-button :style="{ marginRight: '20px' }" @click="closeModal">{{ $t('table.dialog.cancel') }}</a-button> -->
      <a-button v-if="modal?.action === 'view'" class="confirm-btn" type="primary" @click="mainParent?.modalHandler({ ...modal, action: 'update' })">{{ $t('table.dialog.edit') }}</a-button>
      <a-button v-else-if="/add|update/ig.test(modal?.action)" class="confirm-btn" type="primary" @click="handleSubmit">{{ $t('table.dialog.confirm') }}</a-button>
    </div>
  </a-form>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'AccountCenterForm',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      fileList: [],
      countriesList: [],
      fields: ['logoUpload', 'countries', 'companyName', 'remarks']
    }
  },
  computed: {
    mainParent() { return this.getParent('AccountCenter') }
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
      this.getCountriesList()
      this.applyFormData()
    },
    applyFormData() {
      if (/view|update/ig.test(this?.modal?.action) && this?.modal?.data) {
        const { logo, country, companyName, remarks } = this?.modal?.data || {}
        const logoUpload = (logo?.id && logo?.fileLink) ? [
          {
            uid: logo.id,
            name: logo.fileOriginName || String(logo).slice((logo.lastIndexOf('/') + 1), logo.lastIndexOf('?')),
            fileLink: logo.fileLink
          }
        ] : []
        this.form.setFieldsValue({ logoUpload, countries: country, companyName, remarks })
        this.fileList = logoUpload
      }
    },
    async getCountriesList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchCountriesDropdown')
        this.countriesList = list?.data?.country.map((item) => ({ value: item.countryName, label: item.countryName }))
      } catch (error) {
        throw error
      }
    },
    // validateFile(rule, value, callback) {
    //   if (this.fileList.length === 0) {
    //     callback(new Error(this.$t('error.logo.required')))
    //     return false
    //   }
    //   if (this.fileList.length > 5) {
    //     callback(new Error(this.$t('error.up-to-5-files-attached-only.required')))
    //     return false
    //   }
    //   callback()
    // },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = ((newFileList.length > 0) ? newFileList : [])
    },
    beforeUpload(file) {
      this.fileList = [ file ]
      // const isFileExist = Boolean((this.fileList || []).find((item) => (item.name === file.name)))
      // this.fileList = [ ...(this.fileList || []), ...((!isFileExist) ? [ file ] : []) ]
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
        message: (this.modal.action === 'update') ? this.$t('notification.account-center.updated') : this.$t('notification.account-center.added'),
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
          const securityAccountCenterParam = {
            ...((this.modal.action === 'update') ? { id: this.modal.data.id } : {}),
            country: this.form.getFieldValue('countries'),
            companyName: this.form.getFieldValue('companyName'),
            remarks: this.form.getFieldValue('remarks')
          }
          data.append(((this.modal.action === 'update') ? 'securityAccountCenterUpdateParam' : 'securityAccountCenterAddParam'), new Blob([ JSON.stringify(securityAccountCenterParam) ], { type: 'application/json' }))
          this.fileList.forEach((item) => {
            if (!item?.fileLink) { data.append(`logo`, item) }
          })
          // FormData
          // const formData = {}
          // for (const key of data.keys()) {
          //     // console.log(`${key}:`, data.get(key))
          //     formData[key] = data.get(key)
          // }
          // console.log(formData)
          try {
            await this.$store.dispatch(`api/security/accountCenter/${this.modal.action}`, data)
            this.showNotification()
            this.closeModal()
            this.mainParent.refreshTable()
          } catch (error) {
            // if (/company name/ig.test(error?.response?.data?.message)) {
            //   this.form.setFields({ // Set value and error message in fields
            //     companyName: {
            //       value: this.form.getFieldValue('companyName'),
            //       errors: [
            //         { message: error.response.data.message }
            //       ]
            //     }
            //   })
            // }
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
    this.fields.forEach(v => this.form.getFieldDecorator(v))
    this.initiate()
  }
}
</script>

<style>
.checkboxForm .ant-form-item-control{
  width: 150px;
}

.ant-upload-list-item-name {
  width: 90%;
}
</style>
