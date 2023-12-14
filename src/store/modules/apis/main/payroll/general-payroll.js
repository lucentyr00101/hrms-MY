import { fetchList, search, fetchLatest, fetchSummary, toggleStatus, fetchVerify, verifyUpdate, confirm, processPayroll, deletePayslip, deleteAll, viewSummary, viewPayslip, publish, undoProcessPayroll } from '@/api/main/payroll/general-payroll'

export default {
  namespaced: true,
  actions: {
    async fetchList(_, params = {}) {
      try {
        return await fetchList(params)
      } catch (error) {
        throw error
      }
    },
    async search(_, params = {}) {
      try {
        return await search(params)
      } catch (error) {
        throw error
      }
    },
    async fetchLatest(_, params = {}) {
      try {
        return await fetchLatest(params)
      } catch (error) {
        throw error
      }
    },
    async fetchSummary(_, params = {}) {
      try {
        return await fetchSummary(params)
      } catch (error) {
        throw error
      }
    },
    async toggleStatus(_, payload) {
      try {
        return await toggleStatus(payload)
      } catch (error) {
        throw error
      }
    },
    async fetchVerify(_, params = {}) {
      try {
        return await fetchVerify(params)
      } catch (error) {
        throw error
      }
    },
    async verifyUpdate(_, params = {}) {
      try {
        return await verifyUpdate(params)
      } catch (error) {
        throw error
      }
    },
    async confirm(_, params = {}) {
      try {
        return await confirm(params)
      } catch (error) {
        throw error
      }
    },
    async processPayroll(_, params = {}) {
      try {
        return await processPayroll(params)
      } catch (error) {
        throw error
      }
    },
    async deletePayslip(_, params = {}) {
      try {
        return await deletePayslip(params)
      } catch (error) {
        throw error
      }
    },
    async deleteAll(_, params = {}) {
      try {
        return await deleteAll(params)
      } catch (error) {
        throw error
      }
    },
    async viewSummary(_, params = {}) {
      try {
        return await viewSummary(params)
      } catch (error) {
        throw error
      }
    },
    async publish(_, params = {}) {
      try {
        return await publish(params)
      } catch (error) {
        throw error
      }
    },
    async viewPayslip(_, params = {}) {
      try {
        return await viewPayslip(params)
      } catch (error) {
        throw error
      }
    },
    async undoProcessPayroll(_, params = {}) {
      try {
        return await undoProcessPayroll(params)
      } catch (error) {
        throw error
      }
    }
  }
}
