<template>
  <div>
    <a-modal
      :title="formTitle"
      :width="700"
      v-model="modal.show"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      @cancel="closeModal()"
    >
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }" @submit="handleSubmit">
        <a-form-item :label="`${$t('table.column.claim-type')}: `">
          <a-select
            v-decorator="['claimTypeId', { rules: [{ required: true, message: $t('error.form.claim-type.required') }] }]"
            :options="claimTypeList"
            placeholder="Select"
            :disabled="modal?.action === 'view'"
          />
        </a-form-item>

        <a-form-item :label="`${$t('table.column.per-visit-limit')}: `">
          <a-input
            v-decorator="[
              'perVisitLimit',
              { rules: [
                  { required: true, message: $t('error.form.per-visit-limit.required') },
                  { max: 10, message: $t('error.max-10-numerical-characters') }
                ]
              }
            ]"
            type="number"
            style="width: 100%"
            placeholder="example"
            min="0"
            step="1"
            :disabled="modal?.action === 'view'"
          />
        </a-form-item>

        <a-form-item :label="`${$t('table.column.monthly-limit')}: `">
          <a-input
            v-decorator="[
              'monthlyLimit',
              { rules: [
                  { required: true, message: $t('error.form.monthly-limit.required') },
                  { max: 10, message: $t('error.max-10-numerical-characters') }
                ]
              }
            ]"
            type="number"
            style="width: 100%"
            placeholder="example"
            min="0"
            step="1"
            :disabled="modal?.action === 'view'"
          />
        </a-form-item>

        <a-form-item :label="`${$t('table.column.yearly-limit')}: `">
          <a-input
            v-decorator="[
              'yearlyLimit',
              { rules: [
                  { required: true, message: $t('error.form.yearly-limit.required') },
                  { max: 10, message: $t('error.max-10-numerical-characters') }
                ]
              }
            ]"
            type="number"
            style="width: 100%"
            placeholder="example"
            min="0"
            step="1"
            :disabled="modal?.action === 'view'"
          />
        </a-form-item>

        <a-form-item :label="`${$t('table.column.payout-schedule')}: `">
          <a-select
            v-decorator="['payoutSchedule', { rules: [{ required: true, message: $t('error.form.payout-schedule.required') }] }]"
            :options="payoutScheduleTypeList"
            placeholder="Select"
            :disabled="modal?.action === 'view'"
          />
        </a-form-item>

        <div :style="{ display: 'flex', justifyContent: 'flex-end', margin: '20px 25px 0' }">
          <!-- <a-button :style="{ marginRight: '20px' }" @click="closeModal">{{ $t('table.dialog.cancel') }}</a-button> -->
          <a-button v-if="modal?.action === 'view'" class="confirm-btn" type="primary" @click="mainParent?.modalHandler({ ...modal, action: 'update' })">{{ $t('table.dialog.edit') }}</a-button>
          <a-button v-else-if="/add|update/ig.test(modal?.action)" class="confirm-btn" type="primary" @click="handleSubmit">{{ $t('table.dialog.confirm') }}</a-button>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'SetupCompanyClaimSettingModal',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data () {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      fields: ['claimTypeId', 'perVisitLimit', 'monthlyLimit', 'yearlyLimit', 'payoutSchedule'],
      claimTypeList: [],
      payoutScheduleTypeList: []
    }
  },
  computed: {
    mainParent() { return this.getParent('SetupCompanyClaimSetting') },
    formTitle() { return this.$t(`table.dialog.${this?.modal?.action || 'view'}-claim-setting`) }
  },
  watch: {
    modal(to) {
      if (to.show) {
        this.getClaimTypeList()
        this.getPayoutScheduleTypeList()
        if (/view|update/ig.test(to.action) && to?.data) {
          const { companyClaimType, perVisitLimit, monthlyLimit, yearlyLimit, payoutSchedule } = to.data
          this.form.setFieldsValue({ claimTypeId: companyClaimType.id, perVisitLimit: String(perVisitLimit), monthlyLimit, yearlyLimit, payoutSchedule })
          this.checkDataOnList({
            list: this.claimTypeList,
            value: companyClaimType.id,
            callback: () => {
              this.claimTypeList = [ { value: companyClaimType.id, label: companyClaimType.claimType }, ...this.claimTypeList ]
            }
          })
        }
      }
    }
  },
  methods: {
    initiate() {
      this.getClaimTypeList()
      this.getPayoutScheduleTypeList()
      this.fields.forEach(v => this.form.getFieldDecorator(v))
    },
    async getClaimTypeList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchClaimTypeDropdown')
        this.claimTypeList = list?.data?.companyClaimType.map((item) => ({ value: item.id, label: item.companyClaimType }))
        this.checkDataOnList({
          list: this.claimTypeList,
          value: this.modal?.data?.companyClaimType?.id,
          callback: () => {
            const { id, claimType } = this.modal.data.companyClaimType
            this.claimTypeList = [ { value: id, label: claimType }, ...this.claimTypeList ]
          }
        })
      } catch (error) {
        throw error
      }
    },
    async getPayoutScheduleTypeList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchPayoutScheduleTypeDropdown')
        this.payoutScheduleTypeList = list?.data?.payoutScheduleType.map((item) => ({ value: item.id, label: item.payoutScheduleType }))
      } catch (error) {
        throw error
      }
    },
    checkDataOnList({ list, value, callback }) {
      if (/view|update/ig.test(this.modal.action) && value && !list.find((item) => (item.value === value))) {
        callback()
      }
    },
    closeModal() {
      this.$store.commit('modal/TOGGLE_ALLOWANCE_MODAL')
      this.form.resetFields()
    },
    handleSubmit(result) {
      this.form.validateFields((err, values) => !err && this.showInfo(result))
    },
    showNotification() {
      this.$notification.open({
        message: (this.modal.action === 'update') ? this.$t('notification.claim-settings.updated') : this.$t('notification.claim-settings.added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo() {
      this.$confirm({
        title: this.$t('save.confirm'),
        okText: 'Yes',
        cancelText: 'No',
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          const data = {
            ...((this.modal.action === 'update') ? { id: this.modal.data.id } : {}),
            claimTypeId: this.form.getFieldValue('claimTypeId'),
            claimGroupId: this.modal?.claimGroup,
            perVisitLimit: Number(this.form.getFieldValue('perVisitLimit') ?? 0),
            monthlyLimit: this.form.getFieldValue('monthlyLimit'),
            yearlyLimit: this.form.getFieldValue('yearlyLimit'),
            payoutSchedule: this.form.getFieldValue('payoutSchedule')
          }
          // console.log(data)
          try {
            await this.$store.dispatch(`api/setup/company/claimSetting/${this.modal.action}`, data)
            this.showNotification()
            this.closeModal()
            this.mainParent.refreshTable()
          } catch (error) {
            this.$message.error(error.response.data.message)
          }
        },
        onCancel: () => {
          // console.log('Cancel')
        }
      })
    }
  },
  created () {
    this.initiate()
  }
}
</script>

<style>
.checkboxForm .ant-form-item-control{
  width: 150px;
}
</style>
