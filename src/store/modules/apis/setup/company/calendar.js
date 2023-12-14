import { fetchList, addCalendar, toggleStatus, updateCalendar, deleteCalendar } from '@/api/setup/company/calendar'

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
    async add(_, payload) {
      try {
        return await addCalendar(payload)
      } catch (error) {
        throw error
      }
    },
    async update(_, payload) {
      try {
        return await updateCalendar(payload)
      } catch (error) {
        throw error
      }
    },
    async delete(_, payload) {
      try {
        return await deleteCalendar(payload)
      } catch (error) {
        throw error
      }
    },
    async toggleStatus(_, { id, status }) {
      try {
        return toggleStatus({ id, status })
      } catch (error) {
        throw error
      }
    }
  }
}
