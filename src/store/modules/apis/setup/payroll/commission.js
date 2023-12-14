import { fetchList, addData, updateData, toggleDataStatus, deleteData, detail } from '@/api/setup/payroll/commission'

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
    async toggleStatus(_, payload) {
      try {
        return await toggleDataStatus(payload)
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
    async detail(_, payload) {
      try {
        return await detail(payload)
      } catch (error) {
        throw error
      }
    }
  }
}
