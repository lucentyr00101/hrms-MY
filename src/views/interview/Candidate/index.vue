<template>
  <component :is="view"/>
</template>

<script>
import List from './List'
import Form from './Form'

export default {
  name: 'InterviewCandidate',
  components: {
    List,
    Form
  },
  data() {
    return {
      view: this.$route.query?.view || 'List',
      interviewCandidatesList: {
        id: [],
        name: [],
        email: [],
        positionApplied: [],
        interviewer: []
      },
      allPositionAppliedList: [],
      activePositionAppliedList: [],
      genderList: [],
      maritalStatusList: [],
      raceList: [],
      qualificationsList: [],
      interviewStatusList: [],
      interviewerList: [],
      employeeHRList: []
    }
  },
  methods: {
    initiate() {
      this.changeView({ view: this.view, query: this.$route.query })
    },
    changeView(payload = {}) {
      const { view = 'List', query = {} } = payload
      const newView = this.$options.components?.[view]
      this.view = (newView) ? view : 'List'
      // if (this.$route.query?.view !== view || this.view !== view) {
        this.$router.push({ query: { view: this.view, ...query } })
      // }
    },
    async getInterviewCandidatesList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchInterviewCandidatesDropdown')
        // console.log(list)
        this.interviewCandidatesList = { id: [], name: [], email: [], positionApplied: [], interviewer: [] }
        Array.isArray(list?.data) && list.data.forEach((item) => {
          // console.log(item)
          this.interviewCandidatesList.id = [ ...this.interviewCandidatesList.id, ...((this.interviewCandidatesList.id.find((data) => (data?.value === item.idNumber)) || !item.idNumber) ? [] : [ { value: item.idNumber, label: item.idNumber } ]) ]
          this.interviewCandidatesList.name = [ ...this.interviewCandidatesList.name, ...((this.interviewCandidatesList.name.find((data) => (data?.value === item.employeeName)) || !item.employeeName) ? [] : [ { value: item.employeeName, label: item.employeeName } ]) ]
          this.interviewCandidatesList.email = [ ...this.interviewCandidatesList.email, ...((this.interviewCandidatesList.email.find((data) => (data?.value === item.email)) || !item.email) ? [] : [ { value: item.email, label: item.email } ]) ]
          this.interviewCandidatesList.positionApplied = [ ...this.interviewCandidatesList.positionApplied, ...((this.interviewCandidatesList.positionApplied.find((data) => (data?.value === item.positionApplied)) || !item.positionApplied) ? [] : [ { value: item.positionApplied, label: item.positionApplied } ]) ]
          this.interviewCandidatesList.interviewer = [ ...this.interviewCandidatesList.interviewer, ...((this.interviewCandidatesList.interviewer.find((data) => (data?.value === item.interviewer)) || !item.interviewer) ? [] : [ { value: item.interviewer, label: item.interviewer } ]) ]
        })
        // console.log(this.interviewCandidatesList)
      } catch (error) {
        throw error
      }
    },
    async getAllPositionAppliedList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchInterviewPositionDropdown')
        this.allPositionAppliedList = list?.data?.data.map((item) => ({ value: item.id, label: item.position }))
      } catch (error) {
        throw error
      }
    },
    async getActivePositionAppliedList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchInterviewPositionDropdown')
        this.activePositionAppliedList = list?.data?.data.filter((item) => (item.status === 'Enable')).map((item) => ({ value: item.id, label: item.position }))
      } catch (error) {
        throw error
      }
    },
    async getGenderList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchGenderTypeDropdown')
        this.genderList = list?.data?.genderType.map((item) => ({ value: item.id, label: item.genderType }))
      } catch (error) {
        throw error
      }
    },
    async getMaritalStatusList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchMaritalStatusTypeDropdown')
        this.maritalStatusList = list?.data?.maritalStatusType.map((item) => ({ value: item.id, label: item.maritalStatusType }))
      } catch (error) {
        throw error
      }
    },
    async getRaceList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchRaceTypeDropdown')
        this.raceList = list?.data?.raceType.map((item) => ({ value: item.id, label: item.raceType }))
      } catch (error) {
        throw error
      }
    },
    async getQualificationsList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchEmployeeQualificationsDropdown')
        this.qualificationsList = list?.data?.employeeQualification.map((item) => ({ value: item.id, label: item.qualifications }))
      } catch (error) {
        throw error
      }
    },
    async getInterviewStatusList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchInterviewStatusDropdown')
        this.interviewStatusList = list?.data?.interviewStatusType.map((item) => ({ value: `${item.id}/${String(item.interviewStatusType).replace(/(,\s*|,)/ig, ', ')}`, label: String(item.interviewStatusType).replace(/(,\s*|,)/ig, ', ') }))
      } catch (error) {
        throw error
      }
    },
    async getInterviewerList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchActiveEmployeeDropdown')
        this.interviewerList = list?.data?.employeeDetailSmallResponses.map((item) => ({ value: `${item.id}/${String(item.fullName).replace(/(,\s*|,)/ig, ', ')}`, label: String(item.fullName).replace(/(,\s*|,)/ig, ', ') }))
      } catch (error) {
        throw error
      }
    },
    async getEmployeeHRList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchEmployeesHRDropdown')
        this.employeeHRList = list?.data?.map((item) => ({ value: `${item.id}/${String(item.fullName).replace(/(,\s*|,)/ig, ', ')}`, label: String(item.fullName).replace(/(,\s*|,)/ig, ', ') }))
      } catch (error) {
        throw error
      }
    }
  },
  created() {
    this.initiate()
  }
}
</script>

<style scoped></style>
