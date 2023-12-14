import department from './department'
import calendarMasterList from './calendar-master-list'
import calendar from './calendar'
import claimSetting from './claim-setting'
import claimGroup from './claim-group'
import leaveGroup from './leave-group'
import leaveType from './leave-type'
import banks from './banks'
import assetSetup from './asset-setup'
import claimType from './claim-type'
import leaveSetting from './leave-setting'
import library from './library'
import announcement from './announcement'
import companyProfile from './company-profile'

export default {
  namespaced: true,
  modules: {
    department,
    calendarMasterList,
    calendar,
    leaveGroup,
    leaveType,
    claimSetting,
    claimGroup,
    banks,
    assetSetup,
    claimType,
    leaveSetting,
    library,
    announcement,
    companyProfile
  }
}
