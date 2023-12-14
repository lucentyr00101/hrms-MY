<template>
  <component :is="view"/>
</template>

<script>
import List from './List'
import Form from './Form'

export default {
  name: 'InterviewInterview',
  components: {
    List,
    Form
  },
  data() {
    return {
      view: this.$route.query?.view || 'List',
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
      this.changeView({ view: this.view })
    },
    changeView(payload = {}) {
      const { view = 'List', query = {} } = payload
      const newView = this.$options.components?.[view]
      this.view = (newView) ? view : 'List'
      // if (this.$route.query?.view !== view || this.view !== view) {
        this.$router.push({ query: { ...{ ...this.$route.query, ...query }, view: this.view } })
      // }
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
        const list = await this.$store.dispatch('api/dropdown/fetchNationalityTypeDropdown')
        this.raceList = list?.data?.nationalityType.map((item) => ({ value: item.id, label: item.nationalityType }))
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
        this.interviewStatusList = list?.data?.interviewStatusType.filter((item) => (item.interviewStatusType !== 'All')).map((item) => ({ value: `${item.id}/${String(item.interviewStatusType).replace(/(,\s*|,)/ig, ', ')}`, label: String(item.interviewStatusType).replace(/(,\s*|,)/ig, ', ') }))
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
