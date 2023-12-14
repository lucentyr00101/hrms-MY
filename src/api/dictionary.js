import request from '@/utils/request'

const api = {
  list: '/dictionaryType/all',
  search: '/dictionaryType/search',
  add: '/dictionaryType/add',
  edit: `/dictionaryType/update`,
  status: '/dictionaryType/updateStatus',
  delete: '/dictionaryType/delete',
  searchValue: '/dictionaryValue/search',
  values: '/dictionaryValue/valuesByType',
  addValues: '/dictionaryValue/add',
  editValues: `/dictionaryValue/update`,
  statusValue: `/dictionaryValue/updateStatus`,
  deleteValue: '/dictionaryValue/delete',
  typeValue: type => `/dictionaryDropdown/${type}/dropdowns`
}

export const type = {
  HOLIDAY: 'holidayType',
  GENDER: 'genderType',
  EDUCATION: 'education',
  MARITAL: 'maritalStatusType',
  NATIONALITY: 'nationalityType',
  RESIDENT: 'residentStatusType',
  LASTNAME: 'employeeLastName',
  NUMBER: 'employeeNumber',
  DEPARTMENT: 'departmentNames',
  EMAIL: 'employeeEmails',
  YEAR_SERVICE: 'yearOfServiceType',
  LEAVE_ROUND_UP: 'leaveRoundUpType',
  LEAVE_CALCULATION_METHOD: 'leaveCalculationMethodType',
  ATTENDANCE: 'attendanceType',
  LEAVE_TYPE: 'companyLeaveType',
  EMPLOYEE_STATUS_TYPE: 'employeeSetupStatusType'
}

export function fetchDictTypeList (params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function search(data) {
  return request({
    url: api.search,
    method: 'post',
    data
  })
}

export function fetchValuesList (params) {
  return request({
    url: api.values,
    method: 'get',
    params
  })
}

export function searchValue(data) {
  return request({
    url: api.searchValue,
    method: 'post',
    data
  })
}

export function addDictionary (data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function editDictionary (data) {
  return request({
    url: api.edit,
    method: 'put',
    data
  })
}

export function toggleStatus (data) {
  return request({
    url: api.status,
    method: 'put',
    data
  })
}

export function deleteDictionary (data) {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}

export function addValues (data) {
  return request({
    url: api.addValues,
    method: 'post',
    data
  })
}

export function editValues (data) {
  return request({
    url: api.editValues,
    method: 'put',
    data
  })
}

export function toggleStatusValue (data) {
  return request({
    url: api.statusValue,
    method: 'put',
    data
  })
}

export function deleteValue (data) {
  return request({
    url: api.deleteValue,
    method: 'delete',
    data
  })
}

export function getDropdownValues (type) {
  return request({
    url: api.typeValue(type),
    method: 'get'
  })
}
