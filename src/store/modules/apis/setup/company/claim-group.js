import {
  listClaimGroup,
  addClaimGroup,
  updateClaimGroup,
  deleteClaimGroup,
  toggleStatus
} from '@/api/setup/company/claim-group'

export default {
  namespaced: true,
  actions: {
    async list(_, queryParameters = {}) {
      try {
        return await listClaimGroup(queryParameters)
      } catch (error) {
        throw error
      }
    },
    async add(_, payload) {
      try {
        return await addClaimGroup(payload)
      } catch (error) {
        throw error
      }
    },
    async update(_, payload) {
      try {
        return await updateClaimGroup(payload)
      } catch (error) {
        throw error
      }
    },
    async delete(_, payload) {
      try {
        return await deleteClaimGroup(payload)
      } catch (error) {
        throw error
      }
    },
    async toggleStatus(_, { id, status }) {
      try {
        return await toggleStatus({ id, status })
      } catch (error) {
        throw error
      }
    }
  }
}
