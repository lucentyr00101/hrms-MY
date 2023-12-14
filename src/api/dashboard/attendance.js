import request from '@/utils/request'

const api = {
  statistics: '/dashboardAttendance/statistics',
  today: '/dashboardAttendance/today'
}
export function statistics(params) {
  return request({
    url: api.statistics,
    method: 'get',
    params
  })
}
export function attendanceToday(params) {
  return request({
    url: api.today,
    method: 'get',
    params
  })
}
