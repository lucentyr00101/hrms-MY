import request from '@/utils/request'

const api = {
  list: '/payrollTaxType/all',
  add: '/payrollTaxType/add',
  update: '/payrollTaxType/update',
  status: 'payrollTaxType/status',
  delete: '/payrollTaxType/delete'
}

export function fetchList (params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function addTax (data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function updateTax(data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export function deleteTax(data) {
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
