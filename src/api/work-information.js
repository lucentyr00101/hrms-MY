import request from '@/utils/request'

const api = {
  add: '/employeeSetup/employeeWorkInfo/add',
  put: '/employeeSetup/employeeWorkInfo/update',
  attachment: '/employeeSetup/update/attachment',
  dropdownDepartment: '/dictionaryDropdown/department/dropdowns',
  dropdownLeaveGroup: '/dictionaryDropdown/leaveGroup/dropdowns',
  dropdownImmediateSupervisor: '/dictionaryDropdown/employee/dropdowns',
  dropdownActiveEmployee: '/dictionaryDropdown/activeEmployee/dropdowns',
  dropdownClaimGroup: '/dictionaryDropdown/claimGroup/dropdowns',
  dropdownCalendar: '/dictionaryDropdown/calendar/dropdowns'
}

export function add (data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function update (data) {
    return request({
      url: api.put,
      method: 'put',
      data
    })
}

export function updateAttachment (data) {
  return request({
    url: api.attachment,
    method: 'put',
    data
  })
}

export function dropdownDepartment (params) {
  return request({
    url: api.dropdownDepartment,
    method: 'get',
    params
  })
}

export function dropdownLeaveGroup (params) {
  return request({
    url: api.dropdownLeaveGroup,
    method: 'get',
    params
  })
}

export function dropdownImmediateSupervisor (params) {
  return request({
    url: api.dropdownImmediateSupervisor,
    method: 'get',
    params
  })
}

export function dropdownActiveEmployee (params) {
  return request({
    url: api.dropdownActiveEmployee,
    method: 'get',
    params
  })
}

export function dropdownClaimGroup (params) {
  return request({
    url: api.dropdownClaimGroup,
    method: 'get',
    params
  })
}

export function dropdownCalendar (params) {
  return request({
    url: api.dropdownCalendar,
    method: 'get',
    params
  })
}
