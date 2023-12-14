import deduction from './deduction'
import allowance from './allowance'
import payroll from './payroll'
import workInformation from './work-information'
import resignation from './resignation'
import {
  fetchList,
  addEmployee,
  editEmployee,
  editEmployeeAllowance,
  editEmployeeDeduction,
  get,
  fetchEmployeeDropdown,
  search,
  exportData
} from '@/api/employee-setup'
import moment from 'moment'
import { downloadFromBlob } from '@/utils/util'

export default {
  namespaced: true,
  modules: {
    deduction,
    allowance,
    payroll,
    workInformation,
    resignation
  },
  state: {
    employee: {}
  },
  getters: {
    employee: (state) => state.employee
  },
   mutations: {
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_EMPLOYEE: (state, employee) => {
      state.employee = { ...employee }
    }
  },
  actions: {
    async fetchList (_, queryParameters = {}) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetchList(queryParameters)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async search (_, data = {}) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await search(data)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async exportData (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await exportData(payload)
          const date = moment().format('YYYYMMDDHHmmss')
          downloadFromBlob(res, `Employee_Setup_ExportedFile_${date}.csv`)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async addEmployee (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await addEmployee(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async editEmployee (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await editEmployee(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async editEmployeeAllowance (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await editEmployeeAllowance(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async editEmployeeDeduction (_, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await editEmployeeDeduction(payload)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async get ({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await get(id)
          commit('SET_EMPLOYEE', res)
          if (res.data?.employeeSetupResignationResponse) {
            const employeeResignation = res.data?.employeeSetupResignationResponse
            commit('resignation/SET_EMPLOYEE_RESIGNATION', employeeResignation)
            commit('resignation/SET_STATUS', employeeResignation?.status)
          } else {
            commit('resignation/SET_EMPLOYEE_RESIGNATION', {})
            commit('resignation/SET_STATUS', '')
          }
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    async fetchEmployeeDropdown (_, queryParameters = {}) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetchEmployeeDropdown(queryParameters)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    }
  }
}
