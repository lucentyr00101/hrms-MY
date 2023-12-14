import dictionary from './dictionary'
import employee from './employee/index'
import company from './company/index'
import payroll from './payroll/index'
export default {
  namespaced: true,
  modules: {
    employee,
    company,
    payroll,
    dictionary
  }
}
