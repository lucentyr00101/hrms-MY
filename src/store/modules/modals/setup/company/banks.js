export const state = {
  addBankModal: false
}

export const getters = {
  addBankModal: state => state.addBankModal
}

export const mutations = {
  TOGGLE_ADD_BANK_MODAL: (state) => {
    state.addBankModal = !state.addBankModal
  }
}
