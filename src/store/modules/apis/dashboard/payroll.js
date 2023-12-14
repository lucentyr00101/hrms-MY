import { statistics, payroll } from '@/api/dashboard/payroll'

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
    async getPayroll(_, queryParams = {}) {
      try {
        return await payroll(queryParams)
      } catch (error) {
        throw error
      }
    }
  }
}
