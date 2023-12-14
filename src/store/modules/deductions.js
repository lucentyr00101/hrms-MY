import {
  fetchList as _fetchList
} from '@/api/deductions'

export default {
  namespaced: true,
  actions: {
    async fetchList (_, queryParameters = {}) {
      return new Promise(async (resolve, reject) => {
        const res = await _fetchList(queryParameters)
        resolve(res)
      })
    }
  }
}
