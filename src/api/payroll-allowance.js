import request from '@/utils/request'

const api = {
  list: '/mainPayrollAllowance/all',
  search: '/mainPayrollAllowance/search',
  exportData: '/mainPayrollAllowance/export',
  add: '/mainPayrollAllowance/add',
  update: '/mainPayrollAllowance/update',
  delete: '/mainPayrollAllowance/delete'
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

export function addPayrollAllowance(data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function updatePayrollAllowance(data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export const deletePayrollAllowance = (data) => {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}
