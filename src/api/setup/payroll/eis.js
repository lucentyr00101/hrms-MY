import request from '@/utils/request'

const api = {
  list: '/payrollEisType/all',
  add: '/payrollEisType/add',
  update: '/payrollEisType/update',
  status: '/payrollEisType/status',
  delete: '/payrollEisType/delete'
}

export function fetchList (params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function addEis (data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function updateEis (data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export function deleteEis (data) {
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
