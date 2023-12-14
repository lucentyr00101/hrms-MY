import request from '@/utils/request'

const api = {
  list: 'main/employee/assets'
}

export function fetchList (params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}
