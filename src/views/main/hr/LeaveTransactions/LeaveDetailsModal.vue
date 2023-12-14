<template>
  <div>
    <a-modal
      :title="$t('table.dialog.view-leave-details')"
      :width="1000"
      :visible="visible"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      @cancel="closeModal"
    >
      <a-row class="details-holder" type="flex" :gutter="[80, 40]">
        <a-col :span="12">
          <span class="label">{{ $t('table.dialog.employee-number') }} :</span>
          <span class="value">{{ model?.employeeSetup?.employeeNumber || '--' }}</span>
        </a-col>
        <a-col :span="12">
          <span class="label">{{ $t('table.dialog.department') }} :</span>
          <span class="value">{{ model?.employeeSetup?.department || '--' }}</span>
        </a-col>
        <a-col :span="12">
          <span class="label">{{ $t('table.dialog.employee') }} :</span>
          <span class="value">{{ model?.employeeSetup?.fullName || '--' }}</span>
        </a-col>
        <a-col :span="12">
          <span class="label">{{ $t('table.dialog.applied-date') }} :</span>
          <span class="value">{{ model?.appliedTime || '--' }}</span>
        </a-col>
        <a-col :span="12">
          <span class="label">{{ $t('table.dialog.leave-type') }} :</span>
          <span class="value">{{ model?.companyLeaveType?.leaveType || '--' }}</span>
        </a-col>
        <a-col :span="12">
          <span class="label">{{ $t('table.dialog.days') }} :</span>
          <span class="value">{{ model?.days || '--' }}</span>
        </a-col>
        <a-col :span="12">
          <span class="label">{{ $t('table.dialog.date') }} :</span>
          <span class="transactionDateList">
            <span v-for="(value, i) in model?.transactionDateList" :key="i">
              {{ value.startDate }} to {{ value.endDate }} {{ value.leaveDuration }}
              <br>
            </span>
          </span>
        </a-col>
        <a-col :span="12">
          <span class="label">{{ $t('table.dialog.reasons') }} :</span>
          <span class="value">{{ model?.reasons || '--' }}</span>
        </a-col>
      </a-row>
      <a-row class="attachment-holder" type="flex">
        <a-col class="attachment-col">
          <span class="label">{{ $t('table.dialog.attachment') }} :</span>
          <div class="attachments-images">
            <div class="images-holder" v-for="(value, i) in model?.attachments" :key="i">
              <img v-if="value.fileSuffix === 'jpg' || value.fileSuffix === 'png' || value.fileSuffix === 'PNG'" style="width: 120px; height: 120px" :src="value.fileLink" />
              <a-icon v-else type="file" class="file-icon"/>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row class="reasons-holder" type="flex">
        <a-col class="reasons-col">
          <span class="label">{{ $t('table.dialog.reason-for-rejection') }} : {{ model?.rejectionReason || '--' }}</span>
        </a-col>
      </a-row>
      <template slot="footer">
        <a-button v-action:main_hr_leave-transactions_view-details_reject v-if="model?.status === 'Pending'" type="danger" @click="handleReject">{{ $t('table.dialog.reject') }}</a-button>
        <a-button v-action:main_hr_leave-transactions_view-details_approve v-if="model?.status === 'Pending'" type="primary" @click="showConfirm">{{ $t('table.dialog.approve') }}</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'
export default {
  props: {
    model: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      visible: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'leaveDetailsModal' })
    }
  },
  methods: {
    view() {
      this.visible = true
    },
    closeModal() {
      this.visible = false
    },
    handleReject() {
      this.$parent.$parent.id = this.model?.id
      this.$parent.$parent.$refs.rejectModal.view()
    },
    showConfirm () {
      this.$confirm({
        centered: true,
        title: this.$t('table.dialog.approve-msg'),
        okText: this.$t('table.dialog.yes'),
        cancelText: this.$t('table.dialog.no'),
        onOk: () => this.handleApprove(),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />
      })
    },
    async handleApprove() {
      const data = {
        id: this.model?.id
      }
      await this.$store.dispatch('api/main/hr/leaveTransactions/approve', data)
      this.$parent.$parent.$refs.table.refresh(true)
      this.closeModal()
      this.$notification.open({
        message: this.$t('notification.leave.approved'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    }
  }
}
</script>

<style lang="less">
.checkboxForm .ant-form-item-control {
  width: 150px;
}

.ant-modal-body {
  padding: 24px 54px;
}

.details-holder .label {
  display: inline-block;
  width: 150px;
}

.attachment-holder {
  margin-top: 50px;
  margin-bottom: 30px;
  .label {
    display: inline-block;
    width: 152px;
  }
  .attachment-col {
    display: flex;
      .attachments-images {
        display: flex;
        flex-wrap: wrap;
        width: 750px;
        .images-holder {
          margin: 0 20px 20px 0;
        }
    }
  }
}

.custom-form .ant-form-item {
  margin: 0;
}

.transactionDateList {
  span:not(:first-child) {
    position: relative;
    left: 154px;
  }
}

.file-icon {
  svg {
    width: 120px;
    height: 120px;
  }
}

</style>
