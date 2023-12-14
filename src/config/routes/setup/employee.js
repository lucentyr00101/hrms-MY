import { i18nRender } from '@/locales/index'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export default {
  path: 'employee',
  name: 'setup-employee',
  meta: { title: 'menu.employee', icon: 'user', permission: ['setup_employee'] },
  redirect: '/setup/employee/employee-setup',
  component: RouteView,
  children: [
    // employee setup
    {
      path: '/setup/employee/employee-setup',
      name: 'setup-employee-employee-setup',
      meta: { title: 'menu.employee-setup', permission: ['setup_employee_employee-setup'] },
      component: () => import('@/views/setup/employee/EmployeeSetup')

    },
    // employee setup > add >
    {
      path: 'employee-setup/add',
      name: 'setup-employee-employee-setup-add',
      meta: { title: 'Employee Information' },
      redirect: 'employee-setup/add/employee-information',
      hidden: true
    },
    // employee setup > add > employee information
    {
      path: 'employee-setup/add/employee-information',
      name: 'setup-employee-employee-setup-add-employee-information',
      meta: { title: i18nRender('setup.employee.employee-information') },
      component: () => import('@/views/setup/employee/EmployeeSetup/Add'),
      hidden: true
    },
    // employee setup > add > work information
    {
      path: 'employee-setup/add/work-information',
      name: 'setup-employee-employee-setup-add-work-information',
      meta: { title: i18nRender('setup.employee.work-information') },
      component: () => import('@/views/setup/employee/EmployeeSetup/Add'),
      hidden: true
    },
     // employee setup > add > payroll information
    {
      path: 'employee-setup/add/payroll-information',
      name: 'setup-employee-employee-setup-add-payroll-information',
      meta: { title: i18nRender('setup.employee.payroll-information') },
      component: () => import('@/views/setup/employee/EmployeeSetup/Add'),
      hidden: true
    },
     // employee setup > add > allowance
    {
      path: 'employee-setup/add/allowance',
      name: 'setup-employee-employee-setup-add-allowance',
      meta: { title: i18nRender('setup.employee.allowance') },
      component: () => import('@/views/setup/employee/EmployeeSetup/Add'),
      hidden: true
    },
    // employee setup > add > deduction
    {
      path: 'employee-setup/add/deduction',
      name: 'setup-employee-employee-setup-add-deduction',
      meta: { title: i18nRender('setup.employee.deduction') },
      component: () => import('@/views/setup/employee/EmployeeSetup/Add'),
      hidden: true
    },
    // employee setup > add > resignation
    {
      path: 'employee-setup/add/resignation',
      name: 'setup-employee-employee-setup-add-resignation',
      meta: { title: i18nRender('setup.employee.resignation') },
      component: () => import('@/views/setup/employee/EmployeeSetup/Add'),
      hidden: true
    },
    // employee setup > add
    {
      path: 'employee-setup/add',
      name: 'setup-employee-employee-setup-add-index',
      meta: { title: 'Add' },
      component: () => import('@/views/setup/employee/EmployeeSetup/Add/index'),
      hidden: true
    },
    // employee setup > view >
    {
      path: 'employee-setup/view',
      name: 'setup-employee-employee-setup-view',
      meta: { title: 'Employee Information' },
      redirect: 'employee-setup/view/employee-information',
      hidden: true
    },
    // employee setup > view > deduction
    {
      path: 'employee-setup/view/deduction/:id',
      name: 'setup-employee-employee-setup-view-deduction',
      meta: { title: i18nRender('setup.employee.deduction') },
      component: () => import('@/views/setup/employee/EmployeeSetup/View'),
      hidden: true
    },
    // employee setup > view > employee information
    {
      path: 'employee-setup/view/employee-information/:id',
      name: 'setup-employee-employee-setup-view-employee-information',
      meta: { title: i18nRender('setup.employee.employee-information') },
      component: () => import('@/views/setup/employee/EmployeeSetup/View'),
      hidden: true
    },
    // employee setup > view > work information
    {
      path: 'employee-setup/view/work-information/:id',
      name: 'setup-employee-employee-setup-view-work-information',
      meta: { title: i18nRender('setup.employee.work-information') },
      component: () => import('@/views/setup/employee/EmployeeSetup/View'),
      hidden: true
    },
    // employee setup > view > payroll information
    {
      path: 'employee-setup/view/payroll-information/:id',
      name: 'setup-employee-employee-setup-view-payroll-information',
      meta: { title: i18nRender('setup.employee.payroll-information') },
      component: () => import('@/views/setup/employee/EmployeeSetup/View'),
      hidden: true
    },
    // employee setup > view > allowance
    {
      path: 'employee-setup/view/allowance/:id',
      name: 'setup-employee-employee-setup-view-allowance',
      meta: { title: i18nRender('setup.employee.allowance') },
      component: () => import('@/views/setup/employee/EmployeeSetup/View'),
      hidden: true
    },
    // employee setup > view > resignation
    {
      path: 'employee-setup/view/resignation/:id',
      name: 'setup-employee-employee-setup-view-resignation',
      meta: { title: i18nRender('setup.employee.resignation') },
      component: () => import('@/views/setup/employee/EmployeeSetup/View'),
      hidden: true
    },
    // employee setup > view
    {
      path: 'employee-setup/view',
      name: 'setup-employee-employee-setup-view-index',
      meta: { title: 'View' },
      component: () => import('@/views/setup/employee/EmployeeSetup/View/index'),
      hidden: true
    },
    {
      path: '/setup/employee/attendance-setup',
      name: 'setup-employee-attendance-setup',
      meta: { title: 'menu.attendance-setup', permission: ['setup_employee_attendance-setup'] },
      component: () => import('@/views/setup/employee/AttendanceSetup')
    },
    {
      path: '/setup/employee/work-report-setup',
      name: 'setup-employee-work-report-setup',
      meta: { title: 'menu.work-report-setup', permission: ['setup_employee_work-report-setup'] },
      component: () => import('@/views/setup/employee/WorkReportSetup')
    },
    {
      path: '/setup/employee/qualifications',
      name: 'setup-employee-qualifications',
      meta: { title: 'menu.qualifications', permission: ['setup_employee_qualifications'] },
      component: () => import('@/views/setup/employee/Qualifications')
    },
    {
      path: '/setup/employee/work-shift-setup',
      name: 'setup-employee-work-shift-setup',
      meta: { title: 'menu.work-shift-setup', permission: ['setup_employee_work-shift-setup'] },
      component: () => import('@/views/setup/employee/WorkShiftSetup')
    },
    {
      path: '/setup/employee/loan-setup',
      name: 'setup-employee-loan-setup',
      meta: { title: 'menu.loan-setup', permission: ['setup_employee_loan-setup'] },
      component: () => import('@/views/setup/employee/LoanSetup')
    },
    {
      path: '/setup/employee/reminder-setup',
      name: 'setup-employee-reminder-setup',
      meta: { title: 'menu.reminder-setup', permission: ['setup_employee_reminder-setup'] },
      component: () => import('@/views/setup/employee/ReminderSetup')
    }
  ]
}
