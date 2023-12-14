import { fetchList, exportList, fetchDetails, addData, updateData, approveStatus, rejectStatus, deleteData } from '@/api/main/hr/claim-transactions'

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
    async approve(_, payload) {
      try {
        return await approveStatus(payload)
      } catch (error) {
        throw error
      }
    },
    async reject(_, payload) {
      try {
        return await rejectStatus(payload)
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
