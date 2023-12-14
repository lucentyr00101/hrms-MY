<template>
  <div>
    <a-card>
      <a-row :gutter="16" align="middle">
        <a-col :lg="{ span: 3 }" :xs="{ span: 24 }" :md="{ span: 8 }" style="margin-top: 65px">
          <div class="ot-title">
            {{ $t('dashboard.analysis.ot.hour') }}
          </div>
          <div class="ot-title">
            {{ $t('dashboard.analysis.ot.ot-approved') }}
          </div>
        </a-col>
        <a-col :lg="{ span: 3 }" :xs="{ span: 24 }" :md="{ span: 8 }" v-for="(result, i) in results" :key="i">
          <a-card style="text-align: center; background: #fff">
            <div class="date-box">
              {{ result.date | moment('D MMM') }}
            </div>
            <a-space direction="vertical" size="large" style="width: 100%">
              <div style="font-size: 12px; color: #000">
                {{ result.date | moment('dddd') }}
              </div>
              <div class="work-hour">{{ result.workHour }}</div>
              <div :class="`ot-box ot-box-${result.otApprovedStatus}`">
                <div class="ot-box-hour">{{ result.otApprovedHour }}</div>
                <div class="ot-box-status">
                  {{ result.otApprovedStatus === 'Normal' ? '-' : result.otApprovedStatus }}
                </div>
              </div>
            </a-space>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'OtApproved',
  data() {
    return {
      results: []
    }
  },
  async created() {
    const { data } = await this.$store.dispatch('api/dashboard/main/otAndHours')
    this.results = data?.slice(0, 7).map((item) => {
      return {
        date: item.attendanceDate || '',
        workHour: item.workTimeDuration || '',
        otApprovedHour: item.otHour || '',
        otApprovedStatus: item.status || ''
      }
    })
  },
  methods: {}
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/es/style/themes/default.less';

.ant-card-bordered {
  border-radius: 10px;
  margin-bottom: 10px;
  background-color: @primary-color;
}

.date-box {
  background: #5f63f2;
  padding: 4px;
  border-radius: 20px;
  color: #fff;
  text-align: center;
  font-weight: 500;
}

.ot-box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-left: 11px;
  padding-right: 11px;
  border-radius: 10px;
  min-width: 85px;
  color: #fff;
  text-align: center;
  height: 60px;
}

.ot-box-Approved {
  background: #49d940;
}
.ot-box-Pending {
  background: #ffa800;
}
.ot-box-Rejected {
  background: #f52c3c;
}
.ot-box-Normal {
  background: #dedede;
}

.work-hour {
  font-size: 14px;
  font-weight: 700;
  color: #000;
}

.ot-title {
  margin-top: 32px;
  background: #fff;
  padding: 8px;
  border-radius: 12px;
  text-align: center;
  font-weight: 700;
  color: #000;
  margin-bottom: 10px;
}

.ot-box-hour {
  font-size: 11px;
  font-weight: 500;
  border-bottom: 1px solid white;
  width: max-content;
}

.ot-box-status {
  font-size: 10px;
}
</style>
