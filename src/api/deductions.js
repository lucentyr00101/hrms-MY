import request from '@/utils/request'

const api = {
  list: '/deductions'
}

export function fetchList (params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}
