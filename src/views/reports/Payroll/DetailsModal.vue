<template>
  <div>
    <a-modal
      :title="`${$t('table.dialog.view-payroll-summary')} - ${ moment(model?.fromDate).format('YYYY') } ${ moment(model?.fromDate).format('MMMM') } ${ model?.sequence }`"
      :width="1400"
      :visible="visible"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      @cancel="closeModal"
    >
      <div class="company-contri">
        <table>
          <tr>
            <th></th>
            <th></th>
            <th>{{ $t('table.dialog.employees-contribution') }}</th>
            <th></th>
            <th>{{ $t('table.dialog.employers-contribution') }}</th>
            <th></th>
            <th>{{ $t('table.dialog.total') }}</th>
            <th></th>
          </tr>
          <tr>
            <td><span>{{ $t('table.dialog.company-name') }} :</span></td>
            <td>{{ model?.companyName || '--' }}</td>
            <td>{{ $t('table.dialog.total-tax-payment') }} :</td>
            <td>{{ model?.employeeContribution?.totalTax || '0' }}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td><span>{{ $t('table.dialog.no-of-employees') }} :</span></td>
            <td>{{ model?.noOfEmployees || '0' }}</td>
            <td>{{ $t('table.dialog.total-epf-payment') }} :</td>
            <td>{{ model?.employeeContribution?.totalEpf || '0' }}</td>
            <td><span>{{ $t('table.dialog.total-epf-payment') }} :</span></td>
            <td>{{ model?.employerContribution?.totalEpf || '0' }}</td>
            <td><span>{{ $t('table.dialog.total-epf') }} :</span></td>
            <td>{{ model?.epf || '0' }}</td>
          </tr>
          <tr>
            <td><span>{{ $t('table.dialog.total-employee-net-pay') }} :</span></td>
            <td>{{ model?.totalEmployeeNetPay || '0' }}</td>
            <td>{{ $t('table.dialog.total-socso-payment') }} :</td>
            <td>{{ model?.employeeContribution?.totalSocso || '0' }}</td>
            <td><span>{{ $t('table.dialog.total-socso-payment') }} :</span></td>
            <td>{{ model?.employerContribution?.totalSocso || '0' }}</td>
            <td><span>{{ $t('table.dialog.total-sosco') }} :</span></td>
            <td>{{ model?.socso || '0' }}</td>
          </tr>
          <tr>
            <td><span>{{ $t('table.dialog.total-employer-net-pay') }} :</span></td>
            <td>{{ model?.totalEmployerNetPay || '0' }}</td>
            <td>{{ $t('table.dialog.total-eis-payment') }} :</td>
            <td>{{ model?.employeeContribution?.totalEis || '0' }}</td>
            <td><span>{{ $t('table.dialog.total-eis-payment') }} :</span></td>
            <td>{{ model?.employerContribution?.totalEis || '0' }}</td>
            <td><span>{{ $t('table.dialog.total-eis') }} :</span></td>
            <td>{{ model?.eis || '0' }}</td>
          </tr>
        </table>
      </div>
      <div class="employee-contri">
        <table>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th>{{ $t('table.dialog.employees-contribution') }}</th>
            <th>{{ $t('table.dialog.employers-contribution') }}</th>
            <th></th>
          </tr>
          <tr>
            <th>{{ $t('table.dialog.employee') }}</th>
            <th>{{ $t('table.dialog.basic') }}</th>
            <th>{{ $t('table.dialog.additions') }}</th>
            <th>{{ $t('table.dialog.deductions') }}</th>
            <th>
              <table class="inner-table-header">
                <tr>
                  <th>Tax</th>
                  <th>EPF</th>
                  <th>SOCSO</th>
                  <th>EIS</th>
                </tr>
              </table>
            </th>
            <th>
              <table class="inner-table-header">
                <tr>
                  <th>Tax</th>
                  <th>EPF</th>
                  <th>SOCSO</th>
                  <th>EIS</th>
                </tr>
              </table>
            </th>
            <th>{{ $t('table.dialog.net-income') }}</th>
          </tr>
          <tr v-for="(value, i) in model?.payrollPayslipResponses" :key="i">
            <td>{{ value?.employee || '--' }}</td>
            <td>{{ value?.basic || '0' }}</td>
            <td>{{ value?.additions || '0' }}</td>
            <td>{{ value?.deductions || '0' }}</td>
            <td>
              <table class="inner-table-data">
                <tr>
                  <td>{{ value?.employeeContribution?.totalTax || '0' }}</td>
                  <td>{{ value?.employeeContribution?.totalEpf || '0' }}</td>
                  <td>{{ value?.employeeContribution?.totalSocso || '0' }}</td>
                  <td>{{ value?.employeeContribution?.totalEis || '0' }}</td>
                </tr>
              </table>
            </td>
            <td>
              <table class="inner-table-data">
                <tr>
                  <td>{{ value?.employerContribution?.totalTax || '0' }}</td>
                  <td>{{ value?.employerContribution?.totalEpf || '0' }}</td>
                  <td>{{ value?.employerContribution?.totalSocso || '0' }}</td>
                  <td>{{ value?.employerContribution?.totalEis || '0' }}</td>
                </tr>
              </table>
            </td>
            <td>{{ value?.netIncome || '0' }}</td>
          </tr>
        </table>
      </div>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    model: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    moment,
    view() {
      this.visible = true
    },
    closeModal() {
      this.visible = false
    }
  }
}
</script>

<style lang="less">
.company-contri {
  color: #000;
  margin-top: 40px;
  table {
    width: 100%;
  }
  tr:nth-child(1) {
    th:nth-child(1) {
      border-top-left-radius: 10px;
    }
    th:nth-child(8) {
      border-top-right-radius: 10px;
    }
  }
  tr:nth-child(5) {
    td:nth-child(1) {
      border-bottom-left-radius: 10px;
    }
    td:nth-child(8) {
      border-bottom-right-radius: 10px;
    }
  }
  tr:nth-child(2) {
    td {
      padding-top: 10px;
    }
  }
  tr:nth-child(5) {
    td {
      padding-bottom: 20px;
    }
  }
  tr {
    th {
      padding: 15px 20px;
      border-bottom: 1px solid #fff;
    }
    td {
      padding: 7px 20px;
    }
    th:nth-child(3), th:nth-child(5) {
      width: 202px;
    }
    th:nth-child(4), td:nth-child(4) {
      border-right: 1px solid #fff;
    }
    th:nth-child(1), th:nth-child(2), th:nth-child(7), th:nth-child(8) {
      background: #CEF4E5;
    }
    th:nth-child(3), th:nth-child(4), th:nth-child(5), th:nth-child(6),
    td:nth-child(3), td:nth-child(4), td:nth-child(5), td:nth-child(6) {
      background: #E6F7FF;
    }
    td:nth-child(1) span, td:nth-child(5) span, td:nth-child(7) span {
      float: right
    }
    td:nth-child(1), td:nth-child(2), td:nth-child(7), td:nth-child(8) {
      background-color: #F2F2F2;
    }
  }
}
.employee-contri {
  color: #000;
  margin-top: 40px;
  table {
    width: 100%;
  }
  tr:nth-child(1) {
    th:nth-child(5) {
      border-top-left-radius: 10px;
    }
    th:nth-child(6) {
      border-top-right-radius: 10px;
    }
    th:nth-child(5), th:nth-child(6) {
      background: #E6F7FF;
      text-align: center;
    }
  }
  tr:nth-child(2) {
    th:nth-child(1) {
      border-top-left-radius: 10px;
    }
    th:nth-child(7) {
      border-top-right-radius: 10px;
    }
  }
  tr:last-child {
    td:nth-child(1) {
      border-bottom-left-radius: 10px;
    }
    td:nth-child(7) {
      border-bottom-right-radius: 10px;
    }
  }
  tr:nth-child(2) {
    th:nth-child(5), th:nth-child(6) {
      background: #E6F7FF;
    }
    th:nth-child(1), th:nth-child(2), th:nth-child(3), th:nth-child(4), th:nth-child(7) {
      background: #CEF4E5;
    }
  }
  tr {
    th {
      padding: 15px 17.6px;
      border-bottom: 1px solid #fff;
    }
    td {
      padding: 10px 15px;
      border-bottom: 1px solid #fff;
    }
    td:nth-child(1), td:nth-child(2), td:nth-child(3), td:nth-child(4), td:nth-child(7) {
      background-color: #F2F2F2;
    }
    td:nth-child(5), td:nth-child(6) {
      background-color: #E6F7FF;
    }
  }
}
.inner-table-header {
  tr {
    th {
      padding: 0 18px;
      background: #E6F7FF !important;
      border: none
    }
  }
}
.inner-table-data {
  tr {
    td {
      padding: 10px 0;
      background: #E6F7FF !important;
      border: none;
      width: 90px;
      max-width: 90px;
    }
    td:nth-child(1) {
      padding-left: 21px;
    }
    td:nth-child(2) {
      padding-left: 12px;
    }
    td:nth-child(3) {
      padding-left: 4px;
    }
    td:nth-child(4) {
      padding-left: 25px;
    }
  }
}
</style>
