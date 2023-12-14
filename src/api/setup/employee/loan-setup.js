import request from '@/utils/request'

const api = {
  list: '/employeeSetupLoan/all',
  add: '/employeeSetupLoan/add',
  update: '/employeeSetupLoan/update',
  delete: '/employeeSetupLoan/delete'
}

export const fetchList = (params) => {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export const addData = (data) => {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export const updateData = (data) => {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export const deleteData = (data) => {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}
