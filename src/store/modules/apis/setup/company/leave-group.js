import {
  fetchList,
  addLeaveGroup,
  toggleStatus,
  updateLeaveGroup,
  deleteLeaveGroup
} from '@/api/setup/company/leave-group'

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
    async addLeaveGroup (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await addLeaveGroup(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async updateLeaveGroup (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await updateLeaveGroup(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async deleteLeaveGroup (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await deleteLeaveGroup(payload)
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
