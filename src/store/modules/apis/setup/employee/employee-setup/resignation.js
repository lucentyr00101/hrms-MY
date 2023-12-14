import {
  addEmployeeResignation,
  employeeResignation,
  approveResignation,
  rejectResignation,
  withdrawResignation,
  uploadResignation
} from '@/api/employee-setup-resignation'
import { RESIGNATION_STATUS_VALUE } from '@/constant/enum'

export default {
  namespaced: true,
  state: {
    status: '',
    employeeResignation: {}
  },
  getters: {
    employeeId (state, getters, rootState, rootGetters) {
      return rootGetters['api/setup/employee/employeeSetup/employee'].data?.id
    },
    status: (state) => state.status,
    employeeResignation: (state) => state.employeeResignation
  },
  mutations: {
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_EMPLOYEE_RESIGNATION: (state, employeeResignation) => {
      state.employeeResignation = { ...employeeResignation }
    }
  },
  actions: {
    async setState ({ commit }, payload) {
      commit('SET_STATUS', payload)
    },
    async get (_, id) {
      return new Promise(async (resolve, reject) => {
        const res = await employeeResignation(id)
        resolve(res)
      })
    },
    async addResignation ({ commit, dispatch, getters }, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await addEmployeeResignation(payload)
          commit('SET_STATUS', RESIGNATION_STATUS_VALUE.PENDING)
          await dispatch('api/setup/employee/employeeSetup/get', getters.employeeId, { root: true })
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    async approve ({ commit, dispatch, getters }, { id, data }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await approveResignation(id, data)
          commit('SET_STATUS', RESIGNATION_STATUS_VALUE.APPROVED)
          await dispatch('api/setup/employee/employeeSetup/get', getters.employeeId, { root: true })
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    async reject ({ commit, dispatch, getters }, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await rejectResignation(payload)
          commit('SET_STATUS', RESIGNATION_STATUS_VALUE.REJECTED)
          await dispatch('api/setup/employee/employeeSetup/get', getters.employeeId, { root: true })
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    async withdraw ({ commit, dispatch, getters }, { data }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await withdrawResignation(data)
          commit('SET_STATUS', RESIGNATION_STATUS_VALUE.WITHDRAW)
          await dispatch('api/setup/employee/employeeSetup/get', getters.employeeId, { root: true })
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    async upload ({ commit, dispatch, getters }, data) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await uploadResignation(data)
          await dispatch('api/setup/employee/employeeSetup/get', getters.employeeId, { root: true })
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
