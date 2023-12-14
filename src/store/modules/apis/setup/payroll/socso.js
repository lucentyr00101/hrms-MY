import { fetchList, add, update, deleteSocso, toggleStatus } from '@/api/socso'

export default {
  namespaced: true,
  actions: {
    async fetchList (_, queryParameters = {}) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetchList(queryParameters)
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    async add (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await add(payload)
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    async update (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await update(payload)
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    async deleteSocso (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await deleteSocso(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async toggleStatus (_, { id, status }) {
      status = status ? 'Enable' : 'Disable'
      return new Promise(async (resolve, reject) => {
        try {
          const res = await toggleStatus({ id, status })
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
