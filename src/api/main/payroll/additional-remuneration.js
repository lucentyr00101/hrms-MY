import request from '@/utils/request'

const api = {
  list: '/mainPayrollAdditionalRemuneration/search',
  export: '/mainPayrollAdditionalRemuneration/export',
  add: '/mainPayrollAdditionalRemuneration/add',
  update: '/mainPayrollAdditionalRemuneration/update',
  delete: '/mainPayrollAdditionalRemuneration/delete'
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

export const deleteData = (data) => {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}
