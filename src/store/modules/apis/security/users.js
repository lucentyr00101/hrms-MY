import {
  fetchList as _fetchList,
  addUser,
  toggleStatus,
  fetchDetail,
  fetchDropdownList,
  resetPassword,
  updateUser,
  deleteUsers
} from '@/api/users'

export default {
  namespaced: true,
  actions: {
    async deleteUsers (_, payload) {
      try {
        return await deleteUsers(payload)
      } catch (e) {
        throw e
      }
    },
    async updateUser (_, payload) {
      try {
        return await updateUser(payload)
      } catch (e) {
        throw e
      }
    },
    async resetPassword (_, payload) {
      try {
        return await resetPassword(payload)
      } catch (e) {
        throw e
      }
    },
    async fetchList (_, queryParameters = {}) {
      try {
        return await _fetchList(queryParameters)
      } catch (e) {
        throw e
      }
    },
    async fetchDetail (_, queryParameters = {}) {
      try {
        return await fetchDetail(queryParameters)
      } catch (e) {
        throw e
      }
    },
    async addUser (_, payload) {
      try {
        return await addUser(payload)
      } catch (e) {
        throw e
      }
    },
    async updateStatus (_, { id, status }) {
      try {
        return await toggleStatus({ id, status })
      } catch (e) {
        throw e
      }
    },
    async fetchDropdownList (_, payload) {
      try {
        return await fetchDropdownList(payload)
      } catch (e) {
        throw e
      }
    }
  }
}
