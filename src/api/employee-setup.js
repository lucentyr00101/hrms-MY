import request from '@/utils/request'

const api = {
  list: '/employeeSetup/all',
  search: '/employeeSetup/search',
  addEmployee: '/employeeSetup/employeeInfo/add',
  editEmployee: '/employeeSetup/employeeInfo/update',
  editEmployeeAllowance: '/employeeSetupAllowance/update',
  editEmployeeDeduction: '/employeeSetupDeduction/update',
  dropdownList: '/dictionaryDropdown/employee/dropdowns',
  exportData: '/employeeSetup/search/export',
  get: (id) => `/employeeSetup/detail?id=${id}`
}

export function fetchList (params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function search (data) {
  return request({
    url: api.search,
    method: 'post',
    data
  })
}

export function exportData (data) {
  return request({
    url: api.exportData,
    method: 'post',
    data
  })
}

export function addEmployee (data) {
  return request({
    url: api.addEmployee,
    method: 'post',
    data
  })
}

export function editEmployee (data) {
  return request({
    url: api.editEmployee,
    method: 'put',
    data
  })
}

export function editEmployeeAllowance (data) {
  return request({
    url: api.editEmployeeAllowance,
    method: 'put',
    data
  })
}

export function editEmployeeDeduction (data) {
  return request({
    url: api.editEmployeeDeduction,
    method: 'put',
    data
  })
}

export function get (id) {
  return request({
    url: api.get(id),
    method: 'get'
  })
}

export function fetchEmployeeDropdown (data) {
  return request({
    url: api.dropdownList,
    method: 'get',
    data
  })
}
