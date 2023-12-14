import {
  fetchDictTypeList,
  search,
  fetchValuesList as _fetchValuesList,
  searchValue,
  toggleStatus,
  deleteDictionary,
  addDictionary,
  editDictionary,
  addValues,
  editValues,
  toggleStatusValue,
  deleteValue,
  getDropdownValues
} from '@/api/dictionary'

export default {
  namespaced: true,
  actions: {
    async fetchList (_, queryParameters = {}) {
      try {
        return await fetchDictTypeList(queryParameters)
      } catch (e) {
        throw e
      }
    },
    async search(_, payload) {
      try {
        return await search(payload)
      } catch (error) {
        throw error
      }
    },
    async fetchValuesList (_, queryParameters = {}) {
      try {
        return await _fetchValuesList(queryParameters)
      } catch (e) {
        throw e
      }
    },
    async searchValue(_, payload) {
      try {
        return await searchValue(payload)
      } catch (error) {
        throw error
      }
    },
    async addDictionary (_, payload) {
      try {
        return await addDictionary(payload)
      } catch (e) {
        throw e
      }
    },
    async editDictionary (_, payload) {
      try {
        return await editDictionary(payload)
      } catch (e) {
        throw e
      }
    },
    async deleteDictionary (_, payload) {
      try {
        return await deleteDictionary(payload)
      } catch (e) {
        throw e
      }
    },
    async updateStatus (_, { id, status }) {
      try {
        return await toggleStatus({ id, status })
      } catch (e) {
        throw e
      }
    },
    async addValues (_, payload) {
      try {
        return await addValues(payload)
      } catch (e) {
        throw e
      }
    },
    async editValues (_, payload) {
      try {
        return await editValues(payload)
      } catch (e) {
        throw e
      }
    },
    async updateStatusValue (_, { dictionaryValueId, status }) {
      try {
        return await toggleStatusValue({ dictionaryValueId, status })
      } catch (e) {
        throw e
      }
    },
    async deleteValue (_, payload) {
      try {
        return await deleteValue(payload)
      } catch (e) {
        throw e
      }
    },
    async getDropdownValues (_, type) {
      try {
        const res = await getDropdownValues(type)
        return res.data
      } catch (e) {
        throw e
      }
    }
  }
}
