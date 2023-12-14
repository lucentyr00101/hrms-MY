import request from '@/utils/request'

const api = {
  list: '/hrLoanTransaction/all',
  search: '/hrLoanTransaction/search',
  exportData: '/hrLoanTransaction/export',
  add: '/hrLoanTransaction/add',
  update: '/hrLoanTransaction/update',
  delete: '/hrLoanTransaction/delete',
  status: '/hrLoanTransaction/status'
}

export function list(params) {
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

export function add(data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export function status(data) {
  return request({
    url: api.status,
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}
