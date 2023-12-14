export const state = {
  AllowanceModal: false
}

export const mutations = {
  TOGGLE_ALLOWANCE_MODAL: (state) => {
    state.AllowanceModal = !state.AllowanceModal
  }
}
