export const state = {
  addClaimTransactionModal: false,
  detailClaimTransactionModal: false
}

export const getters = {
  addClaimTransactionModal: (state) => state.addClaimTransactionModal,
  detailClaimTransactionModal: (state) => state.detailClaimTransactionModal
}

export const mutations = {
  TOGGLE_ADD_CLAIM_TRANSACTION_MODAL: (state) => {
    state.addClaimTransactionModal = !state.addClaimTransactionModal
  },
  TOGGLE_DETAIL_CLAIM_TRANSACTION_MODAL: (state) => {
    state.detailClaimTransactionModal = !state.detailClaimTransactionModal
  }
}
