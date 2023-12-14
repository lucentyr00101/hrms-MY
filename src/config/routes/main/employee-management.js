const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export default {
  path: 'employee-management',
  name: 'employee-management',
  meta: { title: 'menu.employee-management', icon: 'dollar', permission: ['main_employee-management'] },
  redirect: '/main/employee-management/attendance-list',
  component: RouteView,
  children: [
    {
      path: '/main/employee-management/attendance-list',
      name: 'main-employee-management-attendance-list',
      meta: { title: 'menu.attendance-lists', permission: ['main_employee-management_attendance-lists'] },
      component: () => import('@/views/main/employee-management/AttendanceList/index')
    },
    {
      path: '/main/employee-management/work-report-list',
      name: 'main-employee-management-work-report-list',
      meta: { title: 'menu.work-report-lists', permission: ['main_employee-management_work-report-lists'] },
      component: () => import('@/views/main/employee-management/WorkReportList')
    },
    {
      path: '/main/employee-management/assets-list',
      name: 'main-employee-management-assets-list',
      meta: { title: 'menu.assets-lists', permission: ['main_employee-management_assets-lists'] },
      component: () => import('@/views/main/employee-management/AssetsList/')
    },
    {
      path: '/main/employee-management/work-shift',
      name: 'main-employee-management-work-shift',
      meta: { title: 'menu.work-shift', permission: ['main_employee-management_work-shift'] },
      component: () => import('@/views/main/employee-management/WorkShift')
    },
    {
      path: '/main/employee-management/reminder',
      name: 'main-employee-management-reminder',
      meta: { title: 'menu.reminder', permission: ['main_employee-management_reminder'] },
      component: () => import('@/views/main/employee-management/Reminder')
    }
  ]
}
