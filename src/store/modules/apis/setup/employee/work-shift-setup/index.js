import {
    fetchList,
    addWorkShiftSetup,
    updateWorkShiftSetup,
    deleteAddWorkShiftSetup,
    dropdownWorkShiftRateType
} from '@/api/setup/employee/work-shift-setup'

export default {
    namespaced: true,
    actions: {
        async fetchList (_, queryParameters = {}) {
            return new Promise(async (resolve, reject) => {
                try {
                const res = await fetchList(queryParameters)
                resolve(res)
                } catch (e) {
                reject(e)
                }
            })
        },
        async addWorkShiftSetup (_, payload) {
            return new Promise(async (resolve, reject) => {
                try {
                const res = await addWorkShiftSetup(payload)
                resolve(res)
                } catch (e) {
                reject(e)
                }
            })
        },
        async updateWorkShiftSetup(_, payload) {
            return new Promise(async (resolve, reject) => {
              try {
                const res = await updateWorkShiftSetup(payload)
                resolve(res)
              } catch (e) {
                reject(e)
              }
            })
          },
        async deleteAddWorkShiftSetup (_, payload) {
            try {
              return await deleteAddWorkShiftSetup(payload)
            } catch (e) {
              throw e
            }
        },
        async dropdownWorkShiftRateType ({ commit }, queryParameters = {}) {
            return new Promise(async (resolve, reject) => {
              try {
                const res = await dropdownWorkShiftRateType(queryParameters)
                resolve(res)
              } catch (e) {
                reject(e)
              }
            })
        }
    }
}
