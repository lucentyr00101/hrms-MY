import request from '@/utils/request'

const api = {
  search: '/mainPayrollCommissions/search',
  update: '/mainPayrollCommissions/update',
  export: '/mainPayrollCommissions/export',
  add: '/mainPayrollCommissions/add',
  detail: '/mainPayrollCommissions/detail',
  all: '/mainPayrollCommissions/all',
  delete: '/mainPayrollCommissions/delete'
}

export const search = (data) => {
  return request({
    url: api.search,
    method: 'post',
    data
  })
}

export const update = (data) => {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export const exportData = (data) => {
  return request({
    url: api.export,
    method: 'post',
    data
  })
}

export const add = (data) => {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export const detail = (data) => {
  return request({
    url: api.detail,
    method: 'get',
    data
  })
}

export const all = (data) => {
  return request({
    url: api.all,
    method: 'get',
    data
  })
}

export const deleteCommission = (data) => {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}
