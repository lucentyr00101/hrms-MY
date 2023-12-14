export const state = {
    EPFModal: false
  }

  export const mutations = {
    TOGGLE_EPF_MODAL: (state) => {
      state.EPFModal = !state.EPFModal
    }
  }
