<template>
  <a-modal
    centered
    :okText="$t('table.dialog.confirm')"
    :cancelButtonProps="{ style: 'display: none;' }"
    :visible="value"
    :destroyOnClose="true"
    :title="$t('resignation.approval')"
    :confirm-loading="loading"
    @cancel="closeModal"
    @ok="handleSubmit"
  >
    <a-form :form="form" layout="horizontal" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
      <a-form-item :label="$t('table.dialog.last-date-of-work')">
        <a-date-picker
          v-decorator="[
            'lastWorkingDate',
            {
              rules: [
                { required: true, message: $t('error.resignation.last-date-of-work') }
              ]
            }
          ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

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
      form: this.$form.createForm(this, { name: 'approveResignation' })
    }
  },
  methods: {
    ...mapActions('api/setup/employee/employeeSetup/resignation', ['approve']),
    closeModal () {
      this.$emit('input', false)

      this.$emit('closeModal')
    },
    async handleSubmit () {
      try {
        this.loading = true
        const data = await this.form.validateFields()

        if (data) {
          data.id = this.employeeResignation.id
          if (data.lastWorkingDate) {
            data.lastWorkingDate = data.lastWorkingDate.format('YYYY-MM-DD')
          }
        }
        await this.approve({ id: this.id, data })
        this.closeModal()
        this.loading = false
        this.$notification.open({
          message: this.$t('notification.resignation.approve'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
      } catch (e) {
        this.loading = false
      }
    }
  },
  computed: {
    ...mapGetters('api/setup/employee/employeeSetup/resignation', ['employeeResignation'])
  }
}
</script>
