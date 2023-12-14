import request from '@/utils/request'

const api = {
  list: '/companyLeaveGroup/all',
  add: '/companyLeaveGroup/add',
  update: '/companyLeaveGroup/update',
  delete: '/companyLeaveGroup/delete',
  status: 'companyLeaveGroup/status'
}

export function fetchList (params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function addLeaveGroup (data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function updateLeaveGroup (data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export function deleteLeaveGroup (data) {
  return request({
    url: api.delete,
    method: 'delete',
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
