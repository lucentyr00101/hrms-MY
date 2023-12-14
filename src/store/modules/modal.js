import * as user from './modals/security/user'
import * as roles from './modals/security/user-roles'
import * as calendar from './modals/setup/company/calendar'
import * as department from './modals/setup/company/departments'
import * as leaveSetup from './modals/setup/company/leave-setup'
import * as leaveSetting from './modals/setup/company/leave-setting'
import * as claimGroup from './modals/setup/company/claim-group'
import * as claimType from './modals/setup/company/claim-type'
import * as dictionary from './modals/setup/dictionary'
import * as assets from './modals/setup/company/assets'
import * as employeeAssets from './modals/main/employee-management/assets'
import * as resignation from './modals/setup/employee/employee-setup/resignation'
import * as epf from './modals/setup/payroll/epf'
import * as banks from './modals/setup/company/banks'
import * as tax from './modals/setup/payroll/tax'
import * as eis from './modals/setup/payroll/eis'
import * as addtlRemun from './modals/setup/payroll/addtl-remun'
import * as allowance from './modals/setup/payroll/allowance'
import * as socso from './modals/setup/payroll/socso'
import * as deduction from './modals/setup/payroll/deduction'
import * as employeeAllowance from './modals/setup/employee/employee-setup'
import * as workShiftSetup from './modals/setup/employee/employee-setup/work-shift-setup'
import * as attendanceSetup from './modals/setup/employee/employee-setup/attendance-setup'
import * as attendanceLists from './modals/main/employee-management/attendance-lists'
import * as qualifications from './modals/setup/employee/employee-qualifications/qualifications'
import * as commissions from './modals/main/payroll/commissions'
import * as claimTransactions from './modals/main/hr/claim-transactions'
const modal = {
  namespaced: true,
  state: {
    ...user.state,
    ...roles.state,
    ...calendar.state,
    ...department.state,
    ...leaveSetup.state,
    ...claimGroup.state,
    ...claimType.state,
    ...dictionary.state,
    ...assets.state,
    ...resignation.state,
    ...epf.state,
    ...banks.state,
    ...tax.state,
    ...socso.state,
    ...eis.state,
    ...allowance.state,
    ...deduction.state,
    ...employeeAllowance.state,
    ...employeeAssets.state,
    ...resignation.state,
    ...workShiftSetup.state,
    ...attendanceSetup.state,
    ...attendanceLists.state,
    ...qualifications.state,
    ...qualifications.state,
    ...addtlRemun.state,
    ...leaveSetting.state,
    ...commissions.state,
    ...claimTransactions.state
  },
  mutations: {
    ...user.mutations,
    ...roles.mutations,
    ...calendar.mutations,
    ...department.mutations,
    ...leaveSetup.mutations,
    ...claimGroup.mutations,
    ...claimType.mutations,
    ...dictionary.mutations,
    ...assets.mutations,
    ...resignation.mutations,
    ...epf.mutations,
    ...banks.mutations,
    ...tax.mutations,
    ...socso.mutations,
    ...eis.mutations,
    ...allowance.mutations,
    ...deduction.mutations,
    ...employeeAllowance.mutations,
    ...employeeAssets.mutations,
    ...attendanceSetup.mutations,
    ...workShiftSetup.mutations,
    ...attendanceLists.mutations,
    ...qualifications.mutations,
    ...addtlRemun.mutations,
    ...leaveSetting.mutations,
    ...commissions.mutations,
    ...claimTransactions.mutations
  },
  getters: {
    ...user.getters,
    ...leaveSetup.getters,
    ...dictionary.getters,
    ...assets.getters,
    ...resignation.getters,
    ...banks.getters,
    ...employeeAssets.getters,
    ...leaveSetting.getters,
    ...claimTransactions.getters
  }
}

export default modal
