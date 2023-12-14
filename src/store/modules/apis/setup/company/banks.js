import { fetchList, addBank, deleteData, updateBank } from '@/api/setup/company/banks'

export default {
  namespaced: true,
  actions: {
    async fetchList(_, queryParameters = {}) {
      try {
        return await fetchList(queryParameters)
      } catch (e) {
        throw e
      }
    },
    async addBank(_, payload) {
      try {
        return await addBank(payload)
      } catch (e) {
        throw e
      }
    },
    async delete(_, payload) {
      try {
        return await deleteData(payload)
      } catch (e) {
        throw e
      }
    },
    async updateBank(_, payload) {
      try {
        return await updateBank(payload)
      } catch (e) {
        throw e
      }
    }
  }
}
