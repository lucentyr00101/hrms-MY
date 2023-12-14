<template>
  <div class="leave-dashboard">
    <user-status />
    <a-divider orientation="left"> {{ dateToday }} <a-icon type="calendar" /></a-divider>
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
    <a-divider class="time-in-text" orientation="left">
      {{ $tc('table.card.today-leave-details', fullDateTime) }}</a-divider
    >
    <a-card class="table-card">
      <a-table :columns="columns" :data-source="leaveData" bordered>
        <span slot="timeInTime" slot-scope="text">{{ getTime(text) }}</span>
        <span slot="timeOutTime" slot-scope="text">{{ getTime(text) }}</span>
        <span slot="status" slot-scope="text" :style="{ color: getColor(text) }">
          <a-badge :color="getColor(text)" /> {{ text }}
        </span>
        <a
          :href="
            '/main/hr/leave-transactions?name=' +
            row.employeeSetup.fullName +
            '&startDate=' +
            row.startDate +
            '&leaveType=' +
            row.companyLeaveType.leaveType
          "
          slot-scope="text, row"
          slot="action"
          >View Application</a
        >
      </a-table>
    </a-card>
  </div>
</template>

<script>
import UserStatus from '../UserStatus'
import moment from 'moment'
import { i18nRender } from '@/locales'
import columns from './columns'
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
  name: 'LeaveDashboard',
  data() {
    return {
      annualLeaveData: [],
      medicalLeaveData: [],
      unpaidLeaveData: [],
      pieStyle: {
        stroke: '#fff',
        lineWidth: 2,
        raduis: 100
      },
      leaveData: [],
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
    const leave = await this.$store.dispatch('api/dashboard/leave/getLeaveToday')
    this.leaveData = leave?.data || []
    const { data } = await this.$store.dispatch('api/dashboard/leave/getStatistics', {
      year: moment().format('YYYY'),
      month: moment().format('MM')
    })
    this.annualLeaveData = data?.items?.filter((item) => {
      return item.companyLeaveType?.companyLeaveType === 'Annual Leave'
    })
    this.medicalLeaveData = data?.items?.filter((item) => {
      return item.companyLeaveType?.companyLeaveType === 'Medical Leave'
    })
    this.unpaidLeaveData = data?.items?.filter((item) => {
      return item.companyLeaveType?.companyLeaveType === 'Unpaid Leave'
    })
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
          title: i18nRender('table.column.annual-leave'),
          pieData: this.transform([
            { item: 'Approved', count: this.annualLeaveData[0]?.approved || 0 },
            { item: 'Pending', count: this.annualLeaveData[0]?.pending || 0 }
          ])
        },
        {
          title: i18nRender('table.column.medical-leave'),
          pieData: this.transform([
            { item: 'Approved', count: this.medicalLeaveData[0]?.approved || 0 },
            { item: 'Pending', count: this.medicalLeaveData[0]?.pending || 0 }
          ])
        },
        {
          title: i18nRender('table.column.unpaid-leave'),
          pieData: this.transform([
            { item: 'Approved', count: this.unpaidLeaveData[0]?.approved || 0 },
            { item: 'Pending', count: this.unpaidLeaveData[0]?.pending || 0 }
          ])
        }
      ]
    }
  },
  methods: {
    getColor(status) {
      let color
      switch (status) {
        case 'Rejected':
          color = 'red'
          break
        case 'Pending':
          color = '#FFD300'
          break
        case 'Approved':
          color = 'green'
          break

        default:
          color = 'grey'
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
