import request from '@/utils/request'

const api = {
  list: '/employeeSetupAllowance/all',
  add: '/employeeSetupAllowance/add',
  update: '/employeeSetupAllowance/update',
  detail: '/employeeSetupAllowance/detail',
  delete: '/employeeSetupAllowance/delete',
  getAllowanceDropdown: '/dictionaryDropdown/allowanceType/dropdowns',
  getSequenceDropdown: '/dictionaryDropdown/sequenceType/dropdowns'
}

export function fetchList (params) {
    return request({
        url: api.list,
        method: 'get',
        params
    })
}
export function fetchAllowanceDropdown (params) {
    return request({
        url: api.getAllowanceDropdown,
        method: 'get',
        params
    })
}
export function fetchSequenceDropdown (params) {
    return request({
        url: api.getSequenceDropdown,
        method: 'get',
        params
    })
}
export function fetchDetail (id) {
    return request({
        url: api.detail,
        method: 'get',
        params: { id }
    })
}
export function addAllowance (data) {
    return request({
        url: api.add,
        method: 'post',
        data
    })
}
export function deleteAllowance (data) {
    return request({
        url: api.delete,
        method: 'delete',
        data
    })
}
export function updateAllowance (data) {
    return request({
        url: api.update,
        method: 'update',
        data
    })
}
