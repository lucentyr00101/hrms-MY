import { fetchList } from '@/api/interview/interview'

export default {
  namespaced: true,
  actions: {
    async fetchList(_, payload) {
      try {
        return await fetchList(payload)
      } catch (error) {
        throw error
      }
    }
  }
}
