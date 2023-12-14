import request from '@/utils/request'

const api = {
  details: '/companyProfileSetup/detail',
  updateGeneralInfo: '/companyProfileSetup/generalInfo',
  updateEpfInfo: '/companyProfileSetup/epfInfo',
  updateEisInfo: '/companyProfileSetup/eisInfo',
  updateTaxInfo: '/companyProfileSetup/taxInfo',
  updateSocsoInfo: '/companyProfileSetup/socsoInfo'
}

export const fetchDetails = (params) => {
  return request({
    url: api.details,
    method: 'get',
    params
  })
}

export const updateGeneralInfo = (data) => {
  return request({
    url: api.updateGeneralInfo,
    method: 'post',
    data
  })
}

export const updateEpfInfo = (data) => {
  return request({
    url: api.updateEpfInfo,
    method: 'post',
    data
  })
}

export const updateEisInfo = (data) => {
  return request({
    url: api.updateEisInfo,
    method: 'post',
    data
  })
}

export const updateTaxInfo = (data) => {
  return request({
    url: api.updateTaxInfo,
    method: 'post',
    data
  })
}

export const updateSocsoInfo = (data) => {
  return request({
    url: api.updateSocsoInfo,
    method: 'post',
    data
  })
}
