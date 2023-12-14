export const state = {
  addDepartmentModal: false,
  editDepartmentModal: false
}

export const mutations = {
  TOGGLE_ADD_DEPARTMENT_MODAL: (state) => {
    state.addDepartmentModal = !state.addDepartmentModal
  },
  TOGGLE_EDIT_DEPARTMENT_MODAL: (state) => {
    state.editDepartmentModal = !state.editDepartmentModal
  }
}
