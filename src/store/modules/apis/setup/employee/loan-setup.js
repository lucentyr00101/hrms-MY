import { fetchList, addData, updateData, deleteData } from '@/api/setup/employee/loan-setup'

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
    async delete(_, payload) {
      try {
        return await deleteData(payload)
      } catch (error) {
        throw error
      }
    }
  }
}
