<template>
  <div>
    <!-- Image Modal -->
    <a-modal
      class="modal-image-holder"
      :width="700"
      v-model="imageModal.show"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
    >
      <img :src="imageModal.data.fileLink" />
      <a-button type="approve" icon="download" @click="downloadImage(imageModal.data)">{{
        $t('table.dialog.download')
      }}</a-button>
    </a-modal>
    <!-- /Image Modal -->

    <!-- Reject Modal -->
    <a-modal
      class="modal-reject-holder"
      title="Claim Rejection"
      :width="500"
      v-model="rejectModal.show"
      :okText="$t('table.dialog.confirm')"
      @ok="reject"
      @cancel="
        () => {
          rejectModal.form.resetFields()
        }
      "
    >
      <a-form :form="rejectModal.form" @submit.prevent>
        <a-form-item :label="`${$t('table.column.reject-remarks')}: `" :style="{ margin: '-20px 0 0 0' }">
          <a-input
            v-decorator="[
              'rejectRemarks',
              { rules: [{ required: true, message: $t('error.reject-remarks.required') }] }
            ]"
            type="textarea"
            :maxLength="100"
            style="width: 100%"
            rows="8"
            placeholder="Please state your reason why you're rejecting the deposit"
          />
        </a-form-item>
        <p :style="{ margin: 0, textAlign: 'right' }">
          {{ rejectModal.form.getFieldValue('rejectRemarks')?.length || 0 }} / 100
        </p>
      </a-form>
    </a-modal>
    <!-- /Reject Modal -->

    <a-row class="details-holder" type="flex" :gutter="[8, 30]">
      <a-col v-for="(item, index) of details" :key="index" :span="12">
        <span class="label">{{ item?.label }}:</span>
        <span class="value">{{ item?.value || '--' }}</span>
      </a-col>

      <a-col class="attachment" :span="24">
        <span class="label">Attachment:</span>
        <div v-if="modal?.data.attachments?.length > 0" class="image-wrapper">
          <div v-for="(item, index) of modal?.data.attachments" :key="index" class="value">
            <div
              class="image-holder"
              :style="{ backgroundImage: `url(${item.fileLink})` }"
              @click="
                () => {
                  imageModal = { show: true, data: item }
                }
              "
            ></div>
          </div>
        </div>
        <span v-else class="value">--</span>
      </a-col>

      <a-col v-if="modal?.data?.rejectionReason" :span="24">
        <span class="label">{{ $t('table.column.reason-for-rejecting') }}:</span>
        <span class="value">{{ modal?.data?.rejectionReason }}</span>
      </a-col>
    </a-row>

    <div :style="{ display: 'flex', justifyContent: 'flex-end', margin: '50px 0 0' }">
      <!-- <a-button :style="{ margin: '0 5px' }">{{ $t('table.dialog.cancel') }}</a-button> -->
      <a-button
        v-action:main_hr_claim-transactions_view-details_reject
        type="danger"
        :style="{ margin: '0 5px' }"
        :disabled="/approved|rejected/gi.test(modal?.data?.approvalStatus)"
        @click="
          () => {
            rejectModal.show = true
          }
        "
        >{{ $t('table.dialog.reject') }}</a-button
      >
      <a-button
        v-action:main_hr_claim-transactions_view-details_approve
        type="approve"
        :style="{ margin: '0 5px' }"
        :disabled="/approved/gi.test(modal?.data?.approvalStatus)"
        @click="approve"
        >{{ $t('table.dialog.approve') }}</a-button
      >
    </div>
  </div>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'MainHRClaimTransactionsDetails',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      imageModal: { show: false, data: {} },
      rejectModal: { show: false, form: this.$form.createForm(this) }
    }
  },
  computed: {
    mainParent() {
      return this.getParent('MainHRClaimTransactions')
    },
    details() {
      const {
        employee,
        companyClaimType,
        claimAmount,
        claimsFor,
        appliedTime,
        remarks,
        hrClaimTransactionCustomInputs = []
      } = this.modal?.data || {}
      let details = [
        { label: 'Employee Number', value: employee?.employeeNumber },
        { label: 'Department', value: employee?.department },
        { label: 'Employee', value: employee?.fullName },
        { label: 'Applied Time', value: this.formatDate(appliedTime, 'YYYY-MM-DD HH:mm:ss') },
        { label: 'Claim Type', value: companyClaimType?.claimType },
        { label: 'Claim Amount', value: claimAmount }
      ]
      hrClaimTransactionCustomInputs.forEach((item) => {
        const customDetails = { label: item.name, value: item.value || '' }
        if (item.value === 'true') {
          customDetails.value = 'Enabled'
        }
        if (item.value === 'false') {
          customDetails.value = 'Disabled'
        }
        details = [...details, customDetails]
      })
      details = [...details, { label: 'Claim For', value: claimsFor }, { label: 'Remarks', value: remarks }]
      return details
    }
  },
  watch: {},
  methods: {
    downloadImage(image) {
      fetch(String(image.fileLink).replace('http:', 'https:'), { mode: 'cors' })
        .then((response) => response.blob())
        .then((imageBlob) => {
          const imageObjectURL = window.URL.createObjectURL(imageBlob)
          const link = document.createElement('a')
          link.download = image.fileOriginName
          link.href = imageObjectURL
          link.click()
        })
    },
    reject() {
      this.rejectModal.form.validateFields(
        (error) =>
          !error &&
          (async () => {
            try {
              await this.$store.dispatch('api/main/hr/claimTransactions/reject', {
                id: this.modal?.data?.id,
                rejectionReason: this.rejectModal.form.getFieldValue('rejectRemarks')
              })
              this.rejectModal.show = false
              this.rejectModal.form.resetFields()
              this.$notification.open({
                message: this.$t('notification.claim-transactions.rejected'),
                icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
              })
              this.mainParent.refreshTable()
            } catch (error) {
              this.$message.error(error)
            }
          })()
      )
    },
    approve() {
      this.$confirm({
        title: this.$t('approve.confirm'),
        okText: 'Yes',
        cancelText: 'No',
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          const data = { id: this.modal.data.id }
          // console.log(data)
          try {
            await this.$store.dispatch('api/main/hr/claimTransactions/approve', data)
            this.$notification.open({
              message: this.$t('notification.claim-transactions.approved'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
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
  created() {}
}
</script>

<style>
.details-holder .ant-col {
  display: flex;
}

.details-holder .label {
  display: inline-block;
  min-width: 150px;
}

.details-holder .value {
  display: inline-block;
  overflow: hidden;
}

.details-holder .attachment {
  margin: 30px 0 20px 0;
}

.details-holder .attachment .value {
  overflow: initial;
}

.image-holder {
  width: 120px;
  height: 120px;
  margin: 0 5px 5px 5px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 5px 5px 5px 2px #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  cursor: pointer;
}

.modal-image-holder img {
  display: block;
  width: auto;
  max-width: 100%;
  margin: 20px auto 0 auto;
}

.modal-image-holder .ant-btn {
  display: block;
  margin: 20px auto 0 auto;
}

.ant-btn-approve {
  color: #fff;
  background-color: #00c39d;
  border-color: #00c39d;
}

.ant-btn-approve:hover,
.ant-btn-approve:focus {
  color: #fff;
  background-color: #00d59d;
  border-color: #00d59d;
}
</style>
