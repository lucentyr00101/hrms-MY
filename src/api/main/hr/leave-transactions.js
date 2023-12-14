import request from '@/utils/request'

const api = {
  list: '/hrLeaveTransaction/all',
  search: '/hrLeaveTransaction/search',
  export: '/hrLeaveTransaction/export',
  add: '/hrLeaveTransaction/add',
  delete: '/hrLeaveTransaction/delete',
  approve: '/hrLeaveTransaction/approveStatus',
  reject: '/hrLeaveTransaction/rejectStatus'
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
    url: api.export,
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

export function deleteData(data) {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}

export function approveStatus(data) {
  return request({
    url: api.approve,
    method: 'put',
    data
  })
}

export function rejectStatus(data) {
  return request({
    url: api.reject,
    method: 'put',
    data
  })
}
