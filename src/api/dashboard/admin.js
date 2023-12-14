import request from '@/utils/request'

const api = {
  statistics: '/dashboard/administrativeTab'
}

export function statistics(params) {
  return request({
    url: api.statistics,
    method: 'get',
    params
  })
}
