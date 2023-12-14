import { i18nRender } from '@/locales/index'

export default [
  { title: i18nRender('table.column.employee-number'), dataIndex: 'employee.employeeNumber', order: 1 },
  { title: i18nRender('table.column.name'), dataIndex: 'employee.fullName' },
  {
    title: i18nRender('table.column.time-in'),
    dataIndex: 'timeInTime',
    order: 2,
    scopedSlots: { customRender: 'timeInTime' }
  },
  {
    title: i18nRender('table.column.time-out'),
    dataIndex: 'timeOutTime',
    hideInSearch: true,
    ellipsis: true,
    scopedSlots: { customRender: 'timeOutTime' }
  },
  { title: i18nRender('table.column.work-duration'), dataIndex: 'workTimeDuration' },
  {
    title: i18nRender('table.column.status'),
    dataIndex: 'attendanceType',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: i18nRender('table.column.action'),
    dataIndex: 'employee.id',
    hideInSearch: true,
    scopedSlots: { customRender: 'action' }
  }
]
