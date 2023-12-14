<template>
  <div>
    <a-modal
      :title="modalTitle"
      :width="800"
      v-model="modal.show"
      :cancelButtonProps="{ style: 'display: none;' }"
      :okButtonProps="{ style: { display: 'none' } }"
      @cancel="closeModal"
    >
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
        <a-form-item :label="`${$t('table.column.deduction-type')}: `">
          <a-input
            :disabled="isDisabled"
            :maxLength="25"
            v-decorator="[
              'payrollDeductionType',
              {
                rules: [{ required: true, message: $t('error.deduction-type.required') }]
              }
            ]"
          >
          </a-input
        ></a-form-item>

        <a-form-item :label="`${$t('table.column.descriptions')}: `">
          <a-input
            :disabled="isDisabled"
            type="textarea"
            mode="tags"
            style="width: 100%"
            :maxLength="100"
            v-decorator="['descriptions']"
          >
          </a-input>
        </a-form-item>

        <a-row style="width: 440px; margin-left: 240px">
          <a-col v-for="(item, itemIndex) in checkboxList" :key="itemIndex" :span="8">
            <a-form-item style="margin-bottom: 0px" class="checkboxForm">
              <a-checkbox
                @change="(e) => handleChange(item)"
                :checked="item.checked === 'True'"
                style="margin-left: 0px"
                v-decorator="[`${item.label}`]"
                :disabled="modal?.action === 'view'"
              >
                {{ item.label }}
              </a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item :wrapperCol="{ span: 12, offset: 17 }" :style="{ margin: '20px 0 0 0' }">
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
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'
import { i18nRender } from '@/locales'

export default {
  name: 'DeductionModal',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      fields: ['payrollDeductionType', 'descriptions', 'EPF', 'EIS', 'SOCSO', 'TAX'],
      checkboxList: [
        { key: 0, label: this.$t('table.column.epf'), checked: 'False' },
        { key: 1, label: this.$t('table.column.socso'), checked: 'False' },
        { key: 2, label: this.$t('table.column.eis'), checked: 'False' },
        { key: 3, label: this.$t('table.column.tax'), checked: 'False' }
      ]
    }
  },
  computed: {
    mainParent() {
      return this.getParent('SetupPayrollDeduction')
    },
    isDisabled() {
      return this.modal?.action === 'view'
    },
    modalTitle() {
      return this.modal?.action === 'view'
        ? this.$t('table.dialog.view-deduction')
        : this.modal?.action === 'edit'
        ? this.$t('table.dialog.edit-deduction')
        : this.$t('table.dialog.add-deduction')
    }
  },
  watch: {
    modal(to) {
      if (to.show && to.action === 'view' && to?.data) {
        this.fields.forEach((v) => this.form.getFieldDecorator(v))
        const { payrollDeductionType, descriptions, epf, socso, eis, tax } = to.data
        this.form.setFieldsValue({ payrollDeductionType, descriptions })
        this.checkboxList[0].checked = epf
        this.checkboxList[1].checked = socso
        this.checkboxList[2].checked = eis
        this.checkboxList[3].checked = tax
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
    handleSubmit() {
      this.form.validateFields((err, values) => !err && this.showInfo())
    },
    showNotification() {
      this.$notification.open({
        message:
          this.modal.action === 'edit'
            ? this.$t('table.dialog.deduction-updated')
            : this.$t('table.dialog.deduction-added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo() {
      this.$confirm({
        title: this.$t('table.dialog.confirm-msg'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,

        onOk: async () => {
          const data = {
            ...(this.modal.action === 'edit' ? { id: this.modal.data.id } : {}),
            payrollDeductionType: this.form.getFieldValue('payrollDeductionType'),
            descriptions: this.form.getFieldValue('descriptions') || '',
            epf: this.checkboxList[0].checked,
            socso: this.checkboxList[1].checked,
            eis: this.checkboxList[2].checked,
            tax: this.checkboxList[3].checked,
            status: this.modal?.data?.status || 'Enable'
          }
          try {
            await this.$store.dispatch(
              `api/setup/payroll/deduction/${this.modal.action === 'edit' ? 'update' : 'add'}`,
              data
            )
            this.showNotification()
            this.closeModal()
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
          this.$emit('refreshTable')
        },
        onCancel: () => {}
      })
    }
  }
}
</script>

<style>
.checkboxForm .ant-form-item-control {
  width: 150px;
}
</style>
