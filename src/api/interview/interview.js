import request from '@/utils/request'

const api = {
  scheduledList: '/interview/scheduled',
  unscheduledList: '/interview/unscheduled'
}

export const fetchList = ({ config, params }) => {
  return request({
    url: api[config.list],
    method: 'get',
    params
  })
}
