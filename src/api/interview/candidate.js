import request from '@/utils/request'

const api = {
  list: '/interviewCandidate/search',
  export: '/interviewCandidate/export',
  details: '/interviewCandidate/detail',
  addGeneral: '/interviewCandidate/addGeneral',
  addScreening: '/interviewCandidate/addScreening',
  addInterview: '/interviewCandidate/addInterview',
  updateGeneral: '/interviewCandidate/updateGeneral',
  updateScreening: '/interviewCandidate/updateScreening',
  updateInterview: '/interviewCandidate/updateInterview',
  delete: '/interviewCandidate/delete'
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

export const addGeneral = (data) => {
  return request({
    url: api.addGeneral,
    method: 'post',
    data
  })
}

export const addScreening = (data) => {
  return request({
    url: api.addScreening,
    method: 'post',
    data
  })
}

export const addInterview = (data) => {
  return request({
    url: api.addInterview,
    method: 'post',
    data
  })
}

export const updateGeneral = (data) => {
  return request({
    url: api.updateGeneral,
    method: 'put',
    data
  })
}

export const updateScreening = (data) => {
  return request({
    url: api.updateScreening,
    method: 'put',
    data
  })
}

export const updateInterview = (data) => {
  return request({
    url: api.updateInterview,
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
