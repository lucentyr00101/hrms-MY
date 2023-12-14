import { statistics, attendanceToday } from '@/api/dashboard/attendance'

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
    async getAttendance(_, queryParams = {}) {
      try {
        return await attendanceToday(queryParams)
      } catch (error) {
        throw error
      }
    }
  }
}
