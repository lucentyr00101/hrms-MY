import request from '@/utils/request'
const api = {
  list: '/claimSetupType/all',
  add: '/claimSetupType/add',
  status: '/claimSetupType/status',
  update: '/claimSetupType/update',
  delete: '/claimSetupType/delete'
}

export function claimTypeFetchList(params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function claimTypeAdd(data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function claimTypeToggleStatus(data) {
  return request({
    url: api.status,
    method: 'put',
    data
  })
}

export function claimTypeUpdate(data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export function claimTypeDelete(data) {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}
