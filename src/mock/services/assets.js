import Mock from 'mockjs2'
import { builder, getQueryParameters } from '@/mock/util'

const assets = (options) => {
  const queryParameters = getQueryParameters(options)
  if (queryParameters && !queryParameters.count) {
    queryParameters.count = 5
  }
  const data = []
  const statusArray = ['Allocated', 'Idle', 'Commissioned']
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i + 1,
      assetType: `Type ${i}`,
      assetName: ` Name ${i}`,
      value: (Math.random() * 100000).toFixed(2),
      serialNumber: Math.floor(Math.random() * 1000000000000000),
      status: statusArray[Math.floor(Math.random() * statusArray.length)],
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

Mock.mock(/\/api\/assets/, 'get', assets)
