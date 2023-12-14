<template>
  <a-modal
    :visible="value"
    :maskClosable="false"
    :closable="false"
    :okButtonProps="{style: { display: 'none' }}"
    :cancelButtonProps="{style: { display: 'none' }}"
  >
    <div class="message">
      <p>{{ messagesMap[type] }}</p>
      <p>{{ subMessage }}</p>
    </div>
  </a-modal>
</template>

<script>
export default {
  props: {
    value: Boolean,
    type: {
      type: String,
      default: () => null // passwordChanged, roleDisabled, userDisabled
    }
  },
  data () {
    return {
      timer: 5
    }
  },
  watch: {
    value (visible) {
      if (visible) {
        this.runTimer()
      }
    }
  },
  computed: {
    subMessage () {
      return this.$t('auth.disabled-message') + this.timer + this.$t('seconds') + '.'
      // return this.type === 'roleDisabled'
      //   ? this.$t('auth.role-disabled-message') + this.timer + this.$t('seconds') + '.'
      //   : this.$t('auth.disabled-message') + this.timer + this.$t('seconds') + '.'
    },
    messagesMap () {
      return {
        passwordChanged: this.$t('auth.password-reset'),
        userDisabled: this.$t('auth.user-disabled'),
        roleDisabled: this.$t('auth.role-disabled-site')
      }
    }
  },
  methods: {
    async logout () {
      console.log('logout method')
      try {
        await this.$store.dispatch('Logout')
        window.location.href = '/'
      } catch (e) {
        console.log(e)
      }
    },
    runTimer () {
      setTimeout(async () => {
        if (this.timer > 0) {
          this.timer--
          this.runTimer()
        } else {
          await this.logout()
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.message {
  font-weight: bold;
  font-size: 20px;
  p {
    margin-bottom: 0;
  }
}
</style>
