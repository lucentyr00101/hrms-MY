<template>
  <a-form :form="form" :label-col="{ span: 7 }" :wrapper-col="{ span: 15 }" @submit="handleSubmit">
    <a-form-item :label="`${$t('table.column.department')}: `">
      <a-tree-select
        v-decorator="[
          'department',
          {
            rules: [
              { required: true, message: $t('error.department.required') }
            ]
          }
        ]"
        :tree-data="departmentList"
        tree-default-expand-all
        placeholder="Select"
        :disabled="modal?.action === 'view'"
      />
    </a-form-item>

    <a-form-item :label="`${$t('table.column.year')}: `">
      <a-date-picker
        v-decorator="[
          'year',
          {
            rules: [
              { required: true, message: $t('error.year.required') }
            ]
          }
        ]"
        mode="year"
        format="YYYY"
        style="width: 100%"
        placeholder="Select Year"
        :allow-clear="false"
        :disabled="modal?.action === 'view'"
        @panelChange="yearPickerSelectHandler"
      />
    </a-form-item>

    <a-form-item :label="`${$t('table.column.start-end-date')}: `">
      <a-range-picker
        v-decorator="[
          'dateRange',
          {
            rules: [
              { required: true, message: $t('error.start-end-date.required') }
            ]
          }
        ]"
        style="width: 100%"
        :placeholder="['Select Start Date', 'Select End Date']"
        :allow-clear="false"
        :disabled="modal?.action === 'view'"
      />
    </a-form-item>

    <a-form-item :label="`${$t('table.column.sequence')}: `">
      <a-select
        v-decorator="[
          'sequence',
          {
            rules: [
              { required: true, message: $t('error.sequence.required') }
            ]
          }
        ]"
        :options="sequenceTypeList"
        placeholder="Select"
        :disabled="modal?.action === 'view'"
      />
    </a-form-item>

    <div :style="{ display: 'flex', justifyContent: 'flex-end', margin: '20px 50px 0' }">
      <!-- <a-button :style="{ marginRight: '20px' }" @click="closeModal">{{ $t('table.dialog.cancel') }}</a-button> -->
      <a-button v-if="modal?.action === 'view'" class="confirm-btn" type="primary" @click="mainParent?.modalHandler({ ...modal, action: 'update' })">{{ $t('table.dialog.edit') }}</a-button>
      <a-button v-else-if="/add|update/ig.test(modal?.action)" class="confirm-btn" type="primary" @click="handleSubmit">{{ $t('table.dialog.confirm') }}</a-button>
    </div>
  </a-form>
</template>

<script>
import moment from 'moment'
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'MainPayrollGeneratePayrollForm',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      departmentList: [],
      sequenceTypeList: [],
      fields: ['department', 'year', 'dateRange', 'sequence']
    }
  },
  computed: {
    mainParent() { return this.getParent('MainPayrollGeneratePayroll') }
  },
  watch: {
    modal: {
      deep: true,
      handler(to) {
        if (to.show) {
          this.initiate()
        } else {
          this.closeModal()
        }
      }
    }
  },
  methods: {
    initiate() {
      this.getDepartmentList()
      this.getSequenceTypeList()
      this.applyFormData()
    },
    closeModal() {
      this.form.resetFields()
    },
    applyFormData() {
      if (/view|update/ig.test(this?.modal?.action) && this?.modal?.data) {
        const { logoUpload, countries, companyName, remarks } = this?.modal?.data || {}
        this.form.setFieldsValue({ logoUpload, countries, companyName, remarks })
      }
    },
    async getDepartmentList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchDepartmentDropdown')
        this.departmentList = this.generateSelectTreeList(list?.data?.parentTree)
      } catch (error) {
        throw error
      }
    },
    async getSequenceTypeList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchSequenceDropdown')
        this.sequenceTypeList = list?.data?.sequenceType.map((item) => ({ value: item.sequenceType || item.id, label: item.sequenceType }))
      } catch (error) {
        throw error
      }
    },
    yearPickerSelectHandler(value) {
      this.form.setFieldsValue({ year: value })
    },
    handleSubmit(result) {
      this.form.validateFields((err, values) => !err && this.showInfo(result))
    },
    showNotification() {
      this.$notification.open({
        message: (this.modal.action === 'update') ? this.$t('notification.generate-payroll.updated') : this.$t('notification.generate-payroll.added'),
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
            dateFrom: moment(this.form.getFieldValue('dateRange')[0]).format('YYYY-MM-DD'),
            dateTo: moment(this.form.getFieldValue('dateRange')[1]).format('YYYY-MM-DD'),
            department: this.form.getFieldValue('department'),
            year: this.form.getFieldValue('year').format('YYYY'),
            sequence: this.form.getFieldValue('sequence')
          }
          console.log(data)
          try {
            const summary = await this.$store.dispatch('api/main/payroll/generalPayroll/fetchSummary', data)
            this.mainParent.summary = summary.data
            this.showNotification()
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
    this.initiate()
  }
}
</script>

<style>
.checkboxForm .ant-form-item-control{
  width: 150px;
}

.ant-upload-list-item-name {
  width: 90%;
}
</style>
