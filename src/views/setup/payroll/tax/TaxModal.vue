<template>
  <div v-if="TaxModal">
    <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
      <a-form-item :label="`${$t('table.column.tax-type')} :`">
        <a-input
          :maxLength="25"
          v-decorator="['taxType', { rules: [{ required: true, message: $t('error.tax.required') }] }]"
        >
        </a-input>
      </a-form-item>
      <a-form-item :label="`${$t('table.column.descriptions')} :`">
        <a-input :maxLength="100" type="textarea" mode="tags" style="width: 100%" v-decorator="['descriptions']">
        </a-input>
      </a-form-item>
      <EditableTable :columns="columns" :dataSource="dataSource" :editableColumns="editableCol" ref="editableTable">
        <template v-slot="{ isEditing, result }">
          <div style="display: flex; margin-top: 20px">
            <a-space style="margin-left: auto">
              <a-button class="confirm-btn" type="secondary" @click="closeModal()">{{
                $t('table.dialog.cancel')
              }}</a-button>
              <a-button class="confirm-btn" type="primary" @click="showConfirm(result)">{{
                $t('table.dialog.confirm')
              }}</a-button>
            </a-space>
          </div>
        </template>
      </EditableTable>
    </a-form>
  </div>
</template>

<script>
import { i18nRender } from '@/locales'
import EditableTable from '@/components/Table/EditableTable.vue'
import pick from 'lodash.pick'
import InfoCircle from '@/assets/info-circle.svg'

const fields = ['taxType', 'descriptions']

export default {
  name: 'TaxModal',
  props: {
    model: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      dataSource: [],
      taxLoading: false,
      error1: false,
      error2: false,
      record: null,
      columns: [
        {
          title: i18nRender('table.column.annual-gross-salary-range'),
          dataIndex: 'annualGrossSalary',
          children: [
            {
              title: i18nRender('table.column.min'),
              dataIndex: 'min',
              width: '18%',
              scopedSlots: { customRender: 'min' }
            },
            {
              title: i18nRender('table.column.max'),
              dataIndex: 'max',
              width: '18%',
              scopedSlots: { customRender: 'max' }
            }
          ]
        },
        {
          title: i18nRender('table.column.chargeable-income'),
          dataIndex: 'chargeableIncome',
          scopedSlots: { customRender: 'chargeableIncome' }
        },
        {
          title: i18nRender('table.column.tax-rate'),
          dataIndex: 'taxRate',
          scopedSlots: { customRender: 'taxRate' }
        },
        {
          title: 'Action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      editableCol: [
        {
          dataIndex: 'min',
          maxLength: 10,
          valueType: 'text',
          smallerThan: 'max'
        },
        {
          dataIndex: 'max',
          maxLength: 10,
          valueType: 'text'
        },
        {
          dataIndex: 'chargeableIncome',
          maxLength: 10,
          valueType: 'text'
        },
        {
          dataIndex: 'taxRate',
          maxLength: 10,
          valueType: 'percent'
        }
      ],
      payrollTax: []
    }
  },
  components: { EditableTable },
  watch: {
    model(val) {
      this.record = { ...val }
      this.dataSource = this.model.payrollTaxes.map((el, index) => ({
        ...el,
        key: index,
        min: el.minAnnualGrossSalary,
        max: el.maxAnnualGrossSalary
      }))
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(val, fields))
      })
    }
  },
  computed: {
    TaxModal: {
      get() {
        return this.$store.state.modal.setupPayrollTaxView
      },
      set() {
        // just to prevent error log when @cancel
      }
    },
    editAction() {
      return this.record && this.record.id
    }
  },
  methods: {
    closeModal() {
      this.$store.commit('modal/TOGGLE_SETUP_PAYROLL_TAX_VIEW')
      this.$emit('refreshTable')
      this.form.resetFields()
      this.dataSource = []
      this.record = null
    },
    showConfirm(result) {
      this.form.validateFields((err) => {
        if (err) {
          this.error1 = true
        } else {
          this.error1 = false
        }
      })
      // validate editable table
      if (!this.$refs.editableTable.validateTable()) {
        this.error2 = true
      } else {
        this.error2 = false
      }
      // if both validation has no error
      if (!this.error1 && !this.error2) {
        this.$confirm({
          centered: true,
          title: i18nRender('save.confirm'),
          okText: i18nRender('table.dialog.yes'),
          cancelText: i18nRender('table.dialog.no'),
          onOk: () => this.handleSubmit(result),
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />
        })
      }
    },
    async handleSubmit(result) {
      try {
        this.loading = true
        this.payrollTax = result.map((el) => ({
          annualGrossSalary: {
            min: el.min,
            max: el.max
          },
          chargeableIncome: el.chargeableIncome,
          taxRate: el.taxRate
        }))
        const data = {
          taxType: this.form.getFieldValue('taxType'),
          descriptions: this.form.getFieldValue('descriptions'),
          payrollTaxes: this.payrollTax,
          status: 'Enable'
        }
        try {
          if (this.editAction) {
            await this.$store.dispatch('api/setup/payroll/tax/updateTax', { id: this.model.id, ...data })
            this.$notification.open({
              message: this.$t('notification.tax.updated'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
          } else {
            await this.$store.dispatch('api/setup/payroll/tax/addTax', data)
            this.$notification.open({
              message: this.$t('notification.tax.added'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
          }

          this.closeModal()
          this.dataSource = []
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
