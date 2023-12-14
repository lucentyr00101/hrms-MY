const RouteView = {
    name: 'RouteView',
    render: h => h('router-view')
}

export default {
    path: '/setup',
    name: 'setup',
    meta: { title: 'Setup', icon: 'user-fill' },
    redirect: '/setup/employee',
    component: RouteView,
    children: [
        {
            path: 'calendar',
            name: 'setup-company-calendar',
            meta: { title: 'Calendar' },
            component: () => import('@/views/setup/company/Calendar')
          }
    ]
  }
