import request from '@/utils/request'

const api = {
  list: '/employeeSetupWorkReport/all',
  add: '/employeeSetupWorkReport/add',
  update: '/employeeSetupWorkReport/update',
  delete: '/employeeSetupWorkReport/delete'
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
