import request from '@/utils/request'

const api = {
  list: '/notification/get',
  read: '/notification/read'
}

export function fetchList (params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function read (data) {
  return request({
    url: api.read,
    method: 'put',
    data
  })
}
