import { i18nRender } from '@/locales/index'
import Mock from 'mockjs2'
import { builder } from '../util'

const info = options => {
  console.log('options', options)
  const userInfo = {
    id: '4291d7da9005377ec9aec4a71ea837f',
    name: '天野远子',
    username: 'admin',
    password: '',
    avatar: '/avatar2.jpg',
    status: 1,
    telephone: '',
    lastLoginIp: '27.154.74.117',
    lastLoginTime: 1534837621348,
    creatorId: 'admin',
    createTime: 1497160610259,
    merchantCode: 'TLif2btpzg079h15bk',
    deleted: 0,
    roleId: 'admin',
    role: {}
  }
  // role
  const roleObj = {
    id: 'admin',
    name: '管理员',
    describe: '拥有所有权限',
    status: 1,
    creatorId: 'system',
    createTime: 1497160610259,
    deleted: 0,
    permissions: [
      {
        roleId: 'admin',
        permissionId: 'dashboard',
        permissionName: '仪表盘',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'exception',
        permissionName: '异常页面权限',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'result',
        permissionName: '结果权限',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'profile',
        permissionName: '详细页权限',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'table',
        permissionName: '表格权限',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'import',
            describe: '导入',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'form',
        permissionName: '表单权限',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'order',
        permissionName: '订单管理',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'permission',
        permissionName: '权限管理',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'role',
        permissionName: '角色管理',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'table',
        permissionName: '桌子管理',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'user',
        permissionName: '用户管理',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'import',
            describe: '导入',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          },
          {
            action: 'export',
            describe: '导出',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      }
    ]
  }

  roleObj.permissions.push({
    roleId: 'admin',
    permissionId: 'support',
    permissionName: '超级模块',
    actions:
      '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
    actionEntitySet: [
      {
        action: 'add',
        describe: '新增',
        defaultCheck: false
      },
      {
        action: 'import',
        describe: '导入',
        defaultCheck: false
      },
      {
        action: 'get',
        describe: '详情',
        defaultCheck: false
      },
      {
        action: 'update',
        describe: '修改',
        defaultCheck: false
      },
      {
        action: 'delete',
        describe: '删除',
        defaultCheck: false
      },
      {
        action: 'export',
        describe: '导出',
        defaultCheck: false
      }
    ],
    actionList: null,
    dataAccess: null
  })

  userInfo.role = roleObj
  return builder(userInfo)
}

/**
 * 使用 用户登录的 token 获取用户有权限的菜单
 * 返回结构必须按照这个结构体形式处理，或根据
 * /src/router/generator-routers.js  文件的菜单结构处理函数对应即可
 * @param {*} options
 * @returns
 */
const userNav = options => {
  const nav = [
    // customize dashboard
    {
      name: 'dashboard',
      path: '/dashboard',
      parentId: 0,
      id: 10001,
      meta: {
        icon: 'home',
        title: i18nRender('menu.dashboard'),
        show: true
      },
      component: 'CustomDashboard'
    },
    // main
    // main > payroll
    {
      name: 'main',
      path: '/main',
      parentId: 0,
      id: 10002,
      meta: {
        icon: 'setting',
        title: 'Main',
        show: true
      },
      component: 'RouteView'
    },
    {
      name: 'payroll',
      path: '/payroll',
      parentId: 10002,
      id: 10003,
      meta: {
        icon: 'setting',
        title: 'Payroll',
        show: true
      },
      component: 'RouteView'
    },
    {
      name: 'generate-payroll',
      path: '/main/payroll/generate-payroll',
      parentId: 10003,
      id: 10004,
      meta: {
        icon: '',
        title: 'Generate Payroll',
        show: true
      },
      component: 'main/payroll/GeneratePayroll'
    },
    {
      name: 'commissions',
      path: '/main/payroll/commissions',
      parentId: 10003,
      id: 10005,
      meta: {
        icon: '',
        title: 'Commissions',
        show: true
      },
      component: 'main/payroll/Commissions'
    },
    {
      name: 'bonus',
      path: '/main/payroll/bonus',
      parentId: 10003,
      id: 10006,
      meta: {
        icon: '',
        title: 'Bonus',
        show: true
      },
      component: 'main/payroll/Bonus'
    },
    {
      name: 'allowance',
      path: '/main/payroll/allowance',
      parentId: 10003,
      id: 10007,
      meta: {
        icon: '',
        title: 'Allowance',
        show: true
      },
      component: 'main/payroll/Allowance'
    },
    {
      name: 'deduction',
      path: '/main/payroll/deduction',
      parentId: 10003,
      id: 10008,
      meta: {
        icon: '',
        title: 'Deduction',
        show: true
      },
      component: 'main/payroll/Deduction'
    },
    {
      name: 'additional-remuneration',
      path: '/main/payroll/additional-remuneration',
      parentId: 10003,
      id: 10009,
      meta: {
        icon: '',
        title: 'Additional Remuneration',
        show: true
      },
      component: 'main/payroll/AdditionalRemuneration'
    },
    // main > HR
    {
      name: 'hr',
      path: '/hr',
      parentId: 10002,
      id: 10010,
      meta: {
        icon: 'setting',
        title: 'HR',
        show: true
      },
      component: 'RouteView'
    },
    {
      name: 'leave-transactions',
      path: '/main/hr/leave-transactions',
      parentId: 10010,
      id: 10011,
      meta: {
        icon: '',
        title: 'Leave Transactions',
        show: true
      },
      component: 'main/hr/LeaveTransactions'
    },
    {
      name: 'leave-balance',
      path: '/main/hr/leave-balance',
      parentId: 10010,
      id: 10012,
      meta: {
        icon: '',
        title: 'Leave Balance',
        show: true
      },
      component: 'main/hr/LeaveBalance'
    },
    {
      name: 'claim-transactions',
      path: '/main/hr/claim-transactions',
      parentId: 10010,
      id: 10013,
      meta: {
        icon: '',
        title: 'Claim Transactions',
        show: true
      },
      component: 'main/hr/ClaimTransactions'
    },
    {
      name: 'leave-balance',
      path: '/main/hr/leave-balance',
      parentId: 10010,
      id: 10014,
      meta: {
        icon: '',
        title: 'Leave Balance',
        show: true
      },
      component: 'main/hr/LeaveBalance'
    },
    // main > Employee Management
    {
      name: 'employee-management',
      path: '/employee-management',
      parentId: 10002,
      id: 10015,
      meta: {
        icon: 'setting',
        title: 'Employee Management',
        show: true
      },
      component: 'RouteView'
    },
    {
      name: 'attendance-lists',
      path: '/main/employee-management/attendance-lists',
      parentId: 10015,
      id: 10016,
      meta: {
        icon: '',
        title: 'Attendance Lists',
        show: true
      },
      component: 'main/employee-management/AttendanceLists'
    },
    {
      name: 'work-report-lists',
      path: '/main/employee-management/work-report-lists',
      parentId: 10015,
      id: 10017,
      meta: {
        icon: '',
        title: 'Work Report Lists',
        show: true
      },
      component: 'main/employee-management/WorkReportLists'
    },
    {
      name: 'assets-lists',
      path: '/main/employee-management/assets-lists',
      parentId: 10015,
      id: 10018,
      meta: {
        icon: '',
        title: 'Assets Lists',
        show: true
      },
      component: 'main/employee-management/AssetsLists'
    },
    {
      name: 'work-shift',
      path: '/main/employee-management/work-shift',
      parentId: 10015,
      id: 10019,
      meta: {
        icon: '',
        title: 'Work Shift',
        show: true
      },
      component: 'main/employee-management/WorkShift'
    },
    // Setup
    {
      name: 'setup',
      path: '/setup',
      parentId: 0,
      id: 10020,
      meta: {
        icon: 'setting',
        title: 'Setup',
        show: true
      },
      component: 'RouteView'
    },
    // Setup > Employee
    {
      name: 'employee',
      path: '/employee',
      parentId: 10020,
      id: 10021,
      meta: {
        icon: 'setting',
        title: 'Employee',
        show: true
      },
      component: 'RouteView'
    },
    {
      name: 'employee-setup',
      path: '/main/employee/employee-setup',
      parentId: 10021,
      id: 10022,
      meta: {
        icon: '',
        title: 'Employee Setup',
        show: true
      },
      component: 'main/employee-management/EmployeeSetup'
    },
    {
      name: 'attendance-setup',
      path: '/main/employee/attendance-setup',
      parentId: 10021,
      id: 10023,
      meta: {
        icon: '',
        title: 'Employee Setup',
        show: true
      },
      component: 'main/employee-management/EmployeeSetup'
    },
    {
      name: 'work-report-setup',
      path: '/main/employee/work-report-setup',
      parentId: 10021,
      id: 10024,
      meta: {
        icon: '',
        title: 'Work Report Setup',
        show: true
      },
      component: 'main/employee-management/WorkReportSetup'
    },
    {
      path: '/main/employee/qualifications',
      parentId: 10021,
      id: 10025,
      meta: {
        icon: '',
        title: 'Qualifications',
        show: true
      },
      component: 'main/employee-management/Qualifications'
    },
    {
      name: 'work-shift-setup',
      path: '/main/employee/work-shift-setup',
      parentId: 10021,
      id: 10026,
      meta: {
        icon: '',
        title: 'Work Shift Setup',
        show: true
      },
      component: 'main/employee-management/Qualifications'
    },
    // Setup > Company
    {
      name: 'company',
      path: 'setup/company',
      parentId: 10020,
      id: 10028,
      meta: {
        icon: 'setting',
        title: 'Company',
        show: true
      },
      component: 'RouteView'
    },
    {
      name: 'company-profile',
      path: '/setup/company/company-profile',
      parentId: 10028,
      id: 10029,
      meta: {
        icon: '',
        title: 'Company Profile',
        show: true
      },
      component: 'setup/company/CompanyProfile'
    },
    {
      name: 'banks',
      path: '/setup/company/banks',
      parentId: 10028,
      id: 10030,
      meta: {
        icon: '',
        title: 'Banks',
        show: true
      },
      component: 'setup/company/Banks'
    },
    {
      name: 'departments',
      path: '/setup/company/departments',
      parentId: 10028,
      id: 10031,
      meta: {
        icon: '',
        title: 'Departments',
        show: true
      },
      component: 'setup/company/Departments'
    },
    {
      name: 'calendar',
      path: '/setup/company/calendar',
      parentId: 10028,
      id: 10032,
      meta: {
        icon: '',
        title: 'Calendar',
        show: true
      },
      component: 'setup/company/Calendar'
    },
    {
      name: 'leave-setup',
      path: '/setup/company/leave-setup',
      parentId: 10028,
      id: 10033,
      meta: {
        icon: '',
        title: 'Leave Setup',
        show: true
      },
      component: 'setup/company/LeaveSetup'
    },
    {
      name: 'leave-setting',
      path: '/setup/company/leave-setting',
      parentId: 10028,
      id: 10034,
      meta: {
        icon: '',
        title: 'Leave Setting',
        show: true
      },
      component: 'setup/company/LeaveSetting'
    },
    {
      name: 'Announcement',
      path: '/setup/company/announcement',
      parentId: 10028,
      id: 10035,
      meta: {
        icon: '',
        title: 'Announcement',
        show: true
      },
      component: 'setup/company/Announcement'
    },
    {
      name: 'Claim',
      path: '/setup/company/claim',
      parentId: 10028,
      id: 10036,
      meta: {
        icon: '',
        title: 'Claim',
        show: true
      },
      component: 'setup/company/CLaim'
    },
    // Setup > Payroll
    {
      name: 'payroll',
      path: '/payroll',
      parentId: 10020,
      id: 10040,
      meta: {
        icon: 'setting',
        title: 'Payroll',
        show: true
      },
      component: 'RouteView'
    },
    // Interview
    {
      name: 'interview',
      path: '/interview',
      parentId: 0,
      id: 10049,
      meta: {
        icon: 'setting',
        title: 'Interview',
        show: true
      },
      component: 'RouteView'
    },
    // Reports
    {
      name: 'reports',
      path: '/reports',
      parentId: 0,
      id: 10053,
      meta: {
        icon: 'setting',
        title: 'Reports',
        show: true
      },
      component: 'RouteView'
    },
    // Security
    {
      name: 'security',
      path: '/security',
      parentId: 0,
      id: 10090,
      meta: {
        icon: 'setting',
        title: 'Security',
        show: true
      },
      component: 'RouteView'
    },
    {
      name: 'account',
      parentId: 10090,
      id: 10091,
      meta: {
        icon: '',
        title: 'Account',
        show: true
      },
      component: 'security/Account',
      path: '/security/account'
    },
    {
      name: 'user-roles',
      parentId: 10090,
      id: 10092,
      meta: {
        title: 'User Roles',
        show: true
      },
      component: 'security/UserRoles',
      path: '/security/user-roles'
    },
    {
      name: 'users',
      parentId: 10090,
      id: 10093,
      meta: {
        title: 'Users',
        show: true
      },
      component: 'security/Users',
      path: '/security/users'
    },

    // dashboard
    {
      name: 'olddashboard',
      parentId: 0,
      id: 1,
      meta: {
        icon: 'dashboard',
        title: '仪表盘',
        show: true
      },
      component: 'RouteView',
      redirect: '/dashboard/workplace'
    },
    {
      name: 'workplace',
      parentId: 1,
      id: 2,
      meta: {
        title: '工作台',
        show: true
      },
      component: 'Workplace'
    },
    {
      name: 'monitor',
      path: 'https://www.baidu.com/',
      parentId: 1,
      id: 3,
      meta: {
        title: '监控页（外部）',
        target: '_blank',
        show: true
      }
    },
    {
      name: 'Analysis',
      parentId: 1,
      id: 4,
      meta: {
        title: '分析页',
        show: true
      },
      component: 'Analysis',
      path: '/dashboard/analysis'
    },

    // form
    {
      name: 'form',
      parentId: 0,
      id: 5,
      meta: {
        icon: 'form',
        title: '表单页'
      },
      redirect: '/form/base-form',
      component: 'RouteView'
    },
    {
      name: 'basic-form',
      parentId: 5,
      id: 6,
      meta: {
        title: '基础表单'
      },
      component: 'BasicForm'
    },
    {
      name: 'step-form',
      parentId: 5,
      id: 7,
      meta: {
        title: '分步表单'
      },
      component: 'StepForm'
    },
    {
      name: 'advanced-form',
      parentId: 5,
      id: 8,
      meta: {
        title: '高级表单'
      },
      component: 'AdvanceForm'
    },

    // list
    {
      name: 'list',
      parentId: 0,
      id: 9,
      meta: {
        icon: 'table',
        title: '列表页',
        show: true
      },
      redirect: '/list/table-list',
      component: 'RouteView'
    },
    {
      name: 'table-list',
      parentId: 9,
      id: 10,
      path: '/list/table-list/:pageNo([1-9]\\d*)?',
      meta: {
        title: '查询表格',
        show: true
      },
      component: 'TableList'
    },
    {
      name: 'basic-list',
      parentId: 9,
      id: 11,
      meta: {
        title: '标准列表',
        show: true
      },
      component: 'StandardList'
    },
    {
      name: 'card',
      parentId: 9,
      id: 12,
      meta: {
        title: '卡片列表',
        show: true
      },
      component: 'CardList'
    },
    {
      name: 'search',
      parentId: 9,
      id: 13,
      meta: {
        title: '搜索列表',
        show: true
      },
      redirect: '/list/search/article',
      component: 'SearchLayout'
    },
    {
      name: 'article',
      parentId: 13,
      id: 14,
      meta: {
        title: '搜索列表（文章）',
        show: true
      },
      component: 'SearchArticles'
    },
    {
      name: 'project',
      parentId: 13,
      id: 15,
      meta: {
        title: '搜索列表（项目）',
        show: true
      },
      component: 'SearchProjects'
    },
    {
      name: 'application',
      parentId: 13,
      id: 16,
      meta: {
        title: '搜索列表（应用）',
        show: true
      },
      component: 'SearchApplications'
    },

    // profile
    {
      name: 'profile',
      parentId: 0,
      id: 17,
      meta: {
        title: '详情页',
        icon: 'profile',
        show: true
      },
      redirect: '/profile/basic',
      component: 'RouteView'
    },
    {
      name: 'basic',
      parentId: 17,
      id: 18,
      meta: {
        title: '基础详情页',
        show: true
      },
      component: 'ProfileBasic'
    },
    {
      name: 'advanced',
      parentId: 17,
      id: 19,
      meta: {
        title: '高级详情页',
        show: true
      },
      component: 'ProfileAdvanced'
    },

    // result
    {
      name: 'result',
      parentId: 0,
      id: 20,
      meta: {
        title: '结果页',
        icon: 'check-circle-o',
        show: true
      },
      redirect: '/result/success',
      component: 'PageView'
    },
    {
      name: 'success',
      parentId: 20,
      id: 21,
      meta: {
        title: '成功',
        hiddenHeaderContent: true,
        show: true
      },
      component: 'ResultSuccess'
    },
    {
      name: 'fail',
      parentId: 20,
      id: 22,
      meta: {
        title: '失败',
        hiddenHeaderContent: true,
        show: true
      },
      component: 'ResultFail'
    },

    // Exception
    {
      name: 'exception',
      parentId: 0,
      id: 23,
      meta: {
        title: '异常页',
        icon: 'warning',
        show: true
      },
      redirect: '/exception/403',
      component: 'RouteView'
    },
    {
      name: '403',
      parentId: 23,
      id: 24,
      meta: {
        title: '403',
        show: true
      },
      component: 'Exception403'
    },
    {
      name: '404',
      parentId: 23,
      id: 25,
      meta: {
        title: '404',
        show: true
      },
      component: 'Exception404'
    },
    {
      name: '500',
      parentId: 23,
      id: 26,
      meta: {
        title: '500',
        show: true
      },
      component: 'Exception500'
    },

    // account
    {
      name: 'account',
      parentId: 0,
      id: 27,
      meta: {
        title: '个人页',
        icon: 'user',
        show: true
      },
      redirect: '/account/center',
      component: 'RouteView'
    },
    {
      name: 'center',
      parentId: 27,
      id: 28,
      meta: {
        title: '个人中心',
        show: true
      },
      component: 'AccountCenter'
    },
    // 特殊三级菜单
    {
      name: 'settings',
      parentId: 27,
      id: 29,
      meta: {
        title: '个人设置',
        hideHeader: true,
        hideChildren: true,
        show: true
      },
      redirect: '/account/settings/basic',
      component: 'AccountSettings'
    },
    {
      name: 'BasicSettings',
      path: '/account/settings/basic',
      parentId: 29,
      id: 30,
      meta: {
        title: '基本设置',
        show: false
      },
      component: 'BasicSetting'
    },
    {
      name: 'SecuritySettings',
      path: '/account/settings/security',
      parentId: 29,
      id: 31,
      meta: {
        title: '安全设置',
        show: false
      },
      component: 'SecuritySettings'
    },
    {
      name: 'CustomSettings',
      path: '/account/settings/custom',
      parentId: 29,
      id: 32,
      meta: {
        title: '个性化设置',
        show: false
      },
      component: 'CustomSettings'
    },
    {
      name: 'BindingSettings',
      path: '/account/settings/binding',
      parentId: 29,
      id: 33,
      meta: {
        title: '账户绑定',
        show: false
      },
      component: 'BindingSettings'
    },
    {
      name: 'NotificationSettings',
      path: '/account/settings/notification',
      parentId: 29,
      id: 33,
      meta: {
        title: '新消息通知',
        show: false
      },
      component: 'NotificationSettings'
    }
  ]
  const json = builder(nav)
  console.log('json', json)
  return json
}

Mock.mock(/\/api\/user\/info/, 'get', info)
Mock.mock(/\/api\/user\/nav/, 'get', userNav)
