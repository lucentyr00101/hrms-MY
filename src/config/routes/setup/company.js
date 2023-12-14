const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export default {
  path: 'company',
  name: 'setup-company',
  meta: { title: 'menu.company', icon: 'user', permission: ['setup_company'] },
  redirect: '/setup/company/company-profile',
  component: RouteView,
  children: [
    {
      path: '/setup/company/company-profile',
      name: 'setup-company-company-profile',
      meta: { title: 'menu.company-profile', permission: ['setup_company_company-profile'] },
      component: () => import('@/views/setup/company/CompanyProfile')
    },
    {
      path: '/setup/company/banks',
      name: 'setup-company-bank',
      meta: { title: 'menu.banks', permission: ['setup_company_banks'] },
      component: () => import('@/views/setup/company/Banks')
    },
    {
      path: '/setup/company/department',
      name: 'setup-company-department',
      meta: { title: 'menu.departments', permission: ['setup_company_departments'] },
      component: () => import('@/views/setup/company/Departments/index')
    },
    {
      path: '/setup/company/calendar',
      name: 'setup-company-calendar',
      meta: { title: 'menu.calendar', permission: ['setup_company_calendar'] },
      component: () => import('@/views/setup/company/Calendar')
    },
    {
      path: '/setup/company/leave-setup',
      name: 'setup-company-leave-setup',
      meta: { title: 'menu.leave-setup', permission: ['setup_company_leave-setup'] },
      component: () => import('@/views/setup/company/LeaveSetup')
    },
    {
      path: '/setup/company/leave-setting',
      name: 'setup-company-leave-setting',
      meta: { title: 'menu.leave-setting', permission: ['setup_company_leave-setting'] },
      component: () => import('@/views/setup/company/LeaveSetting')
    },
    {
      path: '/setup/company/announcment',
      name: 'setup-company-announcement',
      meta: { title: 'menu.announcement', permission: ['setup_company_announcement'] },
      component: () => import('@/views/setup/company/Announcement')
    },
    {
      path: '/setup/company/claim-setup',
      name: 'setup-company-claim-setup',
      meta: { title: 'menu.claim-setup', permission: ['setup_company_claim-setup'] },
      component: () => import('@/views/setup/company/ClaimSetup')
    },
    {
      path: '/setup/company/claim-setting',
      name: 'setup-company-claim-setting',
      meta: { title: 'menu.claim-setting', permission: ['setup_company_claim-setting'] },
      component: () => import('@/views/setup/company/ClaimSetting/index.vue')
    },
    {
      path: '/setup/company/assets-setup',
      name: 'setup-company-assets-setup',
      meta: { title: 'menu.assets-setup', permission: ['setup_company_assets-setup'] },
      component: () => import('@/views/setup/company/AssetsSetup')
    },
     {
      path: '/setup/company/library',
      name: 'setup-company-library',
      meta: { title: 'menu.library', permission: ['setup_company_library'] },
      component: () => import('@/views/setup/company/Library')
    }
  ]
}
