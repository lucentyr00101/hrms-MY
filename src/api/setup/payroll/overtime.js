import request from '@/utils/request'

const api = {
  list: '/payrollOvertime/all',
  add: '/payrollOvertime/add',
  update: '/payrollOvertime/update',
  status: '/payrollOvertime/status',
  delete: '/payrollOvertime/delete'
}

export function fetchOvertimeList (params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function updateOvertime(data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export function addOvertime (data) {
    return request({
      url: api.add,
      method: 'post',
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

export function deleteOvertime (data) {
  return request({
      url: api.delete,
      method: 'delete',
      data
  })
}
