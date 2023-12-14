import request from '@/utils/request'

const api = {
  list: '/companyCalendarMasterList/all',
  add: '/companyCalendarMasterList/add',
  update: '/companyCalendarMasterList/update',
  delete: '/companyCalendarMasterList/delete',
  status: '/companyCalendarMasterList/status',
  activeList: '/companyCalendarMasterList/active/all'
}

export function fetchList(params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function fetchActiveList(params) {
  return request({
    url: api.activeList,
    method: 'get',
    params
  })
}

export function updateMasterCalendar(data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export function deleteMasterCalendar(data) {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}

export function addMasterCalendar(data) {
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
