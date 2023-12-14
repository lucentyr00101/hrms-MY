const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export default {
  path: 'm-payroll',
  name: 'main-payroll',
  meta: { title: 'menu.payroll', icon: 'dollar', permission: ['main_payroll'] },
  redirect: '/main/m-payroll/generate',
  component: RouteView,
  children: [
    {
      path: '/main/m-payroll/generate',
      name: 'main-payroll-generate',
      meta: { title: 'menu.generate-payroll', permission: ['main_payroll_generate-payroll'] },
      component: () => import('@/views/main/payroll/GeneratePayroll')
    },
    {
      path: '/main/m-payroll/commissions',
      name: 'main-payroll-commissions',
      meta: { title: 'menu.commissions', permission: ['main_payroll_commissions'] },
      component: () => import('@/views/main/payroll/Commissions')
    },
    {
      path: '/main/m-payroll/bonus',
      name: 'main-payroll-bonus',
      meta: { title: 'menu.bonus', permission: ['main_payroll_bonus'] },
      component: () => import('@/views/main/payroll/Bonus')
    },
    {
      path: '/main/m-payroll/allowance',
      name: 'main-payroll-allowance',
      meta: { title: 'menu.allowance', permission: ['main_payroll_allowance'] },
      component: () => import('@/views/main/payroll/Allowance')
    },
    {
      path: '/main/m-payroll/deduction',
      name: 'main-payroll-deduction',
      meta: { title: 'menu.deduction', permission: ['main_payroll_deduction'] },
      component: () => import('@/views/main/payroll/Deduction')
    },
    {
      path: '/main/m-payroll/additional-remuneration',
      name: 'main-payroll-additional-remuneration',
      meta: { title: 'menu.additional-remuneration', permission: ['main_payroll_additional-remuneration'] },
      component: () => import('@/views/main/payroll/AdditionalRemuneration')
    }
  ]
}
