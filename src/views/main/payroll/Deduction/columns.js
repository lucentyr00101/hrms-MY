import { i18nRender } from '@/locales/index'

export const filters = (valueDropdownsSequence, valueDropdownsDepartment, valueDropdownsEmployees, valueDropdownsDeductionTypes) => {
  return [
    {
      id: 1,
      title: i18nRender('table.column.month'),
      dataIndex: 'month',
      key: 'month',
      order: 1,
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
      valueEnums: valueDropdownsSequence
    },
    {
      id: 3,
      title: i18nRender('table.column.department'),
      dataIndex: 'department',
      key: 'department',
      valueType: 'tree',
      valueEnums: valueDropdownsDepartment
    },
    {
      id: 4,
      title: i18nRender('table.column.employee'),
      dataIndex: 'fullName',
      key: 'fullName',
      valueType: 'select',
      valueEnums: valueDropdownsEmployees
    },
    {
      id: 5,
      title: i18nRender('table.column.deduction-type'),
      dataIndex: 'payrollDeductionId',
      key: 'payrollDeductionId',
      valueType: 'select',
      api: true,
      valueEnums: valueDropdownsDeductionTypes
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
      key: 'employee.department'
    },
    {
      id: 4,
      title: i18nRender('table.column.deduction-type'),
      dataIndex: 'payrollDeduction.payrollDeductionType',
      key: 'payrollDeduction.payrollDeductionType'
    },
    {
      id: 5,
      title: i18nRender('table.column.remarks'),
      ellipsis: true,
      dataIndex: 'remarks',
      key: 'remarks'
    },
    {
      id: 6,
      title: i18nRender('table.column.sequence-type'),
      dataIndex: 'sequence',
      key: 'sequence'
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
