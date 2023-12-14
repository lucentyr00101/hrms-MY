<template>
  <a-modal
    centered
    :okText="$t('table.dialog.confirm')"
    :cancelButtonProps="{ style: 'display: none;' }"
    :visible="showResignationReasonModal"
    :destroyOnClose="true"
    :title="$t('table.dialog.resign')"
    :confirm-loading="loading"
    @cancel="closeModal"
    @ok="handleSubmit"
  >
    <a-form :form="form" layout="horizontal" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
      <a-form-item :label="$t('table.dialog.reason-for-leaving')">
        <a-textarea
          :autoSize="{ minRows: 3, maxRows: 6 }"
          :maxLength="100"
          v-decorator="[
            'resignationReason',
            {initialValue: ''}
          ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { noWhitespaceAllowed } from '@/utils/validators'

export default {
  data () {
    return {
      loading: false,
      form: this.$form.createForm(this),
      employeeId: this.$route.params.id
    }
  },

  computed: {
    ...mapGetters('modal', ['showResignationReasonModal'])
  },
  methods: {
    ...mapActions('api/setup/employee/employeeSetup/resignation', ['addResignation']),
    noWhitespaceAllowed,
    closeModal () {
      this.$store.commit('modal/TOGGLE_RESIGNATION_REASON_MODAL')
    },
    async handleSubmit () {
      this.form.validateFields(async (err, values) => {
        if (!err) {
           this.loading = true
            await this.addResignation({ employeeSetupId: this.employeeId, ...values })
            this.closeModal()
            this.loading = false
        }
      })
    }
  }
}
</script>
