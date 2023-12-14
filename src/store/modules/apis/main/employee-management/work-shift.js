import {
  fetchList, search, exportData, addWorkShift, updateWorkShift, deleteWorkShift
} from '@/api/main/employee-management/work-shift'
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
    async fetchList(_, params = {}) {
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
    async exportData (_, payload) {
      try {
        const res = await exportData(payload)
        const date = moment().format('YYYYMMDDHHmmss')
        downloadFromBlob(res, `EmployeeManagement_WorkShift_ExportedFile_${date}.csv`)
        return res
      } catch (error) {
        throw error
      }
    },
    async add(_, payload) {
      try {
        return await addWorkShift(payload)
      } catch (error) {
        throw error
      }
    },
    async update(_, payload) {
      try {
        return await updateWorkShift(payload)
      } catch (error) {
        throw error
      }
    },
    async delete(_, payload) {
      try {
        return await deleteWorkShift(payload)
      } catch (error) {
        throw error
      }
    }
  }
}
