import {
  fetchList,
  fetchDetail,
  addAllowance,
  toggleStatus,
  updateAllowance,
  deleteAllowance
} from '@/api/setup/payroll/allowance'

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
    async fetchDetail(_, params = {}) {
      try {
        return await fetchDetail(params)
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
        return await addAllowance(payload)
      } catch (error) {
        throw error
      }
    },
    async update(_, payload) {
      try {
        return await updateAllowance(payload)
      } catch (error) {
        throw error
      }
    },
    async delete(_, payload) {
      try {
        return await deleteAllowance(payload)
      } catch (error) {
        throw error
      }
    }
  }
}
