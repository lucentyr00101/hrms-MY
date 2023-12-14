import { fetchDetails, updateGeneralInfo, updateEpfInfo, updateEisInfo, updateTaxInfo, updateSocsoInfo } from '@/api/setup/company/company-profile'

export default {
  namespaced: true,
  actions: {
    async fetchDetails(_, params = {}) {
      try {
        return await fetchDetails(params)
      } catch (error) {
        throw error
      }
    },
    async updateGeneralInfo(_, payload) {
      try {
        return await updateGeneralInfo(payload)
      } catch (error) {
        throw error
      }
    },
    async updateEpfInfo(_, payload) {
      try {
        return await updateEpfInfo(payload)
      } catch (error) {
        throw error
      }
    },
    async updateEisInfo(_, payload) {
      try {
        return await updateEisInfo(payload)
      } catch (error) {
        throw error
      }
    },
    async updateTaxInfo(_, payload) {
      try {
        return await updateTaxInfo(payload)
      } catch (error) {
        throw error
      }
    },
    async updateSocsoInfo(_, payload) {
      try {
        return await updateSocsoInfo(payload)
      } catch (error) {
        throw error
      }
    }
  }
}
