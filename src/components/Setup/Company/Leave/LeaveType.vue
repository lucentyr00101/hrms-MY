<template>
  <div>
    <a-modal
      centered
      :width="900"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      :visible="addLeaveTypeModal"
      :destroyOnClose="true"
      :title="isEdit ? $t('table.dialog.view-leave-type') : $t('table.dialog.add-leave-type')"
      :confirm-loading="loading"
      @cancel="closeModal"
    >
      <a-form :form="form" :label-col="{ span: 7 }" :wrapper-col="{ span: 11 }" class="custom-ant-form-item">
        <a-form-item label="Leave Type: ">
          <a-input
            :maxLength="25"
            v-decorator="[
              'leaveType',
              {
                rules: [{ required: true, message: $t('error.leave-type.required') }]
              }
            ]"
            placeholder="example"
          >
          </a-input>
        </a-form-item>
        <a-form-item label="Gender: ">
          <a-radio-group
            v-decorator="[
              'gender',
              {
                rules: [{ required: true, message: $t('error.gender.required') }]
              }
            ]"
          >
            <a-radio value="Both">Both</a-radio>
            <a-radio value="Male">Male</a-radio>
            <a-radio value="Female">Female</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="Descriptions:">
          <a-input
            type="textarea"
            mode="tags"
            style="width: 100%"
            placeholder="Autoheight based on content lines="
            v-decorator="['descriptions']"
            :maxLength="100"
          >
          </a-input>
        </a-form-item>
        <a-form-item :wrapperCol="{ offset: 7 }">
          <a-checkbox v-decorator="['limited', { valuePropName: 'checked' }]">Limited?</a-checkbox>
        </a-form-item>
        <a-form-item :wrapperCol="{ offset: 7 }">
          <a-checkbox v-decorator="['unpaidLeave', { valuePropName: 'checked' }]">Unpaid Leave?</a-checkbox>
          <a-checkbox v-decorator="['allowCarryForward', { valuePropName: 'checked' }]"
            >Allow Carry Forward?</a-checkbox
          >
        </a-form-item>
        <a-form-item :wrapperCol="{ offset: 7, span: 12 }">
          <a-checkbox v-decorator="['isMaxDay', { valuePropName: 'checked' }]">
            Maximum of
            <a-input-number
              v-decorator="[
                'maxDay',
                {
                  rules: [{ required: form.getFieldValue('isMaxDay'), message: '' }]
                }
              ]"
            />
            days of previous year's leave balance can be carry forward to the following year.
          </a-checkbox>
        </a-form-item>
        <a-form-item :wrapperCol="{ offset: 7, span: 12 }">
          <a-checkbox v-decorator="['isConsumedBefore', { valuePropName: 'checked' }]">
            Leave balance carry forward must be consumed before
            <a-date-picker
              v-decorator="[
                'consumedBefore',
                {
                  rules: [{ required: form.getFieldValue('isConsumedBefore'), message: '' }]
                }
              ]"
            />
            , or else it will be forfeited.
          </a-checkbox>
        </a-form-item>
        <a-form-item :label="`Calculation Year Of Service by: `" :wrapper-col="{ span: 11 }">
          <a-select :disabled="disabled" placeholder="Select" v-decorator="['calculationYearOfService',
            {
              rules: [
                { required: true, message: $t('error.calculation-year.required') }
              ]
            }]">
            <a-select-option v-for="(yearOfServiceType, index) in yearOfServiceTypes.yearOfServiceType" :key="index" :value="yearOfServiceType.yearOfServiceType">{{ yearOfServiceType.yearOfServiceType }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="`Leave Round Up: `" :wrapper-col="{ span: 11 }">
          <a-select
            :disabled="disabled"
            placeholder="Select"
            v-decorator="[
              'leaveRoundUp',
              {
                rules: [{ required: true, message: $t('error.leave-round-up.required') }]
              }
            ]"
          >
            <a-select-option
              v-for="(leaveRoundUpType, index) in leaveRoundUpTypes.leaveRoundUpType"
              :key="index"
              :value="leaveRoundUpType.leaveRoundUpType"
              >{{ leaveRoundUpType.leaveRoundUpType }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item :label="`Leave Calculation Method: `" :wrapper-col="{ span: 11 }">
          <a-select
            :disabled="disabled"
            placeholder="Select"
            v-decorator="[
              'leaveCalculationMethod',
              {
                rules: [{ required: true, message: $t('error.leave-calculation-method.required') }]
              }
            ]"
          >
            <a-select-option
              v-for="(leaveCalculationMethodType, index) in leaveCalculationMethodTypes.leaveCalculationMethodType"
              :key="index"
              :value="leaveCalculationMethodType.leaveCalculationMethodType"
              >{{ leaveCalculationMethodType.leaveCalculationMethodType }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="Apply Leave Type: ">
          <a-radio-group
            v-decorator="[
              'applyLeaveType',
              {
                rules: [{ required: true, message: '' }]
              }
            ]"
          >
            <a-radio :value="true">Use Entitlement Days</a-radio>
            <a-radio :value="false">Use Earned Days</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="Unpaid Leave Per Day Calculation: " :wrapper-col="{ span: 14 }">
          <a-radio-group
            v-decorator="[
              'unpaidLeaveCalculation',
              {
                rules: [{ required: true, message: '' }]
              }
            ]"
          >
            <a-radio :value="true">Use Working Days</a-radio>
            <a-radio :value="false">Use Number of Days in the calendar month</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="Paid Leave Per Day Calculation: " :wrapper-col="{ span: 14 }">
          <a-radio-group
            v-decorator="[
              'paidLeaveCalculation',
              {
                rules: [{ required: true, message: '' }]
              }
            ]"
          >
            <a-radio :value="true">Use Working Days</a-radio>
            <a-radio :value="false">Use Number of Days in the calendar month</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-row v-if="hasError">
          <a-col :offset="7">
            <span class="error">{{ $t('table.dialog.column-validate-msg') }}</span>
          </a-col>
        </a-row>
        <a-form-item :wrapperCol="{ offset: 21 }">
          <a-button class="confirm-btn" type="primary" @click="showConfirm()">{{
            $t('table.dialog.confirm')
          }}</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { i18nRender } from '@/locales'
import { mapGetters } from 'vuex'
import InfoCircle from '@/assets/info-circle.svg'
import { type } from '@/api/dictionary'
import { pick } from 'lodash'

const fields = [
  'leaveType',
  'gender',
  'descriptions',
  'limited',
  'unpaidLeave',
  'allowCarryForward',
  'isMaxDay',
  'maxDay',
  'isConsumedBefore',
  'consumedBefore',
  'calculationYearOfService',
  'leaveRoundUp',
  'leaveCalculationMethod',
  'applyLeaveType',
  'unpaidLeaveCalculation',
  'paidLeaveCalculation',
  'status'
]

const checkboxAndRadioFields = [
  'limited',
  'unpaidLeave',
  'allowCarryForward',
  'isMaxDay',
  'isConsumedBefore',
  'applyLeaveType',
  'unpaidLeaveCalculation',
  'paidLeaveCalculation'
]

export default {
  name: 'LeaveType',
  props: {
    currentRow: {
      type: Object,
      default: () => null
    },
    action: {
      type: String,
      default: () => null
    }
  },
  data() {
    return {
      loading: false,
      hasError: false,
      formLayout: 'horizontal',
      yearOfServiceTypes: [],
      leaveRoundUpTypes: [],
      leaveCalculationMethodTypes: [],
      form: this.$form.createForm(this, { name: 'addLeaveType' })
    }
  },
  async created() {
    this.yearOfServiceTypes = await this.$store.dispatch('api/setup/dictionary/getDropdownValues', type.YEAR_SERVICE)
    this.leaveRoundUpTypes = await this.$store.dispatch('api/setup/dictionary/getDropdownValues', type.LEAVE_ROUND_UP)
    this.leaveCalculationMethodTypes = await this.$store.dispatch(
      'api/setup/dictionary/getDropdownValues',
      type.LEAVE_CALCULATION_METHOD
    )
  },
  watch: {
    addLeaveTypeModal() {
      this.hasError = false
      fields.forEach((v) => this.form.getFieldDecorator(v))
      if (this.isEdit) {
        const updatedCurrentRow = pick(this.currentRow, fields)
        for (const key in updatedCurrentRow) {
          if (updatedCurrentRow.hasOwnProperty(key) && checkboxAndRadioFields.indexOf(key) > -1) {
            updatedCurrentRow[key] = updatedCurrentRow[key] === 'True'
          }
        }
        this.form.setFieldsValue(updatedCurrentRow)
      } else {
        this.form.setFieldsValue({
          applyLeaveType: true,
          unpaidLeaveCalculation: true,
          paidLeaveCalculation: true
        })
      }
    }
  },
  computed: {
    ...mapGetters('modal', ['addLeaveTypeModal']),
    isEdit() {
      return this.action === 'edit'
    }
  },
  methods: {
    closeModal() {
      this.$store.commit('modal/TOGGLE_ADD_LEAVE_TYPE_MODAL')
      this.form.resetFields()
    },
    async showConfirm() {
      try {
        await this.form.validateFields()
        this.hasError = false
        this.$confirm({
          centered: true,
          title: i18nRender('save.confirm'),
          okText: i18nRender('table.dialog.yes'),
          cancelText: i18nRender('table.dialog.no'),
          onOk: () => this.handleSubmit(),
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />
        })
      } catch (e) {
        this.hasError = true
      }
    },
    convertBooleanToString(value) {
      return value ? 'True' : 'False'
    },
    async handleSubmit() {
      try {
        this.loading = true
        const data = {
          id: this.isEdit ? this.currentRow?.id : undefined,
          leaveType: this.form.getFieldValue('leaveType'),
          gender: this.form.getFieldValue('gender'),
          descriptions: this.form.getFieldValue('descriptions'),
          limited: this.convertBooleanToString(this.form.getFieldValue('limited')),
          unpaidLeave: this.convertBooleanToString(this.form.getFieldValue('unpaidLeave')),
          allowCarryForward: this.convertBooleanToString(this.form.getFieldValue('allowCarryForward')),
          isMaxDay: this.convertBooleanToString(this.form.getFieldValue('isMaxDay')),
          maxDay: this.form.getFieldValue('maxDay'),
          isConsumedBefore: this.convertBooleanToString(this.form.getFieldValue('isConsumedBefore')),
          consumedBefore: this.form.getFieldValue('consumedBefore'),
          calculationYearOfService: this.form.getFieldValue('calculationYearOfService'),
          leaveRoundUp: this.form.getFieldValue('leaveRoundUp'),
          leaveCalculationMethod: this.form.getFieldValue('leaveCalculationMethod'),
          applyLeaveType: this.convertBooleanToString(this.form.getFieldValue('applyLeaveType')),
          unpaidLeaveCalculation: this.convertBooleanToString(this.form.getFieldValue('unpaidLeaveCalculation')),
          paidLeaveCalculation: this.convertBooleanToString(this.form.getFieldValue('paidLeaveCalculation')),
          status: this.isEdit ? this.currentRow?.status : 'Enable'
        }
        try {
          if (this.isEdit) {
            await this.$store.dispatch('api/setup/company/leaveType/updateLeaveType', data)
          } else {
            await this.$store.dispatch('api/setup/company/leaveType/addLeaveType', data)
          }
          this.$notification.open({
            message: i18nRender(this.isEdit ? 'notification.leave-type.updated' : 'notification.leave-type.added'),
            icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
          })
          this.closeModal()
          this.$emit('refreshTable')
        } catch (e) {
          this.$message.error(e.response.data.message)
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    }
  }
}
</script>

<style>
.custom-ant-form-item .ant-col-12 {
  width: 53%;
}
.error {
  color: #f5222d;
}
</style>
