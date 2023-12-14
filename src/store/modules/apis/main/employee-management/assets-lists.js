import {
  deleteData,
  search,
  fetchAssetsList,
  add,
  handover,
  returnAssets,
  update,
  exportData
} from '@/api/main/employee-management/assets-lists'
import moment from 'moment'
import { downloadFromBlob } from '@/utils/util'

export default {
  namespaced: true,
  actions: {
    async fetchList(_, queryParameters = {}) {
      try {
        return await fetchAssetsList(queryParameters)
      } catch (error) {
        throw error
      }
    },
    async export(_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await exportData(payload)
          const date = moment().format('YYYYMMDDHHmmss')
          downloadFromBlob(res, `Employee_Management_AssetsLists_${date}.csv`)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async search(_, queryParameters = {}) {
      try {
        return await search(queryParameters)
      } catch (error) {
        throw error
      }
    },
    async add(_, payload) {
      try {
        return await add(payload)
      } catch (error) {
        throw error
      }
    },
    async update(_, payload) {
      try {
        return await update(payload)
      } catch (error) {
        throw error
      }
    },
    async delete(_, payload) {
      try {
        return await deleteData(payload)
      } catch (error) {
        throw error
      }
    },
    async handover(_, id) {
      try {
        return await handover(id)
      } catch (error) {
        throw error
      }
    },
    async returnAssets(_, { data }) {
      try {
        return await returnAssets(data)
      } catch (error) {
        throw error
      }
    }
  }
}
