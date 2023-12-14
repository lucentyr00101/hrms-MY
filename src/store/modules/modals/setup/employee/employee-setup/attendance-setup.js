export const state = {
  addAttendanceSetupModal: false,
  editAttendanceSetupModal: false
}

export const mutations = {
  TOGGLE_ADD_ATTENDANCE_SETUP_MODAL (state) {
    state.addAttendanceSetupModal = !state.addAttendanceSetupModal
  },
  TOGGLE_EDIT_ATTENDANCE_SETUP_MODAL (state) {
    state.editAttendanceSetupModal = !state.editAttendanceSetupModal
  }
}
