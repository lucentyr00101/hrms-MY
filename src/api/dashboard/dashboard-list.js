import request from '@/utils/request'

const api = {
  updateStatus: '/dashboard/updateStatus',
  userWorkDetail: '/dashboard/userWorkDetail',
  loginUserDetail: '/dashboard/loginUser/detail',
  userTodayAttendance: '/dashboard/userTodayAttendance/all',
  offsetAndLeaveBalance: '/dashboard/offsetAndLeaveBalance',
  leaveBalance: '/dashboard/leaveBalance',
  offsetBalance: '/dashboard/offsetBalance',
  otAndHours: '/dashboard/otAndHours'
}
export function updateStatus(data) {
  return request({
    url: api.updateStatus,
    method: 'post',
    data
  })
}
export function userWorkDetail(params) {
  return request({
    url: api.userWorkDetail,
    method: 'get',
    params
  })
}

export function loginUserDetail(params) {
  return request({
    url: api.loginUserDetail,
    method: 'get',
    params
  })
}
export function userTodayAttendance(params) {
  return request({
    url: api.userTodayAttendance,
    method: 'get',
    params
  })
}
export function offsetAndLeaveBalance(params) {
  return request({
    url: api.offsetAndLeaveBalance,
    method: 'get',
    params
  })
}
export function leaveBalance(params) {
  return request({
    url: api.leaveBalance,
    method: 'get',
    params
  })
}
export function offsetBalance(params) {
  return request({
    url: api.offsetBalance,
    method: 'get',
    params
  })
}
export function otAndHours(params) {
  return request({
    url: api.otAndHours,
    method: 'get',
    params
  })
}
