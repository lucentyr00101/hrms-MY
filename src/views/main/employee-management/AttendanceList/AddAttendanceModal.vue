<template>
  <div>
    <a-modal
      :title="$t('table.dialog.add-attendance')"
      :width="800"
      v-model="displayModal"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      @cancel="closeModal()"
    >
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
        <a-form-item :label="`${$t('table.column.employee')}:`">
          <a-select
            show-search
            optionFilterProp="children"
            :options="employeeDropdown"
            v-decorator="['employee', { rules: [{ required: true, message: $t('error.employee.required') }] }]"
            placeholder="Select"
          >
          </a-select>
        </a-form-item>
        <a-form-item :label="`${$t('table.column.attendance-type')}:`">
          <a-select
            show-search
            optionFilterProp="children"
            :options="attendanceTypeDropdown"
            v-decorator="[
              'attendance-type',
              { rules: [{ required: true, message: $t('error.attendance-type.required') }] }
            ]"
            placeholder="Select"
          >
          </a-select>
        </a-form-item>
        <a-form-item :label="`${$t('table.column.date-and-time')}:`">
          <a-date-picker
            style="width: 100%"
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="Select Time"
            v-decorator="['dateAndTime', { rules: [{ required: true, message: $t('error.date-time.required') }] }]"
          />
        </a-form-item>

        <a-form-item :label="`${$t('table.column.remarks')}:`">
          <a-input
            type="textarea"
            :rows="3"
            :maxLength="100"
            mode="tags"
            placeholder="Autosize height based on content lines="
            v-decorator="['remarks']"
          >
          </a-input
        ></a-form-item>

        <a-form-item :wrapperCol="{ span: 1, offset: 18 }">
          <a-button class="confirm-btn" type="primary" @click="handleSubmit()">{{
            $t('table.dialog.confirm')
          }}</a-button>
        </a-form-item>
      </a-form></a-modal
    >
  </div>
</template>

<script>
import { i18nRender } from '@/locales'
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'WorkShiftModal',
  props: {
    showModal: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  created() {
    this.loadAttendanceDropdown()
    this.loadEmployeeDropdown()
  },
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      workDays2: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      attendanceTypeDropdown: [],
      loadAttendanceDropdown: async () => {
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
      },
      employeeDropdown: [],
      loadEmployeeDropdown: async () => {
        const data = await this.$store.dispatch('api/dropdown/fetchActiveEmployeeDropdown')
        data.data.employeeDetailSmallResponses.forEach((item) => {
          this.employeeDropdown = [
            ...this.employeeDropdown,
            {
              value: item.id,
              label: item.fullName
            }
          ]
        })
        return this.employeeDropdown
      }
    }
  },
  computed: {
    displayModal: {
      get() {
        return this.showModal
      },
      set() {
        // just to prevent error log
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
      this.form.resetFields()
    },
    async handleSubmit() {
      const _this = this
      this.form.validateFields(async (err, values) => {
        if (!err) {
          _this.showInfo()
        }
      })
    },
    showInfo() {
      const _this = this
      this.$confirm({
        title: i18nRender('table.dialog.confirm-msg'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        async onOk() {
          try {
            const data = {
              employeeSetupId: _this.form.getFieldValue('employee'),
              employeeSetupAttendanceTypeId: _this.form.getFieldValue('attendance-type'),
              attendanceDateTime: _this.form.getFieldValue('dateAndTime').format('YYYY-MM-DD HH:mm:ss'),
              remarks: _this.form.getFieldValue('remarks') || ''
            }
            await _this.$store.dispatch('api/main/employeeManagement/attendanceList/addAttendance', data)
            _this.$message.success(i18nRender('table.dialog.attendance-added'))
            _this.closeModal()
            _this.$emit('refreshTable')
          } catch (e) {
            _this.$message.error(e?.response?.data.message)
          }
        },
        onCancel() {
          //
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-modal-body {
  .ant-calendar-picker {
    width: 100%;
  }
}
</style>
