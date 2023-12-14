import additionalRemuneration from './additional-remuneration'
import commission from './commission'
import bonus from './bonus'
import allowance from './allowance'
import deduction from './deduction'
import generalPayroll from './general-payroll'

export default {
  namespaced: true,
  modules: {
    additionalRemuneration,
    commission,
    bonus,
    allowance,
    deduction,
    generalPayroll
  }
}
