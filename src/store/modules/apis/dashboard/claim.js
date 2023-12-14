import { statistics, claimAll } from '@/api/dashboard/claim'

export default {
  namespaced: true,
  actions: {
    async getStatistics(_, queryParams = {}) {
      try {
        return await statistics(queryParams)
      } catch (error) {
        throw error
      }
    },
    async getClaimAll(_, queryParams = {}) {
      try {
        return await claimAll(queryParams)
      } catch (error) {
        throw error
      }
    }
  }
}
