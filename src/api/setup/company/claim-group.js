import request from '@/utils/request'

const api = {
  list: '/claimSetupGroup/all',
  add: '/claimSetupGroup/add',
  status: '/claimSetupGroup/status',
  update: '/claimSetupGroup/update',
  delete: '/claimSetupGroup/delete'
}

export function listClaimGroup(params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function addClaimGroup(data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function updateClaimGroup(data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export function deleteClaimGroup(data) {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}

export function toggleStatus(data) {
  return request({
    url: api.status,
    method: 'put',
    data
  })
}
