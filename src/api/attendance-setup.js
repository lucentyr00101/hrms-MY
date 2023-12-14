import request from '@/utils/request'

const api = {
  fetchList: '/employeeSetupAttendance/search',
  add: '/employeeSetupAttendance/add',
  update: '/employeeSetupAttendance/update',
  _delete: '/employeeSetupAttendance/delete',
  dropdowns: '/dictionaryDropdown/colorType/dropdowns'
}

export function fetchDropdowns (params) {
  return request({
    url: api.dropdowns,
    method: 'get',
    params
  })
}

export function fetchList (data) {
  return request({
    url: api.fetchList,
    method: 'post',
    data
  })
}

export function addAttendance (data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function updateAttendance (data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export function deleteAttendance (data) {
  return request({
    url: api._delete,
    method: 'delete',
    data
  })
}
