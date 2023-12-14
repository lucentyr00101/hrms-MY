import request from '@/utils/request'

const api = {
  list: '/payrollDeduction/all',
  add: '/payrollDeduction/add',
  status: '/payrollDeduction/status',
  update: '/payrollDeduction/update',
  delete: '/payrollDeduction/delete'
}

export function fetchList(params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}
export function addDeduction(data) {
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
export function updateDeduction(data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}
export function deleteDeduction(data) {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}
