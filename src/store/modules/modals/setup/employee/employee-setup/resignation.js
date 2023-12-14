export const state = {
  showResignationReasonModal: false
}

export const getters = {
  showResignationReasonModal: state => state.showResignationReasonModal
}

export const mutations = {
  TOGGLE_RESIGNATION_REASON_MODAL (state) {
    state.showResignationReasonModal = !state.showResignationReasonModal
  }
}
