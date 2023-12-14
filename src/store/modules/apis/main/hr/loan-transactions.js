import { search, list, add, update, status, deleteData, exportData } from '@/api/main/hr/loan-transactions'
import { downloadFromBlob } from '@/utils/util'
import moment from 'moment'

export default {
  namespaced: true,
  actions: {
    async list(_, queryParameters = {}) {
      try {
        return await list(queryParameters)
      } catch (error) {
        throw error
      }
    },
    async search(_, payload) {
      try {
        return await search(payload)
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
    async status(_, payload) {
      try {
        return await status(payload)
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
    async export(_, payload) {
      try {
        const res = await exportData(payload)
        const date = moment().format('YYYYMMDDHHmmss')
        downloadFromBlob(res, `HR_LoanTransactions_${date}.csv`)
        return res
      } catch (error) {
        throw error
      }
    }
  }
}
