import { statistics } from '@/api/dashboard/admin'

export default {
  namespaced: true,
  actions: {
    async getStatistics(_, queryParams = {}) {
      try {
        return await statistics(queryParams)
      } catch (error) {
        throw error
      }
    }
  }
}
