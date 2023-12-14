export const state = {
  addClaimGroupModal: false,
  editClaimGroupModal: false,
  claimTypeModal: false
}

export const mutations = {
  TOGGLE_ADD_CLAIM_GROUP_MODAL: (state) => {
    state.addClaimGroupModal = !state.addClaimGroupModal
  },
  TOGGLE_EDIT_CLAIM_GROUP_MODAL: (state) => {
    state.editClaimGroupModal = !state.editClaimGroupModal
  },
  TOGGLE_CLAIM_TYPE_MODAL: (state) => {
    state.claimTypeModal = !state.claimTypeModal
  }
}
