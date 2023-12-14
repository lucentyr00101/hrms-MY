import { i18nRender } from '@/locales/index'

export default [
  {
    title: i18nRender('table.column.deduction-type'),
    dataIndex: 'payrollDeductionType',
    key: 'payrollDeductionType',
    ellipsis: true
  },
  {
    title: i18nRender('table.column.descriptions'),
    dataIndex: 'descriptions',
    key: 'descriptions',
    ellipsis: true
  },
  {
    title: i18nRender('table.column.status'),
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: i18nRender('table.column.epf'),
    dataIndex: 'epf',
    key: 'epf',
    scopedSlots: { customRender: 'epf' }
  },
  {
    title: i18nRender('table.column.socso'),
    dataIndex: 'socso',
    key: 'socso',
    scopedSlots: { customRender: 'socso' }
  },
  {
    title: i18nRender('table.column.eis'),
    dataIndex: 'eis',
    key: 'eis',
    scopedSlots: { customRender: 'eis' }
  },
  {
    title: i18nRender('table.column.tax'),
    dataIndex: 'tax',
    key: 'tax',
    scopedSlots: { customRender: 'tax' }
  },
  {
    title: i18nRender('table.column.action'),
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
