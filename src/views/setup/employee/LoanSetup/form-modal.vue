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
        <a-form-item :label="`${$t('table.column.loan-type')}: `">
          <a-input
            v-decorator="[
              'loanType',
              { rules: [
                  { required: true, message: $t('error.loan-type.required') }
                ]
              }
            ]"
            :maxLength="25"
            placeholder="example"
            :disabled="modal?.action === 'view'"
          />
        </a-form-item>

        <a-form-item :label="`${$t('table.column.terms')}: `" :style="{ marginBottom: '5px' }">
          <a-input
            v-decorator="[
              'terms',
              { rules: [
                  { required: true, message: $t('error.terms.required') },
                  { max: 2, message: $t('error.max-2-numerical-characters') }
                ]
              }
            ]"
            type="number"
            style="width: 100%"
            placeholder="example"
            min="0"
            max="99"
            step="1"
            :disabled="modal?.action === 'view'"
          />
          <p :style="{ marginBottom: '5px', textAlign: 'left', lineHeight: 'normal' }">Months</p>
        </a-form-item>

        <a-form-item :label="`${$t('table.column.interest-rates')}: `">
          <a-input
            v-decorator="[
              'interestRate',
              { rules: [
                  { required: true, message: $t('error.interest-rates.required') },
                  { max: 6, message: $t('error.max-6-numerical-characters') }
                ]
              }
            ]"
            type="number"
            style="width: 100%"
            placeholder="example"
            min="0"
            step="1"
            addon-after="%"
            :disabled="modal?.action === 'view'"
          />
        </a-form-item>

        <a-form-item :label="`${$t('table.column.auto-repayment')}: `">
          <a-select
            v-decorator="['autoRepayment', { rules: [{ required: true, message: $t('error.auto-repayment.required') }] }]"
            :options="autoRepaymentList"
            placeholder="Select"
            :disabled="modal?.action === 'view'"
          />
        </a-form-item>

        <a-form-item :label="`${$t('table.column.remarks')}: `">
          <a-input
            v-decorator="['remarks']"
            type="textarea"
            mode="tags"
            :maxLength="100"
            style="width: 100%"
            placeholder="Autoheight based on content lines="
            :disabled="modal?.action === 'view'"
          />
          <p :style="{ margin: 0, textAlign: 'right' }">{{ form.getFieldValue('remarks')?.length || 0 }} / 100</p>
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
  name: 'SetupEmployeeLoanSetupModal',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data () {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      fields: ['loanType', 'terms', 'interestRate', 'autoRepayment', 'remarks'],
      autoRepaymentList: [
        // { value: '1st Cut-off', label: '1st Cut-off' },
        // { value: '2nd Cut-off', label: '2nd Cut-off' },
        // { value: 'Both Cut-off', label: 'Both Cut-off' }
      ]
    }
  },
  computed: {
    mainParent() { return this.getParent('SetupEmployeeLoanSetup') },
    formTitle() { return this.$t(`table.dialog.${this?.modal?.action || 'view'}-loan-setup`) }
  },
  watch: {
    modal(to) {
      if (to.show) {
        this.getAutoRepaymentList()
        if (/view|update/ig.test(to.action) && to?.data) {
          const { loanType, terms, interestRate, autoRepayment, remarks } = to.data
          this.form.setFieldsValue({ loanType, terms: String(terms), interestRate: String(interestRate), autoRepayment, remarks })
        }
      }
    }
  },
  methods: {
    initiate() {
      this.getAutoRepaymentList()
      this.fields.forEach(v => this.form.getFieldDecorator(v))
    },
    async getAutoRepaymentList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchAutoRepaymentDropdown')
        this.autoRepaymentList = list?.data?.autoRepayment.map((item) => ({ value: item.autoRepayment || item.id, label: item.autoRepayment }))
      } catch (error) {
        throw error
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
        message: (this.modal.action === 'update') ? this.$t('notification.loan-setup.updated') : this.$t('notification.loan-setup.added'),
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
            loanType: this.form.getFieldValue('loanType'),
            terms: Number(this.form.getFieldValue('terms') ?? 0),
            interestRate: Number(this.form.getFieldValue('interestRate') ?? 0),
            autoRepayment: this.form.getFieldValue('autoRepayment'),
            remarks: this.form.getFieldValue('remarks')
          }
          // console.log(data)
          try {
            await this.$store.dispatch(`api/setup/employee/loanSetup/${this.modal.action}`, data)
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
