import Mock from 'mockjs2'
import { builder, getQueryParameters } from '@/mock/util'
import { EMPLOYEE_STATUS_VALUE } from '@/constant/enum'

const employee = (options) => {
  const queryParameters = getQueryParameters(options)
  if (queryParameters && !queryParameters.count) {
    queryParameters.count = 10
  }

  const data = []
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i + 1,
      employeeNumber: `Employee ${i}`,
      employeeLastName: `Employee ${i}`,
      employeeFirstName: `Employee ${i}`,
      employeeMiddleName: `Employee ${i}`,
      department: `Department ${i}`,
      joinDate: Mock.mock('@date'),
      email: Mock.mock('@email'),
      employeeMessage: Mock.mock('@integer(0, 1)') === 0 ? 'No payroll information yet ' : '',
      status: Object.values(EMPLOYEE_STATUS_VALUE)[Mock.mock('@integer(0, 5)')]
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

const employeeInformationById = (id = 1) => {
 const data = {
      id: 1,
      employeeNumber: `Employee 1`,
      employeeLastName: `Employee 1`,
      employeeFirstName: `Employee 1`,
      employeeMiddleName: `Employee 1`,
      department: `Department 1`,
      idNumber: `21312312`,
      joinDate: Mock.mock('@date'),
      email: Mock.mock('@email'),
      emergencyContact: [
        {
          name: 'Ch',
          contactNumber: '0123456',
          relation: 'Father'
        }
      ],
      dependants: [
        {
          name: 'Ch',
          dob: '1996-12-12',
          relation: 'Father'
        }
      ],
      status: Object.values(EMPLOYEE_STATUS_VALUE)[Mock.mock('@integer(0, 5)')]
  }

  return builder({
    data

  })
}
Mock.mock(/\/api\/employee\/([1-9]\\d*)?/, 'get', employeeInformationById)
Mock.mock(/\/api\/employee/, 'get', employee)
