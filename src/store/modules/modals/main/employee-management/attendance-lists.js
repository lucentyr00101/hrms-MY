export const state = {
    addAttendanceListsModal: false,
    viewAttendanceModal: false,
    editAttendanceModal: false

  }

  export const getters = {
    addAttendanceListsModal: state => state.addAttendanceListsModal,
    viewAttendanceModal: state => state.viewAttendanceModal,
    editAttendanceModal: state => state.editAttendanceModal
  }

  export const mutations = {
    TOGGLE_ADD_ATTENDANCE_LISTS_MODAL: (state) => {
      state.addAttendanceListsModal = !state.addAttendanceListsModal
    },
    TOGGLE_VIEW_ATTENDANCE_MODAL: (state) => {
      state.viewAttendanceModal = !state.viewAttendanceModal
    },
    TOGGLE_EDIT_ATTENDANCE_MODAL: (state) => {
      state.editAttendanceModal = !state.editAttendanceModal
    }
  }
