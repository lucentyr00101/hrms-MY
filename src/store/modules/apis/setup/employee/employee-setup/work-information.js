import {
    add,
    update,
    updateAttachment,
    dropdownDepartment,
    dropdownLeaveGroup,
    dropdownImmediateSupervisor,
    dropdownClaimGroup,
    dropdownCalendar,
    dropdownActiveEmployee
} from '@/api/work-information'

export default {
    namespaced: true,
    actions: {
      async add (_, payload) {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await add(payload)
            resolve(res)
          } catch (e) {
            reject(e)
          }
        })
      },
      async update (_, payload) {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await update(payload)
            resolve(res)
          } catch (e) {
            reject(e)
          }
        })
      },
      async updateAttachment (_, payload) {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await updateAttachment(payload)
            resolve(res)
          } catch (e) {
            reject(e)
          }
        })
      },
      async dropdownDepartment ({ commit }, queryParameters = {}) {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await dropdownDepartment(queryParameters)
            resolve(res)
          } catch (e) {
            reject(e)
          }
        })
      },
      async dropdownLeaveGroup ({ commit }, queryParameters = {}) {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await dropdownLeaveGroup(queryParameters)
            resolve(res)
          } catch (e) {
            reject(e)
          }
        })
      },
      async dropdownImmediateSupervisor ({ commit }, queryParameters = {}) {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await dropdownImmediateSupervisor(queryParameters)
            resolve(res)
          } catch (e) {
            reject(e)
          }
        })
      },
      async dropdownActiveEmployee ({ commit }, queryParameters = {}) {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await dropdownActiveEmployee(queryParameters)
            resolve(res)
          } catch (e) {
            reject(e)
          }
        })
      },
      async dropdownClaimGroup ({ commit }, queryParameters = {}) {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await dropdownClaimGroup(queryParameters)
            resolve(res)
          } catch (e) {
            reject(e)
          }
        })
      },
      async dropdownCalendar ({ commit }, queryParameters = {}) {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await dropdownCalendar(queryParameters)
            resolve(res)
          } catch (e) {
            reject(e)
          }
        })
      }
    }
  }
