import { i18nRender } from '@/locales/index'

export const columns = (departmentEnums, employeeEnums, assetsEnums) => {
  return [
    {
      title: i18nRender('table.column.employee-number'),
      dataIndex: 'employee.employeeNumber',
      order: 2,
      valueType: 'select',
      showAllOption: true,
      valueEnums: employeeEnums.map((item) => item.number)
    },
    {
      title: i18nRender('table.column.employee'),
      dataIndex: 'employee.fullName',
      order: 1,
      scopedSlots: { customRender: 'employee_name' },
      valueType: 'select',
      showAllOption: true,
      valueEnums: employeeEnums.map((item) => item.label),
      ellipsis: true
    },
    {
      title: i18nRender('table.column.department'),
      dataIndex: 'employee.department',
      order: 3,
      valueType: 'tree',
      valueEnums: departmentEnums,
      ellipsis: true
    },
    {
      title: i18nRender('table.column.assets-type'),
      dataIndex: 'companyAsset.assetType',
      valueType: 'select',
      showAllOption: true,
      valueEnums: [...new Set(assetsEnums.map((item) => item.assetType))],
      ellipsis: true
    },
    {
      title: i18nRender('table.column.assets-name'),
      dataIndex: 'companyAsset.assetName',
      valueType: 'select',
      showAllOption: true,
      valueEnums: assetsEnums.map((item) => item.assetName),
      ellipsis: true
    },
    {
      title: i18nRender('table.column.serial-number'),
      dataIndex: 'companyAsset.serialNumber',
      valueType: 'select',
      showAllOption: true,
      valueEnums: assetsEnums.map((item) => item.serialNumber),
      ellipsis: true
    },
    {
      title: i18nRender('table.column.value'),
      dataIndex: 'companyAsset.value',
      valueType: 'select',
      showAllOption: true,
      valueEnums: [...new Set(assetsEnums.map((item) => item.assetValue))]
    },
    {
      title: i18nRender('table.column.action'),
      dataIndex: 'id',
      hideInSearch: true,
      scopedSlots: { customRender: 'action' }
    }
  ]
}
