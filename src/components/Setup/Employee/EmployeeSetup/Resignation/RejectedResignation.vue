<template>
  <div id="resignation">
    <img src="@/assets/resignation-rejected.png" alt="">
    <p class="title">{{ header }}</p>
    <div class="content">
      <p class="message">{{ $t('table.dialog.reason-for-leaving') }}</p>
      <p class="option">
        {{ employeeResignation.resignationReason }}
      </p>
    </div>
    <div class="content">
      <p class="message">{{ $t('table.dialog.reason-for-rejection') }}</p>
      <p class="option">
        {{ employeeResignation.rejectionReason }}
      </p>
    </div>
    <a-space style="align-self: end;">
      <withdraw-button />
      <a-button v-if="employee.data?.employeeNumber == currentUser.employeeNumber" type="primary" ghost @click="$store.commit('modal/TOGGLE_RESIGNATION_REASON_MODAL')">{{ $t('table.dialog.resubmit-resignation') }}</a-button>
    </a-space>
    <a-modal
      :title="$t('resignation.withdraw')"
      centered
      v-model="showModal"
      okText="Confirm"
      :cancelButtonProps="{style: { display: 'none' }}"
      @ok="withdrawResignation"
      destroyOnClose
      :confirmLoading="loading"
    >
      <p>{{ $t('resignation.withdraw-message') }}</p>
    </a-modal>
    <ResignReasonModal />
  </div>
</template>

<script>
import CancelButton from '@/components/Setup/Employee/EmployeeSetup/CancelButton.vue'
import { mapActions, mapGetters } from 'vuex'
import WithdrawButton from './WithdrawButton.vue'
export default {
  name: 'PendingResignation',
  components: {
    ResignReasonModal: () => import('@/components/Setup/Employee/EmployeeSetup/Resignation/ResignReasonModal'),
    CancelButton,
    WithdrawButton
  },
  data () {
    return {
      showModal: false,
      loading: false
    }
  },
  computed: {
    ...mapGetters('api/auth', ['currentUser']),
    ...mapGetters('api/setup/employee/employeeSetup', ['employee']),
    ...mapGetters('api/setup/employee/employeeSetup/resignation', ['status', 'employeeResignation']),
    header () {
      return `${this.$t('resignation.status')}: ${this.$t('table.dialog.rejected')}`
    }
  },
  methods: {
    ...mapActions('api/setup/employee/employeeSetup/resignation', ['withdraw']),
    withdrawResignation () {
      return new Promise(async (resolve) => {
        this.loading = true
        await this.withdraw({ id: this.employeeResignation.id })
        this.showModal = false

        this.$notification.open({
          message: this.$t('notification.resignation.withdraw'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.loading = false
        resolve()
      })
    }
  }
}
</script>

<style lang="less" scoped>
#resignation {
  height: 100%;
  padding: 12% 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .title {
    font-size: 24px;
    font-weight: 500;
    margin-top: 20px;
  }
  .message {
    font-weight: 700;
    font-size: 16px;
  }
  .option {
    font-weight: 400;
    font-size: 14px;
  }
  .content {
    background: #FAFAFA;
    padding: 24px 40px;
    margin-bottom: 40px;
    min-width: 100%;
  }
}
</style>
