import {
  fetchList,
  addEis,
  updateEis,
  deleteEis,
  toggleStatus
} from '@/api/setup/payroll/eis'

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
    async addEis (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await addEis(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async updateEis (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await updateEis(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async deleteEis (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await deleteEis(payload)
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
