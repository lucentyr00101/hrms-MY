
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export default {
  path: '/security',
  name: 'security',
  meta: { title: 'menu.security', icon: 'safety', permission: ['security'] },
  redirect: '/security/user-role',
  component: RouteView,
  children: [
    {
      path: '/security/account',
      name: 'security-account',
      meta: { title: 'menu.account', icon: 'safety', permission: ['security_account-profile'] },
      component: () => import('@/views/security/Account')
    },
    {
      path: '/security/user-role',
      name: 'security-userroles',
      meta: { title: 'menu.user-roles', icon: 'safety', permission: ['security_roles'] },
      component: () => import('@/views/security/UserRoles')
    },
     {
      path: '/security/users',
      name: 'security-users',
      meta: { title: 'menu.users', icon: 'safety', permission: ['security_users'] },
      component: () => import('@/views/security/Users')
    },
    {
      path: '/security/account-center',
      name: 'security-account-center',
      meta: { title: 'menu.account-center', icon: 'safety', permission: ['security_account-center'] },
      component: () => import('@/views/security/AccountCenter')
    }
  ]
}
