export const state = {
    EmployeeAllowanceModal: false
  }

  export const mutations = {
    TOGGLE_EMPLOYEE_ALLOWANCE_MODAL: (state) => {
      state.EmployeeAllowanceModal = !state.EmployeeAllowanceModal
    }
  }
