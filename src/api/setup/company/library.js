import request from '@/utils/request'

const api = {
  list: '/companyLibrary/all',
  add: '/companyLibrary/add',
  update: '/companyLibrary/update',
  delete: '/companyLibrary/delete',
  download: '/companyLibrary/download',
  search: '/companyLibrary/search'
}

export function list(params) {
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

export function download(data) {
  return request({
    url: api.download,
    method: 'post',
    responseType: 'arraybuffer',
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

export function deleteData(data) {
  return request({
    url: api.delete,
    method: 'delete',
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
