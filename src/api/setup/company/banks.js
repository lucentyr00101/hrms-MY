import request from '@/utils/request'

const api = {
  list: '/companyBank/all',
  add: '/companyBank/add',
  delete: '/companyBank/delete',
  update: '/companyBank/update'
}

export function updateBank(data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export function fetchList(params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function addBank(data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function deleteData(data) {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}
