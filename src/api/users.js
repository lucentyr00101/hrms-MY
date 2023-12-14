import request from '@/utils/request'

const api = {
  list: '/securityUsers/all',
  add: '/securityUsers/add',
  update: '/securityUsers/update',
  status: '/securityUsers/status',
  resetPassword: '/securityUsers/resetPassword',
  dropdownList: '/securityUsers/search/dropdowns',
  detail: '/securityUsers/detail',
  delete: '/securityUsers/delete'
}

export function deleteUsers (data) {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}

export function updateUser (data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export function fetchList (params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function fetchDetail(id) {
  return request({
    url: api.detail,
    method: 'get',
    params: { id }
  })
}

export function addUser (data) {
  return request({
    url: api.add,
    method: 'post',
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

export function resetPassword (data) {
  return request({
    url: api.resetPassword,
    method: 'put',
    data
  })
}

export function fetchDropdownList (params) {
  return request({
    url: api.dropdownList,
    method: 'get',
    params
  })
}
