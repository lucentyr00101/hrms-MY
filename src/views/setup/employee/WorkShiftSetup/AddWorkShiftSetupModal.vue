<template>
  <div>
    <a-modal
      :title="$t('table.dialog.add-work-shift-type')"
      :width="800"
      v-model="AddWorkShiftSetupModal"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      @cancel="closeModal()"
      destroyOnClose
    >
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" @submit="handleSubmit">
        <a-form-item :label="$t('table.column.work-shift-type')">
          <a-input
            :maxLength="25"
            v-decorator="[
              'workShiftType',
              {
                rules: [
                  { required: true, message: `${$t('table.column.work-shift-type')} ${$t('error.is-required')}` },
                  { validator: validateWorkShiftType }
                ]
              }
            ]"
          >
          </a-input
        ></a-form-item>
        <a-row>
          <a-col :span="18" :push="6">
            <a-row>
              <a-col :span="10">
                <a-form-item :style="{ width: '150%' }">
                  <a-time-picker
                    :style="{ width: '230px' }"
                    placeholder="Start Time"
                    v-decorator="[
                      'startTime',
                      {
                        rules: [
                          { required: true, message: `${$t('table.column.work-time')} ${$t('error.is-required')}` },
                          { validator: validateTime }
                        ]
                      }
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="1" :style="{ textAlign: 'center', marginTop: '9px' }">
                <span> - </span>
              </a-col>
              <a-col :span="10">
                <a-form-item :style="{ width: '150%' }">
                  <a-time-picker
                    :style="{ width: '234px' }"
                    placeholder="End Time"
                    v-decorator="[
                      'endTime',
                      {
                        rules: [
                          { required: true, message: `${$t('table.column.work-time')} ${$t('error.is-required')}` },
                          { validator: validateTime }
                        ]
                      }
                    ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="6" :pull="18">
            <a-row :style="{ width: '100%', marginLeft: '90px' }">
              <a-col :span="1" :style="{ marginTop: '7px' }">
                <span class="ant-form-item-required"></span>
              </a-col>
              <a-col :span="22" :style="{ marginTop: '8px' }">
                <label :style="{ color: 'black' }">&nbsp;Work Time&nbsp;:</label>
                <!-- <a-form-item :style="{border: 'solid cyan'}" :label="`work time  `" ></a-form-item> -->
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-form-item :label="$t('table.dialog.work-shift-rate')">
          <a-select
            :options="dropdownWorkShiftRateType"
            v-decorator="[
              'workShiftRate',
              {
                rules: [{ required: true, message: `${$t('table.dialog.work-shift-rate')} ${$t('error.is-required')}` }]
              }
            ]"
            placeholder="Select"
            @change="handleSelectChange"
          >
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('table.column.remarks')">
          <a-input :maxLength="100" type="textarea" mode="tags" style="width: 100%" v-decorator="['remarks']"> </a-input
        ></a-form-item>
        <a-form-item :label="$t('table.dialog.late-grace-period')">
          <a-input :maxLength="3" style="width: 100%" v-decorator="['lateGracePeriod']">
            <a-select
              slot="addonAfter"
              v-decorator="['lateGracePeriodUnit', { initialValue: 'hourly' }]"
              style="width: 100px"
            >
              <a-select-option value="hourly"> hourly </a-select-option>
              <a-select-option value="minutes"> minutes </a-select-option>
            </a-select>
          </a-input>
        </a-form-item>
        <a-form-item :label="$t('table.dialog.late-deduction-by')">
          <a-input :maxLength="3" style="width: 100%" v-decorator="['deductionTime']" @change="onChange">
            <a-select
              slot="addonAfter"
              v-decorator="['deductionTimeUnit', { initialValue: 'hourly' }]"
              style="width: 100px"
            >
              <a-select-option value="hourly"> hourly </a-select-option>
              <a-select-option value="minutes"> minutes </a-select-option>
            </a-select>
          </a-input>
        </a-form-item>
        <a-form-item :label="$t('table.dialog.late-deduction-amount')">
          <a-input :maxLength="10" v-decorator="['deductionAmount']" :addon-after="currency" @change="onChange"> </a-input>
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 1, offset: 19 }" :style="{ marginLeft: '50px' }">
          <a-button class="confirm-btn" type="primary" @click="handleSubmit()">{{
            $t('table.dialog.confirm')
          }}</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { i18nRender } from '@/locales'
import InfoCircle from '@/assets/info-circle.svg'
import { fetchList } from '@/api/setup/employee/work-shift-setup'

export default {
  name: 'AddWorkShiftSetupModal',

  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      dropdownWorkShiftRateType: [],

      loadWorkShiftRateType: async () => {
        const data = await this.$store.dispatch('api/setup/employee/workShiftSetup/dropdownWorkShiftRateType')
        this.test = data.data.workShiftRateType
        console.log(data)
        this.test.forEach((item) => {
          this.dropdownWorkShiftRateType = [
            ...this.dropdownWorkShiftRateType,
            {
              value: item.workShiftRate,
              label: item.workShiftRateType
            }
          ]
        })
        return this.dropdownWorkShiftRateType
      }
    }
  },

  props: {
    currency: {
      type: String,
      default() {
        return null
      }
    }
  },
  computed: {
    AddWorkShiftSetupModal: {
      get() {
        return this.$store.state.modal.AddWorkShiftSetupModal
      },
      set() {
        // just to prevent error log when @cancel
      }
    }
  },
  created() {
    this.loadWorkShiftRateType()
  },
  methods: {
    handleSelectChange(e) {
      console.log(e)
    },
    onChange(e) {
      const { id, value } = e.target
      this.result = value.replace(/[^0-9.]/gi, '')
      e.target.value = this.result
      console.log(id)
    },
    async validateWorkShiftType(rule, value, callback) {
      const res = await fetchList()
      res.data.data.forEach((el) => {
        if (el.workShiftType === value) {
          callback(new Error(this.$t('table.column.work-shift-type') + this.$t('error.already-exists')))
        }
      })
      callback()
    },
    validateTime(rule, value, callback) {
      const startT = this.form.getFieldValue('startTime')
      const endT = this.form.getFieldValue('endTime')
      if (startT >= endT) {
        if (rule.field === 'startTime') {
          callback(new Error(this.$t('error.start-time.later')))
        } else if (rule.field === 'endTime') {
          callback(new Error(this.$t('error.end-time.earlier')))
        }
      }
      callback()
    },
    showNotification() {
      this.$notification.open({
        message: i18nRender('notification.work-shift-setup.added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    closeModal() {
      this.$store.commit('modal/TOGGLE_ADD_WORK_SHIFT_SETUP_MODAL')
      this.form.resetFields()
    },
    async handleSubmit() {
      const _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
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
              workShiftType: _this.form.getFieldValue('workShiftType'),
              workShiftRate: _this.form.getFieldValue('workShiftRate'),
              startTime: _this.form.getFieldValue('startTime').format('HH:mm:ss'),
              endTime: _this.form.getFieldValue('endTime').format('HH:mm:ss'),
              remarks: _this.form.getFieldValue('remarks') || null,
              deductionTime: _this.form.getFieldValue('deductionTime') || null,
              deductionTimeUnit: _this.form.getFieldValue('deductionTimeUnit'),
              deductionAmount: _this.form.getFieldValue('deductionAmount') || null,
              lateGracePeriod: _this.form.getFieldValue('lateGracePeriod') || null,
              lateGracePeriodUnit: _this.form.getFieldValue('lateGracePeriodUnit')
            }
            console.log('data', data)
            try {
              await _this.$store.dispatch('api/setup/employee/workShiftSetup/addWorkShiftSetup', data)
              _this.showNotification()
              _this.closeModal()
              _this.$emit('refreshTable')
            } catch (e) {
              _this.$message.error(e.response.data.message)
            }
          } catch (e) {
            console.log(e)
          }
        }
      })
    }
  }
}
</script>
