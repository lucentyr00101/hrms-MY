import request from '@/utils/request'

const api = {
  list: '/leaveReport/preview',
  export: '/leaveReport/export'
}

export const fetchList = (data) => {
  return request({
    url: api.list,
    method: 'post',
    data
  })
}

export const exportList = (data) => {
  return request({
    url: api.export,
    method: 'post',
    data
  })
}
