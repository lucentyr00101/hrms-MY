<template>
  <a-modal
    centered
    :title="$t('table.dialog.leave-rejection')"
    :width="500"
    :okText="$t('table.dialog.confirm')"
    :visible="visible"
    :destroyOnClose="true"
    :confirm-loading="loading"
    @cancel="closeModal"
    @ok="showConfirm"
  >
    <a-form :form="form">
      <a-form-item :label="$t('table.dialog.reasons-rejecting')">
        <a-textarea
        :placeholder="$t('table.dialog.state-reason')"
        :autoSize="{ minRows: 3, maxRows: 6 }"
        :maxLength="100"
        v-decorator="[
          'rejectionReason',
          {
            rules: [
              { required: true, message: $t('error.reasons-rejecting.required') }
            ]
          }
        ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'
export default {
  props: {
    value: Boolean,
    model: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      visible: false,
      loading: false,
      form: this.$form.createForm(this, { name: 'rejectModal' })
    }
  },
  methods: {
    view() {
      this.visible = true
    },
    closeModal() {
      this.visible = false
    },
    async showConfirm () {
      try {
        await this.form.validateFields()
        this.$confirm({
          centered: true,
          title: this.$t('table.dialog.confirm-msg'),
          okText: this.$t('table.dialog.yes'),
          cancelText: this.$t('table.dialog.no'),
          onOk: () => this.handleSubmit(),
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />
        })
      } catch (e) {}
    },
    async handleSubmit () {
      try {
        this.loading = true
        const data = {
          id: this.model.id,
          rejectionReason: this.form.getFieldValue('rejectionReason')
        }
        await this.$store.dispatch('api/main/hr/leaveTransactions/reject', data)
        this.$parent.$parent.$refs.table.refresh(true)
        this.$parent.$parent.model.status = 'Rejected'
        this.closeModal()
        this.$parent.$parent.$refs.leaveDetailsModal.closeModal()
        this.$notification.open({
          message: this.$t('notification.leave.rejected'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    }
  }
}
</script>
