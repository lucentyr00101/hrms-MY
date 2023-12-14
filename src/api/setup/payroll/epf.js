import request from '@/utils/request'

const api = {
  list: '/payrollEpfType/all',
  detail: '/payrollEpf/detail',
  add: '/payrollEpfType/add',
  update: '/payrollEpfType/update',
  status: '/payrollEpfType/status',
  delete: '/payrollEpfType/delete'
}

export function fetchList(params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function fetchDetail(params) {
  return request({
    url: api.detail,
    method: 'get',
    params
  })
}

export function addEPF(data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function updateEPF(data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export function deleteEPF(data) {
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
