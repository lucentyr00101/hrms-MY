import { fetchList, addQualification, deleteData, update } from '@/api/setup/employee/qualification'

export default {
  namespaced: true,
  actions: {
    async fetchList(_, queryParameters = {}) {
      try {
        return await fetchList(queryParameters)
      } catch (error) {
        throw error
      }
    },
    async add(_, payload) {
      try {
        return await addQualification(payload)
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
    },
    async update(_, payload) {
      try {
        return await update(payload)
      } catch (error) {
        throw error
      }
    }
  }
}
