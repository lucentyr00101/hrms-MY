import request from '@/utils/request'

const api = {
  list: '/employeeSetupDeduction/all',
  add: '/employeeSetupDeduction/add',
  dropdown: '/employeeSetupDeduction/add/dropdowns',
  update: '/employeeSetupDeduction/update',
  delete: '/employeeSetupDeduction/delete',
  detail: '/employeeSetupDeduction/detail'
}

export function fetchList (params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}
export function addDeduction (data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}
export function dropdownDeduction (params) {
  return request({
    url: api.dropdown,
    method: 'get',
    params
  })
}
export function updateDeduction (data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}
export function deleteDeduction (data) {
  console.log('data', data)

  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}
export function fetchDetail (id) {
  return request({
      url: api.detail,
      method: 'get',
      params: { id }
  })
}
