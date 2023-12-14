<template>
  <div>
    <a-modal
      :title="formTitle"
      :width="800"
      v-model="modal.show"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      @cancel="closeModal()"
    >
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
        <a-form-item :label="`${$t('table.column.commissions-type')}: `">
          <a-input
            v-decorator="[
              'payrollCommissionsType',
              { rules: [{ required: true, message: $t('error.form.commissions-type.required') }] }
            ]"
            :maxLength="25"
            placeholder="commissions example"
            :disabled="modal?.action === 'view'"
          />
        </a-form-item>

        <a-form-item :label="`${$t('table.column.descriptions')}: `" :style="{ margin: 0 }">
          <a-input
            v-decorator="['descriptions']"
            type="textarea"
            mode="tags"
            :maxLength="100"
            style="width: 100%"
            placeholder="Autoheight based on content lines="
            :disabled="modal?.action === 'view'"
          />
          <p :style="{ margin: 0, textAlign: 'right' }">{{ form.getFieldValue('descriptions')?.length || 0 }} / 100</p>
        </a-form-item>

        <a-form-item :label="`${$t('table.column.rate')}: `">
          <a-input
            v-decorator="[
              'rate',
              {
                rules: [
                  { required: true, message: $t('error.form.rate.required') },
                  { max: 6, message: $t('error.max-6-numerical-characters') }
                ]
              }
            ]"
            type="number"
            style="width: 100%"
            placeholder="rate example"
            min="0"
            step="0.1"
            :disabled="modal?.action === 'view'"
          />
        </a-form-item>

        <a-row style="width: 440px; margin-left: 240px">
          <a-col v-for="(item, itemIndex) in checkboxList" :key="itemIndex" :span="5">
            <a-form-item style="margin-bottom: 0px" class="checkboxForm">
              <a-checkbox
                v-decorator="[`${item.label}`]"
                @change="(e) => handleChange(item)"
                :checked="item.checked === 'True'"
                style="margin-left: 0px"
                :disabled="modal?.action === 'view'"
              >
                {{ item.label }}
              </a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>

        <div :style="{ display: 'flex', justifyContent: 'flex-end', margin: '20px 120px 0' }">
          <!-- <a-button :style="{ marginRight: '20px' }" @click="closeModal">{{ $t('table.dialog.cancel') }}</a-button> -->
          <a-button
            v-if="modal?.action === 'view'"
            class="confirm-btn"
            type="primary"
            @click="mainParent?.modalHandler({ ...modal, action: 'update' })"
            >{{ $t('table.dialog.edit') }}</a-button
          >
          <a-button
            v-else-if="/add|update/gi.test(modal?.action)"
            class="confirm-btn"
            type="primary"
            @click="handleSubmit"
            >{{ $t('table.dialog.confirm') }}</a-button
          >
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'
import { i18nRender } from '@/locales'

export default {
  name: 'SetupPayrollCommissionModal',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      fields: ['payrollCommissionsType', 'descriptions', 'rate', 'epf', 'socso', 'eis', 'tax']
    }
  },
  computed: {
    mainParent() {
      return this.getParent('SetupPayrollCommission')
    },
    formTitle() {
      return this.$t(`table.dialog.${this?.modal?.action || 'view'}-commission`)
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
          const { payrollCommissionsType, descriptions, rate, epf, socso, eis, tax } = to.data
          this.form.setFieldsValue({ payrollCommissionsType, descriptions, rate: String(rate) })
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
        message:
          this.modal.action === 'update'
            ? this.$t('notification.commission.updated')
            : this.$t('notification.commission.added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo() {
      this.$confirm({
        title: this.$t('save.confirm'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          const data = {
            ...(this.modal.action === 'update' ? { id: this.modal.data.id } : {}),
            payrollCommissionsType: this.form.getFieldValue('payrollCommissionsType'),
            descriptions: this.form.getFieldValue('descriptions') || '',
            rate: Number(this.form.getFieldValue('rate') ?? 0),
            status: this.modal?.data?.status || 'Enable',
            epf: this.checkboxList[0].checked,
            socso: this.checkboxList[1].checked,
            eis: this.checkboxList[2].checked,
            tax: this.checkboxList[3].checked
          }
          // console.log(data)
          try {
            await this.$store.dispatch(`api/setup/payroll/commission/${this.modal.action}`, data)
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
    // validateRate(rule, value, callback) {
    //   let error
    //   if (!value) {
    //     error = this.$t('error.rate.required')
    //   } else if (value.length > 6) {
    //     error = this.$t('error.rate.max-6-numerical-characters')
    //   }
    //   callback(error)
    // }
  },
  created() {
    this.fields.forEach((v) => this.form.getFieldDecorator(v))
  }
}
</script>

<style>
.checkboxForm .ant-form-item-control {
  width: 150px;
}
</style>
