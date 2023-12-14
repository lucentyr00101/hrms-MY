import { i18nRender } from '@/locales/index'

export default [
  { title: i18nRender('table.column.employee-number'), dataIndex: 'employeeNumber', order: 1 },
  { title: i18nRender('table.column.name'), dataIndex: 'employee' },
  {
    title: i18nRender('table.column.status'),
    dataIndex: 'isPublished',
    scopedSlots: { customRender: 'status' }
  },
  { title: i18nRender('table.column.payroll-amount-rm'), dataIndex: 'gross' },
  {
    title: i18nRender('table.column.action'),
    dataIndex: 'id',
    hideInSearch: true,
    scopedSlots: { customRender: 'action' }
  }
]
