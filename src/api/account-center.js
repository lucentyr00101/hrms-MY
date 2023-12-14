import request from '@/utils/request'

const api = {
  list: '/securityAccountCenter/all',
  // details: '/securityAccountCenter/detail',
  add: '/securityAccountCenter/add',
  update: '/securityAccountCenter/update',
  status: '/securityAccountCenter/status',
  delete: '/securityAccountCenter/delete'
}

export const fetchList = (params) => {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

// export const fetchDetails = (params) => {
//   return request({
//     url: api.details,
//     method: 'get',
//     params
//   })
// }

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

export const deleteData = (data) => {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}
