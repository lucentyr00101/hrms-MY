import request from '@/utils/request'

const api = {
  resetPassword: '/securityAccount/resetPassword',
  updateDisplayName: '/securityAccount/updateDisplayName',
  uploadPhoto: '/securityAccount/uploadPhoto'
}

export function resetPassword (data) {
  return request({
    url: api.resetPassword,
    method: 'put',
    data
  })
}

export function uploadPhoto (data) {
  return request({
    url: api.uploadPhoto,
    method: 'put',
    data
  })
}

export function updateDisplayName (data) {
  return request({
    url: api.updateDisplayName,
    method: 'put',
    data
  })
}
