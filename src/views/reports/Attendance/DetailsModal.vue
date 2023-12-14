<template>
  <a-modal
    :title="$t('table.dialog.attendance-details')"
    :width="1000"
    :visible="visible"
    :okButtonProps="{ style: 'display: none;' }"
    :cancelButtonProps="{ style: 'display: none;' }"
    class="attendance-reports"
    @cancel="handleCancel"
  >
    <a-row :gutter="[0, 8]">
      <a-col :span="12" v-for="i in info" :key="i.key">
        <a-col class="label" :span="12">
          {{ i.label }} :
        </a-col>
        <a-col :span="12">
          {{ i.data }}
        </a-col>
      </a-col>
    </a-row>
    <a-divider orientation="left">{{ $t('table.dialog.attendance-details') }}</a-divider>
    <a-row :gutter="[0, 8]">
      <a-col :span="12" v-for="i in details" :key="i.key">
        <a-col class="label" :span="12">
          {{ i.label }} :
        </a-col>
        <a-col :span="12">
          {{ i.data }}
        </a-col>
      </a-col>
    </a-row>
    <a-divider orientation="left">{{ $t('table.dialog.new-attendance-details') }}</a-divider>
    <a-row :gutter="[0, 8]">
      <a-col :span="12" v-for="i in newDetails" :key="i.key">
        <a-col class="label" :span="12">
          {{ i.label }} :
        </a-col>
        <a-col v-if="i.status">
          <span :style="{ backgroundColor: statusColorMap(i.data) }" class="status"></span>{{ i.data }}
        </a-col>
        <a-col :span="12" v-else>
          {{ i.data }}
        </a-col>
      </a-col>
    </a-row>
    <a-divider orientation="left">{{ $t('table.dialog.work-duration-details') }}</a-divider>
    <a-row :gutter="[0, 8]">
      <a-col :span="12" v-for="i in workDurationDetails" :key="i.key">
        <a-col class="label" :span="12">
          {{ i.label }} :
        </a-col>
        <a-col v-if="i.status">
          <span :style="{ backgroundColor: statusColorMap(i.data) }" class="status"></span>{{ i.data }}
        </a-col>
        <a-col :span="12" v-else>
          {{ i.data }}
        </a-col>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      visible: false,
      location: ''
    }
  },
  props: {
    model: { type: Object, default: null }
  },
  created () {
    this.getLocation()
  },
  computed: {
    info() {
      return [
        { key: 0, label: this.$t('table.dialog.employee-number'), data: `${this.model?.employeeSetup?.employeeNumber || '--'}` },
        { key: 1, label: this.$t('table.dialog.department'), data: `${this.model?.employeeSetup?.department || '--'}` },
        { key: 2, label: this.$t('table.dialog.employee'), data: `${this.model?.employeeSetup?.fullName || '--'}` },
        { key: 3, label: this.$t('table.dialog.created-time'), data: `${this.model?.createdTime || '--'}` },
        { key: 4, label: this.$t('table.dialog.location'), data: `${this.location || '--'}` },
        { key: 5, label: this.$t('table.dialog.attendance-type'), data: `${this.model?.attendanceType || '--'}` },
        { key: 6, label: this.$t('table.column.time-out-type'), data: `${this.model?.timeInOutType || '--'}` },
        { key: 7, label: this.$t('table.dialog.remarks'), data: `${this.model?.remarks || '--'}` },
        { key: 8, label: this.$t('table.dialog.created-by'), data: `${this.model?.createdBy || '--'}` }
      ]
    },
    details() {
      const attendances = this.model?.employeeAttendances
      const data = []
      let key = 0
      if (attendances) {
        attendances.forEach((el) => {
          data.push({ ...el, key: key, label: this.$t('table.dialog.attendance-type'), data: el?.employeeSetupAttendance?.attendanceType })
          key++
          data.push({ ...el, key: key, label: this.$t('table.dialog.entry-time'), data: el?.startDateTime })
          key++
        })
      }
      return data
    },
    newDetails() {
      return [
        { key: 0, label: this.$t('table.dialog.new-attendance-type'), data: `${this.model?.employeeAttendanceUpdate?.employeeSetupAttendance?.attendanceType || '--'}` },
        { key: 1, label: this.$t('table.dialog.new-date-time'), data: `${this.model?.employeeAttendanceUpdate?.startDateTime || '--'}` },
        { key: 2, label: this.$t('table.dialog.remarks'), data: `${this.model?.employeeAttendanceUpdate?.remarks || '--'}` },
        { key: 3, label: this.$t('table.dialog.status'), data: `${this.model?.employeeAttendanceUpdate?.status || '--'}`, status: true },
        { key: 4, label: this.$t('table.dialog.approved-by'), data: `${this.model?.approvedBy || '--'}` },
        { key: 5, label: this.$t('table.dialog.updated-by'), data: `${this.model?.employeeAttendanceUpdate?.updatedBy || '--'}` }
      ]
    },
    workDurationDetails() {
      return [
        { key: 0, label: this.$t('table.column.work-time-durations'), data: `${this.model?.finalWorkTimeDuration || '--'}` },
        { key: 1, label: this.$t('table.dialog.status'), data: `${this.model?.status || '--'}`, status: true },
        { key: 2, label: this.model?.timeInOutType === 'Overtime' ? this.$t('table.column.over-time-hours') : this.$t('table.column.short-hours'), data: `${this.model?.timeInOutType === 'Overtime' ? this.model?.overtime || '--' : this.model?.underTimeHour || '--' }` },
        { key: 3, label: this.model?.timeInOutType === 'Overtime' ? this.$t('table.column.convert-overtime-to-offset') : this.$t('table.column.use-offset-hours'), data: `${this.model?.timeInOutType === 'Overtime' ? this.model?.convertToOffset || 'Yes' : this.model?.isUsedOffset || '--'}` },
        { key: 4, label: this.$t('table.dialog.approved-by'), data: `${this.model?.approvedBy || '--'}` },
        { key: 5, label: this.$t('table.dialog.updated-by'), data: `${this.model?.updatedBy || '--'}` }
      ]
    }
  },
  methods: {
    async getLocation () {
      const response = await axios.get('https://ipapi.co/json/')
      const { city, country_name: country } = response.data
      this.location = `${city}, ${country}`
    },
    statusColorMap (status) {
      const map = {
        Pending: '#EB9514',
        Approved: '#3C9C1B',
        Rejected: '#D71E1E',
        Modified: '#f50'
      }
      return map[status]
    },
    view() {
      this.visible = true
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style>
.attendance-reports .status {
  height: 6px;
  width: 6px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  right: 5px;
  top: -1px;
}

.attendance-reports .label {
  font-weight: bold;
}

.attendance-reports  .ant-divider-horizontal.ant-divider-with-text-left {
  padding: 0px !important;
  font-size: 16px;
  font-weight: 700;
  margin-left: -10px;
}

.attendance-reports .ant-divider-inner-text {
  font-weight: normal;
}

</style>
