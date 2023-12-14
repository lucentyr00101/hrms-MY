<template>
  <div>
    <a-modal :title="$t('table.dialog.reset-password')" :width="800" v-model="resetPasswordModal" @cancel="closeModal">
      <a-form-item :validate-status="valid ? 'validating' : 'error'" :help="passwordHelper">
        <a-input-password placeholder="New Password" v-model="password" :maxLength="16" />
      </a-form-item>

      <template slot="footer">
        <a-button key="back" @click="closeModal"> Cancel </a-button>
        <a-button key="submit" type="primary" @click="confirmResetPassword" :disabled="!password">
          {{ $t('reset') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { validatePassword } from '@/utils/util'
import InfoCircle from '@/assets/info-circle.svg'

const passwordHelper = 'Alpha-numerical. 8-16 characters'

export default {
  name: 'Account',
  props: {
    id: {
      type: String,
      default: () => ''
    },
    apiUrl: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      password: '',
      passwordHelper: passwordHelper,
      valid: true,
      visible: false
    }
  },
  computed: {
    resetPasswordModal: {
      get() {
        return this.$store.state.modal.resetPasswordModal
      },
      set() {
        // just to prevent error log when @cancel
      }
    }
  },
  created() {
    this.$watch('apiUrl', () => {
      console.log(this.apiUrl)
    })
  },
  methods: {
    closeModal() {
      this.$store.commit('modal/TOGGLE_RESET_PASSWORD_MODAL')
      this.password = ''
      this.valid = true
      this.$emit('clearId')
    },
    showNotification() {
      this.$notification.open({
        message: this.$t('table.dialog.reset-password-successfully'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    confirmResetPassword() {
      const validateMessage = validatePassword(this.password)
      const _this = this
      if (!validateMessage) {
        // call reset api
        this.valid = true
        this.passwordHelper = passwordHelper
        this.$confirm({
          title: this.$t('table.dialog.confirm-msg'),
          okText: this.$t('table.dialog.yes'),
          cancelText: this.$t('table.dialog.no'),
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
          async onOk() {
            try {
              await _this.$store.dispatch(_this.apiUrl, { email: _this.id, newPassword: _this.password })
              _this.closeModal()
              _this.showNotification()
            } catch (e) {
              console.error(e)
            }
          },
          onCancel() {}
        })
      } else {
        this.valid = false
        this.passwordHelper = validateMessage
      }
    }
  }
}
</script>
