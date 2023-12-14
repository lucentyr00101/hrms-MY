import request from '@/utils/request'

const api = {
  list: '/payrollBonus/all',
  search: '/payrollBonus/search',
  exportData: '/payrollBonus/export',
  add: '/payrollBonus/add',
  update: '/payrollBonus/update',
  delete: '/payrollBonus/delete'
}

export function fetchList(params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function search(data) {
  return request({
    url: api.search,
    method: 'post',
    data
  })
}

export function exportData(data) {
  return request({
    url: api.exportData,
    method: 'post',
    data
  })
}

export function addBonus(data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function updateBonus(data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export const deleteBonus = (data) => {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}
