export const state = {
  claimTypeModal: false
}

export const mutations = {
  TOGGLE_CLAIM_TYPE_MODAL: (state) => {
    state.claimTypeModal = !state.claimTypeModal
  }
}
