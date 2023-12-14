import {
  checkStatus,
  me
} from '@/api/auth'

export default {
  namespaced: true,
  state: () => ({
    currentUser: null
  }),
  getters: {
    currentUser: state => state.currentUser
  },
  mutations: {
    SET_CURRENT_USER (state, payload) {
      state.currentUser = payload
    }
  },
  actions: {
    fetchCurrentUser ({ commit, dispatch }) {
      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await me()
          const userData = await dispatch('api/security/users/fetchDetail', data.id, { root: true })
          const newData = Object.assign(data, { photo: userData?.data?.photo })
          commit('SET_CURRENT_USER', newData)
          resolve(newData)
        } catch (e) {
          console.log(e)
          reject(e)
        }
      })
    },
    async checkStatus ({ state }) {
      return new Promise(async (resolve, reject) => {
        const id = state.currentUser.id
        try {
          const res = await checkStatus({ id })
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    }
  }
}
