import request from '@/utils/request'

const api = {
  getAllowanceDropdown: '/dictionaryDropdown/allowanceType/dropdowns',
  getDeductionDropdown: '/dictionaryDropdown/deductionType/dropdowns',
  getSequenceDropdown: '/dictionaryDropdown/sequenceType/dropdowns',
  getSalaryTypeDropdown: '/dictionaryDropdown/salaryType/dropdowns',
  getFrequencyTypeDropdown: '/dictionaryDropdown/frequencyType/dropdowns',
  getCompanyBankDropdown: '/dictionaryDropdown/companyBank/dropdowns',
  getPayrollTaxTypeDropdown: '/dictionaryDropdown/payrollTaxType/dropdowns',
  getPayrollEpfTypeDropdown: '/dictionaryDropdown/payrollEpfType/dropdowns',
  getPayrollSocsoTypeDropdown: '/dictionaryDropdown/payrollSocsoType/dropdowns',
  getEmployeeDropdown: '/dictionaryDropdown/employee/dropdowns',
  getActiveEmployeeDropdown: '/dictionaryDropdown/activeEmployee/dropdowns',
  getEmployeeWithLeaveDropdown: '/dictionaryDropdown/employeeWithLeaveGroup/dropdowns',
  getCompanyAssetsDropdown: '/dictionaryDropdown/companyAssets/dropdowns',
  getWorkShiftTypeDropdown: '/dictionaryDropdown/workShiftType/dropdowns',
  getLeaveGroupDropdown: '/dictionaryDropdown/leaveGroup/dropdowns',
  getPayrollCommissionDropdown: '/dictionaryDropdown/payrollCommissions/dropdowns',
  getDepartmentDropdown: '/dictionaryDropdown/department/dropdowns',
  getDepartmentNamesDropdown: '/dictionaryDropdown/departmentNames/dropdowns',
  getAttendanceTypeDropdown: '/dictionaryDropdown/attendanceType/dropdowns',
  getApprovalStatusDropdown: '/dictionaryDropdown/approvalStatus/dropdowns',
  getClaimGroupDropdown: '/dictionaryDropdown/claimGroup/dropdowns',
  getClaimTypeDropdown: '/dictionaryDropdown/companyClaimType/dropdowns',
  getPayoutScheduleTypeDropdown: '/dictionaryDropdown/payoutScheduleType/dropdowns',
  getPayrollAdditionalRemunerationDropdown: '/dictionaryDropdown/payrollAdditionalRemuneration/dropdowns',
  getLoanTypeDropdown: '/dictionaryDropdown/loanType/dropdowns',
  getAutoRepaymentDropdown: '/dictionaryDropdown/autoRepayment/dropdowns',
  getEmployeeNumberDropdown: '/dictionaryDropdown/employeeNumber/dropdowns',
  getAuthorDropdown: '/dictionaryDropdown/companyAnnouncementAuthor/dropdowns',
  getAllCompanyAssetsDropdown: '/dictionaryDropdown/companyAssetsAll/dropdowns',
  getCountriesDropdown: '/dictionaryDropdown/country/dropdowns',
  getLibraryAuthorDropdown: '/dictionaryDropdown/author/dropdowns',
  getLateDeductionCurrencyDropdown: '/dictionaryDropdown/lateDeductionCurrency/dropdowns',
  getWorkReportTypeDropdown: '/dictionaryDropdown/workReportType/dropdowns',
  getLeaveReportTypeDropdown: '/dictionaryDropdown/leaveReportType/dropdowns',
  getLoanReportTypeDropdown: '/dictionaryDropdown/loanReportType/dropdowns',
  getRegionDropdown: '/dictionaryDropdown/region/dropdowns',
  getClaimReportTypeDropdown: '/dictionaryDropdown/claimReportType/dropdowns',
  getInterviewStatusDropdown: '/dictionaryDropdown/interviewStatus/dropdowns',
  getAttendanceReportTypeDropdown: '/dictionaryDropdown/attendanceReportType/dropdowns',
  getGenderTypeDropdown: '/dictionaryDropdown/genderType/dropdowns',
  getMaritalStatusTypeDropdown: '/dictionaryDropdown/maritalStatusType/dropdowns',
  getNationalityTypeDropdown: '/dictionaryDropdown/nationalityType/dropdowns',
  getEmployeeQualificationsDropdown: '/dictionaryDropdown/employeeQualifications/dropdowns',
  getInterviewPositionDropdown: '/interviewPosition/all',
  getPayrollReportTypeDropdown: '/dictionaryDropdown/payrollReportType/dropdowns',
  getInterviewCandidatesDropdown: '/dictionaryDropdown/interviewCandidates/dropdowns',
  getEmployeeSetupReminderDropdown: '/dictionaryDropdown/employeeSetupReminder/dropdowns',
  getEmployeesHRDropdown: '/dictionaryDropdown/hrEmployees/dropdowns',
  getContributionReportTypeDropdown: '/dictionaryDropdown/contributionReportType/dropdowns',
  getEmployeeManagementWorkReportEmployeesDropdown: '/dictionaryDropdown/employeeManagementWorkReportEmployees/dropdowns',
  getEmployeeManagementWorkReportTypeDropdown: '/dictionaryDropdown/employeeManagementWorkReportType/dropdowns',
  getRaceTypeDropdown: '/dictionaryDropdown/raceType/dropdowns'
}

export function fetchAllowanceDropdown(params) {
  return request({
    url: api.getAllowanceDropdown,
    method: 'get',
    params
  })
}

export function fetchAttendanceDropdown(params) {
  return request({
    url: api.getAttendanceTypeDropdown,
    method: 'get',
    params
  })
}
export function fetchDeductionDropdown(params) {
  return request({
    url: api.getDeductionDropdown,
    method: 'get',
    params
  })
}
export function fetchSequenceDropdown(params) {
  return request({
    url: api.getSequenceDropdown,
    method: 'get',
    params
  })
}
export function fetchSalaryTypeDropdown(params) {
  return request({
    url: api.getSalaryTypeDropdown,
    method: 'get',
    params
  })
}
export function fetchFrequencyTypeDropdown(params) {
  return request({
    url: api.getFrequencyTypeDropdown,
    method: 'get',
    params
  })
}
export function fetchCompanyBankDropdown(params) {
  return request({
    url: api.getCompanyBankDropdown,
    method: 'get',
    params
  })
}

export function fetchPayrollTaxTypeDropdown(params) {
  return request({
    url: api.getPayrollTaxTypeDropdown,
    method: 'get',
    params
  })
}

export function fetchPayrollEpfTypeDropdown(params) {
  return request({
    url: api.getPayrollEpfTypeDropdown,
    method: 'get',
    params
  })
}

export function fetchPayrollSocsoTypeDropdown(params) {
  return request({
    url: api.getPayrollSocsoTypeDropdown,
    method: 'get',
    params
  })
}

export function fetchEmployeeDropdown(params) {
  return request({
    url: api.getEmployeeDropdown,
    method: 'get',
    params
  })
}

export function fetchActiveEmployeeDropdown(params) {
  return request({
    url: api.getActiveEmployeeDropdown,
    method: 'get',
    params
  })
}

export function fetchEmployeeWithLeaveDropdown(params) {
  return request({
    url: api.getEmployeeWithLeaveDropdown,
    method: 'get',
    params
  })
}

export function fetchCompanyAssetsDropdown(params) {
  return request({
    url: api.getCompanyAssetsDropdown,
    method: 'get',
    params
  })
}

export function fetchWorkShiftTypeDropdown(params) {
  return request({
    url: api.getWorkShiftTypeDropdown,
    method: 'get',
    params
  })
}

export function fetchLeaveGroupDropdown(params) {
  return request({
    url: api.getLeaveGroupDropdown,
    method: 'get',
    params
  })
}

export function fetchPayrollCommissionsDropdown(params) {
  return request({
    url: api.getPayrollCommissionDropdown,
    method: 'get',
    params
  })
}

export function fetchDepartmentDropdown(params) {
  return request({
    url: api.getDepartmentDropdown,
    method: 'get',
    params
  })
}

export function fetchDepartmentNamesDropdown(params) {
  return request({
    url: api.getDepartmentNamesDropdown,
    method: 'get',
    params
  })
}

export function fetchApprovalStatusDropdown(params) {
  return request({
    url: api.getApprovalStatusDropdown,
    method: 'get',
    params
  })
}

export function fetchClaimGroupDropdown(params) {
  return request({
    url: api.getClaimGroupDropdown,
    method: 'get',
    params
  })
}

export function fetchClaimTypeDropdown(params) {
  return request({
    url: api.getClaimTypeDropdown,
    method: 'get',
    params
  })
}

export function fetchPayoutScheduleTypeDropdown(params) {
  return request({
    url: api.getPayoutScheduleTypeDropdown,
    method: 'get',
    params
  })
}

export function fetchPayrollAdditionalRemunerationDropdown(params) {
  return request({
    url: api.getPayrollAdditionalRemunerationDropdown,
    method: 'get',
    params
  })
}

export function fetchLoanTypeDropdown(params) {
  return request({
    url: api.getLoanTypeDropdown,
    method: 'get',
    params
  })
}

export function fetchAutoRepaymentDropdown(params) {
  return request({
    url: api.getAutoRepaymentDropdown,
    method: 'get',
    params
  })
}

export function fetchEmployeeNumberDropdown(params) {
  return request({
    url: api.getEmployeeNumberDropdown,
    method: 'get',
    params
  })
}

export function fetchAuthorDropdown(params) {
  return request({
    url: api.getAuthorDropdown,
    method: 'get',
    params
  })
}

export function fetchAllCompanyAssetsDropdown(params) {
  return request({
    url: api.getAllCompanyAssetsDropdown,
    method: 'get',
    params
  })
}

export function fetchCountriesDropdown(params) {
  return request({
    url: api.getCountriesDropdown,
    method: 'get',
    params
  })
}

export function fetchLibraryAuthorDropdown(params) {
  return request({
    url: api.getLibraryAuthorDropdown,
    method: 'get',
    params
  })
}

export function fetchLateDeductionCurrencyDropdown(params) {
  return request({
    url: api.getLateDeductionCurrencyDropdown,
    method: 'get',
    params
  })
}

export function fetchWorkReportTypeDropdown(params) {
  return request({
    url: api.getWorkReportTypeDropdown,
    method: 'get',
    params
  })
}

export function fetchLeaveReportTypeDropdown(params) {
  return request({
    url: api.getLeaveReportTypeDropdown,
    method: 'get',
    params
  })
}

export function fetchLoanReportTypeDropdown(params) {
  return request({
    url: api.getLoanReportTypeDropdown,
    method: 'get',
    params
  })
}

export function fetchRegionDropdown(params) {
  return request({
    url: api.getRegionDropdown,
    method: 'get',
    params
  })
}

export function fetchClaimReportTypeDropdown(params) {
  return request({
    url: api.getClaimReportTypeDropdown,
    method: 'get',
    params
  })
}

export function fetchInterviewStatusDropdown(params) {
  return request({
    url: api.getInterviewStatusDropdown,
    method: 'get',
    params
  })
}

export function fetchAttendanceReportTypeDropdown(params) {
  return request({
    url: api.getAttendanceReportTypeDropdown,
    method: 'get',
    params
  })
}

export function fetchGenderTypeDropdown(params) {
  return request({
    url: api.getGenderTypeDropdown,
    method: 'get',
    params
  })
}

export function fetchMaritalStatusTypeDropdown(params) {
  return request({
    url: api.getMaritalStatusTypeDropdown,
    method: 'get',
    params
  })
}

export function fetchNationalityTypeDropdown(params) {
  return request({
    url: api.getNationalityTypeDropdown,
    method: 'get',
    params
  })
}

export function fetchEmployeeQualificationsDropdown(params) {
  return request({
    url: api.getEmployeeQualificationsDropdown,
    method: 'get',
    params
  })
}

export function fetchInterviewPositionDropdown(params) {
  return request({
    url: api.getInterviewPositionDropdown,
    method: 'get',
    params
  })
}

export function fetchPayrollReportTypeDropdown(params) {
  return request({
    url: api.getPayrollReportTypeDropdown,
    method: 'get',
    params
  })
}

export function fetchInterviewCandidatesDropdown(params) {
  return request({
    url: api.getInterviewCandidatesDropdown,
    method: 'get',
    params
  })
}

export function fetchEmployeeSetupReminderDropdown(params) {
  return request({
    url: api.getEmployeeSetupReminderDropdown,
    method: 'get',
    params
  })
}

export function fetchEmployeesHRDropdown(params) {
  return request({
    url: api.getEmployeesHRDropdown,
    method: 'get',
    params
  })
}

export function fetchContributionReportTypeDropdown(params) {
  return request({
    url: api.getContributionReportTypeDropdown,
    method: 'get',
    params
  })
}

export function fetchEmployeeManagementWorkReportEmployeesDropdown(params) {
  return request({
    url: api.getEmployeeManagementWorkReportEmployeesDropdown,
    method: 'get',
    params
  })
}

export function fetchEmployeeManagementWorkReportTypeDropdown(params) {
  return request({
    url: api.getEmployeeManagementWorkReportTypeDropdown,
    method: 'get',
    params
  })
}

export function fetchRaceTypeDropdown(params) {
  return request({
    url: api.getRaceTypeDropdown,
    method: 'get',
    params
  })
}
