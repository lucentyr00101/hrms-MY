import { fetchList, exportList } from '@/api/reports/leave-report'

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
    }
  }
}
