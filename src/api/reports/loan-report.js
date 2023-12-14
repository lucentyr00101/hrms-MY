import request from '@/utils/request'

const api = {
  list: '/loanReport/preview',
  export: '/loanReport/export'
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
