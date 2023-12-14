import request from '@/utils/request'

const api = {
  list: '/companyCalendar/all',
  add: '/companyCalendar/add',
  update: '/companyCalendar/update',
  delete: '/companyCalendar/delete',
  status: '/companyCalendar/status'
}

export function fetchList(params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function addCalendar(data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function updateCalendar(data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export function deleteCalendar(data) {
  return request({
    url: api.delete,
    method: 'delete',
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
