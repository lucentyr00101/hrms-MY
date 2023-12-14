import request from '@/utils/request'

const api = {
  statistics: '/dashboard/claim/statistics',
  claims: '/dashboard/claim/all'
}
export function statistics(params) {
  return request({
    url: api.statistics,
    method: 'get',
    params
  })
}
export function claimAll(params) {
  return request({
    url: api.claims,
    method: 'get',
    params
  })
}
