<template>
  <div>
    <a-modal
      :title="action2 !== 'view' ? (action2 === 'add' ? $t('table.dialog.add-work-shift') : $t('table.dialog.edit-work-shift')) : $t('table.dialog.view-work-shift')"
      :width="800"
      v-model="displayModal"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      :destroyOnClose="true"
      :confirm-loading="loading"
      @cancel="closeModal"
    >
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="Repeat Monthly: ">
          <a-switch
            :default-checked="/view|edit/ig.test(action2) ? (currentValue.repeatMonthly === 'Enable' ? true: false) : true"
            @change="(e) => handleChangeStatus(e)"
            v-decorator="['repeatMonthly']"
            :disabled="action2 === 'view'"
          />
        </a-form-item>
        <a-form-item :label="$t('table.column.employee')">
          <a-select
            show-search
            placeholder="Select"
            v-decorator="[
              'employeeSetupId',
              {
                rules: [
                  { required: true, message: `${$t('table.column.employee')} ${$t('error.is-required')}` }
                ],
                initialValue: /view|edit/ig.test(action2) ? currentValue.employee.fullName : ''
              }
            ]"
            :disabled="action2 === 'view'"
          >
            <a-select-option v-for="(employees, index) in dropdown.employee" :key="index" :value="employees.value + index" @click="handleSelectChangeEmployee(employees)">{{ employees.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('table.column.month')">
          <a-select
            show-search
            placeholder="Select month"
            v-decorator="[
              'month',
              {
                rules: [
                  { required: true, message: `${$t('table.column.month')} ${$t('error.is-required')}` }
                ],
                initialValue: /view|edit/ig.test(action2) ? currentValue.month : ''
              }
            ]"
            :disabled="action2 === 'view'"
          >
            <a-select-option v-for="(monthList, index) in months" :key="index" :value="monthList" @click="handleSelectChangeMonth(monthList)">{{ monthList }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="`${$t('table.column.work-hours')}:`">
          <a-input
            @keypress="isNumberDecimal($event)"
            :maxLength="5"
            :placeholder="`${$t('table.column.work-hours')} per Day`"
            v-decorator="[
              'workHours',
              {
                rules: [
                  { required: true, message: `${$t('table.column.work-hours')} ${$t('error.is-required')}` }
                ],
                initialValue: /view|edit/ig.test(action2) ? currentValue.workHours : ''
              }
            ]"
            :disabled="action2 === 'view'"
          >
          </a-input>
        </a-form-item>
        <a-form-item :label="`${$t('table.column.work-days')}:`">
          <a-input
            @keypress="isNumber($event)"
            :maxLength="1"
            :placeholder="`${$t('table.column.work-days')} per Week`"
            v-decorator="[
              'workDaysCount',
              {
                rules: [
                  { required: true, message: `${$t('table.column.work-days')} ${$t('error.is-required')}` }
                ],
                initialValue: /view|edit/ig.test(action2) ? currentValue.workDaysCount : ''
              }
            ]"
            :disabled="action2 === 'view'"
          >
          </a-input>
        </a-form-item>
        <a-form-item label=" ">
          <a-select
            @deselect="handleSelectDeSelectWorkDays"
            mode="multiple"
            style="width: 100%"
            placeholder="Please select"
            v-decorator="[
              'workDays',
              {
                rules: [
                  { required: true, message: 'Please select work day(s)!' },
                  { validator: validateWorkDays }
                ],
                initialValue: /view|edit/ig.test(action2) ? currentValue.workDays : []
              }
            ]"
            :disabled="action2 === 'view'"
          >
            <a-select-option v-for="(workDay, index) in workDays" :key="index" :value="workDay" @click="handleSelectChangeWorkDays">{{ workDay }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('table.column.work-shift')">
          <a-select
            show-search
            placeholder="Select"
            v-decorator="[
              'workShiftSetupId',
              {
                rules: [
                  { required: true, message: `${$t('table.column.work-shift')} ${$t('error.is-required')}` },
                  { validator: validateWorkShift }
                ],
                initialValue: /view|edit/ig.test(action2) ? currentValue.workShift.workShiftType : ''
              }
            ]"
            :disabled="action2 === 'view'"
          >
            <a-select-option v-for="(workShifts, index) in dropdown.workShift" :key="index" :value="workShifts.value + index" @click="handleSelectChangeWorkShift(workShifts)">{{ workShifts.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 1, offset: 18 }">
          <a-button v-if="action2 === 'view'" class="confirm-btn" type="primary" @click="action2 = 'edit'">{{ $t('table.dialog.edit') }}</a-button>
          <a-button v-else-if="/add|edit/ig.test(action2)" class="confirm-btn" type="primary" @click="showConfirm">{{ $t('table.dialog.confirm') }}</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
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
    action: {
      type: String,
      default: () => null
    },
    currentValue: {
      type: Object,
      default: () => null
    },
    dropdown: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      loading: false,
      form: this.$form.createForm(this),
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      status: null,
      employee: null,
      workshift: null,
      workshiftHours: null,
      monthSelected: null
    }
  },
  computed: {
    displayModal: {
      get () {
        return this.showModal
      },
      set () {
        // just to prevent error log
      }
    },
    action2: {
      get () {
          return this.action
      },
      set (val) {
        this.action = val
      }
    }
  },
  watch: {
    'currentValue' (val) {
      this.status = val.repeatMonthly
      this.monthSelected = val.month
      this.employee = val.employee.id
      this.workshift = val.workShift.id
      this.workshiftHours = val.workShift.workShiftHours
    }
  },
  methods: {
    isNumber: function (event) {
      if (!/\d/.test(event.key)) return event.preventDefault()
    },
    isNumberDecimal: function (event) {
      if (!/\d/.test(event.key) && event.key !== '.') return event.preventDefault()
    },
    handleChangeStatus (checked) {
      this.status = checked ? 'Enable' : 'Disable'
    },
    handleSelectChangeMonth (data) {
      this.monthSelected = data
    },
    handleSelectChangeEmployee (data) {
      this.employee = data.id
    },
    handleSelectChangeWorkDays () {
      this.form.setFieldsValue({ workDaysCount: this.form.getFieldValue('workDays').length + 1 })
    },
    handleSelectDeSelectWorkDays () {
      this.form.setFieldsValue({ workDaysCount: this.form.getFieldValue('workDays').length - 1 })
    },
    handleSelectChangeWorkShift (data) {
      this.workshiftHours = data.workShiftHours
      this.workshift = data.id
    },
    closeModal () {
      this.$emit('closeModal')
    },
    async showConfirm () {
      try {
        await this.form.validateFields()
        this.$confirm({
          centered: true,
          title: i18nRender('save.confirm'),
          okText: i18nRender('table.dialog.yes'),
          cancelText: i18nRender('table.dialog.no'),
          onOk: () => this.handleSubmit(),
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />
        })
      } catch (e) {}
    },
    async handleSubmit () {
      try {
        this.loading = true
        const data = {
          ...((this.action === 'edit') ? { id: this.currentValue.id } : {}),
          repeatMonthly: this.action !== 'add' ? this.status : 'Enable',
          employeeSetupId: this.employee,
          workShiftSetupId: this.workshift,
          month: this.monthSelected,
          workHours: this.form.getFieldValue('workHours'),
          workDays: this.form.getFieldValue('workDays')
        }
        try {
          await this.$store.dispatch(`api/main/employeeManagement/workShift/${(this.action === 'edit' ? 'update' : 'add')}`, data)
          this.$notification.open({
            message: (this.action === 'edit') ? this.$t('table.dialog.work-shift-updated') : i18nRender('table.dialog.work-shift-added'),
            icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
          })
          this.closeModal()
        } catch (e) {
          this.$message.error(e.response.data.message)
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    validateWorkDays (rule, value, callback) {
      var workDaysCount = this.form.getFieldValue('workDaysCount').toString()
      var workDays = this.form.getFieldValue('workDays').length.toString()
      if (!value) {
       return callback()
      }
      if (workDaysCount !== '') {
        if (workDaysCount !== workDays) {
          callback(new Error(this.$t('error.work-days.match')))
        }
      }
      callback()
    },
    validateWorkShift (rule, value, callback) {
      var workH = this.form.getFieldValue('workHours')
      if (workH > this.workshiftHours) {
        callback(new Error(this.$t('error.work-hours.greater')))
      }
      callback()
    }
  }
}
</script>
