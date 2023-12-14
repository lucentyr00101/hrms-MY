import request from '@/utils/request'

const api = {
  list: '/companyLeaveType/all',
  add: '/companyLeaveType/add',
  update: '/companyLeaveType/update',
  delete: '/companyLeaveType/delete',
  status: '/companyLeaveType/status'
}

export function fetchList (params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function addLeaveType (data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}
export function updateLeaveType (data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export function deleteLeaveType (data) {
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
