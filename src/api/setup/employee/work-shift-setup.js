import request from '@/utils/request'

const api = {
  list: '/workShiftSetup/all',
  add: '/workShiftSetup/add',
  update: '/workShiftSetup/update',
  _delete: '/workShiftSetup/delete',
  dropdownWorkShiftRateType: '/dictionaryDropdown/workShiftRateType/dropdowns'
}

export function fetchList (params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}
export function addWorkShiftSetup (data) {
    return request({
      url: api.add,
      method: 'post',
      data
    })
}

export function deleteAddWorkShiftSetup (data) {
  return request({
    url: api._delete,
    method: 'delete',
    data
  })
}

export function updateWorkShiftSetup(data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export function dropdownWorkShiftRateType (params) {
  return request({
    url: api.dropdownWorkShiftRateType,
    method: 'get',
    params
  })
}
