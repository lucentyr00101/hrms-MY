export const state = {
    DeductionModal: false
  }

  export const mutations = {
    TOGGLE_DEDUCTION_MODAL: (state) => {
      state.DeductionModal = !state.DeductionModal
    }
  }
