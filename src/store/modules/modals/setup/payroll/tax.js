export const state = {
  setupPayrollTaxView: false
}

export const mutations = {
  TOGGLE_SETUP_PAYROLL_TAX_VIEW: (state) => {
    state.setupPayrollTaxView = !state.setupPayrollTaxView
  }
}
