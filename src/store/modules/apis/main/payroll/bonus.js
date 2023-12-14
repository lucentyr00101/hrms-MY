import { fetchList, search, exportData, addBonus, updateBonus, deleteBonus } from '@/api/bonus'
import moment from 'moment'

const downloadFromBlob = (blob, filename) => {
  const blobData = new Blob([blob])
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blobData)
  link.download = filename
  link.click()
}
export default {
  namespaced: true,
  actions: {
    async list(_, params = {}) {
      try {
        return await fetchList(params)
      } catch (error) {
        throw error
      }
    },
    async search(_, params = {}) {
      try {
        return await search(params)
      } catch (error) {
        throw error
      }
    },
    async exportData(_, payload) {
      try {
        const res = await exportData(payload)
        const date = moment().format('YYYYMMDDHHmmss')
        downloadFromBlob(res, `Payroll_Bonus_ExportedFile_${date}.csv`)
        return res
      } catch (error) {
        throw error
      }
    },
    async add(_, payload) {
      try {
        return await addBonus(payload)
      } catch (error) {
        throw error
      }
    },
    async update(_, payload) {
      try {
        return await updateBonus(payload)
      } catch (error) {
        throw error
      }
    },
    async delete(_, payload) {
      try {
        return await deleteBonus(payload)
      } catch (error) {
        throw error
      }
    }
  }
}
