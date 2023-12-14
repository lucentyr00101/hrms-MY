import { i18nRender } from '@/locales/index'

export const filters = (valueEnumsSequence, valueEnumsDepartment, valueEnumsEmployees) => {
  return [
    {
      id: 1,
      title: i18nRender('table.column.month'),
      dataIndex: 'month',
      key: 'month',
      order: 1,
      placeholder: 'Select Month',
      valueType: 'select',
      valueEnums: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
    },
    {
      id: 2,
      title: i18nRender('table.column.sequence-type'),
      dataIndex: 'sequenceType',
      key: 'sequenceType',
      valueType: 'select',
      valueEnums: valueEnumsSequence
    },
    {
      id: 3,
      title: i18nRender('table.column.department'),
      dataIndex: 'department',
      key: 'department',
      valueType: 'tree',
      valueEnums: valueEnumsDepartment
    },
    {
      id: 4,
      title: i18nRender('table.column.employee'),
      dataIndex: 'fullName',
      key: 'fullName',
      valueType: 'select',
      valueEnums: valueEnumsEmployees
    }
  ]
}

export const columns = () => {
  return [
    {
      id: 1,
      title: i18nRender('table.column.employee-number'),
      dataIndex: 'employee.employeeNumber',
      key: 'employee.employeeNumber'
    },
    {
      id: 2,
      title: i18nRender('table.column.employee'),
      dataIndex: 'employee.fullName',
      key: 'employee.fullName'
    },
    {
      id: 3,
      title: i18nRender('table.column.department'),
      dataIndex: 'employee.department',
      key: 'employee.department',
      ellipsis: true
    },
    {
      id: 4,
      title: i18nRender('table.column.sequence-type'),
      dataIndex: 'sequence',
      key: 'sequence'
    },
    {
      id: 5,
      title: i18nRender('table.column.descriptions'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      id: 6,
      title: i18nRender('table.column.wages'),
      dataIndex: 'employee.wages',
      key: 'employee.wages'
    },
    {
      id: 7,
      title: i18nRender('table.column.amount'),
      dataIndex: 'amount',
      key: 'amount'
    },
    {
      id: 8,
      title: i18nRender('table.column.action'),
      dataIndex: 'action',
      key: 'action',
      hideInSearch: true,
      scopedSlots: { customRender: 'action' }
    }
  ]
}
