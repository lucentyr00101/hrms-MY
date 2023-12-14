import request from '@/utils/request'

const api = {
  list: '/hrClaimTransaction/search',
  export: '/hrClaimTransaction/export',
  details: '/hrClaimTransaction/detail',
  add: '/hrClaimTransaction/add',
  update: '/hrClaimTransaction/update',
  approveStatus: '/hrClaimTransaction/approveStatus',
  rejectStatus: '/hrClaimTransaction/rejectStatus',
  delete: '/hrClaimTransaction/delete'
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

export const approveStatus = (params) => {
  return request({
    url: api.approveStatus,
    method: 'put',
    params
  })
}

export const rejectStatus = (data) => {
  return request({
    url: api.rejectStatus,
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
