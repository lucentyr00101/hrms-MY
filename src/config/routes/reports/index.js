const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export default {
  path: '/reports',
  name: 'reports',
  meta: { title: 'menu.reports', icon: 'project', permission: ['reports'] },
  component: RouteView,
  children: [
    {
      path: '/reports/payroll-report',
      name: 'reports-payroll',
      meta: { title: 'menu.payroll-report', icon: 'project', permission: ['reports_payroll-report'] },
        component: () => import('@/views/reports/Payroll')
    },
    {
      path: '/reports/attendance-report',
      name: 'reports-attendance',
      meta: { title: 'menu.attendance-report', icon: 'project', permission: ['reports_attendance-report'] },
      component: () => import('@/views/reports/Attendance')
    },
    {
      path: '/reports/leave-report',
      name: 'reports-leave',
      meta: { title: 'menu.leave-report', icon: 'project', permission: ['reports_leave-report'] },
      component: () => import('@/views/reports/Leave')
    },
    {
      path: '/reports/claim-report',
      name: 'reports-claim',
      meta: { title: 'menu.claim-report', icon: 'project', permission: ['reports_claim-report'] },
      component: () => import('@/views/reports/Claim')
    },
    {
      path: '/reports/loan-report',
      name: 'reports-loan',
      meta: { title: 'menu.loan-report', icon: 'project', permission: ['reports_loan-report'] },
      component: () => import('@/views/reports/Loan')
    },
    {
      path: '/reports/contribution-report',
      name: 'reports-contribution',
      meta: { title: 'menu.contribution-report', icon: 'project', permission: ['reports_contribution-report'] },
      component: () => import('@/views/reports/Contribution')
    }
  ]
}
