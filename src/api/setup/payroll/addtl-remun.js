import request from '@/utils/request'

const api = {
  list: '/payrollAdditionalRemuneration/all',
  add: '/payrollAdditionalRemuneration/add',
  status: '/payrollAdditionalRemuneration/status',
  update: '/payrollAdditionalRemuneration/update',
  delete: '/payrollAdditionalRemuneration/delete'
}

export function fetchAddtlRemunList(params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function getAddtlRemun(id) {
  return request({
    url: api.list,
    method: 'get',
    params: { id }
  })
}

export function addAddtlRemun(data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function updateAddtlRemunStatus(data) {
  return request({
    url: api.status,
    method: 'put',
    data
  })
}

export function updateAddtlRemun(data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export function deleteAddtlRemun(data) {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}
