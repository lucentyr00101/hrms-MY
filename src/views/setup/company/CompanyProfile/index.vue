<template>
  <a-card>
    <a-button v-action:setup_company_company-profile_edit v-if="(!isEdit)" class="btn" type="primary" @click="isEdit = true">{{ $t('table.dialog.edit') }}</a-button>
    <a-button v-else class="btn" type="primary" @click="handleSubmit">{{ $t('table.dialog.confirm') }}</a-button>

    <a-form :form="form">
      <a-tabs v-model="tab" class="tabs">
        <a-tab-pane key="GeneralInfo" :tab="$t('tab-general')">
          <General v-if="(tab === 'GeneralInfo')"/>
        </a-tab-pane>
        <a-tab-pane key="EpfInfo" :tab="$t('tab-epf')" :disabled="(!details?.id)">
          <EPF v-if="(tab === 'EpfInfo')"/>
        </a-tab-pane>
        <a-tab-pane key="EisInfo" :tab="$t('tab-eis')" :disabled="(!details?.id)">
          <EIS v-if="(tab === 'EisInfo')"/>
        </a-tab-pane>
        <a-tab-pane key="TaxInfo" :tab="$t('tab-tax')" :disabled="(!details?.id)">
          <Tax v-if="(tab === 'TaxInfo')"/>
        </a-tab-pane>
        <a-tab-pane key="SocsoInfo" :tab="$t('tab-socso')" :disabled="(!details?.id)">
          <SOCSO v-if="(tab === 'SocsoInfo')"/>
        </a-tab-pane>
      </a-tabs>
    </a-form>
  </a-card>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'
import { i18nRender } from '@/locales'
import General from './General'
import EPF from './EPF'
import EIS from './EIS'
import Tax from './Tax'
import SOCSO from './SOCSO'

export default {
  name: 'SetupCompanyProfile',
  components: {
    General,
    EPF,
    EIS,
    Tax,
    SOCSO
  },
  data() {
    return {
      tab: 'GeneralInfo',
      details: {},
      countriesList: [],
      regionList: [],
      form: this.$form.createForm(this),
      isEdit: false,
      image: {
        fileList: [],
        url: undefined
      },
      fields: ['companyName', 'email', 'registrationNumber', 'phoneOne', 'phoneTwo', 'addressOne', 'addressTwo', 'country', 'region', 'code', 'branch', 'website', 'phone', 'remarks'],
      emailRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // Email Validator
    }
  },
  computed: {
    currentTab() { return `${this.tab.slice(0, 1).toLowerCase()}${this.tab.slice(1)}` }
  },
  watch: {
    tab() {
      this.isEdit = false
      this.form.resetFields()
      this.setData()
    }
  },
  methods: {
    initiate() {
      this.getCountriesList()
      this.getRegionList()
      this.getData()
    },
    setData() {
      setTimeout(() => {
        this.fields.forEach(v => this.form.getFieldDecorator(v))
        if (/GeneralInfo/ig.test(this.tab)) {
          const { companyName, email, registrationNumber, phoneOne, phoneTwo, addressOne, addressTwo, country, region, profilePicture } = this.details
          this.form.setFieldsValue({ companyName, email, registrationNumber, phoneOne, phoneTwo, addressOne, addressTwo, country, region })
          // this.image.fileList = [{ uid: profilePicture.id, name: profilePicture.fileOriginName, fileLink: profilePicture?.fileLink || undefined }]
          this.image.fileList = []
          this.image.url = (profilePicture?.fileLink) ? String(profilePicture.fileLink).replace('http:', 'https:') : undefined
        } else if (/EpfInfo|EisInfo|TaxInfo|SocsoInfo/ig.test(this.tab)) {
          const { code, branch, email, website, phone, remarks, addressOne, addressTwo } = this.details?.[this.currentTab] || {}
          this.form.setFieldsValue({ code, branch, email, website, phone, remarks, addressOne, addressTwo })
        }
      })
    },
    async getData() {
      try {
        const details = await this.$store.dispatch('api/setup/company/companyProfile/fetchDetails')
        this.details = details?.data || {}
        this.setData()
      } catch (error) {
        throw error
      }
    },
    async getCountriesList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchCountriesDropdown')
        this.countriesList = list?.data?.country.map((item) => ({ value: item.id, label: item.countryName }))
      } catch (error) {
        throw error
      }
    },
    async getRegionList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchRegionDropdown')
        this.regionList = list?.data?.region.map((item) => ({ value: item.id, label: item.regionName }))
      } catch (error) {
        throw error
      }
    },
    handleSubmit() {
      this.form.validateFields((err) => !err && this.showInfo())
    },
    showInfo() {
      this.$confirm({
        title: this.$t('save.confirm'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          let data
          switch (this.tab) {
            case 'GeneralInfo':
              data = new FormData()
              // const previousAttachmentLinks = this.image.fileList.filter((item) => item?.fileLink).map((item) => item?.fileLink)
              const companyProfileSetupGeneralAddParam = {
                ...((this.details?.id) ? { id: this.details.id } : {}),
                companyName: this.form.getFieldValue('companyName'),
                email: this.form.getFieldValue('email'),
                registrationNumber: this.form.getFieldValue('registrationNumber'),
                phoneOne: this.form.getFieldValue('phoneOne'),
                phoneTwo: this.form.getFieldValue('phoneTwo'),
                addressOne: this.form.getFieldValue('addressOne'),
                addressTwo: this.form.getFieldValue('addressTwo'),
                country: this.form.getFieldValue('country'),
                region: this.form.getFieldValue('region')
                // ...((previousAttachmentLinks.length > 0) ? { previousAttachmentLinks } : {})
              }
              data.append('companyProfileSetupGeneralAddParam', new Blob([ JSON.stringify(companyProfileSetupGeneralAddParam) ], { type: 'application/json' }))
              this.image.fileList.forEach((item) => { data.append(`file`, item) })
              // FormData
              // const formData = {}
              // for (const key of data.keys()) {
              //     // console.log(`${key}:`, data.get(key))
              //     formData[key] = data.get(key)
              // }
              // console.log(formData)
              break
            case 'EpfInfo':
            case 'EisInfo':
            case 'TaxInfo':
            case 'SocsoInfo':
              data = {
                ...((this.details?.[this.currentTab]?.id) ? { id: this.details[this.currentTab].id } : {}),
                companyProfileSetupId: this.details.id,
                code: this.form.getFieldValue('code'),
                branch: this.form.getFieldValue('branch'),
                email: this.form.getFieldValue('email'),
                website: this.form.getFieldValue('website'),
                phone: this.form.getFieldValue('phone'),
                remarks: this.form.getFieldValue('remarks'),
                addressOne: this.form.getFieldValue('addressOne'),
                addressTwo: this.form.getFieldValue('addressTwo')
              }
              break
          }
          try {
            await this.$store.dispatch(`api/setup/company/companyProfile/update${this.tab}`, data)
            this.isEdit = false
            this.getData()
            await this.$store.dispatch('GetCompanyLogoAndName')
            this.$notification.open({
              message: this.$t('notification.company-profile.updated'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
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
    this.initiate()
  }
}
</script>

<style>
  .btn {
    display: block;
    margin: 0 0 0 auto;
  }

  .tabs {
    margin: 20px 0 0 0;
  }

  .form {
    margin-top: 20px;
  }

  .form .ant-form-item {
    display: flex;
  }

  .form .ant-form-item-label {
    width: 150px;
  }

  .form .ant-form-item-control-wrapper {
    flex: 1;
  }
</style>
