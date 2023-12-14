export const state = {
  addLeaveGroupModal: false,
  editLeaveGroupModal: false,
  addLeaveTypeModal: false,
  editLeaveTypeModal: false
}

export const getters = {
  addLeaveGroupModal: state => state.addLeaveGroupModal,
  addLeaveTypeModal: state => state.addLeaveTypeModal
}

export const mutations = {
  TOGGLE_ADD_LEAVE_GROUP_MODAL: (state) => {
    state.addLeaveGroupModal = !state.addLeaveGroupModal
  },
  TOGGLE_EDIT_LEAVE_GROUP_MODAL: (state) => {
    state.editLeaveGroupModal = !state.editLeaveGroupModal
  },
  TOGGLE_ADD_LEAVE_TYPE_MODAL: (state) => {
    state.addLeaveTypeModal = !state.addLeaveTypeModal
  },
  TOGGLE_EDIT_LEAVE_TYPE_MODAL: (state) => {
    state.editLeaveTypeModal = !state.editLeaveTypeModal
  }
}
