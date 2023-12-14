const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export default {
  path: '/',
  meta: { title: 'menu.dashboard', keepAlive: true, icon: 'home', permission: ['dashboard'] },
  component: RouteView,
  children: [
    {
      path: '/',
      name: 'dashboard-main',
      meta: { title: 'menu.main', permission: ['dashboard_personal', 'dashboard_administrative'] },
      component: () => import('@/views/CustomDashboard')
    },
    {
      path: '/dashboard-attendance',
      name: 'dashboard-attendance-view',
      meta: { title: 'menu.attendance', permission: ['dashboard_attendance'] },
      component: () => import('@/views/CustomDashboard/attendance')
    },
    {
      path: '/dashboard-leave',
      name: 'dashboard-leave-view',
      meta: { title: 'menu.leave', permission: ['dashboard_leave'] },
      component: () => import('@/views/CustomDashboard/leave')
    },
    {
      path: '/dashboard-claim',
      name: 'dashboard-claim-view',
      meta: { title: 'menu.claim', permission: ['dashboard_claim'] },
      component: () => import('@/views/CustomDashboard/claim')
    },
    {
      path: '/dashboard-payroll',
      name: 'dashboard-payroll-view',
      meta: { title: 'menu.payroll', permission: ['dashboard_payroll'] },
      component: () => import('@/views/CustomDashboard/payroll')
    }
  ]
}
