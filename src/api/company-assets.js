import request from '@/utils/request'

const api = {
  list: '/companyAsset/all',
  add: '/companyAsset/add',
  search: '/companyAsset/search',
  exportData: '/companyAsset/export',
  update: '/companyAsset/update',
  deleteData: '/companyAsset/delete'
}

export function fetchList(params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: api.add,
    method: 'post',
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

export function exportData(data) {
  return request({
    url: api.exportData,
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

export function deleteData (data) {
  return request({
    url: api.deleteData,
    method: 'delete',
    data
  })
}
