<template>
  <div style="padding: 80px 40px">
    <a-descriptions :column="1">
      <a-descriptions-item v-for="(column, i) in columns" :key="i" :label="column.label">
        {{ column.value }}
        <a-button style="margin-left: 10px;" v-if="$t('table.dialog.last-date-of-work') === column.label" type="text" icon="edit" @click="showApprovalModal = true" />
      </a-descriptions-item>
    </a-descriptions>
    <a-divider orientation="left">{{ $t('resignation.handover-checklist') }}</a-divider>
    <AssetsList :employee="employee" />
    <Uploader :employee="employee" />
    <a-space style="display:flex; justify-content:right">
      <withdraw-button/>
    </a-space>
    <ResignationApprovalModal v-model="showApprovalModal" type="Edit" :id="employeeResignation.id" />
  </div>
</template>

<script>
import Uploader from './Uploader'
import AssetsList from './AssetsList'
import moment from 'moment'
import { mapGetters } from 'vuex'
import WithdrawButton from '../WithdrawButton.vue'
import CancelButton from '@/components/Setup/Employee/EmployeeSetup/CancelButton.vue'

export default {
  name: 'ViewApprovedResignation',
  components: {
    ResignationApprovalModal: () => import('@/components/Setup/Employee/EmployeeSetup/Resignation/ApprovalModal'),
    Uploader,
    AssetsList,
    WithdrawButton,
    CancelButton
  },

  data () {
    return {
      showApprovalModal: false,
      showModal: false,
      loading: false
    }
  },
  computed: {
    ...mapGetters('api/setup/employee/employeeSetup', ['employee']),
    ...mapGetters('api/setup/employee/employeeSetup/resignation', ['employeeResignation']),
    columns () {
      // eslint-disable-next-line camelcase
      const { firstName, lastName } = this.employee?.data
      return [
        {
          label: this.$t('table.column.employee-name'),
          // eslint-disable-next-line camelcase
          value: `${lastName}, ${firstName}`
        },
        {
          label: this.$t('table.dialog.last-date-of-work'),
          value: this.employeeResignation.lastWorkingDate
            ? moment(this.employeeResignation.lastWorkingDate).format('YYYY-MM-DD')
            : '-'
        }
      ]
    }
  }
}
</script>
