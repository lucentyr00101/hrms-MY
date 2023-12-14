<template>
  <div>
    <a-modal
      :title="$t('table.dialog.view-loan-details')"
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
          <span class="label">{{ $t('table.column.applied-time') }} :</span>
          <span class="value">{{ model?.appliedTime || '--' }}</span>
        </a-col>
        <a-col :span="12">
          <span class="label">{{ $t('table.column.loan-type') }} :</span>
          <span class="value">{{ model?.loanType || '--' }}</span>
        </a-col>
        <a-col :span="12">
          <span class="label">{{ $t('table.column.loan-amount') }} :</span>
          <span class="value">{{ model?.loanAmount || '0' }}</span>
        </a-col>
        <a-col :span="12">
          <span class="label">{{ $t('table.dialog.loan-repaid') }} :</span>
          <span class="value">{{ model?.loanRepaid || '0' }}</span>
        </a-col>
        <a-col :span="12">
          <span class="label">{{ $t('table.dialog.loan-balance') }} :</span>
          <span class="value">{{ model?.loanBalance || '0' }}</span>
        </a-col>
        <a-col :span="12">
          <span class="label">{{ $t('table.dialog.remarks') }} :</span>
          <span class="value">{{ model?.remarks || '--' }}</span>
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
      <a-divider></a-divider>
      <table class="terms">
        <tr>
          <td><span>*</span> {{ $t('table.dialog.terms') }} :</td>
          <td>{{ model?.terms || '--' }}</td>
        </tr>
        <tr>
          <td><span>*</span> {{ $t('table.dialog.interest-rate') }} :</td>
          <td>{{ model?.interestRate || '--' }} %</td>
        </tr>
        <tr>
          <td><span>*</span> {{ $t('table.dialog.auto-repayment') }} :</td>
          <td>{{ model?.autoRepayment || '--' }}</td>
        </tr>
        <tr>
          <td><span>*</span> {{ $t('table.dialog.monthly-repayment') }} :</td>
          <td>{{ model?.monthlyRepayment || '0' }}</td>
        </tr>
      </table>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    view() {
      this.visible = true
    },
    closeModal() {
      this.visible = false
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

.terms {
  tr {
    td {
      margin: 20px;
      span {
        color: #FF4D4F
      }
    }
    td:first-child {
      float: right
    }
  }
}

</style>
