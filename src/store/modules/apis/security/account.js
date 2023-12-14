import {
  resetPassword,
  updateDisplayName,
  uploadPhoto
} from '@/api/account'

export default {
  namespaced: true,
  actions: {
    resetPassword (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await resetPassword(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    uploadPhoto (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await uploadPhoto(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    updateDisplayName (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await updateDisplayName(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    }
  }
}
