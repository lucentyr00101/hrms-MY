import socso from './socso'
import epf from './epf'
import eis from './eis'
import tax from './tax'
import deduction from './deduction'
import allowance from './allowance'
import overtime from './overtime'
import commission from './commission'

export default {
  namespaced: true,
  modules: {
    socso,
    epf,
    allowance,
    tax,
    eis,
    deduction,
    overtime,
    commission
  }
}
