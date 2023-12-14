import request from '@/utils/request'

const api = {
  list: '/employeeQualification/all',
  add: '/employeeQualification/add',
  delete: '/employeeQualification/delete',
  update: '/employeeQualification/update'
}

export function fetchList(params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}
export function addQualification(data) {
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
export function update(data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}
