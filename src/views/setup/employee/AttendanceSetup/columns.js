import { i18nRender } from '@/locales/index'

export default [
  {
    id: 1,
    title: i18nRender('table.column.attendance-type'),
    dataIndex: 'attendanceType',
    key: 'attendanceType',
    ellipsis: true,
    scopedSlots: { customRender: 'attendanceType' }
  },
  {
    id: 2,
    title: i18nRender('table.column.sort'),
    dataIndex: 'sort',
    key: 'sort'
  },
  {
    id: 3,
    title: i18nRender('table.column.status-name'),
    dataIndex: 'statusName',
    key: 'statusName',
    scopedSlots: { customRender: 'statusName' }
  },
  {
    id: 3,
    title: i18nRender('table.column.descriptions'),
    dataIndex: 'description',
    key: 'description',
    scopedSlots: { customRender: 'description' },
    ellipsis: true
  },
  {
    id: 4,
    title: i18nRender('table.column.publish'),
    dataIndex: 'isPublish',
    key: 'isPublish',
    scopedSlots: { customRender: 'isPublish' },
    ellipsis: true
  },
  {
    id: 5,
    title: i18nRender('table.column.action'),
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
