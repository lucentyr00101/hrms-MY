import { fetchDepartmentList } from '@/api/setup'

export default {
  namespaced: true,
  state: {
    // select option value {value, text}
    departmentList: {}
  },
  mutations: {
    SET_DEPARTMENT_LIST: (state, payload) => {
      state.departmentList = payload
    }
  },

  actions: {
    async fetchDepartmentList ({ commit }, queryParameters = {}) {
      return new Promise(async (resolve, reject) => {
        const res = await fetchDepartmentList()
        const data = res.result.data
        const values = {}
        data.forEach(element => {
            Object.assign(values, { [element.id]: element.name })
        })
        commit('SET_DEPARTMENT_LIST', values)
        resolve()
      })
    }
  }
}
