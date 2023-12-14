export const state = {
  addAssetModal: false
}

export const getters = {
  addAssetModal: state => state.addAssetModal
}

export const mutations = {
  TOGGLE_ADD_ASSET_MODAL: (state) => {
    state.addAssetModal = !state.addAssetModal
  }
}
