export const state = {
  commissionsModal: false
}

export const mutations = {
  TOGGLE_COMMISSIONS_MODAL: (state) => {
    state.commissionsModal = !state.commissionsModal
  }
}
