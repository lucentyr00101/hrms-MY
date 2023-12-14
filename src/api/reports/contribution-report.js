import request from '@/utils/request'

const api = {
  list: '/contributionReport/preview',
  export: '/contributionReport/export'
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
