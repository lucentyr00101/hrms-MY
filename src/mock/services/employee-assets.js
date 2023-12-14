import Mock from 'mockjs2'
import { builder, getQueryParameters } from '@/mock/util'

const employeeAssets = (options) => {
  const queryParameters = getQueryParameters(options)
  if (queryParameters && !queryParameters.count) {
    queryParameters.count = 5
  }
  const data = []
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i + 1,
      employee: `Employee ${i}`,
      employeeNumber: (Math.random() * 100000).toFixed(0),
      department: `Department ${i}`,
      assetsType: `Type ${i}`,
      assetsName: ` Name ${i}`,
      value: (Math.random() * 100000).toFixed(2),
      serialNumber: Math.floor(Math.random() * 1000000000000000),
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

Mock.mock(/\/api\/main\/employee\/assets/, 'get', employeeAssets)
