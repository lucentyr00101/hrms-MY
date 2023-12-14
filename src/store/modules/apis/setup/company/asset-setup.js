import { fetchList, add, search, exportData, update, deleteData } from '@/api/company-assets'
import { downloadFromBlob } from '@/utils/util'
import moment from 'moment'

export default {
  namespaced: true,
  actions: {
    async fetchList(_, queryParameters = {}) {
      try {
        return await fetchList(queryParameters)
      } catch (e) {
        throw e
      }
    },
    async add(_, payload) {
      try {
        return await add(payload)
      } catch (e) {
        throw e
      }
    },
    async update(_, payload) {
      try {
        return await update(payload)
      } catch (e) {
        throw e
      }
    },
    async deleteData(_, payload) {
      try {
        return await deleteData(payload)
      } catch (error) {
        throw error
      }
    },
    async search(_, payload) {
      try {
        return await search(payload)
      } catch (e) {
        throw e
      }
    },
    async exportData(_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await exportData(payload)
          const date = moment().format('YYYYMMDDHHmmss')
          downloadFromBlob(res, `Company_AssetsSetup_${date}.csv`)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    }
  }
}
