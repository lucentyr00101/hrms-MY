<template>
  <div id="resignation">
    <img src="@/assets/resignation-pending.png" alt="">
    <p class="title">{{ header }}</p>
    <div class="content">
      <p class="message">{{ $t('table.dialog.reason-for-leaving') }}</p>
      <p class="option">
        {{ employeeResignation.resignationReason }}
      </p>
    </div>

    <a-space style="align-self: end;">
      <!-- <cancel-button /> -->
      <withdraw-button/>
      <!-- show approve/reject when user is HR/Manager -->
      <a-button v-action:setup_employee_employee-setup_resignation_approve type="danger" @click="showApprovalModal = true" v-if="employee.data?.employeeNumber !== currentUser?.employeeNumber">{{ $t('table.dialog.approve') }}</a-button>
      <a-button v-action:setup_employee_employee-setup_resignation_reject type="primary" ghost @click="showRejectionModal = true" v-if="employee.data?.employeeNumber !== currentUser?.employeeNumber">{{ $t('table.dialog.reject') }}</a-button>
    </a-space>

    <ResignationApprovalModal v-model="showApprovalModal" :id="employeeResignation.id"/>
    <ResignationRejectionModal v-model="showRejectionModal" :id="employeeResignation.id"/>
  </div>
</template>

<script>
import CancelButton from '@/components/Setup/Employee/EmployeeSetup/CancelButton.vue'
import { mapActions, mapGetters } from 'vuex'
import WithdrawButton from './WithdrawButton.vue'
export default {
  name: 'PendingResignation',
  components: {
    ResignationApprovalModal: () => import('@/components/Setup/Employee/EmployeeSetup/Resignation/ApprovalModal'),
    ResignationRejectionModal: () => import('@/components/Setup/Employee/EmployeeSetup/Resignation/RejectResignationModal'),
    WithdrawButton,
    CancelButton
  },
  data () {
    return {
      showApprovalModal: false,
      showRejectionModal: false,
      showModal: false,
      loading: false
    }
  },
  computed: {
    ...mapGetters('api/setup/employee/employeeSetup/resignation', ['status', 'employeeResignation']),
    ...mapGetters('api/auth', ['currentUser']),
    ...mapGetters('api/setup/employee/employeeSetup', ['employee']),
    header () {
      return `${this.$t('resignation.status')}: ${this.$t('resignation.pending')}`
    }
  },

  methods: {
    ...mapActions('api/setup/employee/employeeSetup', ['get'])
  }
}
</script>

<style lang="less" scoped>
#resignation {
  height: 100%;
  padding: 20% 50px;
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
  .ant-btn {
    align-self: end;
  }
}
</style>
