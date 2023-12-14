import {
  fetchList,
  addAttendance,
  updateAttendance,
  deleteAttendance,
  fetchDropdowns
} from '@/api/attendance-setup'

export default {
  namespaced: true,
  actions: {
    async fetchDropdowns (_, queryParameters = {}) {
      try {
        return await fetchDropdowns(queryParameters)
      } catch (e) {
        throw e
      }
    },
    async fetchList (_, queryParameters = {}) {
      try {
        return await fetchList(queryParameters)
      } catch (e) {
        throw e
      }
    },
    async addAttendance (_, payload) {
      try {
        return await addAttendance(payload)
      } catch (e) {
        throw e
      }
    },
    async updateAttendance (_, payload) {
      try {
        return await updateAttendance(payload)
      } catch (e) {
        throw e
      }
    },
    async deleteAttendance (_, payload) {
      try {
        return await deleteAttendance(payload)
      } catch (e) {
        throw e
      }
    }
  }
}
