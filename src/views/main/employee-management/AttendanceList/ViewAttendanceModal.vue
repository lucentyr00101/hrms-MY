<template>
  <div>
    <!-- Reject Modal -->
    <a-modal
      class="modal-reject-holder"
      title="Reject Remarks"
      :width="500"
      v-model="rejectModal.show"
      :ok-text="$t('table.dialog.reject')"
      ok-type="danger"
      @ok="handleRejectSubmit"
      @cancel="
        () => {
          rejectModal.form.resetFields()
        }
      "
    >
      <a-row v-if="model?.employeeAttendanceUpdate" class="details">
        <a-col :span="12">{{ $t('table.column.new-date-and-time') }}:</a-col>
        <a-col :span="12">{{
          model?.employeeAttendanceUpdate?.startDateTime
            ? formatDate(model?.employeeAttendanceUpdate?.startDateTime, 'YYYY-MM-DD HH:mm:ss')
            : '-'
        }}</a-col>
        <a-col :span="12">{{ $t('table.column.new-attendance-type') }}:</a-col>
        <a-col :span="12">{{ model?.employeeAttendanceUpdate?.employeeSetupAttendance?.attendanceType || '-' }}</a-col>
      </a-row>

      <a-row v-if="model?.timeInOutType === 'Overtime'" class="details">
        <a-col :span="12">{{ $t('table.column.date-and-time') }}:</a-col>
        <a-col :span="12">{{
          model?.employeeAttendances.at(-1)?.startDateTime
            ? formatDate(model?.employeeAttendances.at(-1)?.startDateTime, 'YYYY-MM-DD HH:mm:ss')
            : '-'
        }}</a-col>
        <a-col :span="12">{{ $t('table.column.overtime-hours') }}:</a-col>
        <a-col :span="12">{{ model?.otHour || '-' }}</a-col>
      </a-row>

      <a-row v-if="model?.timeInOutType === 'Early Time Out'" class="details">
        <a-col :span="12">{{ $t('table.column.date-and-time') }}:</a-col>
        <a-col :span="12">{{
          model?.employeeAttendances.at(-1)?.startDateTime
            ? formatDate(model?.employeeAttendances.at(-1)?.startDateTime, 'YYYY-MM-DD HH:mm:ss')
            : '-'
        }}</a-col>
        <a-col :span="12">{{ $t('table.column.short-hours') }}:</a-col>
        <a-col :span="12">{{ model?.underTimeHour || '-' }}</a-col>
      </a-row>

      <a-form :form="rejectModal.form" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" @submit.prevent>
        <a-form-item :label="`${$t('table.column.remarks')}: `" :style="{ margin: '-20px 0 0 0' }">
          <a-input
            v-decorator="[
              'rejectRemarks',
              { rules: [{ required: true, message: $t('error.reject-remarks.required') }] }
            ]"
            type="textarea"
            :maxLength="100"
            style="width: 100%"
            placeholder="Please state your reason why you're rejecting"
          />
        </a-form-item>
        <p :style="{ margin: 0, textAlign: 'right' }">
          {{ rejectModal.form.getFieldValue('rejectRemarks')?.length || 0 }} / 100
        </p>
      </a-form>
    </a-modal>
    <!-- /Reject Modal -->

    <a-modal
      :title="modalTitle"
      :width="1000"
      v-model="viewAttendanceModal"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      @cancel="closeModal()"
    >
      <a-form :form="form">
        <div :style="{ marginLeft: '20px' }">
          <a-row>
            <!-- employee Code -->
            <a-row>
              <a-col :span="6"
                ><div>{{ $t('table.column.employee-code') }}:</div></a-col
              >
              <a-col :span="6">{{ model && model.employee.employeeNumber }}</a-col>
              <a-col :span="6"
                ><div>{{ $t('table.column.department') }}:</div></a-col
              >
              <a-col :span="6">{{ model?.employee?.department || '-' }}</a-col> </a-row
            ><br />
            <a-row>
              <a-col :span="6"
                ><div>{{ $t('table.column.employee') }}:</div></a-col
              >
              <a-col :span="6">{{ model && model.employee.fullName }}</a-col>
              <a-col :span="6"
                ><div>{{ $t('table.column.created-time') }}:</div></a-col
              >
              <a-col :span="6">{{ model && model.createdTime | moment }}</a-col> </a-row
            ><br />
            <a-row>
              <a-col :span="6"
                ><div>{{ $t('table.column.location') }}:</div></a-col
              >
              <a-col :span="6">{{ location }}</a-col>
              <a-col :span="6"
                ><div>{{ $t('table.column.attendance-type') }}:</div></a-col
              >
              <a-col :span="6">{{ model?.attendanceType || '-' }}</a-col> </a-row
            ><br />
            <template v-if="model?.timeInOutType">
              <a-row>
                <a-col :span="6"></a-col>
                <a-col :span="6"></a-col>
                <a-col :span="6"
                  ><div>{{ $t('table.column.time-out-type') }}:</div></a-col
                >
                <a-col :span="6">{{ model?.timeInOutType || '-' }}</a-col> </a-row
              ><br />
            </template>
            <a-row>
              <a-col :span="6"
                ><div>{{ $t('table.column.remarks') }}:</div></a-col
              >
              <a-col :span="6">{{ model?.remarks || '-' }}</a-col>
              <a-col :span="6"
                ><div>{{ $t('table.column.created-by') }}:</div></a-col
              >
              <a-col :span="6">{{ model?.createdBy || '-' }}</a-col>
            </a-row>
          </a-row>
        </div>
        <br />
        <a-divider orientation="left">
          {{ $t('table.dialog.attendance-details') }} </a-divider
        ><br />
        <div :style="{ marginLeft: '20px' }">
          <a-row>
            <div v-for="(item, index) in model?.employeeAttendances" :key="index">
              <a-row>
                <a-col :span="6"
                  ><div>{{ $t('table.column.attendance-type') }}:</div></a-col
                >
                <a-col :span="6">{{ item?.employeeSetupAttendance?.attendanceType || '-' }}</a-col>
                <a-col :span="6"
                  ><div>{{ $t('table.column.entry-time') }}:</div></a-col
                >
                <a-col :span="6">{{ item?.startDateTime ? formatDate(item.startDateTime) : '-' }}</a-col> </a-row
              ><br v-if="index < model?.employeeAttendances.length - 1" />
            </div>
          </a-row>
        </div>
        <br />
        <template v-if="model?.employeeAttendanceUpdate">
          <a-divider orientation="left"> New Attendance Details </a-divider><br />
          <div :style="{ marginLeft: '20px' }">
            <a-row>
              <a-row>
                <a-col :span="6"
                  ><div>{{ $t('table.column.new-attendance-type') }}:</div></a-col
                >
                <a-col :span="6">{{
                  model?.employeeAttendanceUpdate?.employeeSetupAttendance?.attendanceType || '-'
                }}</a-col>
                <a-col :span="6"
                  ><div>{{ $t('table.column.new-date-and-time') }}:</div></a-col
                >
                <a-col :span="6">{{
                  model?.employeeAttendanceUpdate?.startDateTime
                    ? formatDate(model?.employeeAttendanceUpdate?.startDateTime, 'YYYY-MM-DD HH:mm:ss')
                    : '-'
                }}</a-col> </a-row
              ><br />
              <a-row>
                <a-col :span="6"
                  ><div>{{ $t('table.column.remarks') }}:</div></a-col
                >
                <a-col :span="6">{{ model?.employeeAttendanceUpdate?.remarks || '-' }}</a-col>
                <a-col :span="6"
                  ><div>{{ $t('table.column.status') }}:</div></a-col
                >
                <a-col :span="6">
                  <a-badge
                    v-if="model?.status === 'Pending'"
                    color="gold"
                    :text="`${$t('table.column.pending')}`"
                  ></a-badge>
                  <a-badge
                    v-else-if="model?.employeeAttendanceUpdate?.status === 'Approved'"
                    color="#87d068"
                    :text="`${$t('table.column.approved')}`"
                  ></a-badge>
                  <a-badge
                    v-else-if="model?.employeeAttendanceUpdate?.status === 'Rejected'"
                    color="red"
                    :text="`${$t('table.column.rejected')}`"
                  ></a-badge>
                  <a-badge
                    v-else-if="model?.employeeAttendanceUpdate?.status === 'Modified'"
                    color="#f50"
                    :text="`${$t('table.column.modified')}`"
                  ></a-badge>
                </a-col> </a-row
              ><br />
              <a-row>
                <template v-if="model?.status === 'Approved'">
                  <a-col :span="6"
                    ><div>{{ $t('table.column.approved-by') }}:</div></a-col
                  >
                  <a-col :span="6">{{ model?.verifiedBy || '-' }}</a-col>
                </template>
                <template v-else-if="model?.status === 'Rejected'">
                  <a-col :span="6"
                    ><div>{{ $t('table.column.rejected-by') }}:</div></a-col
                  >
                  <a-col :span="6">{{ model?.verifiedBy || '-' }}</a-col>
                </template>
                <a-col :span="6"
                  ><div>{{ $t('table.column.updated-by') }}:</div></a-col
                >
                <a-col :span="6">{{ model?.updatedBy || '-' }}</a-col>
              </a-row>
            </a-row>
          </div>
          <br />
        </template>
        <template v-if="model?.timeInOutType">
          <a-divider orientation="left"> Work Duration Details </a-divider><br />
          <div style="margin-left: 20px; color: black">
            <a-row>
              <a-row>
                <strong>
                  <a-col :span="6"
                    ><div>{{ $t('table.column.work-time-durations') }}:</div></a-col
                  >
                  <a-col :span="6">{{ model?.workTimeDuration || '-' }}</a-col>
                </strong>
                <a-col :span="6"
                  ><div>{{ $t('table.column.status') }}:</div></a-col
                >
                <a-col :span="6">
                  <a-badge
                    v-if="model?.status === 'Pending'"
                    color="gold"
                    :text="`${$t('table.column.pending')}`"
                  ></a-badge>
                  <a-badge
                    v-else-if="model?.status === 'Approved'"
                    color="#87d068"
                    :text="`${$t('table.column.approved')}`"
                  ></a-badge>
                  <a-badge
                    v-else-if="model?.status === 'Rejected'"
                    color="red"
                    :text="`${$t('table.column.rejected')}`"
                  ></a-badge>
                  <a-badge
                    v-else-if="model?.status === 'Modified'"
                    color="#f50"
                    :text="`${$t('table.column.modified')}`"
                  ></a-badge>
                </a-col> </a-row
              ><br />
              <a-row>
                <a-col :span="6">
                  <strong>
                    <div>
                      {{
                        model?.timeInOutType === 'Overtime'
                          ? $t('table.column.over-time-hours')
                          : $t('table.column.short-hours')
                      }}:
                    </div> </strong
                  ><br />
                  <div v-if="model?.status === 'Approved'">{{ $t('table.column.approved-by') }}:</div>
                  <div v-else-if="model?.status === 'Rejected'">{{ $t('table.column.rejected-by') }}:</div>
                  <br />
                  <div>{{ $t('table.column.updated-by') }}:</div>
                </a-col>
                <a-col :span="6">
                  <strong>
                    <div>
                      {{ model?.timeInOutType === 'Overtime' ? model?.otHour || '-' : model?.underTimeHour || '-' }}
                    </div> </strong
                  ><br />
                  <div v-if="model?.status === 'Approved' || model?.status === 'Rejected'">
                    {{ model?.verifiedBy || '-' }}
                  </div>
                  <br />
                  <div>{{ model?.updatedBy || '-' }}</div>
                </a-col>
                <a-col :span="6"
                  ><div>
                    {{
                      model?.timeInOutType === 'Overtime'
                        ? $t('table.column.convert-overtime-to-offset')
                        : $t('table.column.use-offset-hours')
                    }}?
                  </div></a-col
                >
                <a-col :span="6">
                  <a-form-item
                    v-if="isEdit"
                    :help="
                      model?.timeInOutType === 'Overtime'
                        ? 'By selecting “Yes”, you’re about the convert the Overtime Hours to Offset Hours.'
                        : 'Select “Yes” to ustilize offset hours. In the event that there’s not enough balance. The application will be automatically rejected.'
                    "
                  >
                    <a-select
                      v-decorator="[
                        'convertOvertimeToOffsetOrUseOffset',
                        { initialValue: model?.convertToOffset || model?.isUsedOffset || 'Yes' }
                      ]"
                      :options="[
                        { value: 'Yes', label: 'Yes' },
                        { value: 'No', label: 'No' }
                      ]"
                      style="width: 100%"
                      placeholder="Select"
                    />
                  </a-form-item>
                  <template v-else>{{ model?.convertToOffset || model?.isUsedOffset || 'Yes' }}</template>
                </a-col> </a-row
              ><br />
              <!-- <a-row v-if="model?.finalWorkTimeDuration">
                <strong>
                  <a-col :span="6"><div>{{ $t('table.column.final-work-time-durations') }}: </div></a-col>
                  <a-col :span="6">{{ model?.finalWorkTimeDuration || '-' }} </a-col>
                </strong>
              </a-row><br /> -->
            </a-row>
          </div>
        </template>
        <a-form-item style="float: right">
          <a-space>
            <a-button
              v-if="/Pending/gi.test(model?.status) && !isEdit && $store.getters.permissions.includes('main_employee-management_attendance-lists_edit')"
              class="confirm-btn"
              type="primary"
              @click="isEdit = true"
              >{{ $t('table.dialog.edit') }}</a-button
            >
            <template v-if="isEdit || /Approved|Rejected/gi.test(model?.status)">
              <a-button
                v-if="/Pending|Approved/gi.test(model?.status) && $store.getters.permissions.includes('main_employee-management_attendance-lists_view-details_reject')"
                class="confirm-btn"
                type="danger"
                @click="rejectModal.show = true"
                >{{ $t('table.dialog.reject') }}</a-button
              >
              <a-button
                v-if="/Pending|Rejected/gi.test(model?.status) && $store.getters.permissions.includes('main_employee-management_attendance-lists_view-details_approve')"
                class="confirm-btn"
                type="primary"
                @click="handleApproveSubmit"
                >{{ $t('table.dialog.approve') }}</a-button
              >
            </template>
            <a-button class="confirm-btn" type="primary" @click="closeModal">{{ $t('table.dialog.close') }}</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { TreeSelect } from 'ant-design-vue'
// import pick from 'lodash.pick'
import { i18nRender } from '@/locales'
import axios from 'axios'

export default {
  name: 'ViewAttendanceModal',
  data() {
    return {
      // fields: ['createdTime', 'employeeCode', 'employee', 'department', 'remarks', 'location', 'status', 'attendanceType', 'workTimeDurations', 'oTHours'],
      TreeSelect,
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      dp: this.data,
      location: '',
      isEdit: false,
      rejectModal: { show: false, form: this.$form.createForm(this) }
    }
  },
  props: {
    data: {
      type: Array,
      default() {
        return null
      }
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  created() {
    // console.log(res)
    // this.fields.forEach(v => this.form.getFieldDecorator(v))
    // this.$watch('model', () => {
    //   this.model && this.form.setFieldsValue(pick(this.model, this.fields))
    // })
    this.getLocation()
  },
  computed: {
    modalTitle() {
      let title = this.$t('table.dialog.view-attendance-list')
      if (this.model?.timeInOutType === 'Overtime') {
        title = this.$t('table.dialog.view-attendance-list-overtime')
      }
      if (this.model?.timeInOutType === 'Early Time Out') {
        title = this.$t('table.dialog.view-attendance-list-undertime')
      }
      return title
    },
    viewAttendanceModal: {
      get() {
        return this.$store.state.modal.viewAttendanceModal
      },
      set() {
        // just to prevent error log when @cancel
      }
    }
  },
  methods: {
    async getLocation() {
      const response = await axios.get('https://ipapi.co/json/')
      const { city, country_name: country } = response.data
      this.location = `${city}, ${country}`
    },
    closeModal() {
      this.$store.commit('modal/TOGGLE_VIEW_ATTENDANCE_MODAL')
      this.isEdit = false
      this.form.resetFields()
    },
    // async fetchDetail () {
    //   const res = await this.$store.dispatch('api/main/employeeManagement/attendanceList/fetchDetail', this.model?.id)
    //   console.log(res)
    // },
    handleApproveSubmit() {
      const _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log(values)
          _this.showApproveInfo()
        }
      })
    },
    handleRejectSubmit() {
      const _this = this
      this.rejectModal.form.validateFields((err, values) => {
        if (!err) {
          // console.log(values)
          _this.showRejectInfo()
        }
      })
    },
    showApproveInfo() {
      this.$confirm({
        title: i18nRender('table.dialog.approve-msg'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        onOk: async () => {
          try {
            await this.$store.dispatch('api/main/employeeManagement/attendanceList/updateStatusAttendance', {
              id: this.model.id,
              status: 'Approved',
              ...(this.model?.timeInOutType
                ? this.model.timeInOutType === 'Overtime'
                  ? { convertToOffset: this.form.getFieldValue('convertOvertimeToOffsetOrUseOffset') }
                  : { useOffset: this.form.getFieldValue('convertOvertimeToOffsetOrUseOffset') }
                : {})
            })
            this.$notification.open({
              message: this.model?.timeInOutType
                ? this.model.timeInOutType === 'Overtime'
                  ? this.$t('notification.attendance-overtime.approved')
                  : this.$t('notification.attendance-undertime.approved')
                : this.$t('notification.attendance.approved'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
            this.closeModal()
            this.$emit('refreshTable')
          } catch (error) {
            this.$message.error(error.response.data.message)
          }
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    showRejectInfo() {
      this.$confirm({
        title: i18nRender('table.dialog.reject-msg'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        onOk: async () => {
          try {
            await this.$store.dispatch('api/main/employeeManagement/attendanceList/updateStatusAttendance', {
              id: this.model.id,
              status: 'Rejected',
              rejectionRemarks: this.rejectModal.form.getFieldValue('rejectRemarks'),
              ...(this.model?.timeInOutType
                ? this.model.timeInOutType === 'Overtime'
                  ? { convertToOffset: this.form.getFieldValue('convertOvertimeToOffsetOrUseOffset') }
                  : { useOffset: this.form.getFieldValue('convertOvertimeToOffsetOrUseOffset') }
                : {})
            })
            this.$notification.open({
              message: this.model?.timeInOutType
                ? this.model.timeInOutType === 'Overtime'
                  ? this.$t('notification.attendance-overtime.rejected')
                  : this.$t('notification.attendance-undertime.rejected')
                : this.$t('notification.attendance.rejected'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
            this.closeModal()
            this.$emit('refreshTable')
            this.rejectModal.show = false
            this.rejectModal.form.resetFields()
          } catch (error) {
            this.$message.error(error.response.data.message)
          }
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    }
  }
}
</script>

<style lang="less">
.modal-reject-holder {
  .details {
    margin: 0 50px 50px 50px;

    .ant-col {
      text-align: left;
    }
  }
}
</style>
