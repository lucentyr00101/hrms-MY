import employee from './employee'
import company from './company'
import payroll from './payroll'
import dictionary from './dictionary'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export default {
  path: '/setup',
  name: 'setup',
  meta: { title: 'menu.setup', icon: 'user-fill', permission: ['setup'] },
  redirect: '/setup/employee/employee-setup',
  component: RouteView,
  children: [
    employee,
    company,
    payroll,
    dictionary
  ]
}
