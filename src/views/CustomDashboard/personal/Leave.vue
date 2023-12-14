<template>
  <div>
    <a-row :gutter="12">
      <a-col :lg="{ span: 8 }" :xs="{ span: 24 }" v-for="(result, i) in results" :key="i">
        <a-card>
          <p class="leave-title">{{ result.title }}</p>
          <p class="duration-type">{{ result.durationType }}</p>
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
  </div>
</template>

<script>
import { i18nRender } from '@/locales'
import { mapGetters } from 'vuex'
const DataSet = require('@antv/data-set')

const pieScale = [
  {
    dataKey: 'percent',
    min: 0,
    formatter: '.0%'
  }
]

export default {
  name: 'Leave',
  data() {
    return {
      availableVacationLeaveBalance: null,
      usedVacationLeave: null,
      availableSickLeaveBalance: null,
      usedSickLeave: null,
      availableOffsetBalance: null,
      usedOffset: null,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 2
      },
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
  computed: {
    ...mapGetters('api/auth', ['currentUser']),
    results() {
      return [
        {
          title: i18nRender('dashboard.analysis.leave.offset-balance'),
          durationType: 'Hours',
          pieData: this.transform([
            { item: 'Available Balances', count: this.availableOffsetBalance || 0 },
            { item: 'Used', count: this.usedOffset || 0 }
          ])
        },
        {
          title: i18nRender('table.column.medical-leave'),
          durationType: 'Days',
          pieData: this.transform([
            { item: 'Available Balances', count: this.availableSickLeaveBalance || 0 },
            { item: 'Used', count: this.usedSickLeave || 0 }
          ])
        },
        {
          title: i18nRender('table.column.annual-leave'),
          durationType: 'Days',
          pieData: this.transform([
            { item: 'Available Balances', count: this.availableVacationLeaveBalance || 0 },
            { item: 'Used', count: this.usedVacationLeave || 0 }
          ])
        }
      ]
    }
  },
  async created() {
    const offset = await this.$store.dispatch('api/dashboard/main/offsetBalance')
    this.availableOffsetBalance = offset?.data?.availableOffsetBalance
    this.usedOffset = offset?.data?.usedOffset
    const {
      data: { availableSickLeaveBalance, availableVacationLeaveBalance, usedSickLeave, usedVacationLeave }
    } = await this.$store.dispatch('api/dashboard/main/leaveBalance', {
      id: this.currentUser?.employeeSetupWorkInfoResponse?.employeeSetupId
    })
    this.availableSickLeaveBalance = availableSickLeaveBalance || 0
    this.usedSickLeave = usedSickLeave || 0
    this.availableVacationLeaveBalance = availableVacationLeaveBalance || 0
    this.usedVacationLeave = usedVacationLeave || 0
  },
  methods: {
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

<style style="less" scoped>
.ant-card >>> .ant-card-head {
  border-bottom: none;
}

.ant-card >>> .ant-card-body {
  padding-top: 0px;
}

.ant-card {
  border-radius: 10px;
  height: 300px;
  margin-bottom: 20px;
}

.leave-title {
  font-size: 20px;
  font-weight: 500;
  margin-top: 12px;
  margin-bottom: 0px;
}

.duration-type {
  font-size: 10px;
}
</style>
