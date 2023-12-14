import Mock from 'mockjs2'
import { builder, getQueryParameters } from '@/mock/util'

const departments = (options) => {
  const queryParameters = getQueryParameters(options)
  if (queryParameters && !queryParameters.count) {
    queryParameters.count = 5
  }
  const data = []
  for (let i = 0; i < 5; i++) {
    data.push({
      id: i + 1,
      name: `Department ${i}`
    })
  }
  return builder({
    data,
    pageSize: 10,
    pageNo: 1,
    totalPage: data.length,
    totalCount: data.length
  })
}

Mock.mock(/\/api\/departments/, 'get', departments)
