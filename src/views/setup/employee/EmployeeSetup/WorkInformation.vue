<template>
  <div>
    <FillEmployee :employee="employee" />
    <a-row>
      <a-form :form="form" :label-col="{ span: 9 }">
        <a-col :span="12">
          <a-form-item :label="`${$t('setup.employee.department')}: `" :wrapper-col="{ span: 14 }">
            <a-tree-select
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              v-decorator="['department', { rules: [{ required: true, message: 'Department is required.' }] }]"
              placeholder="Select"
              :tree-data="treeData"
              :disabled="disabled"
              tree-default-expand-all
              :replaceFields="{title:'departmentName', value: 'name'}"
              @change="handleSelectChange"
            />
          </a-form-item>

          <a-form-item :label="`${$t('setup.employee.supervisor')}: `" :wrapper-col="{ span: 14 }">
            <a-select
              :options="dropdownImmediateSupervisor"
              v-decorator="['immediateSupervisor']"
              placeholder="Select"
              :disabled="disabled"
              @change="handleSelectChange"
            >
            </a-select>
          </a-form-item>

          <a-form-item :label="`${$t('setup.employee.leave-group')}: `" :wrapper-col="{ span: 14 }">
            <a-select
              :options="dropdownLeaveGroup"
              v-decorator="['leaveGroupId', { rules: [{ required: true, message: 'Leave Group is required.' }] }]"
              placeholder="Select"
              :disabled="disabled"
              @change="handleSelectChange"
            >
            </a-select>
          </a-form-item>

          <a-form-item :label="`${$t('setup.employee.claim-group')}: `" :wrapper-col="{ span: 14 }">
            <a-select
              :options="dropdownClaimGroup"
              v-decorator="['claimGroup']"
              placeholder="Select"
              :disabled="disabled"
              @change="handleSelectChange"
            >
            </a-select>
          </a-form-item>

          <a-form-item :label="`${$t('setup.employee.regularization-date')}: `" :wrapper-col="{ span: 14 }">
            <a-date-picker
              :style="{width: '100%'}"
              v-decorator="['regularizationDate']"
              placeholder="Select Date"
              :disabled="disabled"
              @change="handleSelectChange"
            >
            </a-date-picker>
          </a-form-item>

          <a-form-item
            :label="`${$t('setup.employee.attachment')}`"
            :wrapper-col="{ span: 14 }"
            extra="Resume, Certificates, ID etc."
          >
            <a-space direction="vertical" size="large">
              <a-upload
                name="file"
                :multiple="true"
                :file-list="attachments"
                @change="handleChange"
                v-decorator="['attachments']"
                :disabled="disabled"
                :beforeUpload="() => false"
              >
                <div v-if="attachments.length < 20">
                  <a-button class="upload-btn" type="dashed">
                    <a-icon type="plus" style="margin-bottom: 10px"/>
                    {{ $t('table.dialog.upload') }}
                  </a-button>
                </div>
              </a-upload>
            </a-space>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item :label="`${$t('setup.employee.status')}: `" :wrapper-col="{ span: 14 }">
            <a-select
              :options="dropdownEmployeeStatusType"
              v-decorator="['status', { rules: [{ required: true, message: 'Status is required.' }] }]"
              placeholder="Select"
              :disabled="disabled"
              @change="handleSelectChange"
            >
            </a-select>
          </a-form-item>
          <!-- <= 99 from api -->
          <a-form-item :label="`${$t('setup.employee.probation-months')}: `" :wrapper-col="{ span: 14 }">
            <a-input
              :maxLength="2"
              v-decorator="['probationMonths', { rules: [{ required: true, message: 'Probation Months is required.' }, {validator: validate}] }]"
              placeholder="Enter"
              :style="{width: '100%', height:'44px', paddingTop: '5px'}"
              :disabled="disabled"
              @change="handleSelectChange"
            /></a-form-item>

          <a-form-item :label="`${$t('setup.employee.join-date')}: `" :wrapper-col="{ span: 14 }">
            <a-date-picker
              :style="{width: '100%'}"
              v-decorator="['joinDate', { rules: [{ required: true, message: 'Join Date is required.' }] }]"
              placeholder="Select Date"
              :disabled="disabled"
              @change="onStartDateChange"
            >
            </a-date-picker>
          </a-form-item>

          <a-form-item :label="`${$t('setup.employee.resign-date')}: `" :wrapper-col="{ span: 14 }">
            <a-date-picker
              :style="{width: '100%'}"
              v-decorator="['resignDate']"
              placeholder="Select Date"
              :disabled="disabled"
              @change="onEndDateChange"
            >
            </a-date-picker>
          </a-form-item>
          <a-form-item :label="`${$t('setup.employee.tenure')}: `" :wrapper-col="{ span: 14 }">
            <a-input-number
              :readonly="true"
              :formatter="value => `${value} months`"
              :style="{width: '100%'}"
              v-decorator="['tenure']"
              placeholder="Enter"
              :disabled="disabled"
              @change="handleSelectChange"
            />
          </a-form-item>
          <a-form-item :label="`${$t('setup.employee.calendar')}: `" :wrapper-col="{ span: 14 }" style="margin-top: 50px">
            <a-select
              :options="dropdownCalendar"
              v-decorator="['calendarId', { rules: [{ required: true, message: 'Calendar is required.' }] }]"
              placeholder="Select"
              :disabled="disabled"
              @change="handleSelectChange"
            >
            </a-select>
          </a-form-item>
        </a-col>
      </a-form>
    </a-row>
    <div style="display: flex">
      <a-space style="margin-left: auto; margin-top: 8px">
        <a-button v-show="!disabled" class="confirm-btn" :disabled="disabled" type="secondary" @click="cancel()">{{
          $t('table.dialog.cancel')
        }}</a-button>
        <a-button class="confirm-btn" v-if="disabled" type="primary" @click="disabled = false">{{
          $t('table.dialog.edit')
        }}</a-button>
        <a-button class="confirm-btn" v-if="!disabled" type="primary" @click="e => handleSubmit(e)">{{
          $t('table.dialog.confirm')
        }}</a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import { TreeSelect } from 'ant-design-vue'
import moment from 'moment'
import pick from 'lodash.pick'
import InfoCircle from '@/assets/info-circle.svg'
import { get } from '@/api/employee-setup'
import { mapGetters } from 'vuex'
import { i18nRender } from '@/locales'
import { employeeSetupMixin } from '@/store/app-mixin'
import FillEmployee from '@/components/Setup/Employee/EmployeeSetup/FillEmployee.vue'
import { type } from '@/api/dictionary'

const fields = ['department', 'immediateSupervisor', 'leaveGroupId', 'claimGroup', 'regularizationDate', 'status', 'probationMonths', 'joinDate', 'tenure', 'calendarId', 'resignDate']

export default {
  name: 'WorkInformation',
  mixins: [employeeSetupMixin],
  props: {
    editable: { type: Boolean, default: null }
  },
  components: {
    FillEmployee
  },
  data () {
    console.log('this', this.editable)
    return {
      TreeSelect,
      attachments: [],
      test: '',
      image: null,
      form: this.$form.createForm(this, { name: 'employeeInformation' }),
      startDate: null,
      endDate: null,
      disabled: this.editable,
      employeeId: this.$route.params.id,
      treeData: [],
      dropdownLeaveGroup: [],
      dropdownImmediateSupervisor: [],
      dropdownClaimGroup: [],
      dropdownCalendar: [],
      dropdownEmployeeStatusType: [],
      loadDepartmentType: async () => {
        const data = await this.$store.dispatch('api/setup/employee/employeeSetup/workInformation/dropdownDepartment')
        this.treeData = this.generateTree(data.data.parentTree)
      },
      loadLeaveGroupType: async () => {
        const { data } = await this.$store.dispatch('api/setup/employee/employeeSetup/workInformation/dropdownLeaveGroup')
        const { companyLeaveGroup } = data
        const _companyLeaveGroup = companyLeaveGroup.map((item) => {
          return {
            value: item.id,
            label: item.leaveGroup
          }
        })
        this.dropdownLeaveGroup = [...this.dropdownLeaveGroup, ..._companyLeaveGroup]
        return this.dropdownLeaveGroup
      },
      loadImmediateSupervisorType: async () => {
        const { data } = await this.$store.dispatch('api/setup/employee/employeeSetup/workInformation/dropdownImmediateSupervisor')
        const { employeeDetailSmallResponses } = data
        const _employeeDetailSmallResponses = employeeDetailSmallResponses.map((item) => {
          return {
            value: item.id,
            label: item.fullName
          }
        })
        this.dropdownImmediateSupervisor = [...this.dropdownImmediateSupervisor, ..._employeeDetailSmallResponses]
        return this.dropdownImmediateSupervisor
      },
      loadClaimGroupType: async () => {
        const { data } = await this.$store.dispatch('api/setup/employee/employeeSetup/workInformation/dropdownClaimGroup')
        const { companyClaimGroups } = data
        const _companyClaimGroups = companyClaimGroups.map((item) => {
          return {
            value: item.id,
            label: item.companyClaimGroup
          }
        })
        this.dropdownClaimGroup = [...this.dropdownClaimGroup, ..._companyClaimGroups]
        return this.dropdownClaimGroup
      },
      loadCalendarType: async () => {
        const { data } = await this.$store.dispatch('api/setup/employee/employeeSetup/workInformation/dropdownCalendar')
        const { calendarSmallResponses } = data
        const _calendarSmallResponses = calendarSmallResponses.map((item) => {
          return {
            value: item.id,
            label: item.calendarName
          }
        })
        this.dropdownCalendar = [...this.dropdownCalendar, ..._calendarSmallResponses]
        return this.dropdownCalendar
      },
      loadEmployeeStatusType: async () => {
        const { employeeSetupStatusType } = await this.$store.dispatch('api/setup/dictionary/getDropdownValues', type.EMPLOYEE_STATUS_TYPE)
        this.dropdownEmployeeStatusType = (employeeSetupStatusType || [])?.map((item) => {
          return {
            value: item.employeeSetupStatusType,
            label: item.employeeSetupStatusType
          }
        })
      }
    }
  },
  async created () {
    // console.log('id', this.$route.params.id)
    this.loadCalendarType()
    this.loadClaimGroupType()
    this.loadImmediateSupervisorType()
    this.loadLeaveGroupType()
    this.loadDepartmentType()
    this.loadEmployeeStatusType()
    if (this.employeeId !== undefined) {
      this.getEmployeeSetup(this.$route.params.id).then(res => {
        const workInfoResponse = res.data.employeeSetupWorkInfoResponse
        workInfoResponse !== null ? this.disabled = true : this.disabled = false
        const data = {
          ...workInfoResponse,
          leaveGroupId: workInfoResponse?.companyLeaveGroup?.id,
          calendarId: workInfoResponse?.companyCalendar?.id
        }
        this.cacheData = data
        this.form.setFieldsValue({
          ...pick(data, fields),
          tenure: data.tenureMonths || 0
        })
        this.setAttachments(workInfoResponse)
      })
    } else {
      this.loading = false
    }
  },
  computed: {
    ...mapGetters('api/setup/employee/employeeSetup', ['employee'])
  },
  methods: {
    async loadAttachments () {
      this.getEmployeeSetup(this.$route.params.id).then(res => {
        const workInfoResponse = res.data.employeeSetupWorkInfoResponse
        this.setAttachments(workInfoResponse)
      })
    },
    async setAttachments (workInfoResponse) {
      this.attachments = (workInfoResponse.attachments || []).map((attachment, index) => {
        const name = decodeURIComponent(this.getFilename(attachment))
          return {
            uid: index,
            name,
            status: 'done',
            url: attachment
          }
        })
    },
    getFilename (name) {
      return name?.split('?')[0]?.split('/').pop()
    },
    generateTree (data) {
      return data.reduce((list, item) => {
        // const id = item.name
        const id = item.id
        const obj = {
           id,
          ...item,
          label: item.name,
          key: item.id
        }
        item.children?.length > 0 && (obj.children = this.generateTree(item.children))
        list.push(obj)
        return list
      }, [])
    },
    validate (rule, value, callback) {
      console.log(value)
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
    handleChange(info) {
      this.attachments = info.fileList
    },
    cancel () {
      this.disabled = true
    },
    handleSelectChange (val) {
      console.log(val)
    },
    showNotification () {
      this.$notification.open({
        message: this.$t('table.dialog.work-information-added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showUpdatedNotification () {
      this.$notification.open({
        message: this.$t('table.dialog.work-information-updated'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
      async showInfo () {
        const _this = this
        const previousAttachmentLinks = this.attachments
          .map(attachment => attachment.url)
          .filter(attachment => attachment)
        this.cacheData = {
          employeeSetupId: _this.employeeId,
          department: _this.form.getFieldValue('department'),
          immediateSupervisor: _this.form.getFieldValue('immediateSupervisor'),
          calendarId: _this.form.getFieldValue('calendarId'),
          leaveGroupId: _this.form.getFieldValue('leaveGroupId'),
          claimGroup: _this.form.getFieldValue('claimGroup'),
          probationMonths: _this.form.getFieldValue('probationMonths'),
          status: _this.form.getFieldValue('status'),
          resignDate: this.form.getFieldValue('resignDate') !== undefined && this.form.getFieldValue('resignDate') !== null ? moment(this.form.getFieldValue('resignDate')).format('YYYY-MM-DD').toString() : null,
          joinDate: moment(this.form.getFieldValue('joinDate')).format('YYYY-MM-DD').toString(),
          regularizationDate: this.form.getFieldValue('regularizationDate') !== undefined && this.form.getFieldValue('regularizationDate') !== null ? moment(this.form.getFieldValue('regularizationDate')).format('YYYY-MM-DD').toString() : null,
          reasonForLeaving: null,
          previousAttachmentLinks
          // tenure auto compute from backend
        }
        this.$confirm({
          title: _this.$t('table.dialog.confirm-msg'),
          okText: 'Yes',
          cancelText: 'No',
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
          async onOk () {
            const employeeInfo = await get(_this.employeeId)
            const data = {
              employeeSetupId: _this.employeeId,
              department: _this.form.getFieldValue('department'),
              immediateSupervisor: _this.form.getFieldValue('immediateSupervisor'),
              calendarId: _this.form.getFieldValue('calendarId'),
              leaveGroupId: _this.form.getFieldValue('leaveGroupId'),
              claimGroup: _this.form.getFieldValue('claimGroup'),
              probationMonths: _this.form.getFieldValue('probationMonths'),
              status: _this.form.getFieldValue('status'),
              resignDate: _this.form.getFieldValue('resignDate') !== undefined && _this.form.getFieldValue('resignDate') !== null ? moment(_this.form.getFieldValue('resignDate')).format('YYYY-MM-DD').toString() : null,
              joinDate: moment(_this.form.getFieldValue('joinDate')).format('YYYY-MM-DD').toString(),
              regularizationDate: _this.form.getFieldValue('regularizationDate') !== undefined && _this.form.getFieldValue('regularizationDate') !== null ? moment(_this.form.getFieldValue('regularizationDate')).format('YYYY-MM-DD').toString() : null,
              reasonForLeaving: null,
              previousAttachmentLinks
              // tenure auto compute from backend
            }
            const blob = new Blob([JSON.stringify(data)], {
              type: 'application/json'
            })
            const formData = new FormData()
            formData.append('employeeSetupWorkInfoUpdateParam', blob)
            console.log('blob', blob)
            _this.attachments.forEach(r => {
              if (r.originFileObj) {
                formData.append('attachments', r.originFileObj)
              }
            })
            const checkUpdate = employeeInfo.data.employeeSetupWorkInfoResponse !== null
            try {
              await _this.$store.dispatch('api/setup/employee/employeeSetup/workInformation/update', formData)
              checkUpdate === true ? _this.showUpdatedNotification() : _this.showNotification()
              _this.cancel()
              _this.$emit('titleIcon')
              _this.loadAttachments()
            } catch (e) {
              _this.$message.error(e.response.data.message)
            }
          }
        })
      },
    handleSubmit () {
      this.form.validateFields((err, values) => !err && this.showInfo())
    },
    onStartDateChange (date) {
      this.formattedJoinDate = date.format('YYYY.MM.DD')
      this.formattedCurrentDate = new Date().toJSON().slice(0, 10).replace(/-/g, '/')
      this.joinYear = new Date(this.formattedJoinDate).getFullYear()// 2022
      this.joinMonth = new Date(this.formattedJoinDate).getMonth() + 1 // 07
      this.currentYear = new Date(this.formattedCurrentDate).getFullYear() // 2022
      this.currentMonth = new Date(this.formattedCurrentDate).getMonth() + 1 // 09
      this.calculteMonth = (this.currentMonth - this.joinMonth) + (12 * (this.currentYear - this.joinYear))
      this.calculteMonth < 0 ? this.form.setFieldsValue({ 'tenure': 0 }) : this.form.setFieldsValue({ 'tenure': this.calculteMonth })
      // this.startDate = date.unix()
    },
    onEndDateChange (date) {
      console.log(date)
      this.endDate = date.unix()
    },
    checkStartDate (rule, value, callback) {
      if (this.endDate) {
        return value.unix() <= this.endDate ? callback() : callback(i18nRender(i18nRender('error.start-date.later')))
      }
    },
    checkEndDate (rule, value, callback) {
      if (this.startDate) {
        return value.unix() >= this.startDate ? callback() : callback(i18nRender(i18nRender('error.end-date.earlier')))
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
.ant-row >>> .ant-upload-list-item-info {
  padding: 0 30px 0 4px !important;
  white-space: nowrap;
}
.upload-btn {
  display: flex;
  flex-direction: column;
  height: 200px;
  width: 200px;
  justify-content: center;
  align-items: center;
  padding: 0px;
  font-size: 20px;
  background-color: light-grey;
}
</style>
