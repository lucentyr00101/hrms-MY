import { fetchList, fetchDetail, addEPF, deleteEPF, updateEPF, toggleStatus } from '@/api/setup/payroll/epf'

export default {
  namespaced: true,
  actions: {
    async fetchList(_, queryParameters = {}) {
      return new Promise(async (resolve, reject) => {
        const res = await fetchList(queryParameters)
        resolve(res)
      })
    },
    async fetchDetail(_, queryParameters = {}) {
      return new Promise(async (resolve, reject) => {
        const res = await fetchDetail(queryParameters)
        resolve(res)
      })
    },
    async addEPF(_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await addEPF(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async updateEPF(_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await updateEPF(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async deleteEPF(_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await deleteEPF(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async updateStatus(_, { id, status }) {
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
