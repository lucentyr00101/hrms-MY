<template>
  <div>
    <a-modal
      :title="formTitle"
      :width="800"
      v-model="modal.show"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      @cancel="closeModal"
    >
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
        <a-form-item :label="`${$t('table.column.date')}: `">
          <a-month-picker
            v-decorator="[
              'date',
              { rules: [
                  { required: true, message: $t('error.date.required') }
                ]
              }
            ]"
            :style="{ width: '100%' }"
            format="YYYY/MM"
            placeholder="Select month"
            :disabled="modal?.action === 'view'"
          />
        </a-form-item>

        <a-form-item :label="`${$t('table.column.sequence')}: `">
          <a-select
            v-decorator="['sequence', { rules: [{ required: true, message: $t('error.sequence.required') }] }]"
            :options="mainParent.sequenceTypeList"
            placeholder="Select"
            :disabled="modal?.action === 'view'"
          />
        </a-form-item>

        <a-form-item :label="`${$t('table.column.employee')}: `">
          <a-select
            v-decorator="[
              'employee',
              { rules: [
                  { required: true, message: $t('error.employee.required') }
                ]
              }
            ]"
            :options="mainParent.employeeList"
            show-search
            placeholder="example: Last Name, First Name"
            :disabled="modal?.action === 'view'"
          />
        </a-form-item>

        <a-form-item :label="`${$t('table.dialog.remuneration-type')}: `">
          <a-select
            v-decorator="['payrollAdditionalRemunerationId', { rules: [{ required: true, message: $t('error.remuneration-type.required') }] }]"
            :options="mainParent.additionalRemunerationList"
            placeholder="Select"
            :disabled="modal?.action === 'view'"
            @select="applyCheckboxStatus"
          />
        </a-form-item>

        <a-form-item :label="`${$t('table.column.remarks')}: `" :style="{ margin: 0 }">
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

        <a-form-item :label="`${$t('table.column.amount')}: `">
          <a-input
            v-decorator="[
              'amount',
              { rules: [
                  { required: true, message: $t('error.amount.required') },
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

        <a-row style=" width: 440px; margin-left: 240px">
          <a-col v-for="(item, itemIndex) in checkboxList" :key="itemIndex" :span="5">
            <a-form-item style="margin-bottom: 0px" class="checkboxForm">
              <a-checkbox
                v-decorator="[`${item.label}`]"
                @change="e => handleChange(item)"
                :checked="item.checked === 'True'"
                style="margin-left: 0px;"
                :disabled="modal?.action === 'view'"
              >
                {{ item.label }}
              </a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>

        <div :style="{ display: 'flex', justifyContent: 'flex-end', margin: '20px 120px 0' }">
          <!-- <a-button :style="{ marginRight: '20px' }" @click="closeModal">{{ $t('table.dialog.cancel') }}</a-button> -->
          <a-button v-if="modal?.action === 'view'" class="confirm-btn" type="primary" @click="mainParent?.modalHandler({ ...modal, action: 'update' })">{{ $t('table.dialog.edit') }}</a-button>
          <a-button v-else-if="/add|update/ig.test(modal?.action)" class="confirm-btn" type="primary" @click="handleSubmit">{{ $t('table.dialog.confirm') }}</a-button>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'MainPayrollAdditionalRemunerationModal',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data () {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      fields: ['date', 'sequence', 'employee', 'payrollAdditionalRemunerationId', 'remarks', 'amount', 'epf', 'socso', 'eis', 'tax']
    }
  },
  computed: {
    mainParent() { return this.getParent('MainPayrollAdditionalRemuneration') },
    formTitle() { return this.$t(`table.dialog.${this?.modal?.action || 'view'}-additional-remuneration`) },
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
        this.mainParent.getSequenceTypeList()
        this.mainParent.getAdditionalRemunerationList()
        this.mainParent.getEmployeeList()
        if (/view|update/ig.test(to.action) && to?.data) {
          const { date, sequence, employee, descriptions, amount, payrollAdditionalRemuneration } = to.data
          this.form.setFieldsValue({ date: moment(date), sequence, employee: employee.fullName, payrollAdditionalRemunerationId: payrollAdditionalRemuneration.id, remarks: descriptions, amount: String(amount) })
          this.checkboxList[0].checked = payrollAdditionalRemuneration.epf
          this.checkboxList[1].checked = payrollAdditionalRemuneration.socso
          this.checkboxList[2].checked = payrollAdditionalRemuneration.eis
          this.checkboxList[3].checked = payrollAdditionalRemuneration.tax
        }
      }
    }
  },
  methods: {
    applyCheckboxStatus(value) {
      const { epf, socso, eis, tax } = this.mainParent.additionalRemunerationList.find((item) => (item.value === value))?.data || {}
      this.checkboxList[0].checked = epf
      this.checkboxList[1].checked = socso
      this.checkboxList[2].checked = eis
      this.checkboxList[3].checked = tax
    },
    handleChange(data) {
      this.checkboxList.forEach((item) => {
        if (item.key === data.key) {
          if (item.checked === 'False') {
            item.checked = 'True'
          } else { item.checked = 'False' }
        }
      })
    },
    closeModal() {
      this.$store.commit('modal/TOGGLE_ALLOWANCE_MODAL')
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
        message: (this.modal.action === 'update') ? this.$t('notification.additional-remuneration.updated') : this.$t('notification.additional-remuneration.added'),
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
          const [ lastName, firstName ] = this.form.getFieldValue('employee').replace(/,\s/g, ',').split(',') || []
          const data = {
            ...((this.modal.action === 'update') ? { id: this.modal.data.id } : {}),
            date: this.form.getFieldValue('date').format('YYYY-MM-DD'),
            sequence: this.form.getFieldValue('sequence') || '',
            lastName,
            firstName,
            payrollAdditionalRemunerationId: this.form.getFieldValue('payrollAdditionalRemunerationId') || '',
            descriptions: this.form.getFieldValue('remarks') || '',
            amount: Number(this.form.getFieldValue('amount') ?? 0),
            epf: this.checkboxList[0].checked,
            socso: this.checkboxList[1].checked,
            eis: this.checkboxList[2].checked,
            tax: this.checkboxList[3].checked
          }
          // console.log(data)
          try {
            await this.$store.dispatch(`api/main/payroll/additionalRemuneration/${this.modal.action}`, data)
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
    this.fields.forEach(v => this.form.getFieldDecorator(v))
  }
}
</script>

<style>
.checkboxForm .ant-form-item-control{
  width: 150px;
}
</style>
