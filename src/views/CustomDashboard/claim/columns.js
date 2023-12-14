import { i18nRender } from '@/locales/index'

export default [
  { title: i18nRender('table.column.employee-number'), dataIndex: 'employee.employeeNumber', order: 1 },
  { title: i18nRender('table.column.name'), dataIndex: 'employee.fullName' },
  {
    title: i18nRender('table.column.status'),
    dataIndex: 'approvalStatus',
    scopedSlots: { customRender: 'status' }
  },
  { title: i18nRender('table.column.claim-type'), dataIndex: 'companyClaimType.claimType' },
  {
    title: i18nRender('table.column.action'),
    dataIndex: 'id',
    hideInSearch: true,
    scopedSlots: { customRender: 'action' }
  }
]
