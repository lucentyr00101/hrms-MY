import request from '@/utils/request'

const api = {
  list: '/hrLeaveBalance/search',
  export: '/hrLeaveBalance/export',
  details: '/hrLeaveBalance/detail',
  add: '/hrLeaveBalance/add',
  update: '/hrLeaveBalance/update',
  delete: '/hrLeaveBalance/delete'
}

export const fetchList = (data) => {
  return request({
    url: api.list,
    method: 'post',
    data
  })
}

export const exportList = (data) => {
  return request({
    url: api.export,
    method: 'post',
    data
  })
}

export const fetchDetails = (params) => {
  return request({
    url: api.details,
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
