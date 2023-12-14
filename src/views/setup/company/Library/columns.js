import { i18nRender } from '@/locales/index'

export const filters = (authorsEnums) => {
  return [
    {
      id: 1,
      title: i18nRender('table.column.date'),
      dataIndex: 'createdDate',
      key: 'createdDate',
      valueType: 'date'
    },
    {
      id: 2,
      title: i18nRender('table.column.title'),
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: i18nRender('table.column.author'),
      dataIndex: 'author',
      valueType: 'select',
      valueEnums: authorsEnums
    }
  ]
}

export const columns = [
  {
    title: i18nRender('table.column.title'),
    dataIndex: 'title',
    key: 'title',
    ellipsis: true
  },
  {
    title: i18nRender('table.column.author'),
    dataIndex: 'author',
    key: 'author',
    ellipsis: true
  },
  {
    title: i18nRender('table.column.descriptions'),
    dataIndex: 'descriptions',
    key: 'descriptions',
    ellipsis: true,
    scopedSlots: { customRender: 'status' }
  },
  {
    title: i18nRender('table.column.date'),
    dataIndex: 'date',
    key: 'date',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: i18nRender('table.column.action'),
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
