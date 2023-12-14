import request from '@/utils/request'

const api = {
  list: '/interviewPosition/search',
  details: '/interviewPosition/detail',
  add: '/interviewPosition/add',
  update: '/interviewPosition/update',
  status: '/interviewPosition/status',
  delete: '/interviewPosition/delete'
}

export const fetchList = (data) => {
  return request({
    url: api.list,
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
