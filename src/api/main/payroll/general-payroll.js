import request from '@/utils/request'

const api = {
  list: '/generatePayroll/employeeSummary/all',
  search: '/generatePayroll/employeeSummary/search',
  latest: 'generatePayroll/summary/viewLatestPayroll',
  summary: '/generatePayroll/summary/add',
  status: '/generatePayroll/employeeSummary/update',
  verify: '/generatePayroll/employeePayslip/all',
  verifyUpdate: '/generatePayroll/employeePayslip/update',
  confirm: 'generatePayroll/employeePayslip/confirm',
  processPayroll: 'generatePayroll/summary/processPayroll',
  delete: '/generatePayroll/employeePayslip/delete',
  deleteAll: 'generatePayroll/summary/deleteAll',
  viewSummary: 'generatePayroll/summary/detail',
  viewPayslip: 'generatePayroll/employeeSummary/detail',
  publish: 'generatePayroll/summary/publish',
  undoProcessPayroll: 'generatePayroll/summary/undoProcessPayroll'
}

export const fetchList = (data) => {
  return request({
    url: api.list,
    method: 'get',
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

export const fetchLatest = (data) => {
  return request({
    url: api.latest,
    method: 'get',
    data
  })
}

export const fetchSummary = (data) => {
  return request({
    url: api.summary,
    method: 'post',
    data
  })
}

export const toggleStatus = (data) => {
  return request({
    url: api.status,
    method: 'put',
    data
  })
}

export const fetchVerify = (data) => {
  return request({
    url: api.verify,
    method: 'post',
    data
  })
}

export const verifyUpdate = (data) => {
  return request({
    url: api.verifyUpdate,
    method: 'put',
    data
  })
}

export const confirm = (data) => {
  return request({
    url: api.confirm,
    method: 'put',
    data
  })
}

export const processPayroll = (data) => {
  return request({
    url: api.processPayroll,
    method: 'put',
    data
  })
}

export const deletePayslip = (data) => {
  return request({
    url: api.delete,
    method: 'delete',
    data
  })
}

export const deleteAll = (data) => {
  return request({
    url: api.deleteAll,
    method: 'delete',
    data
  })
}

export const viewSummary = (id) => {
  return request({
    url: api.viewSummary,
    method: 'get',
    params: { id: id }
  })
}

export const viewPayslip = (id) => {
  return request({
    url: api.viewPayslip,
    method: 'get',
    params: { id: id }
  })
}

export const publish = (data) => {
  return request({
    url: api.publish,
    method: 'put',
    data
  })
}

export const undoProcessPayroll = (data) => {
  return request({
    url: api.undoProcessPayroll,
    method: 'put',
    data
  })
}
