import employeeSetup from './employee-setup'
import qualifications from './qualifications'
import workShiftSetup from './work-shift-setup'
import attendanceSetup from './attendance-setup'
import loanSetup from './loan-setup'
import workReportSetup from './work-report-setup'
import reminderSetup from './reminder-setup'

export default {
  namespaced: true,
  modules: {
    employeeSetup,
    qualifications,
    workShiftSetup,
    attendanceSetup,
    loanSetup,
    workReportSetup,
    reminderSetup
  }
}
