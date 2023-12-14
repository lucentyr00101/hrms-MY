<template>
  <div class="leave-dashboard">
    <user-status />
    <a-row :gutter="12">
      <a-divider orientation="left"> {{ dateToday }} <a-icon type="calendar" /></a-divider>
      <a-col :lg="{ span: 12 }" :xs="{ span: 24 }">
        <a-card style="display: inline-block; position: relative; width: 100%">
          <canvas id="barChart"></canvas>
        </a-card>
      </a-col>
      <a-col :lg="{ span: 12 }" :xs="{ span: 24 }">
        <a-card style="display: inline-block; position: relative; width: 100%">
          <canvas id="hBarChart"></canvas>
        </a-card>
      </a-col>
    </a-row>
    <a-divider class="time-in-text" orientation="left">
      {{ $tc('table.card.previous-month-payroll-breakdown', fullDateTime) }}
    </a-divider>

    <a-row :gutter="12">
      <a-col :lg="{ span: 8 }" :xs="{ span: 24 }" v-for="(result, i) in results" :key="i">
        <a-card style="height: 300px">
          <p style="margin: 0 !important; font-weight: bold; font-size: 25px; color: black">{{ result.title }}</p>
          <v-chart :force-fit="true" :height="320" :data="result.pieData" :scale="pieScale">
            <v-tooltip :showTitle="false" dataKey="item*percent" />
            <v-axis />
            <v-legend dataKey="item" position="left-top" :textStyle="{ fontSize: 15 }" />
            <v-pie position="percent" :color="color" :vStyle="pieStyle" :label="label" />
            <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />
          </v-chart>
        </a-card>
      </a-col>
    </a-row>
    <a-divider class="time-in-text" orientation="left"> Previous Month's Payroll Details ({{ dateToday }}) </a-divider>
    <a-card class="table-card">
      <a-table :columns="columns" :data-source="payrollItems" bordered>
        <span slot="status" slot-scope="text" :style="{ color: getColor(text) }">
          <a-badge :color="getColor(text)" /> {{ text === 'Yes' ? 'Published' : 'Not Published' }}
        </span>
        <a href="/main/m-payroll/generate?viewSummary=true" slot="action">View Payslip</a>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import UserStatus from '../UserStatus'
import moment from 'moment'
import { i18nRender } from '@/locales'
import columns from './columns'
import Chart from 'chart.js/auto'
const DataSet = require('@antv/data-set')

const pieScale = [
  {
    dataKey: 'percent',
    min: 0,
    formatter: '.0%'
  }
]
export default {
  components: { UserStatus },
  name: 'PayrollDashboard',
  data() {
    return {
      payrollData: [],
      pieStyle: {
        stroke: '#fff',
        lineWidth: 2,
        raduis: 100
      },
      payrollItems: [],
      color: ['item', ['#20C997', '#5F63F2']],
      label: [
        'count',
        {
          offset: -15,
          textStyle: {
            rotate: -0.1,
            textAlign: 'center',
            shadowBlur: 2,
            fill: 'white',
            shadowColor: 'rgba(0, 0, 0, .45)',
            fontWeight: 700,
            fontSize: 15
          }
        }
      ],
      pieScale
    }
  },
  async created() {
    const leave = await this.$store.dispatch('api/dashboard/payroll/getPayroll')
    this.payrollItems = leave?.data?.data || []
    const { data } = await this.$store.dispatch('api/dashboard/payroll/getStatistics', {
      year: moment().format('YYYY'),
      month: moment().format('MM')
    })
    this.payrollData = data
    this.payrollBarData = data?.employeePayrollDetails?.items || []
    const payrollDataSet = this.payrollBarData?.filter((item) => {
      return item?.totalSalary !== 0
    })
    const salary = payrollDataSet?.map((item) => {
      return item.totalSalary
    })
    const payrollEpf = payrollDataSet?.map((item) => {
      return item.totalEpf
    })
    const tax = payrollDataSet?.map((item) => {
      return item.totalTax
    })
    const bar = document.getElementById('barChart')
    const barData = new Chart(bar, {
      type: 'bar',
      data: {
        labels: this.payrollBarLabels,
        datasets: [
          { data: tax, backgroundColor: ['#5F63F2'], label: i18nRender('table.column.tax') },
          { data: payrollEpf, backgroundColor: ['#20C997'], label: i18nRender('table.column.epf') },
          { data: salary, backgroundColor: ['#0DB5FF'], label: i18nRender('table.column.salary') }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            align: 'start',
            padding: 20,
            text: moment().format('YYYY') + ' ' + this.$t('table.card.employee-payroll-details')
          },
          legend: {
            position: 'right'
          }
        },
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true
          }
        }
      }
    })

    this.contributionBarData = data?.employerContributionResponse?.items || []
    const contributionDataSet = this.contributionBarData?.filter((item) => {
      return item?.totalSalary !== 0
    })
    const epf = contributionDataSet?.map((item) => {
      return item.totalEmployerContributionEpf
    })
    const hdrf = contributionDataSet?.map((item) => {
      return item.totalEmployerContributionHrdf
    })
    const socso = contributionDataSet?.map((item) => {
      return item.totalEmployerContributionSocso
    })
    const Hbar = document.getElementById('hBarChart')
    const HBarData = new Chart(Hbar, {
      type: 'bar',
      data: {
        labels: this.payrollBarLabels,
        datasets: [
          { data: epf, backgroundColor: ['#0DB5FF'], label: i18nRender('table.column.epf') },
          { data: hdrf, backgroundColor: ['#20C997'], label: i18nRender('table.column.socso') },
          { data: socso, backgroundColor: ['#5F63F2'], label: i18nRender('table.column.hrdf') }
        ]
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          title: {
            padding: 20,
            display: true,
            align: 'start',
            text: moment().format('YYYY') + ' ' + this.$t('table.column.employer-contribution')
          },
          legend: {
            position: 'right'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })

    console.log(barData, HBarData)
  },
  computed: {
    columns() {
      return columns
    },
    dateToday() {
      return moment().format('MMMM YYYY')
    },
    fullDateTime() {
      return moment().format('DD-MM-YYYY @ hh:mm A')
    },
    results() {
      return [
        {
          title: i18nRender('table.column.epf-contribution'),
          pieData: this.transform([
            { item: 'Employee', count: this.payrollData?.epfContribution?.employeeContribution || 0 },
            { item: 'Employer', count: this.payrollData?.epfContribution?.employerContribution || 0 }
          ])
        },
        {
          title: i18nRender('table.column.socso-contribution'),
          pieData: this.transform([
            { item: 'Employee', count: this.payrollData?.socsoContribution?.employeeContribution || 0 },
            { item: 'Employer', count: this.payrollData?.socsoContribution?.employerContribution || 0 }
          ])
        },
        {
          title: i18nRender('table.column.eis-contribution'),
          pieData: this.transform([
            { item: 'Employee', count: this.payrollData?.eisContribution?.employeeContribution || 0 },
            { item: 'Employer', count: this.payrollData?.eisContribution?.employeeContribution || 0 }
          ])
        }
      ]
    },
    payrollBarLabels() {
      return this.payrollBarData
        ?.filter((item) => {
          return item?.totalSalary !== 0
        })
        .map((item) => {
          return moment()
            .month(item.monthDate - 1)
            .format('MMMM')
        })
    },
    contributionBarLabels() {
      return this.contributionBarData
        ?.filter((item) => {
          return item?.totalEmployerContributionEpf !== 0
        })
        .map((item) => {
          return moment()
            .month(item.monthDate - 1)
            .format('MMMM')
        })
    }
  },
  methods: {
    getColor(status) {
      let color
      switch (status) {
        case 'Yes':
          color = 'green'
          break

        default:
          color = 'red'
          break
      }
      return color
    },
    getTime(date) {
      if (!date) return '-'
      return moment(date).format('HH:MM:SS')
    },
    transform: function transform(data) {
      const dv = new DataSet.View().source(data)
      dv.transform({
        type: 'percent',
        field: 'count',
        dimension: 'item',
        as: 'percent'
      })
      const pieData = dv.rows
      return pieData
    }
  }
}
</script>

<style lang="less">
.leave-dashboard {
  .table-card {
    .ant-card-body {
      padding: 0 !important;
    }
    .ant-pagination {
      padding-right: 10px;
    }
    .ant-table-header-column {
      color: grey !important;
      font-weight: lighter !important;
    }
  }
  .ant-divider-inner-text {
    font-weight: bold;
  }
  .time-in-text {
    .ant-divider-inner-text {
      font-weight: lighter !important;
    }
  }
}
</style>
