import request from '@/utils/request'

const api = {
  list: '/companyAnnouncement/search',
  details: '/companyAnnouncement/detail',
  acknowledgedList: '/companyAnnouncement/acknowledgementList',
  add: '/companyAnnouncement/add',
  update: '/companyAnnouncement/update',
  status: '/companyAnnouncement/status',
  acknowledge: '/companyAnnouncement/acknowledgeAnnouncement',
  delete: '/companyAnnouncement/delete'
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

export const fetchAcknowledgedList = (params) => {
  return request({
    url: api.acknowledgedList,
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

export const acknowledgeData = (params) => {
  return request({
    url: api.acknowledge,
    method: 'post',
    params
  })
}

export const deleteData = (data) => {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}
