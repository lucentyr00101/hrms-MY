import setup from './setup'
import main from './main'
import security from './security'
import auth from './auth'
import dropdown from './dropdown'
import dashboard from './dashboard'
import interview from './interview'
import reports from './reports'
import notification from './notification'

export default {
  namespaced: true,
  modules: {
    setup,
    main,
    security,
    auth,
    dropdown,
    dashboard,
    interview,
    reports,
    notification
  }
}
