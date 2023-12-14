import request from '@/utils/request'

const api = {
  statistics: '/dashboard/payroll/statistics',
  all: '/dashboard/payroll/all'
}
export function statistics(params) {
  return request({
    url: api.statistics,
    method: 'get',
    params
  })
}
export function payroll(params) {
  return request({
    url: api.all,
    method: 'get',
    params
  })
}
