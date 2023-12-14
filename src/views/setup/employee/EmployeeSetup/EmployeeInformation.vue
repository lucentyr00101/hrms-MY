<template>
  <a-form :form="form" :label-col="{ span: 9 }">
    <a-row>
      <a-col :span="4" :style="{ textAlign: 'center' }">
        <a-space direction="vertical" size="large">
          <a-avatar width="40" icon="user" :src="imageUrl" />
          <a-upload name="file" :fileList="fileList" v-decorator="['file']" @change="handleChange">
            <a-button :disabled="disabled"> <a-icon type="upload" /> {{ $t('table.dialog.click-to-upload') }} </a-button>
          </a-upload>
        </a-space>
      </a-col>
      <a-col :span="10">
        <a-form-item :label="`${$t('setup.employee.employee-number')}: `" :wrapper-col="{ span: 14 }">
          <a-input
            :maxLength="25"
            :disabled="disabled"
            placeholder="MPEJ1289128912"
            v-decorator="[
              'employeeNumber',
              {
                rules: [
                  { required: true, message: `${$t('setup.employee.employee-number')} ${$t('error.is-required')}` }
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item :label="`${$t('setup.employee.employee-last-name')}: `" :wrapper-col="{ span: 14 }">
          <a-input
            :maxLength="25"
            :disabled="disabled"
            placeholder="employee lastname"
            v-decorator="[
              'lastName',
              {
                rules: [
                  { required: true, message: `${$t('setup.employee.employee-last-name')} ${$t('error.is-required')}` }
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item :label="`${$t('setup.employee.employee-first-name')}: `" :wrapper-col="{ span: 14 }">
          <a-input
            :maxLength="25"
            :disabled="disabled"
            placeholder="employee first name"
            v-decorator="[
              'firstName',
              {
                rules: [
                  { required: true, message: `${$t('setup.employee.employee-first-name')} ${$t('error.is-required')}` }
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item :label="`${$t('setup.employee.employee-nickname')}: `" :wrapper-col="{ span: 14 }">
          <a-input
            :maxLength="25"
            :disabled="disabled"
            placeholder="employee nickname"
            v-decorator="['nickName']"
          />
        </a-form-item>
        <a-form-item :label="`${$t('setup.employee.id-number')}: `" :wrapper-col="{ span: 14 }">
          <a-input
            :maxLength="25"
            :disabled="disabled"
            placeholder="id number"
            v-decorator="[
              'idNumber',
              {
                rules: [
                  { required: true, message: `${$t('setup.employee.id-number')} ${$t('error.is-required')}` }
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item :label="`${$t('setup.employee.email')}: `" :wrapper-col="{ span: 14 }">
          <a-input
            :maxLength="100"
            :disabled="disabled"
            placeholder="email"
            v-decorator="[
              'email',
              {
                rules: [
                  { required: true, message: `${$t('setup.employee.email')} ${$t('error.is-required')}` }
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item
          :label="`${$t('setup.employee.primary-contact')}: `"
          :wrapper-col="{ span: 14 }"
          extra="country code+mobile: 60175523033"
        >
          <a-input
            :maxLength="13"
            :disabled="disabled"
            placeholder="mobile number"
            v-decorator="[
              'primaryContact',
              {
                rules: [
                  { required: true, message: `${$t('setup.employee.primary-contact')} ${$t('error.is-required')}` }
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item
          :label="`${$t('setup.employee.secondary-contact')}: `"
          :wrapper-col="{ span: 14 }"
          extra="country code+mobile: 60175523033"
        >
          <a-input
            :maxLength="13"
            :disabled="disabled"
            placeholder="mobile number"
            v-decorator="['secondaryContact']"
          />
        </a-form-item>
      </a-col>
      <a-col :span="10">
        <a-form-item :label="`${$t('setup.employee.marital-status')}: `" :wrapper-col="{ span: 14 }">
          <a-select :disabled="disabled" placeholder="Select" v-decorator="['maritalStatus', { rules: [{required: true, message: `${$t('setup.employee.marital-status')} ${$t('error.is-required')}`}]}]">
            <a-select-option v-for="(maritalTypes, index) in maritalType.maritalStatusType" :key="index" :value="maritalTypes.id">{{ maritalTypes.maritalStatusType }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="`${$t('setup.employee.race')}: `" :wrapper-col="{ span: 14 }">
          <a-select :disabled="disabled" placeholder="Select" v-decorator="['race', { rules: [{required: true, message: `${$t('setup.employee.race')} ${$t('error.is-required')}`}]}]">
            <a-select-option v-for="(raceTypes, index) in raceType" :key="index" :value="raceTypes.value">{{ raceTypes.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="`${$t('setup.employee.resident-status')}: `" :wrapper-col="{ span: 14 }">
          <a-select :disabled="disabled" placeholder="Select" v-decorator="['residentStatus', { rules: [{required: true, message: `${$t('setup.employee.resident-status')} ${$t('error.is-required')}`}]}]">
            <a-select-option v-for="(residentStatusTypes, index) in residentStatusType.residentStatusType" :key="index" :value="residentStatusTypes.id">{{ residentStatusTypes.residentStatusType }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="`${$t('setup.employee.gender')}: `" :wrapper-col="{ span: 14 }">
          <a-select :disabled="disabled" placeholder="Select" v-decorator="['gender', { rules: [{required: true, message: `${$t('setup.employee.gender')} ${$t('error.is-required')}`}]}]">
            <a-select-option v-for="(genderTypes, index) in genderType.genderType" :key="index" :value="genderTypes.id">{{ genderTypes.genderType }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="`${$t('setup.employee.date-of-birth')}: `" :wrapper-col="{ span: 14 }">
          <a-date-picker
            v-decorator="['dateOfBirth', { rules: [{ required: true, message: `${$t('setup.employee.date-of-birth')} ${$t('error.is-required')}` }] }]"
            :disabled="disabled"
            placeholder="Select date"
            :disabled-date="disabledDate"
            style="width:100%"
          >
          </a-date-picker>
        </a-form-item>
        <a-form-item :label="`${$t('setup.employee.passport-number')}: `" :wrapper-col="{ span: 14 }">
          <a-input
            :maxLength="25"
            :disabled="disabled"
            placeholder="passport number"
            v-decorator="['passportNumber']"
          />
        </a-form-item>
        <a-form-item :label="`${$t('setup.employee.passport-expiry-date')}: `" :wrapper-col="{ span: 14 }">
          <a-date-picker
            v-decorator="['passportExpiryDate']"
            :disabled="disabled"
            placeholder="Select date"
            style="width:100%"
          >
          </a-date-picker>
        </a-form-item>
        <a-form-item :label="`${$t('setup.employee.highest-education')}: `" :wrapper-col="{ span: 14 }">
          <a-select :disabled="disabled" placeholder="Select" v-decorator="['highestEducation', { rules: [{required: true, message: `${$t('setup.employee.highest-education')} ${$t('error.is-required')}`}]}]">
            <a-select-option v-for="(educationTypes, index) in educationType.educationType" :key="index" :value="educationTypes.id">{{ educationTypes.educationType }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="`${$t('setup.employee.address')}: `" :wrapper-col="{ span: 14 }">
          <a-textarea
            :maxLength="100"
            :disabled="disabled"
            placeholder="Autosize height based on content lines="
            v-decorator="[
              'address',
              {
                rules: [
                  { required: true, message: `${$t('setup.employee.address')} ${$t('error.is-required')}` }
                ],
              },
            ]"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-card>
      <template slot="title" class="contact-list">{{ $t('setup.employee.emergency-contact') }}</template>
      <div>
        <employee-editable-table
          ref="editableTable1"
          :columns="emergencyContactColumns"
          :editableColumns="emergencyContactEditableColumns"
          :dataSource="emergencyResult"
          :disabled="disabled"
        />
      </div>
    </a-card>
    <a-card>
      <template slot="title" class="contact-list">{{ $t('setup.employee.list-of-dependant') }}</template>
      <div>
        <employee-editable-table
          ref="editableTable2"
          :columns="dependantsListColumns"
          :editableColumns="dependantsListEditableColumns"
          :dataSource="dependentResult"
          :disabled="disabled"
        />
      </div>
    </a-card>
    <div style="display: flex">
      <a-space style="margin-left: auto; margin-top: 8px">
        <a-button v-show="action === 'edit'" class="confirm-btn" type="secondary" @click="cancel()">{{
          $t('table.dialog.cancel')
        }}</a-button>
        <a-button class="confirm-btn" v-if="disabled" type="primary" @click="disabled = false">{{
          $t('table.dialog.edit')
        }}</a-button>
        <a-button class="confirm-btn" v-if="!disabled" type="primary" @click="showConfirm()">{{
          $t('table.dialog.confirm')
        }}</a-button>
      </a-space>
    </div>
  </a-form>
</template>

<script>
import EmployeeEditableTable from '@/components/Table/EmployeeEditableTable.vue'
import { i18nRender } from '@/locales'
import moment from 'moment'
import './employee.less'
import pick from 'lodash.pick'
import InfoCircle from '@/assets/info-circle.svg'
import { type } from '@/api/dictionary'
import { employeeSetupMixin } from '@/store/app-mixin'
const emergencyContactColumns = [
  {
    title: '#',
    dataIndex: 'index',
    scopedSlots: { customRender: 'index' }
  },
  {
    title: i18nRender('setup.employee.name'),
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: i18nRender('setup.employee.contact-number'),
    dataIndex: 'contactNumber',
    scopedSlots: { customRender: 'contactNumber' }
  },
  {
    title: i18nRender('setup.employee.relation'),
    dataIndex: 'relation',
    scopedSlots: { customRender: 'relation' }
  },
  {
    title: i18nRender('setup.employee.action'),
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
const dependantsListColumns = [
  {
    title: '#',
    dataIndex: 'index',
    scopedSlots: { customRender: 'index' }
  },
  {
    title: i18nRender('setup.employee.name'),
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: i18nRender('setup.employee.dob'),
    dataIndex: 'dateOfBirth',
    scopedSlots: { customRender: 'dateOfBirth' }
  },
  {
    title: i18nRender('setup.employee.relation'),
    dataIndex: 'relation',
    scopedSlots: { customRender: 'relation' }
  },
  {
    title: i18nRender('setup.employee.action'),
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
const fields = ['employeeNumber', 'lastName', 'firstName', 'nickName', 'idNumber', 'email', 'primaryContact', 'secondaryContact', 'maritalStatus', 'race', 'residentStatus', 'gender', 'dateOfBirth', 'passportNumber', 'passportExpiryDate', 'highestEducation', 'address']
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  components: { EmployeeEditableTable },
  name: 'EmployeeInformation',
  mixins: [employeeSetupMixin],
  data () {
    return {
      image: null,
      imageUrl: '',
      fileList: [],
      form: this.$form.createForm(this, { name: 'employeeInformation' }),
      emergencyContactColumns,
      dependantsListColumns,
      dependentResult: [],
      emergencyResult: [],
      emergencyContactEditableColumns: [
        {
          dataIndex: 'name',
          valueType: 'text'
        },
        {
          dataIndex: 'contactNumber',
          valueType: 'text'
        },
        {
          dataIndex: 'relation',
          valueType: 'text'
        }
      ],
      dependantsListEditableColumns: [
        {
          dataIndex: 'name',
          valueType: 'text'
        },
        {
          dataIndex: 'dateOfBirth',
          valueType: 'date'
        },
        {
          dataIndex: 'relation',
          valueType: 'text'
        }
      ],
      disabled: false,
      cacheData: null,
      maritalType: [],
      raceType: [],
      residentStatusType: [],
      genderType: [],
      educationType: [],
      error1: false,
      error2: false,
      error3: false,
      employeeId: null,
      action: 'add'
    }
  },
  async created () {
    if (this.$route.params.id) {
      this.disabled = true
      this.action = 'edit'
      this.employeeId = this.$route.params.id
      this.getEmployeeSetup(this.$route.params.id).then(res => {
        this.cacheData = JSON.parse(JSON.stringify(res.data))
        this.imageUrl = res.data.profilePicture?.fileLink
        this.emergencyResult = res.data.contacts.map((item, index) => ({ ...item, key: index }))
        this.dependentResult = res.data.dependents.map((item, index) => ({ ...item, key: index }))
        this.form.setFieldsValue(pick(res.data, fields))
      })
    }
    this.maritalType = await this.$store.dispatch('api/setup/dictionary/getDropdownValues', type.MARITAL)
    const list = await this.$store.dispatch('api/dropdown/fetchRaceTypeDropdown')
    this.raceType = list?.data?.raceType.map((item) => ({ value: item.id, label: item.raceType }))
    this.residentStatusType = await this.$store.dispatch('api/setup/dictionary/getDropdownValues', type.RESIDENT)
    this.genderType = await this.$store.dispatch('api/setup/dictionary/getDropdownValues', type.GENDER)
    this.educationType = await this.$store.dispatch('api/setup/dictionary/getDropdownValues', type.EDUCATION)
  },
  methods: {
    handleChange (info) {
      getBase64(info.file.originFileObj, (imageUrl) => {
        this.imageUrl = imageUrl
        this.image = info.file.originFileObj
      })
    },
    cancel () {
      if (this.action === 'edit' && !this.disabled) {
        this.disabled = true
        // reset the value back to original
        this.imageUrl = this.cacheData.profilePicture?.fileLink
        this.emergencyResult = this.cacheData.contacts.map((item) => ({ ...item }))
        this.dependentResult = this.cacheData.dependents.map((item) => ({ ...item }))
        this.form.setFieldsValue(pick(this.cacheData, fields))
      } else {
        this.$multiTab.closeCurrentPage()
        this.$router.push({ name: 'setup-employee-employee-setup' })
      }
    },
    disabledDate (current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day')
    },
    showConfirm () {
      this.form.validateFields((err) => {
        if (err) {
          this.error1 = true
        } else {
          this.error1 = false
        }
      })
      // validate editable table
      if (!this.$refs.editableTable1.validateTableEmpty()) {
        this.error2 = true
      } else {
        this.error2 = false
      }
      if (!this.$refs.editableTable2.validateTableEmpty()) {
        this.error3 = true
      } else {
        this.error3 = false
      }
      if (this.$refs.editableTable1.ds.length === 0) this.error2 = false
      if (this.$refs.editableTable2.ds.length === 0) this.error3 = false
      // if both validation has no error
      if (!this.error1 && !this.error2 && !this.error3) {
        this.$confirm({
          centered: true,
          title: i18nRender('save.confirm'),
          okText: i18nRender('table.dialog.yes'),
          cancelText: i18nRender('table.dialog.no'),
          onOk: () => this.handleSubmit(),
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />
        })
      }
    },
    handleSubmit () {
      try {
        this.loading = true
        const emergency = this.$refs.editableTable1.ds.map(item => {
          return { key: item.key, name: item.name, contactNumber: item.contactNumber, relation: item.relation }
        })
        const dependents = this.$refs.editableTable2.ds.map(item => {
          return { key: item.key, name: item.name, dateOfBirth: item.dateOfBirth, relation: item.relation }
        })
        this.cacheData = {
          profilePicture: {
            fileLink: this.imageUrl
          },
          employeeNumber: this.form.getFieldValue('employeeNumber'),
          lastName: this.form.getFieldValue('lastName'),
          firstName: this.form.getFieldValue('firstName'),
          nickName: this.form.getFieldValue('nickName'),
          idNumber: this.form.getFieldValue('idNumber'),
          email: this.form.getFieldValue('email'),
          primaryContact: this.form.getFieldValue('primaryContact'),
          secondaryContact: this.form.getFieldValue('secondaryContact'),
          maritalStatus: this.form.getFieldValue('maritalStatus'),
          race: this.form.getFieldValue('race'),
          gender: this.form.getFieldValue('gender'),
          dateOfBirth: moment(this.form.getFieldValue('dateOfBirth')).format('YYYY-MM-DD').toString(),
          passportNumber: this.form.getFieldValue('passportNumber'),
          passportExpiryDate: this.form.getFieldValue('passportExpiryDate') !== undefined ? moment(this.form.getFieldValue('passportExpiryDate')).format('YYYY-MM-DD').toString() : null,
          highestEducation: this.form.getFieldValue('highestEducation'),
          address: this.form.getFieldValue('address'),
          contacts: emergency,
          dependents: dependents
        }
        if (this.action === 'add') {
          const data = {
            employeeNumber: this.form.getFieldValue('employeeNumber'),
            lastName: this.form.getFieldValue('lastName'),
            firstName: this.form.getFieldValue('firstName'),
            nickName: this.form.getFieldValue('nickName') !== undefined ? this.form.getFieldValue('nickName') : null,
            idNumber: this.form.getFieldValue('idNumber'),
            email: this.form.getFieldValue('email'),
            residentStatus: this.form.getFieldValue('residentStatus'),
            gender: this.form.getFieldValue('gender'),
            passportNumber: this.form.getFieldValue('passportNumber') !== undefined ? this.form.getFieldValue('passportNumber') : null,
            dateOfBirth: moment(this.form.getFieldValue('dateOfBirth')).format('YYYY-MM-DD').toString(),
            maritalStatus: this.form.getFieldValue('maritalStatus'),
            passportExpiryDate: this.form.getFieldValue('passportExpiryDate') !== undefined ? moment(this.form.getFieldValue('passportExpiryDate')).format('YYYY-MM-DD').toString() : null,
            race: this.form.getFieldValue('race'),
            address: this.form.getFieldValue('address'),
            primaryContact: this.form.getFieldValue('primaryContact'),
            secondaryContact: this.form.getFieldValue('secondaryContact') !== undefined ? this.form.getFieldValue('secondaryContact') : null,
            highestEducation: this.form.getFieldValue('highestEducation'),
            contacts: emergency,
            dependents: dependents
          }
          console.log(data)
          const formData = new FormData()
          const blob = new Blob([JSON.stringify(data)], {
            type: 'application/json'
          })
          formData.set('file', this.image)
          formData.append('employeeSetupInfoAddParam', blob)
          this.$store.dispatch('api/setup/employee/employeeSetup/addEmployee', formData)
          .then((res) => {
            this.employeeId = res.data.id
            this.$store.commit('api/setup/employee/employeeSetup/SET_EMPLOYEE', res)
            this.$notification.open({
              message: i18nRender('setup.employee.employee-information-added'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
            this.action = 'edit'
            this.disabled = true

            this.$router.push({ name: 'setup-employee-employee-setup-view-employee-information', params: { id: this.employeeId } })
          }).catch(err => {
            this.$message.error(err.response.data.message)
          })
        } else {
          console.log(this.form.getFieldValue('passportExpiryDate'))
          const data = {
            id: this.employeeId,
            employeeNumber: this.form.getFieldValue('employeeNumber'),
            lastName: this.form.getFieldValue('lastName'),
            firstName: this.form.getFieldValue('firstName'),
            nickName: this.form.getFieldValue('nickName') !== undefined && this.form.getFieldValue('nickName') !== null ? this.form.getFieldValue('nickName') : null,
            idNumber: this.form.getFieldValue('idNumber'),
            email: this.form.getFieldValue('email'),
            residentStatus: this.form.getFieldValue('residentStatus'),
            gender: this.form.getFieldValue('gender'),
            passportNumber: this.form.getFieldValue('passportNumber') !== undefined && this.form.getFieldValue('passportNumber') !== null ? this.form.getFieldValue('passportNumber') : null,
            dateOfBirth: moment(this.form.getFieldValue('dateOfBirth')).format('YYYY-MM-DD').toString(),
            maritalStatus: this.form.getFieldValue('maritalStatus'),
            passportExpiryDate: this.form.getFieldValue('passportExpiryDate') !== undefined && this.form.getFieldValue('passportExpiryDate') !== null ? moment(this.form.getFieldValue('passportExpiryDate')).format('YYYY-MM-DD').toString() : null,
            race: this.form.getFieldValue('race'),
            address: this.form.getFieldValue('address'),
            primaryContact: this.form.getFieldValue('primaryContact'),
            secondaryContact: this.form.getFieldValue('secondaryContact') !== undefined && this.form.getFieldValue('secondaryContact') !== null ? this.form.getFieldValue('secondaryContact') : null,
            highestEducation: this.form.getFieldValue('highestEducation'),
            contacts: emergency,
            dependents: dependents
          }
          const formData = new FormData()
          const blob = new Blob([JSON.stringify(data)], {
            type: 'application/json'
          })
          formData.set('file', this.image)
          formData.append('employeeSetupInfoUpdateParam', blob)
          this.$store.dispatch('api/setup/employee/employeeSetup/editEmployee', formData)
          .then((res) => {
            this.$notification.open({
              message: i18nRender('setup.employee.employee-information-updated'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
            this.disabled = true
          }).catch(err => {
            this.$message.error(err.response.data.message)
          })
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.ant-avatar {
  width: 125px;
  height: 125px;
}
.ant-avatar.ant-avatar-icon {
  font-size: 70px;
  line-height: unset;
}
.ant-row .ant-form-item {
  margin-bottom: 18px;
}
.ant-row >>> .ant-upload-list-item-name {
  white-space: inherit;
}
.ant-card {
  border-radius: 2px;
}
</style>
