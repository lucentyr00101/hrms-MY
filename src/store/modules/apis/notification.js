import {
  fetchList, read
} from '@/api/notification'

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
    async read(_, params = {}) {
      try {
        return await read(params)
      } catch (error) {
        throw error
      }
    }
  }
}
