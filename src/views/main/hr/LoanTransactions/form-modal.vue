<template>
  <div>
    <a-modal
      :title="modalTitle"
      v-model="modal.show"
      :width="isModalAdd ? 700 : 1300"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      :maskClosable="false"
      @cancel="closeModal()"
    >
      <a-form :form="form" layout="horizontal" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }" v-if="isModalAdd">
        <a-form-item :label="$t('table.column.employee')">
          <a-select
            show-search
            placeholder="Select"
            :disabled="isModalView"
            v-decorator="[
              'employeeSetupId',
              {
                rules: [{ required: true, message: $t('error.employee.required') }]
              }
            ]"
          >
            <a-select-option v-for="(employees, index) in mainParent.dropdownsEmployees" :key="index" :value="employees.value" @click="handleSelectChangeEmployee(employees)">{{ employees.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('table.column.loan-type')">
          <a-select
            show-search
            placeholder="Select"
            :disabled="isModalView"
            v-decorator="[
              'employeeSetupLoanId',
              {
                rules: [{ required: true, message: $t('error.loan-type.required') }]
              }
            ]"
          >
            <a-select-option v-for="(loanTypes, index) in mainParent.dropdownsLoanType" :key="index" :value="loanTypes.value" @click="handleSelectChangeLoanType(loanTypes)">{{ loanTypes.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('table.column.loan-amount')">
          <a-input
            type="number"
            style="width: 100%"
            :disabled="isModalView"
            min="0"
            step="0.1"
            v-decorator="[
              'loanAmount',
              {
                rules: [
                  { required: true, message: $t('error.loan-amount.required') },
                  { max: 10, message: $t('error.max-10-numerical-characters') }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item :label="$t('table.dialog.attachment')">
          <a-upload
            name="file"
            accept="image/*"
            listType="picture"
            @change="handleChange"
            :fileList="attachments"
            v-decorator="['attachments']"
            :beforeUpload="beforeUpload"
          >
            <a-button :disabled="isModalView">
              <a-icon type="upload" /> {{ $t('table.dialog.click-to-upload') }}
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item :label="`${$t('table.column.remarks')}:`">
          <a-input
            type="textarea"
            :disabled="isModalView"
            :rows="3"
            mode="tags"
            :maxLength="100"
            v-decorator="['remarks']"
          >
          </a-input
        ></a-form-item>
        <div style="display: flex; align-items: center; justify-content: right; padding-right: 40px">
          <a-form-item>
            <a-button
              v-if="/add|edit/gi.test(modal?.action)"
              class="confirm-btn"
              type="primary"
              @click="handleSubmit()"
              >{{ $t('table.dialog.confirm') }}</a-button
            >
          </a-form-item>
        </div>
      </a-form>

      <a-form :form="form" layout="horizontal" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }" v-else>
        <a-row>
          <a-col :span="12">
            <a-form-item :label="$t('table.column.employee-number')">
              <a-select
                show-search
                placeholder="Select"
                :disabled="true"
                :options="mainParent.dropdownsEmployees.map((item) => ({ label: item.number, value: item.number }))"
                v-decorator="['employeeNumber']"
              />
            </a-form-item>
            <a-form-item :label="$t('table.column.employee')">
              <a-select
                show-search
                placeholder="Select"
                :disabled="true"
                v-decorator="['employeeID']"
              >
                <a-select-option v-for="(employees, index) in mainParent.dropdownsEmployees" :key="index" :value="employees.id" @click="handleSelectChangeEmployee(employees)">{{ employees.label }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item :label="$t('table.column.loan-type')">
              <a-select
                show-search
                placeholder="Select"
                :disabled="true"
                :options="mainParent.dropdownsLoanType"
                v-decorator="['loanType']"
              />
            </a-form-item>
            <a-form-item :label="$t('table.column.loan-repaid')" v-if="isApproved">
              <a-input style="width: 100%" :disabled="true" v-decorator="['loanRepaid']" />
            </a-form-item>

            <a-form-item :label="`${$t('table.column.remarks')}:`">
              <a-input
                type="textarea"
                :disabled="true"
                :rows="3"
                mode="tags"
                :maxLength="100"
                v-decorator="['remarks']"
              >
              </a-input
            ></a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('table.column.department')">
              <a-select
                show-search
                placeholder="Select"
                :disabled="true"
                :options="mainParent.dropdownsDepartment.map((item) => ({ label: item, value: item }))"
                v-decorator="['department']"
              />
            </a-form-item>

            <a-form-item :label="$t('table.column.applied-time')">
              <a-input :disabled="true" style="width: 100%" v-decorator="['appliedTime']" />
            </a-form-item>

            <a-form-item :label="$t('table.column.loan-amount')">
              <a-input style="width: 100%" :disabled="true" v-decorator="['loanAmount']" />
            </a-form-item>

            <a-form-item :label="$t('table.column.loan-balance')" v-if="isApproved">
              <a-input style="width: 100%" :disabled="true" v-decorator="['loanBalance']" />
              <a-button type="secondary" v-if="isApproved">{{ $t('table.dialog.details') }}</a-button>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :label="`${$t('table.dialog.attachment')}:`">
              <a-row>
                <a-col :span="4" v-for="img in attachments" :key="img">
                  <img :src="img" height="100" width="100" style="margin-bottom: 10px; object-fit: cover" />
                </a-col>
              </a-row>
            </a-form-item>
          </a-col>
          <a-divider />
          <a-form-item :label="`${$t('table.column.terms')}:`">
            <a-input
              style="width: 100%"
              :disabled="isEditable"
              type="number"
              v-decorator="[
                'terms',
                {
                  rules: [{ required: true, message: $t('error.terms.required') }]
                }
              ]"
            />
          </a-form-item>
          <a-form-item :label="`${$t('table.column.interest-rate')}:`">
            <a-input
              style="width: 100%"
              type="number"
              :disabled="isEditable"
              v-decorator="[
                'interestRate',
                { rules: [{ required: true, message: $t('error.interest-rates.required') }] }
              ]"
            />
          </a-form-item>
          <a-form-item :label="$t('table.column.auto-repayment')">
            <a-select
              show-search
              placeholder="Select"
              :disabled="isEditable"
              :options="autoRepaymentItems.map((item) => ({ label: item, value: item }))"
              v-decorator="[
                'autoRepayment',
                { rules: [{ required: true, message: $t('error.auto-repayment.required') }] }
              ]"
            />
          </a-form-item>
          <a-form-item :label="$t('table.column.monthly-repayment')">
            <a-input
              type="number"
              style="width: 100%"
              :disabled="isEditable"
              v-decorator="[
                'monthlyRepayment',
                { rules: [{ required: true, message: $t('error.monthly-repayment.required') }] }
              ]"
            />
          </a-form-item>
          <div style="display: flex; align-items: center; justify-content: right; padding-right: 80px">
            <a-form-item style="margin-right: 20px" v-if="!isApproved">
              <a-button v-action:main_hr_loan-transactions_view-details_reject type="danger" @click="handleStatus('Reject')">{{ $t('table.dialog.reject') }}</a-button>
            </a-form-item>
            <a-form-item v-if="!isApproved">
              <a-button v-action:main_hr_loan-transactions_view-details_approve class="confirm-btn" @click="handleStatus('Approved')" type="primary">{{
                $t('table.dialog.approve')
              }}</a-button>
            </a-form-item>
            <a-form-item v-else-if="isApproved">
              <a-button
                v-if="isModalView"
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
        </a-row>
      </a-form>
    </a-modal>

    <a-modal
      :title="$t('table.column.loan-rejection')"
      v-model="rejectModal"
      :width="700"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      :maskClosable="false"
      @cancel="closeReject()"
    >
      <a-form :form="rejectForm" layout="horizontal" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
        <a-form-item :label="`${$t('table.dialog.reason-for-rejection')}:`">
          <a-input
            type="textarea"
            :rows="3"
            mode="tags"
            :maxLength="100"
            v-decorator="[
              'rejectionReason',
              {
                initialValue: '',
                rules: [{ required: true, message: $t('error.reason-for-rejection.required') }]
              }
            ]"
          >
          </a-input
        ></a-form-item>
        <div style="display: flex; align-items: center; justify-content: right; padding-right: 80px">
          <a-form-item style="margin-right: 10px">
            <a-button v-action:main_hr_loan-transactions_view-details_reject class="confirm-btn" @click="closeReject()">{{ $t('table.dialog.cancel') }}</a-button>
          </a-form-item>
          <a-form-item>
            <a-button v-action:main_hr_loan-transactions_view-details_approve class="confirm-btn" type="primary" @click="handleRejectSubmit()">{{
              $t('table.dialog.confirm')
            }}</a-button>
          </a-form-item>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import pick from 'lodash.pick'
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'MainHRLoanTransactionModal',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      rejectModal: false,
      attachments: [],
      autoRepaymentItems: ['1st Cut-off', '2nd Cut-off', 'Both Cut-off'],
      form: this.$form.createForm(this),
      rejectForm: this.$form.createForm(this),
      fields: ['employeeSetupId', 'employeeSetupLoanId', 'loanAmount', 'remarks'],
      editFields: [
        'employeeNumber',
        'department',
        'employeeID',
        'appliedTime',
        'loanType',
        'loanAmount',
        'loanRepaid',
        'loanBalance',
        'remarks',
        'terms',
        'interestRate',
        'autoRepayment',
        'monthlyRepayment'
      ],
      employee: null,
      loanType: null
    }
  },
  computed: {
    mainParent() {
      return this.getParent('MainHRLoanTransactions')
    },
    isModalAdd() {
      return this.modal?.action === 'add'
    },
    isModalView() {
      return this.modal?.action === 'view'
    },
    isModalEdit() {
      return this.modal?.action === 'edit'
    },
    approvalStatus() {
      return this.modal?.data?.approvalStatus
    },
    isApproved() {
      return this.approvalStatus === 'Approved'
    },
    isEditable() {
      return !(this.modal?.action !== 'view' && this.approvalStatus !== 'Pending')
    },
    modalTitle() {
      if (this.isModalView) {
        return this.$t('table.dialog.view-loan')
      } else if (this.isModalEdit) {
        return this.$t('table.dialog.edit-loan')
      }
      return this.$t('table.dialog.add-loan')
    }
  },
  watch: {
    modal(params) {
      if (params.show && params.action !== 'add' && params?.data) {
        this.attachments = params?.data?.attachments || []
        this.editFields.forEach((v) => this.form.getFieldDecorator(v))
        this.form.setFieldsValue(pick(params?.data, this.editFields))
        this.form.setFieldsValue({
          employeeNumber: params?.data?.employee.employeeNumber || null,
          department: params?.data?.employee.department || null,
          employeeID: params?.data?.employee.id || null
        })
      }
    }
  },
  methods: {
    closeReject() {
      this.rejectModal = false
      this.rejectForm.resetFields()
    },
    beforeUpload(file) {
      const isLt1M = file?.size / 1024 / 1024 < 1
      if (!isLt1M) this.$message.error(this.$t('error.max-1mb-file'))
      return !isLt1M
    },
    handleChange(info) {
      this.attachments = info.fileList
    },
    handleSelectChangeEmployee (data) {
      this.employee = data.id
    },
    handleSelectChangeLoanType (data) {
      this.loanType = data.id
    },
    handleSubmit() {
      this.form.validateFields((err, values) => !err && this.showInfo())
    },
    handleRejectSubmit() {
      this.rejectForm.validateFields((err, values) => !err && this.showRejectInfo())
    },
    showNotification() {
      this.$notification.open({
        message: this.isModalEdit
          ? this.$t('notification.loan-transaction.updated')
          : this.$t('notification.loan-transaction.added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showRejectInfo() {
      this.$confirm({
        title: this.$t('table.dialog.confirm-msg'),
        okText: this.$t('table.dialog.yes'),
        cancelText: this.$t('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          try {
            await this.$store.dispatch('api/main/hr/loanTransactions/status', {
              id: this.modal?.data?.id,
              approvalStatus: 'Rejected',
              rejectionReason: this.rejectForm.getFieldValue('rejectionReason') || ''
            })

            this.$notification.open({
              message: this.$t('notification.loan-transaction.rejected'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
            this.closeModal()
            this.closeReject()
            this.$emit('refreshTable')
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
        }
      })
    },
    showInfo() {
      this.$confirm({
        title: this.$t('table.dialog.confirm-msg'),
        okText: this.$t('table.dialog.yes'),
        cancelText: this.$t('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          let formData
          if (this.isModalEdit && this.modal.data.id) {
            formData = {
              id: this.modal.data.id,
              terms: this.form.getFieldValue('terms'),
              interestRate: this.form.getFieldValue('interestRate'),
              autoRepayment: this.form.getFieldValue('autoRepayment'),
              monthlyRepayment: this.form.getFieldValue('monthlyRepayment')
            }
          } else {
            const blob = new Blob(
              [
                JSON.stringify({
                  employeeSetupId: this.employee,
                  employeeSetupLoanId: this.loanType,
                  loanAmount: this.form.getFieldValue('loanAmount'),
                  remarks: this.form.getFieldValue('remarks')
                })
              ],
              {
                type: 'application/json'
              }
            )
            formData = new FormData()
            formData.append(this.isModalEdit ? 'hrLoanTransactionAddParam' : 'hrLoanTransactionAddParam', blob)
            this.attachments.map((r) => formData.append('attachments', r.originFileObj))
          }

          try {
            await this.$store.dispatch(`api/main/hr/loanTransactions/${this.isModalEdit ? 'update' : 'add'}`, formData)
            this.showNotification()
            this.closeModal()
            this.$emit('refreshTable')
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
        }
      })
    },
    handleStatus(status) {
      if (!status) return
      if (status === 'Approved') {
        this.$confirm({
          title: this.$t('table.dialog.approve-msg'),
          okText: this.$t('table.dialog.yes'),
          cancelText: this.$t('table.dialog.no'),
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
          onOk: async () => {
            try {
              await this.$store.dispatch('api/main/hr/loanTransactions/status', {
                id: this.modal?.data?.id,
                approvalStatus: 'Approved'
              })

              this.$notification.open({
                message: this.$t('notification.loan-transaction.approved'),
                icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
              })
            } catch (e) {
              this.$message.error(e.response.data.message)
            }
            this.$emit('refreshTable')
            this.closeModal()
          }
        })
      } else {
        this.rejectModal = true
      }
    },
    closeModal() {
      this.attachments = []
      this.form.resetFields()
    }
  }
}
</script>
