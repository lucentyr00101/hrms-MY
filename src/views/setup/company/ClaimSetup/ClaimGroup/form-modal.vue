<template>
  <a-modal
    :title="modalTitle"
    v-model="modal.show"
    :width="800"
    :cancelButtonProps="{ style: { display: 'none' } }"
    :okButtonProps="{ style: { display: 'none' } }"
    @cancel="closeModal()"
  >
    <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
      <a-form-item :label="$t('table.top.claim-group')">
        <a-input
          :maxLength="25"
          v-decorator="['claimGroup', { rules: [{ required: true, message: $t('error.claim-group2.required') }] }]"
        >
        </a-input
      ></a-form-item>
      <a-form-item :label="$t('table.column.descriptions')">
        <a-input :maxLength="100" type="textarea" mode="tags" style="width: 100%" v-decorator="['descriptions']">
        </a-input
      ></a-form-item>
      <a-form-item :wrapperCol="{ span: 12, offset: 17 }" :style="{ margin: '20px 0 0 0' }">
        <a-button
          v-if="modal?.action === 'view'"
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
    </a-form>
  </a-modal>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'ClaimGroupModal',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      fields: ['claimGroup', 'descriptions'],
      form: this.$form.createForm(this)
    }
  },
  computed: {
    mainParent() {
      return this.getParent('SetupCompanyClaimSetupGroup')
    },
    modalTitle() {
      return this.modal?.action === 'view'
        ? this.$t('table.dialog.view-claim-group')
        : this.modal?.action === 'edit'
        ? this.$t('table.dialog.edit-claim-group')
        : this.$t('table.dialog.add-claim-group')
    }
  },
  watch: {
    modal(to) {
      if (to.show && to.action !== 'add' && to?.data) {
        this.fields.forEach((v) => this.form.getFieldDecorator(v))
        const { claimGroup, descriptions } = to.data
        this.form.setFieldsValue({ claimGroup, descriptions })
      }
    }
  },
  methods: {
    closeModal() {
      this.form.resetFields()
    },
    handleSubmit(result) {
      this.form.validateFields((err, values) => !err && this.showInfo(result))
    },
    showNotification() {
      this.$notification.open({
        message:
          this.modal.action === 'edit'
            ? this.$t('table.dialog.claim-group-updated')
            : this.$t('table.dialog.claim-group-added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo() {
      this.$confirm({
        title: this.$t('table.dialog.confirm-msg'),
        okText: this.$t('table.dialog.yes'),
        cancelText: this.$t('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,

        onOk: async () => {
          const data = {
            ...(this.modal.action === 'edit' ? { id: this.modal.data.id } : {}),
            claimGroup: this.form.getFieldValue('claimGroup'),
            descriptions: this.form.getFieldValue('descriptions') || '',
            status: this.modal?.data?.status || 'Enable'
          }
          try {
            await this.$store.dispatch(
              `api/setup/company/claimGroup/${this.modal.action === 'edit' ? 'update' : 'add'}`,
              data
            )
            this.showNotification()
            this.closeModal()
            this.$emit('refreshTable')
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
        },
        onCancel: () => {}
      })
    }
  }
}
</script>
