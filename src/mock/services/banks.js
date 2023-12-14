import Mock from 'mockjs2'
import { builder, getQueryParameters } from '@/mock/util'

const banks = (options) => {
  const queryParameters = getQueryParameters(options)
  if (queryParameters && !queryParameters.count) {
    queryParameters.count = 5
  }
  const data = []
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i + 1,
      bankName: `Bank Name ${i}`,
      descriptions: `Description blabla ${i}`
    })
  }
  return builder({
    data,
    pageSize: 10,
    pageNo: 1,
    totalPage: data.length / 10,
    totalCount: data.length
  })
}

Mock.mock(/\/api\/banks/, 'get', banks)
