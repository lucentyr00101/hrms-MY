import {
  updateStatus,
  userWorkDetail,
  loginUserDetail,
  userTodayAttendance,
  offsetAndLeaveBalance,
  leaveBalance,
  offsetBalance,
  otAndHours
} from '@/api/dashboard/dashboard-list'

export default {
  namespaced: true,
  actions: {
    async updateStatus(_, payload) {
      try {
        return await updateStatus(payload)
      } catch (error) {
        throw error
      }
    },
    async userWorkDetail(_, queryParameters = {}) {
      try {
        return await userWorkDetail(queryParameters)
      } catch (error) {
        throw error
      }
    },
    async loginUserDetail(_, queryParameters = {}) {
      try {
        return await loginUserDetail(queryParameters)
      } catch (error) {
        throw error
      }
    },
    async userTodayAttendance(_, queryParameters = {}) {
      try {
        return await userTodayAttendance(queryParameters)
      } catch (error) {
        throw error
      }
    },
    async offsetAndLeaveBalance(_, queryParameters = {}) {
      try {
        return await offsetAndLeaveBalance(queryParameters)
      } catch (error) {
        throw error
      }
    },
    async leaveBalance(_, queryParameters = {}) {
      try {
        return await leaveBalance(queryParameters)
      } catch (error) {
        throw error
      }
    },
    async offsetBalance(_, queryParameters = {}) {
      try {
        return await offsetBalance(queryParameters)
      } catch (error) {
        throw error
      }
    },
    async otAndHours(_, queryParameters = {}) {
      try {
        return await otAndHours(queryParameters)
      } catch (error) {
        throw error
      }
    }
  }
}
