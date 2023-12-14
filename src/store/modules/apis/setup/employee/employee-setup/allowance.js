import
{
    fetchList,
    addAllowance,
    fetchAllowanceDropdown,
    fetchSequenceDropdown,
    deleteAllowance,
    fetchDetail
} from '@/api/setup/employee/employeeSetup/allowance'

export default {
  namespaced: true,
  actions: {
    async fetchList (_, queryParameters = {}) {
      return new Promise(async (resolve, reject) => {
        const res = await fetchList(queryParameters)
        resolve(res)
      })
    },
    async fetchDetail (_, queryParameters) {
      return new Promise(async (resolve, reject) => {
        const res = await fetchDetail(queryParameters)
        resolve(res)
      })
    },
    async fetchAllowanceDropdown (_, queryParameters = {}) {
      return new Promise(async (resolve, reject) => {
        const res = await fetchAllowanceDropdown(queryParameters)
        resolve(res)
      })
    },
    async fetchSequenceDropdown (_, queryParameters = {}) {
      return new Promise(async (resolve, reject) => {
        const res = await fetchSequenceDropdown(queryParameters)
        resolve(res)
      })
    },
    async addAllowance (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await addAllowance(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async deleteAllowance (_, queryParameters = {}) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await deleteAllowance(queryParameters)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    }
  }
}
