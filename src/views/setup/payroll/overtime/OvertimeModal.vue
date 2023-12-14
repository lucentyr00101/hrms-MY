<template>
  <a-modal
    :title="
      modal?.action != 'view'
        ? modal?.action === 'add'
          ? $t('table.dialog.add-overtime')
          : $t('table.dialog.view-overtime')
        : $t('table.dialog.view-overtime')
    "
    :width="800"
    v-model="modal.show"
    :cancelButtonProps="{ style: { display: 'none' } }"
    :okButtonProps="{ style: { display: 'none' } }"
    @cancel="closeModal()"
  >
    <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
      <a-form-item :label="`${$t('table.column.overtime-type')}: `">
        <a-input
          :maxLength="25"
          v-decorator="[
            'payrollOvertimeType',
            {
              rules: [
                { required: true, message: $t('error.overtime-type.required') },
                { validator: validateOvertimeType }
              ]
            }
          ]"
          :disabled="modal?.action === 'view'"
        />
      </a-form-item>
      <a-form-item :label="`${$t('table.column.descriptions')}: `">
        <a-input
          type="textarea"
          mode="tags"
          :maxLength="100"
          style="width: 100%"
          v-decorator="['descriptions']"
          :disabled="modal?.action === 'view'"
        />
      </a-form-item>
      <a-form-item :label="`${$t('table.column.rate')}: `">
        <a-input
          :maxLength="6"
          v-decorator="[
            'rate',
            { rules: [{ required: true, message: $t('error.status-rate.required') }, { validator: validate }] }
          ]"
          :disabled="modal?.action === 'view'"
        />
      </a-form-item>
      <a-form-item :label="`${$t('table.column.unit-type')}: `">
        <a-select
          v-decorator="['unitType', { rules: [{ required: true, message: $t('error.unit-type.required') }] }]"
          :disabled="modal?.action === 'view'"
        >
          <a-select-option value="Hourly">Hourly</a-select-option>
          <a-select-option value="Daily">Daily</a-select-option>
        </a-select>
      </a-form-item>
      <a-row style="width: 440px; margin-left: 240px">
        <a-col v-for="(item, itemIndex) in checkboxList" :key="itemIndex" :span="8">
          <a-form-item style="margin-bottom: 0px" class="checkboxForm">
            <a-checkbox
              @change="(e) => handleChange(item)"
              v-decorator="[`${item.label}`]"
              :checked="item.checked === 'True'"
              style="margin-left: 0px"
              :disabled="modal?.action === 'view'"
            >
              {{ item.label }}
            </a-checkbox>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item :wrapperCol="{ span: 12, offset: 17 }" :style="{ margin: '20px 0 0 0' }">
        <!-- <a-button style="margin-right: 20px; margin-top: 25px" @click="closeModal()">{{ $t('table.dialog.cancel') }}</a-button> -->
        <a-button
          v-if="modal?.action === 'view'"
          class="confirm-btn"
          type="primary"
          @click="mainParent?.openOvertimeModal({ ...modal, action: 'update' })"
          >{{ $t('table.dialog.edit') }}</a-button
        >
        <a-button
          v-else-if="/add|update/gi.test(modal?.action)"
          class="confirm-btn"
          type="primary"
          @click="handleSubmit"
          >{{ $t('table.dialog.confirm') }}</a-button
        >
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { i18nRender } from '@/locales'
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'OvertimeModal',
  data() {
    return {
      visible: false,
      form: this.$form.createForm(this),
      fields: ['payrollOvertimeType', 'descriptions', 'rate', 'unitType', 'epf', 'eis', 'socso', 'tax']
    }
  },
  props: {
    modal: {
      type: Object,
      default: () => ({ show: false })
    }
  },
  async created() {
    this.fields.forEach((v) => this.form.getFieldDecorator(v))
  },
  computed: {
    mainParent() {
      return this.getParent('SetupPayrollOvertime')
    },
    checkboxList() {
      return [
        { key: 0, label: this.$t('table.column.epf'), checked: 'False' },
        { key: 1, label: this.$t('table.column.socso'), checked: 'False' },
        { key: 2, label: this.$t('table.column.eis'), checked: 'False' },
        { key: 3, label: this.$t('table.column.tax'), checked: 'False' }
      ]
    }
  },
  watch: {
    modal(to) {
      if (to.show) {
        if (/view|update/gi.test(to.action) && to?.data) {
          const { payrollOvertimeType, descriptions, rate, unitType, epf, socso, eis, tax } = to.data
          this.form.setFieldsValue({ payrollOvertimeType, descriptions, rate: String(rate), unitType })
          this.checkboxList[0].checked = epf
          this.checkboxList[1].checked = socso
          this.checkboxList[2].checked = eis
          this.checkboxList[3].checked = tax
        }
      }
    }
  },
  methods: {
    handleChange(data) {
      this.checkboxList.forEach((item) => {
        if (item.key === data.key) {
          if (item.checked === 'False') {
            item.checked = 'True'
          } else {
            item.checked = 'False'
          }
        }
      })
    },
    closeModal() {
      this.form.resetFields()
      this.checkboxList.forEach((item) => {
        item.checked = 'False'
      })
    },
    handleSubmit(result) {
      this.form.validateFields((err, values) => !err && this.showInfo(result))
    },
    showNotification() {
      this.$notification.open({
        message:
          this.modal && this.modal.data?.id === undefined
            ? this.$t('table.dialog.overtime-added')
            : this.$t('table.dialog.overtime-updated'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo() {
      console.log('te', this.modal.data.id)
      const _this = this
      this.$confirm({
        title: _this.$t('table.dialog.confirm-msg'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,

        async onOk() {
          const data = {
            // ...((_this.modal.action === 'update') ? { id: _this.modal.data.id } : {}),
            payrollOvertimeType: _this.form.getFieldValue('payrollOvertimeType'),
            descriptions: _this.form.getFieldValue('descriptions') || '',
            rate: _this.form.getFieldValue('rate'),
            unitType: _this.form.getFieldValue('unitType'),
            epf: _this.checkboxList[0].checked,
            socso: _this.checkboxList[1].checked,
            eis: _this.checkboxList[2].checked,
            tax: _this.checkboxList[3].checked,
            status: 'Enable'
          }
          console.log('onOk', data)

          try {
            _this.modal && _this.modal.data?.id === undefined
              ? await _this.$store.dispatch('api/setup/payroll/overtime/addOvertime', data)
              : await _this.$store.dispatch('api/setup/payroll/overtime/updateOvertime', {
                  id: _this.modal.data.id,
                  ...data
                })
            _this.showNotification()
            _this.closeModal()
            _this.mainParent.refreshTable()
          } catch (e) {
            _this.$message.error(e.response.data.message)
          }
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    async validateOvertimeType(rule, value, callback) {
      const res = await this.$store.dispatch('api/setup/payroll/overtime/fetchOvertimeList')
      res.data.data.forEach((el) => {
        if (el.id !== this.modal.data.id) {
          if (el.payrollOvertimeType === value) {
            callback(new Error(this.$t('table.column.overtime-type') + this.$t('error.already-exists')))
          }
        }
      })
      callback()
    },
    validate(rule, value, callback) {
      const regex = /^\d*\.?\d*$/
      const regexDp = /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/

      if (value && !regex.test(value)) {
        callback(new Error(this.$t('error.nan')))
      } else {
        if (value && !regexDp.test(value)) {
          callback(new Error(this.$t('error.2dp')))
        } else if (value > 999.99) {
          callback(new Error(this.$t('error.upto6char')))
        } else {
          callback()
        }
      }
    }
  }
}
</script>

<style>
.checkboxForm .ant-form-item-control {
  width: 150px;
}
</style>
