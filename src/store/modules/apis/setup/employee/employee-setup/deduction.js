import {
    fetchList,
    addDeduction,
    dropdownDeduction,
    updateDeduction,
    deleteDeduction
  } from '@/api/setup/employee/employeeSetup/deduction'

  export default {
    namespaced: true,
    actions: {
      async fetchList ({ commit }, queryParameters = {}) {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await fetchList(queryParameters)
            resolve(res)
          } catch (e) {
            reject(e)
          }
        })
      },
      async addDeduction (_, payload) {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await addDeduction(payload)
            resolve(res)
          } catch (e) {
            reject(e)
          }
        })
      },
      async dropdownDeduction ({ commit }, queryParameters = {}) {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await dropdownDeduction(queryParameters)
            resolve(res)
          } catch (e) {
            reject(e)
          }
        })
      },
      async updateDeduction (_, payload) {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await updateDeduction(payload)
            resolve(res)
          } catch (error) {
            reject(error)
          }
        })
      },
      async deleteDeduction (_, queryParameters = {}) {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await deleteDeduction(queryParameters)
            resolve(res)
          } catch (e) {
            reject(e)
          }
        })
      }
    }
  }
