<template>
  <div class="generate-payroll view">
    <a-row id="filter" type="flex" :gutter="[50, 8]">
      <a-col class="action-holder" :span="24">
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item @click="undo">{{ $t('table.dialog.undo') }}</a-menu-item>
          </a-menu>
          <a-button icon="ellipsis" :style="{ margin: '0 0 0 10px' }"></a-button>
        </a-dropdown>
      </a-col>
    </a-row>
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
          <td>{{ modal?.data?.companyName || '--' }}</td>
          <td>{{ $t('table.dialog.total-tax-payment') }} :</td>
          <td>{{ modal?.data?.totalEmployeeContribution?.totalTax || '0' }}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td><span>{{ $t('table.dialog.no-of-employees') }} :</span></td>
          <td>{{ modal?.data?.employeeCount || '0' }}</td>
          <td>{{ $t('table.dialog.total-epf-payment') }} :</td>
          <td>{{ modal?.data?.totalEmployeeContribution?.totalEpf || '0' }}</td>
          <td><span>{{ $t('table.dialog.total-epf-payment') }} :</span></td>
          <td>{{ modal?.data?.totalEmployerContribution?.totalEpf || '0' }}</td>
          <td><span>{{ $t('table.dialog.total-epf') }} :</span></td>
          <td>{{ modal?.data?.totalContribution?.totalEpf || '0' }}</td>
        </tr>
        <tr>
          <td><span>{{ $t('table.dialog.total-employee-net-pay') }} :</span></td>
          <td>{{ modal?.data?.totalEmployeeNetPay || '0' }}</td>
          <td>{{ $t('table.dialog.total-socso-payment') }} :</td>
          <td>{{ modal?.data?.totalEmployeeContribution?.totalSocso || '0' }}</td>
          <td><span>{{ $t('table.dialog.total-socso-payment') }} :</span></td>
          <td>{{ modal?.data?.totalEmployerContribution?.totalSocso || '0' }}</td>
          <td><span>{{ $t('table.dialog.total-sosco') }} :</span></td>
          <td>{{ modal?.data?.totalContribution?.totalSocso || '0' }}</td>
        </tr>
        <tr>
          <td><span>{{ $t('table.dialog.total-employer-net-pay') }} :</span></td>
          <td>{{ modal?.data?.totalEmployerNetPay || '0' }}</td>
          <td>{{ $t('table.dialog.total-eis-payment') }} :</td>
          <td>{{ modal?.data?.totalEmployeeContribution?.totalEis || '0' }}</td>
          <td><span>{{ $t('table.dialog.total-eis-payment') }} :</span></td>
          <td>{{ modal?.data?.totalEmployerContribution?.totalEis || '0' }}</td>
          <td><span>{{ $t('table.dialog.total-eis') }} :</span></td>
          <td>{{ modal?.data?.totalContribution?.totalEis || '0' }}</td>
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
        <tr v-for="(value, i) in modal?.data?.employeePayrollSummaries" :key="i">
          <td>{{ value?.employee || '--' }}</td>
          <td>{{ value?.basic || '0' }}</td>
          <td>{{ value?.additions || '0' }}</td>
          <td>{{ value?.deductions || '0' }}</td>
          <td>
            <table class="inner-table-data">
              <tr>
                <td>{{ value?.employeeContribution?.tax || '0' }}</td>
                <td>{{ value?.employeeContribution?.epf || '0' }}</td>
                <td>{{ value?.employeeContribution?.socso || '0' }}</td>
                <td>{{ value?.employeeContribution?.eis || '0' }}</td>
              </tr>
            </table>
          </td>
          <td>
            <table class="inner-table-data">
              <tr>
                <td>{{ value?.employerContribution?.tax || '0' }}</td>
                <td>{{ value?.employerContribution?.epf || '0' }}</td>
                <td>{{ value?.employerContribution?.socso || '0' }}</td>
                <td>{{ value?.employerContribution?.eis || '0' }}</td>
              </tr>
            </table>
          </td>
          <td>{{ value?.netIncome || '0' }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainPayrollGeneratePayrollViewSummary',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  computed: {
    mainParent() {
      return this.getParent('MainPayrollGeneratePayroll')
    }
  },
  methods: {
    async undo() {
      try {
        await this.$store.dispatch('api/main/payroll/generalPayroll/undoProcessPayroll', { id: this.modal?.data.id })
        this.mainParent.summary.status = 'Pending'
        this.mainParent.getSummary()
        this.$notification.open({
          message: this.$t('notification.generate-payroll.undo'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
      } catch (e) {
        this.$message.error(e.response)
      }
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
    th:nth-child(3),
    th:nth-child(5) {
      width: 202px;
    }
    th:nth-child(4),
    td:nth-child(4) {
      border-right: 1px solid #fff;
    }
    th:nth-child(1),
    th:nth-child(2),
    th:nth-child(7),
    th:nth-child(8) {
      background: #cef4e5;
    }
    th:nth-child(3),
    th:nth-child(4),
    th:nth-child(5),
    th:nth-child(6),
    td:nth-child(3),
    td:nth-child(4),
    td:nth-child(5),
    td:nth-child(6) {
      background: #e6f7ff;
    }
    td:nth-child(1) span,
    td:nth-child(5) span,
    td:nth-child(7) span {
      float: right;
    }
    td:nth-child(1),
    td:nth-child(2),
    td:nth-child(7),
    td:nth-child(8) {
      background-color: #f2f2f2;
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
    th:nth-child(5),
    th:nth-child(6) {
      background: #e6f7ff;
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
    th:nth-child(5),
    th:nth-child(6) {
      background: #e6f7ff;
    }
    th:nth-child(1),
    th:nth-child(2),
    th:nth-child(3),
    th:nth-child(4),
    th:nth-child(7) {
      background: #cef4e5;
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
    td:nth-child(1),
    td:nth-child(2),
    td:nth-child(3),
    td:nth-child(4),
    td:nth-child(7) {
      background-color: #f2f2f2;
    }
    td:nth-child(5),
    td:nth-child(6) {
      background-color: #e6f7ff;
    }
  }
}
.inner-table-header {
  tr {
    th {
      padding: 0 18px;
      background: #e6f7ff !important;
      border: none;
    }
  }
}
.inner-table-data {
  tr {
    td {
      padding: 10px 0;
      background: #e6f7ff !important;
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
