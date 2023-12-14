import request from '@/utils/request'

const api = {
  list: '/payrollCommissions/all',
  add: '/payrollCommissions/add',
  update: '/payrollCommissions/update',
  status: '/payrollCommissions/status',
  delete: '/payrollCommissions/delete',
  detail: '/payrollCommissions/detail'
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

export const toggleDataStatus = (data) => {
  return request({
    url: api.status,
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

export const detail = (params) => {
  return request({
    url: api.detail,
    method: 'get',
    params
  })
}
