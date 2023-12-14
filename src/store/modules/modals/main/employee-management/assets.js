export const state = {
  addEmployeeAssetModal: false
}

export const getters = {
  addEmployeeAssetModal: state => state.addEmployeeAssetModal
}

export const mutations = {
  TOGGLE_ADD_EMPLOYEE_ASSET_MODAL: (state) => {
    state.addEmployeeAssetModal = !state.addEmployeeAssetModal
  }
}
