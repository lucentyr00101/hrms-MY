import { i18nRender } from '@/locales/index'

export const leave = (valueEnumsEmployeeNumber, valueEnumsEmployeeName, valueEnumsDepartment, valueEnumsLeaveType) => {
  return [
    {
      id: 1,
      title: i18nRender('table.column.employee-number'),
      dataIndex: 'employeeNumber',
      key: 'employeeNumber',
      order: 5,
      valueType: 'select',
      valueEnums: valueEnumsEmployeeNumber,
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
      ellipsis: true,
      scopedSlots: { customRender: 'employeeName' }
    },
    {
      id: 3,
      title: i18nRender('table.column.department'),
      dataIndex: 'department',
      key: 'department',
      order: 4,
      valueType: 'tree',
      valueEnums: valueEnumsDepartment,
      ellipsis: true,
      scopedSlots: { customRender: 'department' }
    },
    {
      id: 4,
      title: i18nRender('table.column.leave-type'),
      dataIndex: 'leaveType',
      key: 'leaveType',
      order: 6,
      valueType: 'select',
      valueEnums: valueEnumsLeaveType,
      scopedSlots: { customRender: 'leaveType' }
    },
    {
      id: 5,
      title: i18nRender('table.column.applied-time'),
      dataIndex: 'appliedTime',
      key: 'appliedTime',
      hideInSearch: true,
      ellipsis: true
    },
    {
      id: 6,
      title: i18nRender('table.column.start-date2'),
      dataIndex: 'startDate',
      key: 'startDate',
      order: 1,
      valueType: 'date',
      datePlaceholder: 'Select Date'
    },
    {
      id: 7,
      title: i18nRender('table.column.end-date2'),
      dataIndex: 'endDate',
      key: 'endDate',
      hideInSearch: true
    },
    {
      id: 8,
      title: i18nRender('table.column.days'),
      dataIndex: 'days',
      key: 'days',
      hideInSearch: true
    },
    {
      id: 9,
      title: i18nRender('table.column.status'),
      dataIndex: 'status',
      key: 'status',
      order: 3,
      valueType: 'select',
      valueEnums: ['All', 'Pending', 'Approved', 'Rejected'],
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
