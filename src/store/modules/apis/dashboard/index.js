import attendance from './attendance'
import main from './main'
import leave from './leave'
import claim from './claim'
import admin from './admin'
import payroll from './payroll'

export default {
  namespaced: true,
  modules: {
    attendance,
    main,
    leave,
    claim,
    admin,
    payroll
  }
}
