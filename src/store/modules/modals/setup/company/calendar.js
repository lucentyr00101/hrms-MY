export const state = {
  MasterListModal: false,
  editMasterListModal: false,
  addCalendarModal: false
}

export const mutations = {
  TOGGLE_MASTER_LIST_MODAL: (state) => {
    state.MasterListModal = !state.MasterListModal
  },
  TOGGLE_EDIT_MASTER_LIST_MODAL: (state) => {
    state.editMasterListModal = !state.editMasterListModal
  },
  TOGGLE_ADD_CALENDAR_MODAL: (state) => {
    state.addCalendarModal = !state.addCalendarModal
  }
}
