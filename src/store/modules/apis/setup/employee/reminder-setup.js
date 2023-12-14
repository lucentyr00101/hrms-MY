import {
  fetchList, search, addReminder, updateReminder, toggleStatus, deleteReminder
} from '@/api/setup/employee/reminder-setup'

export default {
  namespaced: true,
  actions: {
    async fetchList(_, params = {}) {
      try {
        return await fetchList(params)
      } catch (error) {
        throw error
      }
    },
    async search(_, params = {}) {
      try {
        return await search(params)
      } catch (error) {
        throw error
      }
    },
    async add(_, payload) {
      try {
        return await addReminder(payload)
      } catch (error) {
        throw error
      }
    },
    async update(_, payload) {
      try {
        return await updateReminder(payload)
      } catch (error) {
        throw error
      }
    },
    async updateStatus (_, { id, status }) {
      try {
        return await toggleStatus({ id, status })
      } catch (e) {
        throw e
      }
    },
    async delete(_, payload) {
      try {
        return await deleteReminder(payload)
      } catch (error) {
        throw error
      }
    }
  }
}
