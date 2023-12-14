import { i18nRender } from '@/locales/index'

export default [
  { title: i18nRender('table.column.assets-type'), dataIndex: 'assetType', order: 1, ellipsis: true },
  { title: i18nRender('table.column.assets-name'), dataIndex: 'assetName', ellipsis: true },
  { title: i18nRender('table.column.serial-number'), dataIndex: 'serialNumber', order: 2, ellipsis: true },
  { title: i18nRender('table.column.remark'), dataIndex: 'remarks', hideInSearch: true, ellipsis: true },
  { title: i18nRender('table.column.value'), dataIndex: 'value' },
  {
    title: i18nRender('table.column.status'),
    dataIndex: 'status',
    valueType: 'select',
    order: 3,
    showAllOption: true,
    valueEnums: {
      allocated: 'Allocated',
      idle: 'Idle',
      decommissioned: 'Decommissioned'
    },
    scopedSlots: { customRender: 'status' }
  },
  {
    title: i18nRender('table.column.action'),
    dataIndex: 'id',
    hideInSearch: true,
    scopedSlots: { customRender: 'action' }
  }
]
