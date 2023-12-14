import { i18nRender } from '@/locales/index'

export default [
  { title: i18nRender('table.column.employee-number'), dataIndex: 'employeeSetup.employeeNumber', order: 1 },
  { title: i18nRender('table.column.name'), dataIndex: 'employeeSetup.fullName' },
  {
    title: i18nRender('table.column.status'),
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  { title: i18nRender('table.column.leave-type'), dataIndex: 'companyLeaveType.leaveType' },
  {
    title: i18nRender('table.column.action'),
    dataIndex: 'id',
    hideInSearch: true,
    scopedSlots: { customRender: 'action' }
  }
]
