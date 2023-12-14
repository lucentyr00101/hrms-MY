import request from '@/utils/request'

const api = {
  listLeaveType: '/companyLeaveType/active/all',
  all: '/companyLeaveSetting/all',
  add: '/companyLeaveSetting/add',
  update: '/companyLeaveSetting/update',
  delete: '/companyLeaveSetting/delete'
}

export function fetchLeaveTypeList(params) {
  return request({
    url: api.listLeaveType,
    method: 'get',
    params
  })
}

export function fetchLeaveSetting(data) {
  return request({
    url: api.all,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    data
  })
}

export function addLeaveSetting(data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}
export function deleteLeaveSetting(data) {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}

export function updateLeaveSetting(data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}
