const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export default {
  path: 'hr',
  name: 'main-hr',
  meta: { title: 'menu.hr', icon: 'user', permission: ['main_hr'] },
  redirect: '/main/hr/leave-transactions',
  component: RouteView,
  children: [
    {
      path: '/main/hr/leave-transactions',
      name: 'main-hr-leave-transactions',
      meta: { title: 'menu.leave-transactions', permission: ['main_hr_leave-transactions'] },
      component: () => import('@/views/main/hr/LeaveTransactions')
    },
    {
      path: '/main/hr/leave-balance',
      name: 'main-hr-leave-balance',
      meta: { title: 'menu.leave-balance', permission: ['main_hr_leave-balance'] },
      component: () => import('@/views/main/hr/LeaveBalance')
    },
    {
      path: '/main/hr/claim-transactions',
      name: 'main-hr-claim-transactions',
      meta: { title: 'menu.claim-transactions', permission: ['main_hr_claim-transactions'] },
      component: () => import('@/views/main/hr/ClaimTransactions')
    },
    {
      path: '/main/hr/loan-transactions',
      name: 'main-hr-loan-transactions',
      meta: { title: 'menu.loan-transactions', permission: ['main_hr_loan-transactions'] },
      component: () => import('@/views/main/hr/LoanTransactions')
    }
  ]
}
