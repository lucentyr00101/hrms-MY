<template>
  <a-modal
    centered
    :okText="$t('table.dialog.confirm')"
    :cancelButtonProps="{ style: 'display: none;' }"
    :visible="value"
    :destroyOnClose="true"
    :title="$t('table.dialog.reject')"
    :confirm-loading="loading"
    @cancel="closeModal"
    @ok="handleSubmit"
  >
    <a-form :form="form" layout="horizontal" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
      <a-form-item :label="$t('table.dialog.reason-for-rejection')">
        <a-textarea
          :autoSize="{ minRows: 3, maxRows: 6 }"
          :maxLength="100"
          v-decorator="[
            'rejectionReason',
            {initialValue: ''}
          ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    value: Boolean,
    id: {
      type: String,
      default: () => null
    }
  },
  data () {
    return {
      loading: false,
      form: this.$form.createForm(this, { name: 'rejectResignationModal' })
    }
  },
  methods: {
    ...mapActions('api/setup/employee/employeeSetup/resignation', ['reject']),
    closeModal () {
      this.$emit('input', false)
      this.$emit('closeModal')
    },
    async handleSubmit () {
      try {
        this.loading = true
        this.closeModal()
        this.reject({
          id: this.id,
          ...this.form.getFieldsValue()
        })
        this.loading = false
        this.$notification.open({
          message: this.$t('notification.resignation.reject'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
      } catch (e) {
        this.loading = false
      }
    }
  }
}
</script>
