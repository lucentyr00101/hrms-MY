import request from '@/utils/request'

const api = {
  list: '/payrollSocsoType/all',
  add: '/payrollSocsoType/add',
  update: 'payrollSocsoType/update',
  status: 'payrollSocsoType/status',
  delete: '/payrollSocsoType/delete'
}

export function fetchList (params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
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
    url: api.update,
    method: 'put',
    data
  })
}

export function deleteSocso (data) {
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
