import Mock from 'mockjs2'
import { builder, getQueryParameters } from '@/mock/util'

const deductions = (options) => {
  const queryParameters = getQueryParameters(options)
  if (queryParameters && !queryParameters.count) {
    queryParameters.count = 5
  }
  const data = []
  const sequenceArr = ['First Half', 'Second Half', 'Monthly']
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i + 1,
      deductionType: `Type ${i}`,
      sequence: sequenceArr[Math.floor(Math.random() * sequenceArr.length)],
      amount: Math.floor(Math.random() * 10000),
      from: '2022-02-07',
      to: '2022-02-08',
      name: `Department ${i}`
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

Mock.mock(/\/api\/deductions/, 'get', deductions)
