<template>
  <div class="claim-dashboard">
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
      {{ $tc('table.card.today-claim-details', fullDateTime) }}
    </a-divider>
    <a-card class="table-card">
      <a-table :columns="columns" :data-source="claimData" bordered>
        <span slot="timeInTime" slot-scope="text">{{ getTime(text) }}</span>
        <span slot="timeOutTime" slot-scope="text">{{ getTime(text) }}</span>
        <span slot="status" slot-scope="text" :style="{ color: getColor(text) }">
          <a-badge :color="getColor(text)" /> {{ text }}
        </span>
        <a
          :href="
            '/main/hr/claim-transactions?name=' +
            row.employee.fullName +
            '&claimType=' +
            row.companyClaimType.claimType +
            '&month=' +
            row.claimsFor +
            '&claimApprovalStatus=' +
            row.claimApprovalStatus +
            '&employeeNumber=' +
            row.employee.employeeNumber
          "
          slot="action"
          slot-scope="text, row"
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
  name: 'ClaimDashboard',
  data() {
    return {
      pieData: null,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 2,
        raduis: 100
      },
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
    const claim = await this.$store.dispatch('api/dashboard/claim/getClaimAll')
    this.claimData = claim?.data?.data || []
    const { data } = await this.$store.dispatch('api/dashboard/claim/getStatistics', {
      year: moment().format('YYYY'),
      month: moment().format('MM')
    })
    this.pieData = data
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
          title: i18nRender('table.column.medical-claim'),
          pieData: this.transform([
            { item: 'Approved', count: this.pieData?.medicalClaim?.approved || 0 },
            { item: 'Pending', count: this.pieData?.medicalClaim?.pending || 0 }
          ])
        },
        {
          title: i18nRender('table.column.travel-claim'),
          pieData: this.transform([
            { item: 'Approved', count: this.pieData?.travelClaim?.approved || 0 },
            { item: 'Pending', count: this.pieData?.travelClaim?.pending || 0 }
          ])
        },
        {
          title: i18nRender('table.column.msc-claim'),
          pieData: this.transform([
            { item: 'Approved', count: this.pieData?.mscClaim?.approved || 0 },
            { item: 'Pending', count: this.pieData?.mscClaim?.pending || 0 }
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
.claim-dashboard {
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
