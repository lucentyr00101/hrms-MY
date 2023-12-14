import assetsLists from './assets-lists'
import workShift from './work-shift'
import attendanceList from './attendance-list'
import workReportList from './work-report-list'
import reminder from './reminder'

export default {
  namespaced: true,
  modules: {
    assetsLists,
    workShift,
    attendanceList,
    workReportList,
    reminder
  }
}
