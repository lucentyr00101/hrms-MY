import { fetchList, fetchDetails, fetchAcknowledgedList, addData, updateData, toggleDataStatus, acknowledgeData, deleteData } from '@/api/setup/company/announcement'

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
    async fetchDetails(_, params = {}) {
      try {
        return await fetchDetails(params)
      } catch (error) {
        throw error
      }
    },
    async fetchAcknowledgedList(_, params = {}) {
      try {
        return await fetchAcknowledgedList(params)
      } catch (error) {
        throw error
      }
    },
    async add(_, payload) {
      try {
        return await addData(payload)
      } catch (error) {
        throw error
      }
    },
    async update(_, payload) {
      try {
        return await updateData(payload)
      } catch (error) {
        throw error
      }
    },
    async toggleStatus(_, payload) {
      try {
        return await toggleDataStatus(payload)
      } catch (error) {
        throw error
      }
    },
    async acknowledge(_, payload) {
      try {
        return await acknowledgeData(payload)
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
