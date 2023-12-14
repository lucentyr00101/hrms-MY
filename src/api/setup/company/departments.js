import request from '@/utils/request'

const api = {
  list: '/companyDepartment/all',
  add: '/companyDepartment/add',
  dropdownList: '/companyDepartment/add/dropdowns',
  update: '/companyDepartment/update',
  delete: '/companyDepartment/delete'
}

export function updateDepartment(data) {
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

export function addDepartment(data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function fetchDropdownList(params) {
  return request({
    url: api.dropdownList,
    method: 'get',
    params
  })
}

export function deleteData(data) {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}
