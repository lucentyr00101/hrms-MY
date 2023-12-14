import {
  claimTypeAdd,
  claimTypeDelete,
  claimTypeFetchList,
  claimTypeToggleStatus,
  claimTypeUpdate
} from '@/api/claim-type'
export default {
  namespaced: true,
  actions: {
    async fetchClaimTypeList(_, data) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await claimTypeFetchList(data)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async claimTypeAdd(_, data) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await claimTypeAdd(data)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async claimTypeDelete(_, data) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await claimTypeDelete(data)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async claimTypeToggleStatus(_, data) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await claimTypeToggleStatus(data)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async claimTypeUpdate(_, data) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await claimTypeUpdate(data)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    }
  }
}
