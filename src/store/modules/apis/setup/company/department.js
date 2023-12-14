import {
  addDepartment,
  fetchList,
  fetchDropdownList,
  updateDepartment,
  deleteData
} from '@/api/setup/company/departments'

export default {
  namespaced: true,
  actions: {
    async update(_, payload) {
      try {
        return await updateDepartment(payload)
      } catch (e) {
        throw e
      }
    },
    async fetchList(_, queryParameters = {}) {
      try {
        return await fetchList(queryParameters)
      } catch (e) {
        throw e
      }
    },
    async add(_, payload) {
      try {
        return await addDepartment(payload)
      } catch (e) {
        throw e
      }
    },
    async fetchDropdownList(_, payload) {
      try {
        return await fetchDropdownList(payload)
      } catch (e) {
        throw e
      }
    },
    async delete(_, payload) {
      try {
        return await deleteData(payload)
      } catch (e) {
        throw e
      }
    }
  }
}
