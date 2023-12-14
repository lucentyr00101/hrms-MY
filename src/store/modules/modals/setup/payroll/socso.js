export const state = {
  addSocsoModal: false,
  editSocsoModal: false
}

export const mutations = {
  TOGGLE_ADD_SOCSO_MODAL: (state) => {
    state.addSocsoModal = !state.addSocsoModal
  },
  TOGGLE_EDIT_SOCSO_MODAL: (state) => {
    state.editSocsoModal = !state.editSocsoModal
  }
}
