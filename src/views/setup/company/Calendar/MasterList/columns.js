import { i18nRender } from '@/locales/index'

export default [
  {
    title: i18nRender('table.column.holiday'),
    dataIndex: 'holiday',
    key: 'holiday',
    ellipsis: true
  },
  {
    title: i18nRender('table.column.date-from'),
    dataIndex: 'fromDate',
    key: 'start_date',
    scopedSlots: { customRender: 'startDate' }
  },
  {
    title: i18nRender('table.column.date-to'),
    dataIndex: 'toDate',
    key: 'end_date',
    scopedSlots: { customRender: 'endDate' }
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
    title: i18nRender('table.column.action'),
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
