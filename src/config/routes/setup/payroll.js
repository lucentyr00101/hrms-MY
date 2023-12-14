const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export default {
  path: 's-payroll',
  name: 'setup-payroll',
  meta: { title: 'menu.payroll', icon: 'user', permission: ['setup_payroll'] },
  redirect: '/setup/s-payroll/payroll-commission',
  exact: true,
  component: RouteView,
  children: [
    {
      path: '/setup/s-payroll/commission',
      name: 'setup-payroll-commission',
      meta: { title: 'menu.commissions', permission: ['setup_payroll_commissions'] },
      component: () => import('@/views/setup/payroll/commission')
    },
    {
      path: '/setup/s-payroll/allowance',
      name: 'setup-payroll-allowance',
      meta: { title: 'menu.allowance', permission: ['setup_payroll_allowance'] },
      component: () => import('@/views/setup/payroll/allowance')
    },
    {
      path: '/setup/s-payroll/deduction',
      name: 'setup-payroll-deduction',
      meta: { title: 'menu.deduction', permission: ['setup_payroll_deduction'] },
      component: () => import('@/views/setup/payroll/deduction/index')
    },
    {
      path: '/setup/s-payroll/tax',
      name: 'setup-payroll-tax',
      meta: { title: 'menu.tax', permission: ['setup_payroll_tax'] },
      component: () => import('@/views/setup/payroll/tax')
    },
    {
      path: '/setup/s-payroll/epf',
      name: 'setup-payroll-epf',
      meta: { title: 'menu.epf', permission: ['setup_payroll_epf'] },
      component: () => import('@/views/setup/payroll/epf')
    },
    {
      path: '/setup/s-payroll/eis',
      name: 'setup-payroll-eis',
      meta: { title: 'menu.eis', permission: ['setup_payroll_eis'] },
      component: () => import('@/views/setup/payroll/EIS')
    },
    {
      path: '/setup/s-payroll/socso',
      name: 'setup-payroll-socso',
      meta: { title: 'menu.socso', permission: ['setup_payroll_socso'] },
      component: () => import('@/views/setup/payroll/socso')
    },
    {
      path: '/setup/s-payroll/additional-remunation',
      name: 'setup-payroll-additional-remunation',
      meta: { title: 'menu.additional-remuneration', permission: ['setup_payroll_additional-remuneration'] },
      component: () => import('@/views/setup/payroll/AdditionalRemuneration')
    },
    {
      path: '/setup/s-payroll/overtime',
      name: 'setup-payroll-overtime',
      meta: { title: 'menu.overtime', permission: ['setup_payroll_overtime'] },
      component: () => import('@/views/setup/payroll/overtime')
    }
  ]
}
