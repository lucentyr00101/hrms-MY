import request from '@/utils/request'

const api = {
  list: '/employeeSetupReminder/all',
  search: '/employeeSetupReminder/search',
  add: '/employeeSetupReminder/add',
  update: '/employeeSetupReminder/update',
  status: '/employeeSetupReminder/updateStatus',
  delete: '/employeeSetupReminder/delete'
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

export function addReminder (data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function updateReminder (data) {
  return request({
    url: api.update,
    method: 'put',
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

export const deleteReminder = (data) => {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}
