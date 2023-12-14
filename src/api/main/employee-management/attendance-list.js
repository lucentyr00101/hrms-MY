import request from '@/utils/request'

const api = {
  list: '/employeeManagementAttendanceList/all',
  add: '/employeeManagementAttendanceList/add',
  search: '/employeeManagementAttendanceList/search',
  update: '/employeeManagementAttendanceList/update',
  updateEmployeeAttendance: '/employeeManagementAttendanceList/update/employeeAttendance',
  status: '/employeeManagementAttendanceList/status',
  export: '/employeeManagementAttendanceList/export',
  detail: '/employeeManagementAttendanceList/detail',
  delete: '/employeeManagementAttendanceList/delete'
}

export function deleteData (data) {
    return request({
      url: api.delete,
      method: 'delete',
      data
    })
}

export function fetchDetail (id) {
  return request({
      url: api.detail,
      method: 'get',
      params: { id }
  })
}

export function status (data) {
    return request({
      url: api.status,
      method: 'put',
      data
    })
}

export function update (data) {
    return request({
      url: api.update,
      method: 'put',
      data
    })
}

export function updateEmployeeAttendance (data) {
    return request({
      url: api.updateEmployeeAttendance,
      method: 'put',
      data
    })
}

export function fetchList (params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

export function add (data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function search (data) {
  return request({
    url: api.search,
    method: 'post',
    data
  })
}

export function exportData (data) {
  return request({
    url: api.export,
    method: 'post',
    data
})
}
