import
{
    addPayroll, get, updatePayroll
} from '@/api/setup/employee/employeeSetup/payroll'

export default {
  namespaced: true,
  actions: {
    async addPayroll (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await addPayroll(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async get (id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await get(id)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async updatePayroll (_, data) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await updatePayroll(data)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    }
  }
}
