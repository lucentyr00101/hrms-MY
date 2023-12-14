<template>
  <div class="attendance-dashboard">
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
      {{ $tc('table.card.today-time-in-details', fullDateTime) }}
    </a-divider>
    <a-card class="table-card">
      <a-table :columns="columns" :data-source="attendanceData" bordered>
        <span slot="timeInTime" slot-scope="text">{{ getTime(text) }}</span>
        <span slot="timeOutTime" slot-scope="text">{{ getTime(text) }}</span>
        <span slot="status" slot-scope="text, row" :style="{ color: row.statusColor }">
          <a-badge :color="row.statusColor" /> {{ text }}
        </span>
        <a slot-scope="id" :href="'/setup/employee/employee-setup/view/employee-information/' + id" slot="action"
          >View Employee</a
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
  name: 'AttendanceDashboard',
  data() {
    return {
      timeInData: [],
      absentData: [],
      pendingApprovalData: [],
      pieStyle: {
        stroke: '#fff',
        lineWidth: 2,
        raduis: 100
      },
      attendanceData: [],
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
    const attendance = await this.$store.dispatch('api/dashboard/attendance/getAttendance')
    this.attendanceData = attendance?.data || []
    const { data } = await this.$store.dispatch('api/dashboard/attendance/getStatistics', {
      year: moment().format('YYYY'),
      month: moment().format('MM')
    })
    this.timeInData = data?.attendanceTypeStatistics
      ?.filter((item) => {
        return item.label === 'Time In' || item.label === 'Late Time In'
      })
      .map((item) => {
        return { item: item.label === 'Time In' ? 'Normal Time In' : item.label, count: item.count }
      })
    this.absentData = data?.absentTypeStatistics?.map((item) => {
      return { item: item.label, count: item.count }
    })
    this.pendingApprovalData = data?.approvalStatusStatistics
      ?.filter((item) => {
        return item.label !== 'Rejected'
      })
      .map((item) => {
        return { item: item.label === 'Approved' ? 'Fully Approved' : item.label, count: item.count }
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
          title: i18nRender('table.column.time-in'),
          pieData: this.transform(this.timeInData)
        },
        {
          title: i18nRender('table.column.absent'),
          pieData: this.transform(this.absentData)
        },
        {
          title: i18nRender('table.column.pending-approval'),
          pieData: this.transform(this.pendingApprovalData)
        }
      ]
    }
  },
  methods: {
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
.attendance-dashboard {
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
