import {
  fetchLeaveTypeList,
  fetchLeaveSetting,
  addLeaveSetting,
  updateLeaveSetting,
  deleteLeaveSetting
} from '@/api/setup/company/leave-setting'

export default {
  namespaced: true,
  actions: {
    async listLeaveType(_, queryParameters = {}) {
      try {
        return await fetchLeaveTypeList(queryParameters)
      } catch (e) {
        throw e
      }
    },
    async list(_, queryParameters = {}) {
      try {
        return await fetchLeaveSetting(queryParameters)
      } catch (e) {
        throw e
      }
    },
    async add(_, payload) {
      try {
        return await addLeaveSetting(payload)
      } catch (e) {
        throw e
      }
    },
    async update(_, payload) {
      try {
        return await updateLeaveSetting(payload)
      } catch (e) {
        throw e
      }
    },
    async delete(_, payload) {
      try {
        return await deleteLeaveSetting(payload)
      } catch (e) {
        throw e
      }
    }
  }
}
