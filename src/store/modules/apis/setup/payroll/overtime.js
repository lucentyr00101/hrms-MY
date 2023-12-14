import { fetchOvertimeList, addOvertime, updateOvertime, toggleStatus, deleteOvertime } from '@/api/setup/payroll/overtime'

export default {
  namespaced: true,
  actions: {
    async fetchOvertimeList (_, queryParameters = {}) {
      return new Promise(async (resolve, reject) => {
        const res = await fetchOvertimeList(queryParameters)
        resolve(res)
      })
    },
    async addOvertime (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await addOvertime(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async updateOvertime (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await updateOvertime(payload)
          resolve(res)
        } catch (error) {
          reject(error)
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
    },

    async deleteOvertime (_, queryParameters = {}) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await deleteOvertime(queryParameters)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    }
  }
}
