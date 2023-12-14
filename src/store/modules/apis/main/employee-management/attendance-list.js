import {
  search,
  list,
  add,
  update,
  updateEmployeeAttendance,
  fetchDetail,
  deleteData,
  exportData,
  status
} from '@/api/main/employee-management/attendance-list'

import moment from 'moment'

const downloadFromBlob = (blob, filename) => {
  const blobData = new Blob([blob], { type: 'application/vnd.ms-excel;charset=UTF-8' })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blobData)
  link.download = filename
  link.click()
}

export default {
  namespaced: true,
  actions: {
    async fetchList(_, queryParameters = {}) {
      return new Promise(async (resolve, reject) => {
        const res = await list(queryParameters)
        resolve(res)
      })
    },
    async fetchDetail(_, queryParameters = {}) {
      return new Promise(async (resolve, reject) => {
        const res = await fetchDetail(queryParameters)
        resolve(res)
      })
    },
    async searchAttendance(_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await search(payload)
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    async addAttendance(_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await add(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async updateAttendance(_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await update(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async updateEmployeeAttendance(_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await updateEmployeeAttendance(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async updateStatusAttendance(_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await status(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async deleteAttendance(_, payload) {
      try {
        return await deleteData(payload)
      } catch (e) {
        throw e
      }
    },
    async exportData(_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await exportData(payload)
          const date = moment().format('YYYYMMDDHHmmss')
          downloadFromBlob(res, `EmployeeManagement_AttendanceLists_ExportedFile_${date}.csv`)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    }
  }
}
