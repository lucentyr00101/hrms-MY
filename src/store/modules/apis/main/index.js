import employeeManagement from './employee-management/index'
import hr from './hr/index'
import payroll from './payroll/index'

export default {
  namespaced: true,
  modules: {
    employeeManagement,
    hr,
    payroll
  }
}
