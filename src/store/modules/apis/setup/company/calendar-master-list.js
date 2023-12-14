import {
  fetchList,
  addMasterCalendar,
  toggleStatus,
  fetchActiveList,
  updateMasterCalendar,
  deleteMasterCalendar
} from '@/api/setup/company/calendar-master-list'

export default {
  namespaced: true,
  actions: {
    async list(_, queryParameters = {}) {
      try {
        return await fetchList(queryParameters)
      } catch (error) {
        throw error
      }
    },
    async fetchActiveList(_, queryParameters = {}) {
      try {
        return await fetchActiveList(queryParameters)
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
    },
    async add(_, payload) {
      try {
        return await addMasterCalendar(payload)
      } catch (error) {
        throw error
      }
    },
    async update(_, payload) {
      try {
        return await updateMasterCalendar(payload)
      } catch (error) {
        throw error
      }
    },
    async delete(_, payload) {
      try {
        return await deleteMasterCalendar(payload)
      } catch (error) {
        throw error
      }
    }
  }
}
