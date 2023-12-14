<template>
  <div v-if="addSocsoModal">
    <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
      <a-form-item :label="`${$t('table.column.socso-type')} :`">
        <a-input
          :maxLength="25"
          v-decorator="['socsoType', { rules: [{ required: true, message: $t('error.socso.required') }] }]"
        >
        </a-input
      ></a-form-item>
      <a-form-item :label="`${$t('table.column.descriptions')} :`">
        <a-input :maxLength="100" type="textarea" mode="tags" style="width: 100%" v-decorator="['descriptions']">
        </a-input>
      </a-form-item>
      <EditableTable :columns="columns" :dataSource="dataSource" :editableColumns="editableCol" ref="editableTable">
        <template v-slot="{ isEditing, result }">
          <div style="display: flex">
            <a-space style="margin-left: auto">
              <a-button class="confirm-btn" type="secondary" @click="closeModal()">{{
                $t('table.dialog.cancel')
              }}</a-button>
              <a-button class="confirm-btn" type="primary" @click="handleSubmit(result)">{{
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
import InfoCircle from '@/assets/info-circle.svg'
const fields = ['socsoType', 'descriptions']

export default {
  name: 'AddSocsoModal',
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      dataSource: [],
      editableCol: [
        {
          dataIndex: 'minAnnualGrossSalary',
          smallerThan: 'maxAnnualGrossSalary',
          maxLength: 10,
          valueType: 'text'
        },
        {
          dataIndex: 'maxAnnualGrossSalary',
          maxLength: 10,
          valueType: 'text'
        },
        {
          dataIndex: 'employerContribution',
          maxLength: 10,
          valueType: 'text'
        },
        {
          dataIndex: 'employerContributionSecondCategory',
          maxLength: 10,
          valueType: 'text'
        },
        {
          dataIndex: 'employeeContribution',
          maxLength: 10,
          valueType: 'text'
        }
      ],
      fields,
      columns: [
        {
          title: i18nRender('table.column.annual-gross-salary'),
          children: [
            {
              title: i18nRender('table.column.min'),
              dataIndex: 'minAnnualGrossSalary',
              scopedSlots: { customRender: 'minAnnualGrossSalary' }
            },
            {
              title: i18nRender('table.column.max'),
              dataIndex: 'maxAnnualGrossSalary',
              scopedSlots: { customRender: 'maxAnnualGrossSalary' }
            }
          ]
        },
        {
          title: i18nRender('table.column.employer-contribution'),
          width: '15%',
          dataIndex: 'employerContribution',
          scopedSlots: { customRender: 'employerContribution' }
        },
        {
          title: i18nRender('table.column.employer-contribution-2'),
          width: '15%',
          dataIndex: 'employerContributionSecondCategory',
          scopedSlots: { customRender: 'employerContributionSecondCategory' }
        },
        {
          title: i18nRender('table.column.employee-contribution'),
          width: '15%',
          dataIndex: 'employeeContribution',
          scopedSlots: { customRender: 'employeeContribution' }
        },
        {
          title: i18nRender('table.column.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  components: { EditableTable },
  computed: {
    addSocsoModal: {
      get() {
        return this.$store.state.modal.addSocsoModal
      },
      set() {
        // just to prevent error log when @cancel
      }
    }
  },

  methods: {
    closeModal() {
      this.$store.commit('modal/TOGGLE_ADD_SOCSO_MODAL')
    },
    handleSubmit(result) {
      const _this = this
      this.form.validateFields((err, values) => {
        if (_this.$refs.editableTable.validateTable() && !err) {
          const payload = { ...values, status: 'Enable', payrollSocsoList: result }
          _this.showInfo(payload)
        }
      })
    },
    showInfo(payload) {
      const _this = this
      this.$confirm({
        title: i18nRender('table.dialog.confirm-msg'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        async onOk() {
          try {
            await _this.$store.dispatch('api/setup/payroll/socso/add', payload)
            _this.$notification['success']({
              message: i18nRender('notification.socso.added')
            })
            _this.closeModal()
            _this.$emit('refreshTable')
          } catch (e) {
            _this.$notification['error']({
              message: e.response.data.message
            })
          }
        }
      })
    }
  },
  props: {
    data: {
      type: Array,
      default() {
        return null
      }
    },
    model: {
      type: Object,
      default: () => null
    }
  }
}
</script>
