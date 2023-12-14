import request from '@/utils/request'

const api = {
  list: '/payrollAllowance/all',
  detail: '/payrollEpf/detail',
  add: '/payrollAllowance/add',
  status: '/payrollAllowance/status',
  update: '/payrollAllowance/update',
  delete: '/payrollAllowance/delete'
}

export function fetchList(params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function fetchDetail(params) {
  return request({
    url: api.detail,
    method: 'get',
    params
  })
}

export function addAllowance(data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function toggleStatus(data) {
  return request({
    url: api.status,
    method: 'put',
    data
  })
}

export function updateAllowance(data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export function deleteAllowance(data) {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}
