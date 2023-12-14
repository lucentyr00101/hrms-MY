<template>
  <div>
    <a-modal
      :title="$t('table.dialog.edit-attendance-list')"
      :width="800"
      v-model="editAttendanceModal"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      @cancel="closeModal()"
    >
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
        <a-form-item :label="this.$t('table.column.employee')">
          <!-- <div>{{ model?.employee?.fullName || '-' }}</div> -->
          <a-select v-decorator="['fullName']" style="width: 100%" disabled placeholder="Select" />
        </a-form-item>

        <a-form-item :label="this.$t('table.column.attendance-type')">
          <!-- <div>{{ model?.attendanceType || '-' }}</div> -->
          <a-select
            v-decorator="['attendanceType']"
            :options="employeeAttendancesList"
            style="width: 100%"
            @change="attendanceTypeOnChange"
            placeholder="Select"
          />
        </a-form-item>

        <a-form-item :label="this.$t('table.column.date-and-time')">
          <!-- <div>{{ model?.timeInTime ? formatDate(model.timeInTime, 'YYYY/MM/DD HH:mm:ss') : '-' }}</div> -->
          <a-date-picker
            v-decorator="['dateAndTime']"
            show-time
            format="YYYY/MM/DD HH:mm:ss"
            style="width: 100%"
            disabled
            placeholder="Select Date & Time"
          />
        </a-form-item>

        <a-form-item :label="this.$t('table.column.remarks')">
          <!-- <div>{{ model?.remarks || '-' }}</div> -->
          <a-input
            v-decorator="['remarks']"
            type="textarea"
            :maxLength="100"
            style="width: 100%"
            placeholder="Autoheight based on content lines="
            disabled
          />
        </a-form-item>

        <a-divider orientation="left">{{ $t('table.card.new-attendance-information') }}</a-divider>

        <a-form-item :label="this.$t('table.column.new-attendance-type')">
          <a-select
            v-decorator="['attendanceType']"
            :options="employeeAttendancesList"
            style="width: 100%"
            placeholder="Select"
            disabled
          />
        </a-form-item>

        <a-form-item :label="this.$t('table.column.new-date-and-time')">
          <a-date-picker
            v-decorator="[
              'newDateAndTime',
              { rules: [{ required: true, message: $t('error.new-date-and-time.required') }] }
            ]"
            show-time
            style="width: 100%"
            placeholder="Select Date & Time"
          />
        </a-form-item>

        <a-form-item
          class="help-text-right"
          :label="this.$t('table.column.remarks')"
          :help="`${form.getFieldValue('newRemarks')?.length || 0} / 100`"
        >
          <a-input
            v-decorator="['newRemarks']"
            type="textarea"
            :maxLength="100"
            style="width: 100%"
            placeholder="Autoheight based on content lines="
          />
        </a-form-item>

        <!-- <a-form-item :label="this.$t('table.column.work-time-durations')" >
          <div>{{ model?.workTimeDurations ? model.workTimeDuration : '-' }}</div>
        </a-form-item>

        <a-form-item :label="this.$t('table.column.oTHours')">
          <div>{{ model?.oTHours ? model.otHours : '-' }}</div>
        </a-form-item>

        <a-form-item :label="this.$t('table.column.final-attendance-type')" >
          <a-select v-decorator="['finalAttendanceType']" :options="attendanceTypeDropdown" style="width: 100%"/>
        </a-form-item>

        <a-form-item :label="this.$t('table.column.final-work-time-durations')" :help="this.$t('table.help.rejected-ot-hours-will-convert-to-offset-balances')">
          <a-time-picker v-decorator="['finalWorkTimeDurations']" style="width: 100%" :minute-step="15" :second-step="10" />
        </a-form-item>

        <a-form-item :label="this.$t('table.column.use-offset-balance')" :help="this.$t('table.help.untick-to-proceed-with-late-deduction')">
          <a-checkbox v-decorator="['useOffsetBalance']" @change="onChange">
            <strong>Yes</strong>
          </a-checkbox><br />
        </a-form-item> -->

        <a-form-item :wrapperCol="{ span: 1, offset: 18 }">
          <a-button class="confirm-btn" type="primary" @click="handleSubmit()">{{ $t('submit') }}</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { TreeSelect } from 'ant-design-vue'
import { i18nRender } from '@/locales'
import moment from 'moment'
export default {
  name: 'EditAttendanceModal',
  data() {
    return {
      fields: ['fullName', 'attendanceType', 'dateAndTime', 'remarks', 'newDateAndTime', 'newRemarks'],
      TreeSelect,
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      attendanceTypeDropdown: [],
      loadAttendanceDropdown: async () => {
        this.attendanceTypeDropdown = []
        const data = await this.$store.dispatch('api/dropdown/fetchAttendanceDropdown')
        data.data.employeeSetupAttendanceTypes.forEach((item) => {
          this.attendanceTypeDropdown = [
            ...this.attendanceTypeDropdown,
            {
              value: item.id,
              label: item.attendanceType
            }
          ]
        })
        return this.attendanceTypeDropdown
      }
    }
  },
  props: {
    model: {
      type: Object,
      default: () => null
    }
  },
  created() {
    this.loadAttendanceDropdown()
  },
  computed: {
    editAttendanceModal: {
      get() {
        return this.$store.state.modal.editAttendanceModal
      },
      set() {
        // just to prevent error log when @cancel
      }
    },
    employeeAttendancesList() {
      return (this.model?.employeeAttendances || []).map((item) => ({
        value: `${item?.id}`,
        label: item?.employeeSetupAttendance?.attendanceType
      }))
    }
  },
  watch: {
    editAttendanceModal(to) {
      if (to) {
        this.applyData()
      }
    }
  },
  methods: {
    moment,
    applyData() {
      this.loadAttendanceDropdown()
      this.fields.forEach((v) => this.form.getFieldDecorator(v))
      if (this.model) {
        const { employee, employeeAttendances, remarks } = this.model
        this.form.setFieldsValue({
          fullName: employee.fullName,
          attendanceType: employeeAttendances?.[0]?.id,
          dateAndTime: moment(employeeAttendances?.[0]?.startDateTime),
          remarks
        })
      }
    },
    attendanceTypeOnChange(id) {
      this.form.setFieldsValue({
        dateAndTime: moment(this.model?.employeeAttendances.find((item) => item.id === id)?.startDateTime)
      })
    },
    onChange(e) {
      console.log(`checked = ${e.target.checked}`)
    },
    closeModal() {
      this.$store.commit('modal/TOGGLE_EDIT_ATTENDANCE_MODAL')
      this.form.resetFields()
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.showInfo()
        }
      })
    },
    showInfo() {
      this.$confirm({
        title: i18nRender('table.dialog.confirm-msg'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        onOk: async () => {
          const data = {
            id: this.model?.id,
            employeeAttendanceId: this.form.getFieldValue('attendanceType'),
            newAttendanceDateTime: this.formatDate(this.form.getFieldValue('newDateAndTime'), 'YYYY-MM-DD HH:mm:ss'),
            newRemarks: this.form.getFieldValue('newRemarks')
            // 'finalAttendanceType': this.form.getFieldValue('finalAttendanceType'),
            // // TO BE FIXED
            // 'finalWorkTimeDuration': this.form.getFieldValue('finalWorkTimeDurations') | moment('HH:mm:ss'),
            // 'isUsedOffset': this.form.getFieldValue('useOffsetBalance')
          }
          await this.$store.dispatch('api/main/employeeManagement/attendanceList/updateEmployeeAttendance', data)
          this.$emit('success')
          this.$notification.open({
            message: this.$t('notification.attendance-has-been.updated'),
            icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
          })
          this.closeModal()
        },
        onCancel: () => {
          console.log('Cancel')
        }
      })
    }
  }
}
</script>

<style lang="less">
.help-text-right {
  .ant-form-explain {
    text-align: right;
  }
}
</style>
