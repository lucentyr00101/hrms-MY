export const state = {
  addDictTypeModal: false,
  dictValuesList: false,
  addDictValuesModal: false
}

export const getters = {
  addDictTypeModal: state => state.addDictTypeModal,
  dictValuesList: state => state.dictValuesList,
  addDictValuesModal: state => state.addDictValuesModal
}

export const mutations = {
  TOGGLE_DICT_ADD_TYPE_MODAL (state) {
    state.addDictTypeModal = !state.addDictTypeModal
  },
  TOGGLE_DICT_VALUES_LIST_MODAL (state) {
    state.dictValuesList = !state.dictValuesList
  },
  TOGGLE_ADD_DICT_VALUES_MODAL (state) {
    state.addDictValuesModal = !state.addDictValuesModal
  }
}
