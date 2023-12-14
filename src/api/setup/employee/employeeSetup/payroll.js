import request from '@/utils/request'

const api = {
  add: '/employeeSetupPayroll/add',
  get: (id) => `/employeeSetupPayroll/detail?id=${id}`,
  update: '/employeeSetupPayroll/update'
}

export function addPayroll (data) {
    return request({
        url: api.add,
        method: 'post',
        data
    })
}

export function get (id) {
  return request({
    url: api.get(id),
    method: 'get'
  })
}

export function updatePayroll (data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}
