import request from '@/utils/request'

const api = {
  departmentList: '/company_departments',
  employeeList: '/employee',
  employeeInformationById: '/employee/3'
}

// company
export function fetchDepartmentList () {
  return request({
    url: api.departmentList,
    method: 'get'
  })
}

export function addDepartment (data) {
  return request({
    url: api.departmentList,
    method: 'post',
    data
  })
}

export function fetchEmployeeList (queryParameters) {
  return request({
    url: api.employeeList,
    method: 'get',
    queryParameters
  })
}

export function fetchEmployeeInformationById () {
  return request({
    url: api.employeeInformationById,
    method: 'get'
  })
}

export function fetchEmployeeData (queryParameters) {
  return request({
    url: api.employeeList,
    method: 'get',
    queryParameters
  })
}
