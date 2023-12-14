import request from '@/utils/request'

const api = {
  bankList: '/banks'
}

export function fetchBankList (params) {
  return request({
    url: api.bankList,
    method: 'get',
    params
  })
}
