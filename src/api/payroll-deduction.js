import request from '@/utils/request'

const api = {
  list: '/mainPayrollDeduction/all',
  search: '/mainPayrollDeduction/search',
  exportData: '/mainPayrollDeduction/export',
  add: '/mainPayrollDeduction/add',
  update: '/mainPayrollDeduction/update',
  delete: '/mainPayrollDeduction/delete'
}

export function fetchList(params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function search(data) {
  return request({
    url: api.search,
    method: 'post',
    data
  })
}

export function exportData(data) {
  return request({
    url: api.exportData,
    method: 'post',
    data
  })
}

export function addPayrollDeduction(data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function updatePayrollDeduction(data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export const deletePayrollDeduction = (data) => {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}
