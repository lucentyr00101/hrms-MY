import { i18nRender } from '@/locales/index'

export const filters = (valueDropdownsLoanType, valueDropdownsDepartment, valueDropdownsEmployees) => {
  return [
    {
      id: 1,
      title: i18nRender('table.column.time'),
      dataIndex: 'dateTime',
      valueType: 'date',
      dateType: 'rangeDateTime'
    },
    {
      id: 2,
      title: i18nRender('table.column.employee'),
      dataIndex: 'employeeName',
      valueType: 'select',
      showAllOption: true,
      valueEnums: valueDropdownsEmployees.map((item) => item.label)
    },
    {
      id: 3,
      title: i18nRender('table.column.approval-status'),
      dataIndex: 'approvalStatus',
      valueType: 'select',
      showAllOption: true,
      valueEnums: ['Pending', 'Approved', 'Rejected']
    },
    {
      id: 4,
      title: i18nRender('table.column.loan-type'),
      dataIndex: 'loanType',
      valueType: 'select',
      showAllOption: true,
      valueEnums: valueDropdownsLoanType.map((item) => item.label)
    },
    {
      id: 5,
      title: i18nRender('table.column.employee-number'),
      dataIndex: 'employeeNumber',
      valueType: 'select',
      showAllOption: true,
      valueEnums: valueDropdownsEmployees.map((item) => item.number)
    },
    {
      id: 6,
      title: i18nRender('table.column.department'),
      dataIndex: 'department',
      valueType: 'tree',
      valueEnums: valueDropdownsDepartment
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
      key: 'employee.fullName',
      ellipsis: true
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
      title: i18nRender('table.column.loan-type'),
      dataIndex: 'loanType',
      key: 'loanType',
      ellipsis: true
    },
    {
      id: 5,
      title: i18nRender('table.column.applied-time'),
      dataIndex: 'appliedTime',
      key: 'appliedTime',
      ellipsis: true
    },
    {
      id: 6,
      title: i18nRender('table.column.amount'),
      dataIndex: 'loanAmount',
      key: 'loanAmount'
    },
    {
      id: 7,
      title: i18nRender('table.column.terms'),
      dataIndex: 'terms',
      key: 'terms'
    },
    {
      id: 8,
      title: i18nRender('table.column.interest-rate'),
      dataIndex: 'interestRate',
      key: 'interestRate',
      scopedSlots: { customRender: 'interestRate' }
    },
    {
      id: 8,
      title: i18nRender('table.column.approval-status'),
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      scopedSlots: { customRender: 'status' }
    },
    {
      id: 10,
      title: i18nRender('table.column.action'),
      dataIndex: 'action',
      key: 'action',
      hideInSearch: true,
      scopedSlots: { customRender: 'action' }
    }
  ]
}
