export const state = {
  addRoleModal: false
}

export const mutations = {
  TOGGLE_ADD_ROLE_MODAL: (state) => {
    state.addRoleModal = !state.addRoleModal
  }
}
