<template>
  <div>
    <a-modal
      :title="modalTitle"
      v-model="modal.show"
      :width="600"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      :maskClosable="false"
      @cancel="closeModal()"
    >
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item :label="`${$t('table.column.holiday')}: `" style="display: flex">
          <a-input
            :disabled="modal?.action === 'view'"
            :maxLength="25"
            v-decorator="['holiday', { rules: [{ required: true, message: $t('error.holiday.required') }] }]"
          />
        </a-form-item>
        <a-row>
          <a-col :span="18" :push="6">
            <a-row :style="{ marginLeft: '40px;' }">
              <a-col :span="10">
                <a-form-item style="width: 150%">
                  <a-date-picker
                    :disabled="modal?.action === 'view'"
                    :placeholder="$t('table.column.start-date2')"
                    v-decorator="[
                      'fromDate',
                      {
                        rules: [
                          { required: true, message: this.$t('error.startDate.required') },
                          { validator: validate }
                        ]
                      }
                    ]"
                  />
                </a-form-item> </a-col
              >&nbsp;
              <a-col :span="1" :style="{ textAlign: 'center', marginTop: '9px' }">
                <span> - </span>
              </a-col>
              <a-col :span="10">
                <a-form-item style="width: 150%">
                  <a-date-picker
                    :disabled="modal?.action === 'view'"
                    :placeholder="$t('table.column.end-date2')"
                    v-decorator="[
                      'toDate',
                      {
                        rules: [{ required: true, message: this.$t('error.endDate.required') }, { validator: validate }]
                      }
                    ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="6" :pull="15">
            <a-row style="margin-left: 11px">
              <a-col :span="2" :style="{ textAlign: 'right', marginTop: '9px' }">
                <span class="ant-form-item-required"></span>
              </a-col>
              <a-col :span="22">
                <a-form-item :label="`${$t('table.column.date')} `"
                  ><span style="color: black">&nbsp;:</span></a-form-item
                >
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-form-item :label="`${$t('table.column.holiday-type')}: `">
          <a-select
            :disabled="modal?.action === 'view'"
            v-decorator="['holidayType', { rules: [{ required: true, message: $t('error.holiday-type.required') }] }]"
          >
            <a-select-option v-for="(item, index) in holidayTypes" :key="index" :value="item.holidayType">{{
              item.holidayType
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="`${$t('table.column.descriptions')}: `">
          <a-textarea
            :disabled="modal?.action === 'view'"
            :autoSize="{ minRows: 3, maxRows: 6 }"
            :maxLength="100"
            v-decorator="['descriptions']"
          />
        </a-form-item>
        <div style="display: flex; align-items: center; justify-content: right; padding-right: 40px">
          <a-form-item style="width: 280px">
            <a-checkbox
              :disabled="modal?.action === 'view'"
              v-decorator="[
                'yearly',
                {
                  valuePropName: 'checked',
                  initialValue: isRepeat
                }
              ]"
            >
              {{ $t('table.dialog.repeated-yearly') }}
            </a-checkbox>
          </a-form-item>
          <a-form-item>
            <a-button
              v-if="modal?.action === 'view'"
              class="confirm-btn"
              type="primary"
              @click="mainParent?.modalHandler({ ...modal, action: 'edit' })"
              >{{ $t('table.dialog.edit') }}</a-button
            >
            <a-button
              v-else-if="/add|edit/gi.test(modal?.action)"
              class="confirm-btn"
              type="primary"
              @click="handleSubmit()"
              >{{ $t('table.dialog.confirm') }}</a-button
            >
          </a-form-item>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import InfoCircle from '@/assets/info-circle.svg'
import { type } from '@/api/dictionary'

export default {
  name: 'MasterListModal',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      fields: ['holiday', 'descriptions', 'holidayType', 'fromDate', 'toDate'],
      holidayTypes: [],
      isRepeat: false
    }
  },
  async created() {
    this.holidayTypes = (
      await this.$store.dispatch('api/setup/dictionary/getDropdownValues', type.HOLIDAY)
    ).holidayTypes
  },
  computed: {
    mainParent() {
      return this.getParent('SetupCalendarMasterList')
    },
    modalTitle() {
      return this.modal?.action === 'view'
        ? this.$t('table.dialog.view-master-list')
        : this.modal?.action === 'edit'
        ? this.$t('table.dialog.edit-master-list')
        : this.$t('table.dialog.add-master-list')
    }
  },
  watch: {
    modal(to) {
      this.isRepeat = false
      if (to.show && to.action !== 'add' && to?.data) {
        this.fields.forEach((v) => this.form.getFieldDecorator(v))
        const { holiday, descriptions, holidayType, fromDate, toDate, yearly } = to.data
        this.form.setFieldsValue({
          holiday,
          descriptions,
          holidayType,
          fromDate: moment(fromDate),
          toDate: moment(toDate)
        })
        this.isRepeat = yearly === 'Yes'
      }
    }
  },
  methods: {
    closeModal() {
      this.form.resetFields()
    },
    handleSubmit() {
      this.form.validateFields((err, values) => !err && this.showInfo())
    },
    showNotification() {
      this.$notification.open({
        message:
          this.modal.action === 'edit'
            ? this.$t('notification.calendar.masterlist.updated')
            : this.$t('notification.calendar.masterlist.added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo() {
      this.$confirm({
        title: this.$t('table.dialog.confirm-msg'),
        okText: this.$t('table.dialog.yes'),
        cancelText: this.$t('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          const data = {
            ...(this.modal.action === 'edit' ? { id: this.modal.data.id } : {}),
            holiday: this.form.getFieldValue('holiday'),
            fromDate: moment(this.form.getFieldValue('fromDate')).format('YYYY-MM-DD'),
            toDate: moment(this.form.getFieldValue('toDate')).format('YYYY-MM-DD'),
            descriptions: this.form.getFieldValue('descriptions') || '',
            status: this.modal?.data?.status || 'Enable',
            yearly: this.form.getFieldValue('yearly') ? 'Yes' : 'No',
            holidayType: this.form.getFieldValue('holidayType')
          }
          try {
            await this.$store.dispatch(
              `api/setup/company/calendarMasterList/${this.modal.action === 'edit' ? 'update' : 'add'}`,
              data
            )
            this.showNotification()
            this.closeModal()
            this.$emit('refreshTable')
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
        }
      })
    },
    validate(rule, value, callback) {
      const startD = this.form.getFieldValue('fromDate') || null
      const endD = this.form.getFieldValue('toDate') || null
      if (startD && endD && !moment(startD).isBefore(moment(endD)) && !startD.isSame(endD, 'day')) {
        if (rule.field === 'fromDate') callback(new Error(this.$t('error.startDate.required')))
        else if (rule.field === 'toDate') callback(new Error(this.$t('error.endDate.required')))
      }
      callback()
    }
  }
}
</script>
