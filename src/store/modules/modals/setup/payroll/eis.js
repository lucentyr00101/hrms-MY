export const state = {
    EISModal: false
  }

  export const mutations = {
    TOGGLE_EIS_MODAL: (state) => {
      state.EISModal = !state.EISModal
    }
  }
