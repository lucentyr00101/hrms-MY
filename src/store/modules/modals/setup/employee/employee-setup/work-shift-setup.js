export const state = {
    AddWorkShiftSetupModal: false,
    EditWorkShiftSetupModal: false
  }

export const mutations = {
    TOGGLE_ADD_WORK_SHIFT_SETUP_MODAL: (state) => {
        state.AddWorkShiftSetupModal = !state.AddWorkShiftSetupModal
    },
    TOGGLE_EDIT_WORK_SHIFT_SETUP_MODAL: (state) => {
      state.EditWorkShiftSetupModal = !state.EditWorkShiftSetupModal
    }
}
