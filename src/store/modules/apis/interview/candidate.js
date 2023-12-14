import { fetchList, exportList, fetchDetails, addGeneral, addScreening, addInterview, updateGeneral, updateScreening, updateInterview, deleteData } from '@/api/interview/candidate'

export default {
  namespaced: true,
  actions: {
    async fetchList(_, params = {}) {
      try {
        return await fetchList(params)
      } catch (error) {
        throw error
      }
    },
    async exportList(_, params = {}) {
      try {
        return await exportList(params)
      } catch (error) {
        throw error
      }
    },
    async fetchDetails(_, params = {}) {
      try {
        return await fetchDetails(params)
      } catch (error) {
        throw error
      }
    },
    async addGeneral(_, payload) {
      try {
        return await addGeneral(payload)
      } catch (error) {
        throw error
      }
    },
    async addScreening(_, payload) {
      try {
        return await addScreening(payload)
      } catch (error) {
        throw error
      }
    },
    async addInterview(_, payload) {
      try {
        return await addInterview(payload)
      } catch (error) {
        throw error
      }
    },
    async updateGeneral(_, payload) {
      try {
        return await updateGeneral(payload)
      } catch (error) {
        throw error
      }
    },
    async updateScreening(_, payload) {
      try {
        return await updateScreening(payload)
      } catch (error) {
        throw error
      }
    },
    async updateInterview(_, payload) {
      try {
        return await updateInterview(payload)
      } catch (error) {
        throw error
      }
    },
    async delete(_, payload) {
      try {
        return await deleteData(payload)
      } catch (error) {
        throw error
      }
    }
  }
}
