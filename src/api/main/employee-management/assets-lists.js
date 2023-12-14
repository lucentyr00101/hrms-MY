import request from '@/utils/request'

const api = {
  list: '/employeeManagementAsset/all',
  add: '/employeeManagementAsset/add',
  update: '/employeeManagementAsset/update',
  delete: '/employeeManagementAsset/delete',
  handover: '/employeeSetupResignation/approved/detail',
  return: '/employeeSetupResignation/returnAsset',
  search: '/employeeManagementAsset/search',
  export: '/employeeManagementAsset/export'
}

export function fetchAssetsList(params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function exportData(data) {
  return request({
    url: api.export,
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export function search(data) {
  return request({
    url: api.search,
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

export function handover(id) {
  return request({
    url: api.handover,
    method: 'get',
    params: { employeeNumber: id }
  })
}

export function returnAssets(data) {
  return request({
    url: api.return,
    method: 'put',
    data
  })
}
