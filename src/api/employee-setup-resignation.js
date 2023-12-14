import request from '@/utils/request'

const api = {
  add: `/employeeSetupResignation/add`,
  get: `/employeeSetupResignation/detail`,
  upload: '/employeeSetupResignation/uploadImage',
  approve: '/employeeSetupResignation/approve',
  reject: `/employeeSetupResignation/reject`,
  withdraw: '/employeeSetupResignation/withdraw'
}

export function employeeResignation (id) {
  return request({
    url: api.get(id),
    method: 'get'
  })
}

export function addEmployeeResignation (data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function approveResignation (id, data) {
  return request({
    url: api.approve,
    method: 'put',
    data
  })
}

export function rejectResignation (data) {
  return request({
    url: api.reject,
    method: 'put',
    data
  })
}

export function uploadResignation (data) {
  return request({
    url: api.upload,
    method: 'post',
    data
  })
}

export function withdrawResignation (data) {
  return request({
    url: api.withdraw,
    method: 'put',
    data
  })
}
