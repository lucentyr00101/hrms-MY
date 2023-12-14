import { i18nRender } from '@/locales/index'

export const workshift = (valueEnumsNumber, valueEnumsEmployeeName, valueEnumsDepartment, valueEnumsMonth) => {
  return [
    {
      id: 1,
      title: i18nRender('table.column.employee-number'),
      dataIndex: 'employeeNumber',
      key: 'employeeNumber',
      order: 3,
      valueType: 'select',
      valueEnums: valueEnumsNumber,
      scopedSlots: { customRender: 'employeeNumber' }
    },
    {
      id: 2,
      title: i18nRender('table.column.employee'),
      dataIndex: 'employeeName',
      key: 'employeeName',
      order: 2,
      valueType: 'select',
      valueEnums: valueEnumsEmployeeName,
      scopedSlots: { customRender: 'employeeName' },
      ellipsis: true
    },
    {
      id: 3,
      title: i18nRender('table.column.department'),
      dataIndex: 'department',
      key: 'department',
      valueType: 'tree',
      valueEnums: valueEnumsDepartment,
      scopedSlots: { customRender: 'department' },
      ellipsis: true
    },
    {
      id: 4,
      title: i18nRender('table.column.month'),
      dataIndex: 'month',
      key: 'month',
      order: 1,
      valueType: 'select',
      valueEnums: valueEnumsMonth,
      scopedSlots: { customRender: 'month' }
    },
    {
      id: 5,
      title: i18nRender('table.column.work-hours'),
      dataIndex: 'workHours',
      key: 'workHours'
    },
    {
      id: 6,
      title: i18nRender('table.column.work-days'),
      dataIndex: 'workDaysCount',
      key: 'workDaysCount'
    },
    {
      id: 7,
      title: i18nRender('table.column.action'),
      dataIndex: 'action',
      key: 'action',
      hideInSearch: true,
      scopedSlots: { customRender: 'action' }
    }
  ]
}
