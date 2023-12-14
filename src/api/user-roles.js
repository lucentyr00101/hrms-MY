import request from '@/utils/request'

const api = {
  list: '/securityUserRoles/all',
  add: '/securityUserRoles/add',
  status: '/securityUserRoles/status',
  rename: '/securityUserRoles/rename',
  delete: '/securityUserRoles/delete',
  dataAccess: '/securityUserRoles/dataAccess/add',
  getDataAccess: '/securityUserRoles/dataAccess',
  accessLayers: '/dictionaryDropdown/dataAccessLayer/dropdowns',
  getSecurityPermission: '/securityPermission/tree',
  setPermission: '/securityUserRoles/setPermission'
}

export function getDataAccess (params) {
  return request({
    url: api.getDataAccess,
    method: 'get',
    params
  })
}

export function accessLayers (data) {
  return request({
    url: api.accessLayers,
    method: 'get',
    data
  })
}

export function dataAccess (data) {
  return request({
    url: api.dataAccess,
    method: 'post',
    data
  })
}

export function deleteRoles (data) {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}

export function renameRole (data) {
  return request({
    url: api.rename,
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

export function addRole (data) {
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

export function getSecurityPermission (params) {
  return request({
    url: api.getSecurityPermission,
    method: 'get',
    params
  })
}

export function setPermission (data) {
  return request({
    url: api.setPermission,
    method: 'put',
    data
  })
}
