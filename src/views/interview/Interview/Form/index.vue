<template>
  <a-card>
    <a-form :form="form">
      <a-tabs v-model="tab" class="tabs">
        <a-tab-pane key="General" :tab="$t('tab-general')">
          <General v-if="(tab === 'General')"/>
        </a-tab-pane>
        <a-tab-pane key="Screening" :tab="$t('tab-screening')" :disabled="(!details?.id)">
          <Screening v-if="(tab === 'Screening')"/>
        </a-tab-pane>
        <a-tab-pane key="Interview" :tab="$t('tab-interview')" :disabled="(!details?.id)">
          <Interview v-if="(tab === 'Interview')"/>
        </a-tab-pane>
        <!-- <a-tab-pane key="4" :tab="$t('tab-2nd-interview')">
          <Interview2nd/>
        </a-tab-pane> -->
      </a-tabs>
    </a-form>
    <div :style="{ display: 'flex', justifyContent: 'flex-end', margin: '20px 0 0' }">
      <a-button @click="mainParent.changeView({ view: 'List', query: { ...$route.query, action: undefined, id: undefined } })">{{ $t('table.dialog.cancel') }}</a-button>
      <a-button v-if="$route.query?.action === 'view'" class="confirm-btn" :style="{ marginLeft: '20px' }" type="primary" @click="mainParent.changeView({ view: 'Form', query: { ...$route.query, action: 'update' } })">{{ $t('table.dialog.edit') }}</a-button>
      <a-button v-else-if="(/^add$|^update$/ig.test($route.query?.action))" class="confirm-btn" :style="{ marginLeft: '20px' }" type="primary" @click="handleSubmit">{{ $t('table.dialog.confirm') }}</a-button>
    </div>
  </a-card>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'
import moment from 'moment'

import General from './General'
import Screening from './Screening'
import Interview from './Interview'
// import Interview2nd from './Interview2nd'

export default {
  name: 'InterviewInterviewForm',
  components: {
    General,
    Screening,
    Interview
    // Interview2nd
  },
  data() {
    return {
      moment,
      tab: 'General',
      form: this.$form.createForm(this),
      details: {},
      image: {
        fileList: [],
        url: undefined
      },
      attached: {
        fileList: []
      },
      screeningQuestionnaires: [],
      interviewQuestionnaires: [],
      // interviewQuestionnairesSecond: [],
      // fields: ['companyName', 'email', 'registrationNumber', 'phoneOne', 'phoneTwo', 'addressOne', 'addressTwo', 'country', 'region', 'code', 'branch', 'website', 'phone', 'remarks'],
      emailRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // Email Validator
    }
  },
  computed: {
    mainParent() { return this.getParent('InterviewInterview') }
  },
  watch: {
    '$route.query': {
      deep: true,
      handler() {
        this.initiate()
      }
    },
    tab() {
      this.form.resetFields()
      this.setData()
    },
    details: {
      deep: true,
      handler() {
        this.setData()
      }
    }
  },
  methods: {
    initiate() {
      this.getDropdownList()
      if (this.$route.query?.id) { this.getDetails() }
    },
    async getDetails() {
      try {
        const details = await this.$store.dispatch('api/interview/candidate/fetchDetails', { id: this.$route.query.id })
        if (details?.data?.positionApplied && details?.data?.positionAppliedId && !this.mainParent.activePositionAppliedList.find((item) => (item.value === details.data.positionAppliedId))) {
          this.mainParent.activePositionAppliedList.push({ value: details.data.positionAppliedId, label: details.data.positionApplied }) // Add position applied in the list when not available.
        }
        // console.log(details)
        this.details = details.data
      } catch (error) {
        throw error
      }
    },
    getDropdownList() {
      this.mainParent.getActivePositionAppliedList()
      this.mainParent.getGenderList()
      this.mainParent.getMaritalStatusList()
      this.mainParent.getRaceList()
      this.mainParent.getQualificationsList()
      this.mainParent.getInterviewStatusList()
      this.mainParent.getInterviewerList()
      this.mainParent.getEmployeeHRList()
    },
    setData() {
      setTimeout(() => {
        // this.fields.forEach(v => this.form.getFieldDecorator(v))
        const { employeeName, positionAppliedId, email, genderId, idNumber, mobile, passportNumber, dateOfBirth, maritalStatusId, passportExpiryDate, raceId, qualificationsId, status, statusId, interviewer, address, interviewTime, secondInterviewTime, profilePicture, attachments, interviewCandidateScreening, interviewCandidateInterview } = this.details
        if (/General/ig.test(this.tab)) {
          this.form.setFieldsValue({
            employeeName: employeeName || undefined,
            positionApplied: positionAppliedId,
            email: email || undefined,
            gender: genderId || undefined,
            idNumber: idNumber || undefined,
            mobile: mobile || undefined,
            passportNumber: passportNumber || undefined,
            dateOfBirth: (dateOfBirth) ? moment(dateOfBirth) : undefined,
            maritalStatus: maritalStatusId || undefined,
            passportExpiryDate: (passportExpiryDate) ? moment(passportExpiryDate) : undefined,
            race: raceId || undefined,
            qualifications: qualificationsId || undefined,
            status: (statusId && status) ? `${statusId}/${String(status).replace(/(,\s*|,)/ig, ', ')}` : undefined,
            interviewer: (interviewer?.id && interviewer?.fullName) ? `${interviewer.id}/${String(interviewer.fullName).replace(/(,\s*|,)/ig, ', ')}` : undefined,
            address: address || undefined,
            interviewTime: (interviewTime) ? moment(interviewTime) : undefined,
            secondInterviewTime: (secondInterviewTime) ? moment(secondInterviewTime) : undefined
          })
          // this.image.fileList = [{ uid: profilePicture.id, name: profilePicture.fileOriginName, fileLink: profilePicture?.fileLink || undefined }]
          this.image.fileList = [ ...this.image.fileList ]
          this.image.url = this.image.url || profilePicture?.fileLink || undefined
          this.attached.fileList = [ ...((Array.isArray(attachments) && attachments.map((item) => ({ uid: item.id, name: item.fileOriginName, fileLink: item?.fileLink || undefined }))) || []), ...this.attached.fileList.filter((item) => !item?.fileLink) ]
        } else if (/Screening/ig.test(this.tab)) {
          const { screeningDate, employeeHR, screeningQuestionnaires } = interviewCandidateScreening || {}
          this.form.setFieldsValue({
            screeningDate: (screeningDate) ? moment(screeningDate) : undefined,
            employeeHrId: (employeeHR?.id && employeeHR?.fullName) ? `${employeeHR.id}/${String(employeeHR.fullName).replace(/(,\s*|,)/ig, ', ')}` : undefined
          })
          this.screeningQuestionnaires = (screeningQuestionnaires && Array.isArray(screeningQuestionnaires) && screeningQuestionnaires.map((item, index) => ({ key: index, ...item }))) || this.screeningQuestionnaires
        } else if (/Interview/ig.test(this.tab)) {
          const { ranks, interviewQuestionnaires } = interviewCandidateInterview || {}
          this.form.setFieldsValue({
            interviewer: interviewer?.fullName || undefined,
            interviewTime: this.formatDate(interviewTime, 'YYYY-MM-DD HH:mm:ss'),
            ranks: ranks || undefined
          })
          this.interviewQuestionnaires = (interviewQuestionnaires && Array.isArray(interviewQuestionnaires) && interviewQuestionnaires.map((item, index) => ({ key: index, ...item }))) || this.interviewQuestionnaires
        }
      })
    },
    handleSubmit(result) {
      this.form.validateFields((err) => !err && this.showInfo(result))
    },
    showInfo() {
      this.$confirm({
        title: this.$t('save.confirm'),
        okText: 'Yes',
        cancelText: 'No',
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          let data
          const method = (this.$route.query?.action === 'update' && (this.tab === 'General' || (this.tab === 'Screening' && this.details?.interviewCandidateScreening) || (this.tab === 'Interview' && this.details?.interviewCandidateInterview))) ? 'update' : 'add'
          switch (this.tab) {
            case 'General':
              data = new FormData()
              const previousAttachmentLinks = this.attached.fileList.filter((item) => item?.fileLink).map((item) => item?.fileLink)
              const interviewCandidate = {
                ...((this.details?.id) ? { id: this.details.id } : {}),
                ...((this.form.getFieldValue('employeeName')) ? { employeeName: this.form.getFieldValue('employeeName') } : {}),
                ...((this.form.getFieldValue('positionApplied')) ? { positionAppliedId: this.form.getFieldValue('positionApplied') } : {}),
                ...((this.form.getFieldValue('email')) ? { email: this.form.getFieldValue('email') } : {}),
                ...((this.form.getFieldValue('gender')) ? { gender: this.form.getFieldValue('gender') } : {}), // id
                ...((this.form.getFieldValue('idNumber')) ? { idNumber: this.form.getFieldValue('idNumber') } : {}),
                ...((this.form.getFieldValue('mobile')) ? { mobile: this.form.getFieldValue('mobile') } : {}),
                ...((this.form.getFieldValue('passportNumber')) ? { passportNumber: this.form.getFieldValue('passportNumber') } : {}),
                ...((this.form.getFieldValue('dateOfBirth')) ? { dateOfBirth: this.formatDate(this.form.getFieldValue('dateOfBirth'), 'YYYY-MM-DD') } : {}),
                ...((this.form.getFieldValue('maritalStatus')) ? { maritalStatus: this.form.getFieldValue('maritalStatus') } : {}), // id
                ...((this.form.getFieldValue('passportExpiryDate')) ? { passportExpiryDate: this.formatDate(this.form.getFieldValue('passportExpiryDate'), 'YYYY-MM-DD') } : {}),
                ...((this.form.getFieldValue('race')) ? { race: this.form.getFieldValue('race') } : {}), // id
                ...((this.form.getFieldValue('qualifications')) ? { qualifications: this.form.getFieldValue('qualifications') } : {}), // id
                ...((this.form.getFieldValue('status')) ? { status: String(this.form.getFieldValue('status')).split('/')[0] } : {}), // id
                ...((this.form.getFieldValue('interviewer')) ? { interviewerId: String(this.form.getFieldValue('interviewer')).split('/')[0] } : {}), // id
                ...((this.form.getFieldValue('address')) ? { address: this.form.getFieldValue('address') } : {}),
                ...((this.form.getFieldValue('interviewTime')) ? { interviewTime: this.formatDate(this.form.getFieldValue('interviewTime'), 'YYYY-MM-DD HH:mm:ss') } : {}),
                ...((this.form.getFieldValue('secondInterviewTime')) ? { secondInterviewTime: this.formatDate(this.form.getFieldValue('secondInterviewTime'), 'YYYY-MM-DD HH:mm:ss') } : {}),
                ...((previousAttachmentLinks.length > 0) ? { previousAttachmentLinks } : {})
              }
              // console.log(interviewCandidate)
              data.append((method === 'update') ? 'interviewCandidateUpdateParam' : 'interviewCandidateAddParam', new Blob([ JSON.stringify(interviewCandidate) ], { type: 'application/json' }))
              this.image.fileList.forEach((item) => { data.append(`profilePicture`, item) })
              this.attached.fileList.forEach((item) => { if (!item?.fileLink) { data.append(`attachments`, item) } })
              // FormData
              // const formData = {}
              // for (const key of data.keys()) {
              //     // console.log(`${key}:`, data.get(key))
              //     formData[key] = data.get(key)
              // }
              // console.log(formData)
              break
            case 'Screening':
              data = {
                ...((this.details?.id) ? { interviewCandidateId: this.details.id } : {}),
                ...((this.details?.interviewCandidateScreening?.id) ? { id: this.details.interviewCandidateScreening.id } : {}),
                ...((this.form.getFieldValue('screeningDate')) ? { screeningDate: this.formatDate(this.form.getFieldValue('screeningDate'), 'YYYY-MM-DD HH:mm:ss') } : {}),
                ...((this.form.getFieldValue('employeeHrId')) ? { employeeHrId: this.form.getFieldValue('employeeHrId').split('/')[0] } : {}), // id
                ...((this.screeningQuestionnaires.length > 0) ? { screeningQuestionnaires: this.screeningQuestionnaires.map((item) => ({ question: item.question, comments: item.comments })) } : {})
              }
              break
            case 'Interview':
              data = {
                ...((this.details?.id) ? { interviewCandidateId: this.details.id } : {}),
                ...((this.details?.interviewCandidateInterview?.id) ? { id: this.details.interviewCandidateInterview.id } : {}),
                // ...((this.form.getFieldValue('interviewTime')) ? { interviewTime: this.formatDate(this.form.getFieldValue('interviewTime'), 'YYYY-MM-DD HH:mm:ss') } : {}),
                // ...((this.form.getFieldValue('employeeHrId')) ? { employeeHrId: this.form.getFieldValue('employeeHrId').split('/')[0] } : {}), // id
                ...((this.form.getFieldValue('ranks')) ? { ranks: this.form.getFieldValue('ranks') } : {}),
                ...((this.interviewQuestionnaires.length > 0) ? { interviewQuestionnaires: this.interviewQuestionnaires.map((item) => ({ question: item.question, comments: item.comments })) } : {})
              }
              break
          }
          try {
            const response = await this.$store.dispatch(`api/interview/candidate/${method}${this.tab}`, data)
            // console.log(response.data)
            this.mainParent.changeView({ view: 'Form', query: { action: 'view' || ((this.$route.query?.action === 'add') ? 'update' : 'view'), id: (response.data?.interviewCandidateId || response.data?.id) } })
            // if (this.$route.query?.action === 'add') {
            //   this.mainParent.changeView({ view: 'Form', query: { action: 'update', id: (response.data?.interviewCandidateId || response.data?.id) } })
            // } else {
            //   this.mainParent.changeView({ view: 'View' })
            // }
            this.$notification.open({
              message: (method === 'update') ? this.$t(`notification.candidate-${String(this.tab).toLocaleLowerCase()}.updated`) : this.$t(`notification.candidate-${String(this.tab).toLocaleLowerCase()}.added`),
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
    },
    generateRange(start, end) {
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    },
    disabledFutureDate(current) {
      // Can not select days after today
      return current && current > moment().endOf('day')
    },
    disabledPassDate(current) {
      // Can not select days before today
      return current && current < moment().startOf('day')
    },
    disabledPassTime(current) {
      const selectedDate = moment(current).hour(0).minute(0).second(0)
      return {
        disabledHours: () => this.generateRange(0, 24).splice(0, ((selectedDate > moment()) ? selectedDate : moment()).hour()),
        disabledMinutes: () => this.generateRange(0, 60).splice(0, ((selectedDate > moment()) ? selectedDate : moment()).minute())
        // disabledSeconds: () => this.generateRange(0, 60).splice(0, ((selectedDate > moment()) ? selectedDate : moment()).second())
      }
    }
  },
  created() {
    this.initiate()
  }
}
</script>

<style lang="less">
  .edit-btn {
    display: block;
    margin: 0 0 0 auto;
  }

  .form {
    margin-top: 20px;

    .ant-form-item {
      display: flex;
    }

    .ant-form-item-label {
      width: 190px;
    }

    .ant-form-item-control-wrapper {
      flex: 1;
    }

    .ant-select {
      width: 100%;
    }
  }
</style>
