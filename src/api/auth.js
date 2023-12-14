import request from '@/utils/request'

const api = {
  me: '/dashboard/loginUser/detail',
  checkStatus: '/securityUsers/notification'
}

export function me () {
  return request({
    url: api.me,
    method: 'get'
  })
}

export function checkStatus (params) {
  return request({
    url: api.checkStatus,
    method: 'get',
    params
  })
}
