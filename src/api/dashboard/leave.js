import request from '@/utils/request'

const api = {
  statistics: '/dashboardLeave/statistics',
  today: '/dashboardLeave/today'
}
export function statistics(params) {
  return request({
    url: api.statistics,
    method: 'get',
    params
  })
}
export function leaveToday(params) {
  return request({
    url: api.today,
    method: 'get',
    params
  })
}
