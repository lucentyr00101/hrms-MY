<template>
  <div>
    <a-divider class="time-in-text" orientation="left">
      {{ $tc('table.card.today-leave-details', dateToday) }}
    </a-divider>
    <a-row :gutter="12">
      <a-col :lg="{ span: 8 }" :xs="{ span: 24 }" v-for="(result, i) in results[0]" :key="i">
        <a-card style="height: 300px" @click="goTo(result.link)" class="is-pointer">
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
    <a-divider class="time-in-text" orientation="left">
      {{ $tc('table.card.today-leave-details', dateToday) }}
    </a-divider>
    <a-row :gutter="12">
      <a-col :lg="{ span: 8 }" :xs="{ span: 24 }" v-for="(result, i) in results[1]" :key="i">
        <a-card style="height: 300px" @click="goTo(result.link)" class="is-pointer">
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
    <a-divider class="time-in-text" orientation="left">
      {{ $tc('table.card.today-claim-details', dateToday) }}
    </a-divider>
    <a-row :gutter="12">
      <a-col :lg="{ span: 8 }" :xs="{ span: 24 }" v-for="(result, i) in results[2]" :key="i">
        <a-card style="height: 300px" @click="goTo(result.link)" class="is-pointer">
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
    <a-row :gutter="12" v-if="isLoaded">
      <a-divider class="time-in-text" orientation="left">
        {{ $tc('table.card.previous-month-payroll-breakdown', dateToday) }}
      </a-divider>
      <a-col :lg="{ span: 12 }" :xs="{ span: 24 }">
        <a-card style="height: 400px; display: flex; align-items: center; justify-content: center">
          <canvas id="barChart" width="700" height="400"></canvas>
        </a-card>
      </a-col>
      <a-col :lg="{ span: 12 }" :xs="{ span: 24 }">
        <a-card style="height: 400px; display: flex; align-items: center; justify-content: center">
          <canvas id="hBarChart" width="700" height="400"></canvas>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'
import { i18nRender } from '@/locales'
import moment from 'moment'
const DataSet = require('@antv/data-set')

const pieScale = [
  {
    dataKey: 'percent',
    min: 0,
    formatter: '.0%'
  }
]
export default {
  data() {
    return {
      isLoaded: true,
      payrollBarData: [],
      contributionBarData: [],
      pieStyle: {
        stroke: '#fff',
        lineWidth: 2,
        raduis: 100
      },
      timeInData: [],
      absentData: [],
      pendingApprovalData: [],
      annualLeaveData: [],
      medicalLeaveData: [],
      unpaidLeaveData: [],
      claimData: [],
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
    const {
      data: {
        dashboardAttendanceStatisticsResponse,
        dashboardLeaveStatisticsResponse,
        dashboardClaimStatisticsResponse,
        dashboardEmployeePayrollDetailResponse,
        dashboardEmployerContributionResponse
      }
    } = await this.$store.dispatch('api/dashboard/admin/getStatistics')
    this.timeInData = dashboardAttendanceStatisticsResponse?.attendanceTypeStatistics
      ?.filter((item) => {
        return item.label === 'Time In' || item.label === 'Late Time In'
      })
      .map((item) => {
        return { item: item.label === 'Time In' ? 'Normal Time In' : item.label, count: item.count }
      })
    this.absentData = dashboardAttendanceStatisticsResponse?.absentTypeStatistics?.map((item) => {
      return { item: item.label, count: item.count }
    })
    this.pendingApprovalData = dashboardAttendanceStatisticsResponse?.approvalStatusStatistics
      ?.filter((item) => {
        return item.label !== 'Rejected'
      })
      .map((item) => {
        return { item: item.label === 'Approved' ? 'Fully Approved' : item.label, count: item.count }
      })
    this.annualLeaveData = dashboardLeaveStatisticsResponse?.items?.filter((item) => {
      return item.companyLeaveType?.companyLeaveType === 'Annual Leave'
    })
    this.medicalLeaveData = dashboardLeaveStatisticsResponse?.items?.filter((item) => {
      return item.companyLeaveType?.companyLeaveType === 'Medical Leave'
    })
    this.unpaidLeaveData = dashboardLeaveStatisticsResponse?.items?.filter((item) => {
      return item.companyLeaveType?.companyLeaveType === 'Unpaid Leave'
    })

    this.claimData = dashboardClaimStatisticsResponse || []
    this.payrollBarData = dashboardEmployeePayrollDetailResponse?.items || []
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

    this.contributionBarData = dashboardEmployerContributionResponse?.items || []
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
    },
    dateToday() {
      return moment().format('DD-MM-YYYY @ hh:mm A')
    },
    results() {
      return [
        [
          {
            title: i18nRender('table.column.time-in'),
            pieData: this.transform(this.timeInData),
            link: '/dashboard-attendance'
          },
          {
            title: i18nRender('table.column.absent'),
            pieData: this.transform(this.absentData),
            link: '/dashboard-attendance'
          },
          {
            title: i18nRender('table.column.pending-approval'),
            pieData: this.transform(this.pendingApprovalData),
            link: '/dashboard-attendance'
          }
        ],
        [
          {
            title: i18nRender('table.column.annual-leave'),
            pieData: this.transform([
              { item: 'Approved', count: this.annualLeaveData[0]?.approved || 0 },
              { item: 'Pending', count: this.annualLeaveData[0]?.pending || 0 }
            ]),
            link: '/dashboard-leave'
          },
          {
            title: i18nRender('table.column.medical-leave'),
            pieData: this.transform([
              { item: 'Approved', count: this.medicalLeaveData[0]?.approved || 0 },
              { item: 'Pending', count: this.medicalLeaveData[0]?.pending || 0 }
            ]),
            link: '/dashboard-leave'
          },
          {
            title: i18nRender('table.column.unpaid-leave'),
            pieData: this.transform([
              { item: 'Approved', count: this.unpaidLeaveData[0]?.approved || 0 },
              { item: 'Pending', count: this.unpaidLeaveData[0]?.pending || 0 }
            ]),
            link: '/dashboard-leave'
          }
        ],
        [
          {
            title: i18nRender('table.column.medical-claim'),
            pieData: this.transform([
              { item: 'Approved', count: this.claimData?.medicalClaim?.approved || 0 },
              { item: 'Pending', count: this.claimData?.medicalClaim?.pending || 0 }
            ]),
            link: '/dashboard-claim'
          },
          {
            title: i18nRender('table.column.travel-claim'),
            pieData: this.transform([
              { item: 'Approved', count: this.claimData?.travelClaim?.approved || 0 },
              { item: 'Pending', count: this.claimData?.travelClaim?.pending || 0 }
            ]),
            link: '/dashboard-claim'
          },
          {
            title: i18nRender('table.column.msc-claim'),
            pieData: this.transform([
              { item: 'Approved', count: this.claimData?.mscClaim?.approved || 0 },
              { item: 'Pending', count: this.claimData?.mscClaim?.pending || 0 }
            ]),
            link: '/dashboard-claim'
          }
        ]
      ]
    }
  },
  methods: {
    goTo(url) {
      if (url) window.location.href = url
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

<style scoped>
.is-pointer {
  cursor: pointer;
}
</style>
