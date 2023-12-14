import { fetchList, addDeduction, toggleStatus, updateDeduction, deleteDeduction } from '@/api/setup/payroll/deduction'

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
    async toggleStatus(_, { id, status }) {
      try {
        return await toggleStatus({ id, status })
      } catch (error) {
        throw error
      }
    },
    async add(_, payload) {
      try {
        return await addDeduction(payload)
      } catch (error) {
        throw error
      }
    },
    async update(_, payload) {
      try {
        return await updateDeduction(payload)
      } catch (error) {
        throw error
      }
    },
    async delete(_, payload) {
      try {
        return await deleteDeduction(payload)
      } catch (error) {
        throw error
      }
    }
  }
}
