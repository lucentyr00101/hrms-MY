import {
  fetchBankList
} from '@/api/banks'

export default {
  namespaced: true,
  actions: {
    async fetchList (_, queryParameters = {}) {
      return new Promise(async (resolve, reject) => {
        const res = await fetchBankList(queryParameters)
        resolve(res)
      })
    }
  }
}
