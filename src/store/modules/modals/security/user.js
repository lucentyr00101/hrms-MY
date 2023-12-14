export const state = {
  resetPasswordModal: false,
  addUserModal: false
}

export const getters = {
  resetPasswordModal: state => state.resetPasswordModal
}

export const mutations = {
  TOGGLE_RESET_PASSWORD_MODAL: (state) => {
    state.resetPasswordModal = !state.resetPasswordModal
  },
  TOGGLE_ADD_USER_MODAL: (state) => {
    state.addUserModal = !state.addUserModal
  }
}
