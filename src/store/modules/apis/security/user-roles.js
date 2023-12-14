import {
  fetchList as _fetchList,
  addRole,
  toggleStatus,
  renameRole,
  deleteRoles,
  dataAccess,
  accessLayers,
  getDataAccess,
  getSecurityPermission,
  setPermission
} from '@/api/user-roles'

export default {
  namespaced: true,
  actions: {
    async fetchDataAccess (_, payload = {}) {
      try {
        return await getDataAccess(payload)
      } catch (e) {
        throw e
      }
    },
    async fetchAccessLayer (_, payload) {
      try {
        return await accessLayers(payload)
      } catch (e) {
        throw e
      }
    },
    async dataAccess (_, payload) {
      try {
        return await dataAccess(payload)
      } catch (e) {
        throw e
      }
    },
    async deleteRoles (_, queryParameters = {}) {
      try {
        return await deleteRoles(queryParameters)
      } catch (e) {
        throw e
      }
    },
    async renameRole (_, queryParameters = {}) {
      try {
        return await renameRole(queryParameters)
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
    async addRole (_, payload) {
      try {
        return await addRole(payload)
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
    async fetchPermissionTree(_, payload) {
      try {
        return await getSecurityPermission(payload)
      } catch (e) {
        throw e
      }
    },
    async setPermission (_, payload) {
      try {
        return await setPermission(payload)
      } catch (e) {
        throw e
      }
    }
  }
}
