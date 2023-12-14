import { statistics, leaveToday } from '@/api/dashboard/leave'

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
    async getLeaveToday(_, queryParams = {}) {
      try {
        return await leaveToday(queryParams)
      } catch (error) {
        throw error
      }
    }
  }
}
