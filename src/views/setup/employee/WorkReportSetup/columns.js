import { i18nRender } from '@/locales/index'

export default [
  {
    title: i18nRender('table.column.work-report-type'),
    dataIndex: 'workReportType',
    key: 'workReportType',
    ellipsis: true
  },
  {
    title: i18nRender('table.column.descriptions'),
    dataIndex: 'descriptions',
    key: 'descriptions',
    ellipsis: true
  },
  {
    title: i18nRender('table.column.action'),
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
