<template>
  <a-form :form="form" @submit="handleSubmit">
    <a-row type="flex" :gutter="[30, 0]">
      <a-col :span="12">
        <a-form-item :label="`${$t('table.column.employee')}: `">
          <a-select
            v-decorator="['employee', { rules: [{ required: true, message: $t('error.employee.required') }] }]"
            :options="mainParent.employeeList"
            show-search
            placeholder="Select"
            :disabled="modal?.action === 'view'"
          />
        </a-form-item>
      </a-col>

      <a-col :span="12">
        <a-form-item :label="`${$t('table.column.claim-type')}: `">
          <a-select
            v-decorator="['claimType', { rules: [{ required: true, message: $t('error.claim-type.required') }] }]"
            :options="mainParent.claimTypeList"
            placeholder="Select"
            :disabled="modal?.action === 'view'"
            @change="onSelectClaimType"
          />
        </a-form-item>
      </a-col>

      <a-col :span="12">
        <a-form-item :label="`${$t('table.column.claim-amount')}: `">
          <a-input
            v-decorator="[
              'claimAmount',
              {
                rules: [
                  { required: true, message: $t('error.claim-amount.required') },
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
      </a-col>

      <a-col :span="12">
        <a-form-item :label="`${$t('table.column.claim-for')}: `">
          <a-month-picker
            v-decorator="['claimFor', { rules: [{ required: true, message: $t('error.claim-for.required') }] }]"
            :style="{ width: '100%' }"
            format="MMMM"
            placeholder="Select month"
            :disabled="modal?.action === 'view'"
          />
        </a-form-item>
      </a-col>

      <a-col v-for="item in customInputs" :key="item?.id" :span="12">
        <a-form-item :label="item?.name">
          <a-input
            v-if="item?.type === 'text'"
            v-decorator="[
              item?.id,
              {
                rules: [
                  { required: JSON.parse(String(item?.required).toLowerCase()), message: `${item?.name} is required.` }
                ]
              }
            ]"
            style="width: 100%"
            placeholder="example"
            :disabled="modal?.action === 'view'"
          />

          <a-date-picker
            v-else-if="item?.type === 'date'"
            v-decorator="[
              item?.id,
              {
                rules: [
                  { required: JSON.parse(String(item?.required).toLowerCase()), message: `${item?.name} is required.` }
                ]
              }
            ]"
            style="width: 100%"
            placeholder="Select Date"
            format="YYYY/MM/DD"
            :disabled="modal?.action === 'view'"
          />

          <a-checkbox
            v-else-if="item?.type === 'checkbox'"
            v-decorator="[
              item?.id,
              {
                valuePropName: 'checked',
                initialValue: false,
                rules: [
                  { required: JSON.parse(String(item?.required).toLowerCase()), message: `${item?.name} is required.` }
                ]
              }
            ]"
            :disabled="modal?.action === 'view'"
            >{{ item?.name }}</a-checkbox
          >
        </a-form-item>
      </a-col>

      <a-col :span="24">
        <a-form-item :label="`${$t('table.column.remarks')}: `" :style="{ margin: 0 }">
          <a-input
            v-decorator="['remarks']"
            type="textarea"
            :maxLength="100"
            style="width: 100%"
            placeholder="Autoheight based on content lines="
            :disabled="modal?.action === 'view'"
          />
        </a-form-item>
        <p :style="{ margin: 0, textAlign: 'right' }">{{ form.getFieldValue('remarks')?.length || 0 }} / 100</p>
      </a-col>

      <a-col :span="12">
        <a-form-item :label="`${$t('table.column.attached')}: `">
          <a-upload
            :file-list="fileList"
            v-decorator="[
              'attached',
              { rules: [{ required: true, message: $t('error.attached.required') }, { validator: validateFile }] }
            ]"
            :multiple="true"
            list-type="picture"
            accept="image/png, image/jpeg, image/jpg"
            :remove="handleRemove"
            :before-upload="beforeUpload"
          >
            <a-button icon="upload">{{ $t('table.dialog.click-to-upload') }}</a-button>
          </a-upload>
        </a-form-item>
      </a-col>
    </a-row>

    <div :style="{ display: 'flex', justifyContent: 'flex-end', margin: '20px 0 0' }">
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
</template>

<script>
import moment from 'moment'
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'MainHRClaimTransactionsForm',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      customInputs: [],
      fileList: []
    }
  },
  computed: {
    mainParent() {
      return this.getParent('MainHRClaimTransactions')
    },
    fields() {
      let fields = [
        'employee',
        'claimType',
        'claimAmount',
        'claimFor',
        'clinicName',
        'doctorName',
        'remarks',
        'attached'
      ]
      fields = [...fields, ...this.customInputs.map((item) => item.id)]
      return fields
    }
  },
  watch: {
    modal: {
      deep: true,
      handler(to) {
        if (to.show) {
          this.getData()
          if (/view|update/gi.test(to.action) && to?.data) {
            const { date, sequence, employee, descriptions, amount, payrollAdditionalRemuneration } = to.data
            this.form.setFieldsValue({
              date: moment(date),
              sequence,
              employee: employee.fullName,
              payrollAdditionalRemunerationId: payrollAdditionalRemuneration.id,
              remarks: descriptions,
              amount: String(amount)
            })
          }
        } else {
          this.closeModal()
        }
      }
    },
    fields(to) {
      if (this.modal.show) {
        to.forEach((v) => this.form.getFieldDecorator(v))
      }
    }
  },
  methods: {
    initiate() {
      this.getData()
    },
    getData() {
      this.mainParent.getEmployeeList()
      this.mainParent.getClaimTypeList()
    },
    onSelectClaimType(value) {
      this.customInputs = this.mainParent.claimTypeList.find((item) => item.value === value)?.customRequirements || []
    },
    validateFile(rule, value, callback) {
      if (this.fileList.length === 0) {
        callback(new Error(this.$t('error.attached.required')))
        return false
      }
      if (this.fileList.length > 5) {
        callback(new Error(this.$t('error.up-to-5-files-attached-only.required')))
        return false
      }
      callback()
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList.length > 0 ? newFileList : []
    },
    beforeUpload(file) {
      const isFileExist = Boolean((this.fileList || []).find((item) => item.name === file.name))
      this.fileList = [...(this.fileList || []), ...(!isFileExist ? [file] : [])]
      return false
    },
    closeModal() {
      this.$store.commit('modal/TOGGLE_ALLOWANCE_MODAL')
      this.form.resetFields()
      this.fileList = []
      this.customInputs = []
    },
    handleSubmit(result) {
      this.form.validateFields((err, values) => !err && this.showInfo(result))
    },
    showNotification() {
      this.$notification.open({
        message:
          this.modal.action === 'update'
            ? this.$t('notification.claim-transactions.updated')
            : this.$t('notification.claim-transactions.added'),
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
          const data = new FormData()
          const hrClaimTransactionAddParam = {
            employeeId: String(this.form.getFieldValue('employee')).split('/')[0],
            claimTypeId: String(this.form.getFieldValue('claimType')).split('/')[0],
            claimsFor: this.form.getFieldValue('claimFor').format('MMMM'),
            claimAmount: Number(this.form.getFieldValue('claimAmount') ?? 0),
            approvedClaimAmount: Number(this.form.getFieldValue('claimAmount') ?? 0),
            remarks: this.form.getFieldValue('remarks') || ''
          }
          this.customInputs.forEach((item) => {
            const customInput = { name: item.name, value: '' }
            if (item.type === 'text') {
              customInput.value = this.form.getFieldValue(item.id)
            }
            if (item.type === 'date') {
              customInput.value = moment(this.form.getFieldValue(item.id)).format('YYYY-MM-DD')
            }
            if (item.type === 'checkbox') {
              customInput.value = String(this.form.getFieldValue(item.id))
            }
            hrClaimTransactionAddParam.hrClaimTransactionCustomInputsAddParam = [
              ...(hrClaimTransactionAddParam.hrClaimTransactionCustomInputsAddParam
                ? hrClaimTransactionAddParam.hrClaimTransactionCustomInputsAddParam
                : []),
              customInput
            ]
          })
          data.append(
            'hrClaimTransactionAddParam',
            new Blob([JSON.stringify(hrClaimTransactionAddParam)], { type: 'application/json' })
          )
          this.fileList.forEach((item) => {
            data.append(`attachments`, item)
          })
          // FormData
          // const formData = {}
          // for (const key of data.keys()) {
          //     // console.log(`${key}:`, data.get(key))
          //     formData[key] = data.get(key)
          // }
          // console.log(formData)
          try {
            await this.$store.dispatch(`api/main/hr/claimTransactions/${this.modal.action}`, data)
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
  created() {
    this.initiate()
    this.fields.forEach((v) => this.form.getFieldDecorator(v))
  }
}
</script>

<style>
.checkboxForm .ant-form-item-control {
  width: 150px;
}

.ant-upload-list-item-name {
  width: 90%;
}
</style>
