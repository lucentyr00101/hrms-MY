import Mock from 'mockjs2'
import { builder, getQueryParameters } from '@/mock/util'

const dictionary = (options) => {
  const queryParameters = getQueryParameters(options)
  if (queryParameters && !queryParameters.count) {
    queryParameters.count = 5
  }
  const data = []
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i + 1,
      typeName: `Type ${i}`,
      code: 'XX',
      sort: (Math.random() * 100).toFixed(0),
      status: false,
      remarks: `Remarks ${i}`
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

Mock.mock(/\/api\/dictionary\/type/, 'get', dictionary)
