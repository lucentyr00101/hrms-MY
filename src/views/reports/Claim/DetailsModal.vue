<template>
  <div>
    <a-modal
      :title="$t('table.dialog.view-claim-details')"
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
          <span class="label">{{ $t('table.column.claim-type') }} :</span>
          <span class="value">{{ model?.claimType || '--' }}</span>
        </a-col>
        <a-col :span="12">
          <span class="label">{{ $t('table.column.claim-amount') }} :</span>
          <span class="value">{{ model?.claimAmount || '--' }}</span>
        </a-col>
        <a-col :span="12" v-for="(value, i) in model?.hrClaimTransactionCustomInputs" :key="i">
          <span class="label">{{ value.name }} :</span>
          <span class="value" v-if="value.value === 'true' || value.value === 'false'">{{ value.value ? 'Enabled' : 'Disabled' }}</span>
          <span class="value" v-else>{{ value.value }}</span>
        </a-col>
        <a-col :span="12">
          <span class="label">{{ $t('table.column.claim-for') }} :</span>
          <span class="value">{{ model?.claimFor || '--' }}</span>
        </a-col>
        <a-col :span="12">
          <span class="label">{{ $t('table.dialog.remarks') }} :</span>
          <span class="value">{{ model?.remarks || '--' }}</span>
        </a-col>
      </a-row>
      <a-row class="attachment-holder" type="flex">
        <a-col class="attachment-col">
          <span class="label">{{ $t('table.dialog.attachment') }} :</span>
          <div class="attachments">
            <div class="images-holder" v-for="(value, i) in model?.attachments" :key="i">
              <img v-if="value.fileSuffix === 'jpg' || value.fileSuffix === 'png' || value.fileSuffix === 'PNG'" style="width: 120px; height: 120px" :src="value.fileLink" />
              <a-icon v-else type="file" class="file-icon"/>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row class="reasons-holder" type="flex">
        <a-col class="reasons-col">
          <span class="label">{{ $t('table.dialog.reason-for-rejection') }} : {{ model?.rejectReason || '--' }}  </span>
        </a-col>
      </a-row>
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
    width: 150px;
  }
  .attachment-col {
    display: flex;
      .attachments {
        display: flex;
        .images-holder {
          margin-right: 20px;
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
