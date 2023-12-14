import payroll from './payroll'
import hr from './hr'
import employeeManagement from './employee-management'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export default {
  path: '/main',
  name: 'main',
  meta: { title: 'menu.main', icon: 'user-fill', permission: ['main'] },
  redirect: '/main/payroll/generate-payroll',
  component: RouteView,
  children: [
    payroll, hr, employeeManagement
  ]
}
