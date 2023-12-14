import leaveReport from './leave-report'
import loanReport from './loan-report'
import claimReport from './claim-report'
import attendanceReport from './attendance-report'
import payrollReport from './payroll-report'
import contributionReport from './contribution-report'

export default {
  namespaced: true,
  modules: {
    leaveReport,
    loanReport,
    claimReport,
    attendanceReport,
    payrollReport,
    contributionReport
  }
}
