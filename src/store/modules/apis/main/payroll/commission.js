import { add, all, deleteCommission, detail, exportData, search, update } from '@/api/main/payroll/commission'

export default {
  namespaced: true,
  actions: {
    async add(_, data) {
      try {
        return await add(data)
      } catch (error) {
        throw error
      }
    },
    async all(_, data) {
      try {
        return await all(data)
      } catch (error) {
        throw error
      }
    },
    async deleteCommission(_, data) {
      try {
        return await deleteCommission(data)
      } catch (error) {
        throw error
      }
    },
    async detail(_, data) {
      try {
        return await detail(data)
      } catch (error) {
        throw error
      }
    },
    async exportData(_, data) {
      try {
        return await exportData(data)
      } catch (error) {
        throw error
      }
    },
    async search(_, data) {
      try {
        return await search(data)
      } catch (error) {
        throw error
      }
    },
    async update(_, data) {
      try {
        return await update(data)
      } catch (error) {
        throw error
      }
    }
  }
}
