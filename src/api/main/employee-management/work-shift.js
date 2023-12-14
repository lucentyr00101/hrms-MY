import request from '@/utils/request'

const api = {
  list: '/employeeManagementWorkShift/all',
  search: '/employeeManagementWorkShift/search',
  exportData: '/employeeManagementWorkShift/export',
  add: '/employeeManagementWorkShift/add',
  update: '/employeeManagementWorkShift/update',
  delete: '/employeeManagementWorkShift/delete'
}

export function fetchList (params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function search (data) {
  return request({
    url: api.search,
    method: 'post',
    data
  })
}

export function exportData (data) {
  return request({
    url: api.exportData,
    method: 'post',
    data
  })
}

export function addWorkShift (data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function updateWorkShift (data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export const deleteWorkShift = (data) => {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}
