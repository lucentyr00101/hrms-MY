import {
  fetchList,
  addLeaveType,
  toggleStatus,
  updateLeaveType,
  deleteLeaveType
} from '@/api/setup/company/leave-type'

export default {
  namespaced: true,
  actions: {
    async fetchList (_, queryParameters = {}) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetchList(queryParameters)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async addLeaveType (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await addLeaveType(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async updateLeaveType (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await updateLeaveType(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async deleteLeaveType (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await deleteLeaveType(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async updateStatus (_, { id, status }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await toggleStatus({ id, status })
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    }
  }
}
