<template>
  <span class="header-notice">
    <a-popover
      v-model="visible"
      trigger="click"
      placement="bottomRight"
      overlayClassName="header-notice-wrapper"
      :getPopupContainer="() => $refs.noticeRef.parentElement"
      :autoAdjustOverflow="true"
      :arrowPointAtCenter="true"
      :overlayStyle="{ width: '300px', top: '50px'}"
    >
      <template slot="content">
        <div class="list">
          <a-list v-if="details?.pendingAttendance?.data?.count !== 0" size="small">
            <a-list-item
              class="list-item"
              @click="handleClick(details?.pendingAttendance?.notificationType, details?.pendingAttendance?.data)"
              :style="{ background: details?.pendingAttendance?.data?.readMessage === 'No' ? '#e9f3ff': '#fff'}"
            >
              <span><b>{{ details?.pendingAttendance?.data?.count }} Pending Attendance</b> are for your Approval.</span>
            </a-list-item>
          </a-list>
          <a-list v-if="details?.pendingLeave?.data?.count !== 0" size="small">
            <a-list-item
              class="list-item"
              @click="handleClick(details?.pendingLeave?.notificationType, details?.pendingLeave?.data)"
              :style="{ background: details?.pendingLeave?.data?.readMessage === 'No' ? '#e9f3ff': '#fff'}"
            >
              <span><b>{{ details?.pendingLeave?.data?.count }} Pending Leave</b> are for your Approval that is due on {{ details?.pendingLeave?.data?.date }}.</span>
            </a-list-item>
          </a-list>
          <a-list v-if="details?.pendingClaim?.data?.count !== 0" size="small">
            <a-list-item
              class="list-item"
              @click="handleClick(details?.pendingClaim?.notificationType, details?.pendingClaim?.data)"
              :style="{ background: details?.pendingClaim?.data?.readMessage === 'No' ? '#e9f3ff': '#fff'}"
            >
              <span><b>{{ details?.pendingClaim?.data?.count }} Pending Claims</b> are for your Approval.</span>
            </a-list-item>
          </a-list>
          <a-list v-if="details?.pendingLoans?.data?.count !== 0" size="small">
            <a-list-item
              class="list-item"
              @click="handleClick(details?.pendingLoans?.notificationType, {})"
              :style="{ background: details?.pendingLoans?.data?.readMessage === 'No' ? '#e9f3ff': '#fff'}"
            >
              <span><b>{{ details?.pendingLoans?.data?.count }} Pending Loans</b> are for your Approval.</span>
            </a-list-item>
          </a-list>
          <a-list v-if="details?.totalEmployeeWithoutWorkShift?.data?.count !== 0" size="small">
            <a-list-item
              class="list-item"
              @click="handleClick(details?.totalEmployeeWithoutWorkShift?.notificationType, details?.totalEmployeeWithoutWorkShift?.data)"
              :style="{ background: details?.totalEmployeeWithoutWorkShift?.data?.readMessage === 'No' ? '#e9f3ff': '#fff'}"
            >
              <span><b>{{ details?.totalEmployeeWithoutWorkShift?.data?.count }} Employees</b> are not assigned to a Work Shift on the coming month.</span>
            </a-list-item>
          </a-list>
          <a-list v-if="details?.attendance?.data.length !== 0" size="small" :data-source="details?.attendance?.data">
            <a-list-item
              class="list-item"
              slot="renderItem"
              slot-scope="item, index"
              :key="index"
              @click="handleClick(details?.attendance?.notificationType, item)"
              :style="{ background: item.readMessage === 'No' ? '#e9f3ff': '#fff'}"
            >
              <span v-if="item.status === 'Pending'">Your Attendance <b>{{ item.attendanceDate }}</b> is subject for Approval.</span>
              <span v-else>Your Attendance last <b>{{ item.attendanceDate }}</b> has been <b>{{ item.status }}</b>.</span>
            </a-list-item>
          </a-list>
          <a-list v-if="details?.leave?.data.length !== 0" size="small" :data-source="details?.leave?.data">
            <a-list-item
              class="list-item"
              slot="renderItem"
              slot-scope="item, index"
              :key="index"
              @click="handleClick(details?.leave?.notificationType, item)"
              :style="{ background: item.readMessage === 'No' ? '#e9f3ff': '#fff'}"
            >
              <span v-if="item.status === 'Pending'">Your <b>{{ item.leaveType }}</b> Request is subject for Approval.</span>
              <span v-else>Your <b>{{ capitalFirstLetter(item.leaveType) }}</b> for <b>{{ item.startDate }}</b> to <b>{{ item.endDate }}</b>  has been <b>{{ item.status }}</b>.</span>
            </a-list-item>
          </a-list>
          <a-list v-if="details?.claim?.data.length !== 0" size="small" :data-source="details?.claim?.data">
            <a-list-item
              class="list-item"
              slot="renderItem"
              slot-scope="item, index"
              :key="index"
              @click="handleClick(details?.claim?.notificationType, item)"
              :style="{ background: item.readMessage === 'No' ? '#e9f3ff': '#fff'}"
            >
              <span v-if="item.status === 'Pending'">Your <b>{{ item.claimType }}</b> Request is subject for Approval.</span>
              <span v-else>Your <b>{{ capitalFirstLetter(item.claimType) }}</b> amounting to <b>{{ item.amount }}</b> for the <b>{{ item.claimMonth }}</b>  has been <b>{{ item.status }}</b>.</span>
            </a-list-item>
          </a-list>
          <a-list v-if="details?.loan?.data.length !== 0" size="small" :data-source="details?.loan?.data">
            <a-list-item
              class="list-item"
              slot="renderItem"
              slot-scope="item, index"
              :key="index"
              @click="handleClick(details?.loan?.notificationType, item)"
              :style="{ background: item.readMessage === 'No' ? '#e9f3ff': '#fff'}"
            >
              <span v-if="item.status === 'Pending'">Your <b>{{ item.loanType }}</b> Request is subject for Approval.</span>
              <span v-else>Your <b>{{ capitalFirstLetter(item.loanType) }}</b> amounting to <b>{{ item.loanAmount }}</b> has been <b>{{ item.status }}</b>.</span>
            </a-list-item>
          </a-list>
          <a-list v-if="details?.payroll?.data.length !== 0" size="small" :data-source="details?.payroll?.data">
            <a-list-item
              class="list-item"
              slot="renderItem"
              slot-scope="item, index"
              :key="index"
              @click="handleClick(details?.payroll?.notificationType, item)"
              :style="{ background: item.readMessage === 'No' ? '#e9f3ff': '#fff'}"
            >
              <span v-if="item.isPublished === 'Yes'">Your Payslip for <b>{{ item.dateFrom }}</b> to <b>{{ item.dateTo }}</b> has been <b>Published</b>.</span>
            </a-list-item>
          </a-list>
          <a-list v-if="details?.workShift?.data && details?.workShift?.data?.displayNoWorkInfoNotification" size="small">
            <a-list-item class="list-item" :style="{ background: details?.workShift?.data?.readMessage === 'No' ? '#e9f3ff': '#fff'}">
              <span>You are not assigned to a Work Shift Starting <b>{{ details?.workShift?.data?.createdTime }}</b>. Please check contact your supervisor.</span>
            </a-list-item>
          </a-list>
          <a-list v-if="details?.announcement?.data.length !== 0" size="small" :data-source="details?.announcement?.data">
            <a-list-item
              class="list-item"
              slot="renderItem"
              slot-scope="item, index"
              :key="index"
              @click="handleClick(details?.announcement?.notificationType, item)"
              :style="{ background: item.readMessage === 'No' ? '#e9f3ff': '#fff'}"
            >
              <span>A new announcement <b>{{ capitalFirstLetter(item.title) }}</b> has been posted by <b>{{ item.author }}</b>. Please acknowledge.</span>
            </a-list-item>
          </a-list>
          <a-list v-if="details?.library?.data.length !== 0" size="small" :data-source="details?.library?.data">
            <a-list-item
              class="list-item"
              slot="renderItem"
              slot-scope="item, index"
              :key="index"
              @click="handleClick(details?.library?.notificationType, item)"
              :style="{ background: item.readMessage === 'No' ? '#e9f3ff': '#fff'}"
            >
              <span>A new <b>{{ capitalFirstLetter(item.title) }}</b> has been added on the Library. Please read through it.</span>
            </a-list-item>
          </a-list>
          <a-list v-if="details?.compulsoryWorkReport?.data.length !== 0" size="small" :data-source="details?.compulsoryWorkReport?.data">
            <a-list-item
              class="list-item"
              slot="renderItem"
              slot-scope="item, index"
              :key="index"
              @click="handleClick(details?.compulsoryWorkReport?.notificationType, item)"
              :style="{ background: item.readMessage === 'No' ? '#e9f3ff': '#fff'}"
            >
              <span>Please submit a <b>{{ item.workReportType }}</b> prior you can proceed on <b>{{ item.trigger }}</b>.</span>
            </a-list-item>
          </a-list>
          <a-list v-if="details?.reminder?.data.length !== 0" size="small" :data-source="details?.reminder?.data">
            <a-list-item
              class="list-item"
              slot="renderItem"
              slot-scope="item, index"
              :key="index"
              @click="handleClick(details?.reminder?.notificationType, item)"
              :style="{ background: item.readMessage === 'No' ? '#e9f3ff': '#fff'}"
            >
              <span><b style="color: #de350b">Reminder!</b> {{ item.reminderName }} - {{ item.reminderMessage }}</span>
            </a-list-item>
          </a-list>
        </div>
      </template>
      <span @click="fetchNotice" ref="noticeRef" :style="{ padding: '0 18px', cursor: 'pointer'}">
        <a-badge :count="details?.unreadNotifCount">
          <a-icon style="font-size: 20px; padding: 4px" type="bell" theme="filled" />
        </a-badge>
      </span>
    </a-popover>
    <details-modal ref="detailsModal" :modal="mdl"/>
  </span>
</template>

<script>
import DetailsModal from './DetailsModal.vue'

export default {
  name: 'HeaderNotice',
  components: {
    DetailsModal
  },
  data () {
    return {
      visible: false,
      details: null,
      mdl: null
    }
  },
  methods: {
    capitalFirstLetter (value) {
      const capitalized = value.charAt(0).toUpperCase() + value.slice(1)
      return capitalized
    },
    async fetchNotice () {
      this.visible = !this.visible
    },
    async fetchList () {
      const details = await this.$store.dispatch('api/notification/fetchList')
      this.details = details.data
    },
    async handleClick(type, selectedItem) {
      this.read(type, selectedItem)
      switch (type) {
        case 'Supervisor Employee Attendance':
          this.$router.push({ name: 'main-employee-management-attendance-list' })
          break
        case 'Supervisor Employee Leave':
          this.$router.push({ name: 'main-hr-leave-transactions' })
          break
        case 'Supervisor Employee Claim':
          this.$router.push({ name: 'main-hr-claim-transactions' })
          break
        case 'Supervisor Employee Loan':
          this.$router.push({ name: 'main-hr-loan-transactions' })
          break
        case 'Supervisor Employee Work Shift':
          this.$router.push({ name: 'main-employee-management-work-shift' })
          break
        case 'Employee Attendance':
          if (selectedItem.status === 'Pending') {
            this.$router.push({ name: 'setup-employee-attendance-setup' })
          } else {
            this.$router.push({ name: 'main-employee-management-attendance-list' })
          }
          break
        case 'Employee Leave':
          this.$router.push({ name: 'main-hr-leave-transactions' })
          break
        case 'Employee Claim':
          this.$router.push({ name: 'main-hr-claim-transactions' })
          break
        case 'Employee Loan':
          this.$router.push({ name: 'main-hr-loan-transactions' })
          break
        case 'Employee Payroll':
          const details = await this.$store.dispatch('api/main/payroll/generalPayroll/viewPayslip', selectedItem.id)
          this.mdl = details
          this.$refs.detailsModal.view()
          break
        case 'Company Announcement':
          this.$router.push({ name: 'setup-company-announcement' })
          break
        case 'Company Library':
          this.$router.push({ name: 'setup-company-library' })
          break
        case 'Employee Work Report':
          this.$router.push({ name: 'main-employee-management-work-report-list' })
          break
        case 'Employee Reminder':
          this.$router.push({ name: 'main-employee-management-reminder' })
          break
        default:
      }
    },
    async read (type, item) {
      const data = {
        id: item.id,
        notificationType: type,
        readMessage: 'Yes'
      }
      try {
        await this.$store.dispatch('api/notification/read', data)
        this.fetchList()
      } catch (error) {
        this.$message.error(error.response.data.message)
      }
    }
  },
  async created() {
    this.fetchList()
  }
}
</script>

<style lang="less">
.header-notice-wrapper {
  .ant-popover-inner {
    border-radius: 10px;
  }
  .list {
    overflow-y: auto;
    height: 285px;
    width: 285px;
    word-break: break-word;
  }
  .list-item {
    cursor: pointer;
  }
  .list-item:last-child {
    border-bottom: 1px solid #e8e8e8;
  }
}
</style>

<style lang="less" scoped>
  .ant-spin-container{
    height: 400px;
  }
  .header-notice-wrapper {
    top: 50px !important;
  }
  .ant-list-item-meta-title{
    position: absolute;
    left: 0;
  }
  .ant-list-item-meta-description{
    margin-top: 25px;
  }
  .anticon-clock-circle{
    margin-top: 25px;
    margin-right: 10px;
  }
  .header-notice{
    display: inline-block;
    transition: all 0.3s;
    span {
      vertical-align: initial;
    }
  }
  .ant-btn{
    border: none;
    font-weight: 600;
  }
</style>
