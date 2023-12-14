<template>
  <div>
    <a-card class="generate-payroll">
      <a-row id="filter" type="flex" :gutter="[50, 8]">
        <a-col :span="6">
          <span class="name">{{ $t('table.column.year') }}:</span>
          <a-date-picker
            class="input"
            v-model="filter.year"
            mode="year"
            format="YYYY"
            placeholder="Select Year"
            allow-clear
            @panelChange="yearPickerSelectHandler"
          />
        </a-col>
        <a-col class="action-holder" :span="18">
          <a-button v-action:main_payroll_generate-payroll_generate-payroll-button type="primary" icon="plus" @click="modalHandler({ show: true, action: 'add' })">{{
            $t('table.dialog.add-generate-payroll')
          }}</a-button>
        </a-col>
      </a-row>

      <a-card class="first-data">
        <div class="header">
          <span class="name">{{ firstDetails.name }}</span>
          <span :class="['status', `${String(firstDetails.status).toLocaleLowerCase()}`]">{{
            firstDetails.status
          }}</span>
        </div>
        <div class="body">
          <div v-for="(item, index) in firstDetails.data" :key="index" class="detail">
            <span class="title">{{ item.name }}</span>
            <span class="value">{{ item.value }}</span>
          </div>
        </div>
        <div class="action">
          <a-button v-if="summary?.status === 'Pending' && $store.getters.permissions.includes('main_payroll_generate-payroll_verify')" type="primary" @click="getVerify">
            {{ $t('table.dialog.verify') }}
          </a-button>
          <template v-else>
            <a-button v-if="summary?.isPublished === 'NO' && $store.getters.permissions.includes('main_payroll_generate-payroll_publish')" :style="{ margin: '0 10px 0 0' }" @click="publish('Yes')">
              {{ $t('table.dialog.publish') }}
            </a-button>
            <a-button v-if="summary?.isPublished === 'YES' && $store.getters.permissions.includes('main_payroll_generate-payroll_unpublish')" :style="{ margin: '0 10px 0 0' }" @click="publish('No')">
              {{ $t('table.dialog.unpublish') }}
            </a-button>
            <a-button v-if="$store.getters.permissions.includes('main_payroll_generate-payroll_view-summary')" type="primary" @click="viewSummary">
              {{ $t('table.dialog.view-summary') }}
            </a-button>
          </template>
        </div>
      </a-card>

      <s-table
        permissionName="main_payroll_generate-payroll_view"
        ref="table"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :pagination="{
          showSizeChanger: true,
          showQuickJumper: true,
          'show-total': (total) => $tc('table.column.total-items', total)
        }"
      >
        <span slot="publish" slot-scope="value, data">
          <a-switch
            :disabled="!$store.getters.permissions.includes('main_payroll_generate-payroll_update-status')"
            :defaultChecked="value === 'Yes'"
            @click="toggleStatus(data.id, value)"
          />
        </span>
        <span slot="processDate" slot-scope="value">{{ value ? formatDate(value, 'YYYY-MM-DD') : '' }}</span>
        <span slot="dateFrom" slot-scope="value">{{ value ? formatDate(value, 'YYYY-MM-DD') : '' }}</span>
        <span slot="dateTo" slot-scope="value">{{ value ? formatDate(value, 'YYYY-MM-DD') : '' }}</span>
        <span slot="action" slot-scope="value, data">
          <a v-if="data.isPublished === 'Yes'" class="action-button" @click="viewPayslip(data)">{{
            $t('table.dialog.view')
          }}</a>
        </span>
      </s-table>
      <Modal :data="modalData" />
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { i18nRender } from '@/locales'
import Modal from './Modal'

export default {
  name: 'MainPayrollGeneratePayroll',
  components: {
    Modal
  },
  data() {
    return {
      filter: { year: moment().format('YYYY') },
      modalData: { show: false },
      queryParam: {},
      currentData: [],
      selectedNestedKeys: [],
      authorList: [],
      summary: [],
      loadData: async (parameter) => {
        const { year } = this.filter
        const { pageNo, pageSize } = parameter
        const _parameter = {
          year: year ? this.formatDate(year, 'YYYY') : undefined,
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const response = await this.$store.dispatch('api/main/payroll/generalPayroll/search', params)
        // console.log(response)
        this.currentData = response.data.data
        return response
      }
    }
  },
  computed: {
    columns() {
      return [
        { title: i18nRender('table.column.period'), dataIndex: 'period', key: 'period' },
        { title: i18nRender('table.column.sequence'), dataIndex: 'sequence', key: 'sequence' },
        {
          title: i18nRender('table.column.publish'),
          dataIndex: 'isPublished',
          key: 'publish',
          scopedSlots: { customRender: 'publish' }
        },
        { title: i18nRender('table.column.employee'), dataIndex: 'employee', key: 'employee', ellipsis: true },
        {
          title: i18nRender('table.column.process-date'),
          dataIndex: 'processDate',
          key: 'processDate',
          scopedSlots: { customRender: 'processDate' }
        },
        {
          title: i18nRender('table.column.date-from'),
          dataIndex: 'dateFrom',
          key: 'dateFrom',
          scopedSlots: { customRender: 'dateFrom' }
        },
        {
          title: i18nRender('table.column.date-to'),
          dataIndex: 'dateTo',
          key: 'dateTo',
          scopedSlots: { customRender: 'dateTo' }
        },
        { title: i18nRender('table.column.gross'), dataIndex: 'gross', key: 'gross' },
        { title: i18nRender('table.column.total-tax'), dataIndex: 'totalContribution.totalTax', key: 'totalTax' },
        { title: i18nRender('table.column.total-epf'), dataIndex: 'totalContribution.totalEpf', key: 'totalEPF' },
        { title: i18nRender('table.column.total-socso'), dataIndex: 'totalContribution.totalSocso', key: 'totalSOCSO' },
        { title: i18nRender('table.column.total-eis'), dataIndex: 'totalContribution.totalEis', key: 'totalEIS' },
        {
          title: i18nRender('table.column.action'),
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    },
    firstDetails() {
      return {
        name: `${moment(this.summary?.dateFrom).format('YYYY')} ${moment(this.summary?.dateFrom).format('MMMM')} - ${
          this.summary?.sequence
        }`,
        status: this.summary?.status,
        data: [
          { name: 'Employee', value: this.summary?.employeeCount || '0' },
          { name: 'Gross', value: this.summary?.gross || '0' },
          { name: 'Create Date', value: this.summary?.createdDate },
          { name: 'Sequence', value: this.summary?.sequence },
          { name: 'Total Tax', value: this.summary?.totalContribution?.totalTax || '0' },
          { name: 'Total EPF', value: this.summary?.totalContribution?.totalEpf || '0' },
          { name: 'Total SOCSO', value: this.summary?.totalContribution?.totalSocso || '0' },
          { name: 'Total EIS', value: this.summary?.totalContribution?.totalEis || '0' },
          { name: 'Process Date', value: this.summary?.processDate },
          { name: 'Date from', value: this.summary?.dateFrom },
          { name: 'Date to', value: this.summary?.dateTo }
        ]
      }
    }
  },
  methods: {
    async getEmployee() {
      try {
        const employee = await this.$store.dispatch('api/dropdown/fetchActiveEmployeeDropdown')
        this.employee = employee.data.employeeDetailSmallResponses.map(({ fullName }) => fullName)
      } catch (error) {
        throw error
      }
    },
    async getSummary() {
      try {
        const summary = await this.$store.dispatch('api/main/payroll/generalPayroll/fetchLatest')
        this.summary = summary.data
      } catch (error) {
        throw error
      }
    },
    async getDetails(action, data) {
      try {
        const details = await this.$store.dispatch('api/main/payroll/generalPayroll/fetchDetails', { id: data.id })
        this.modalHandler({ show: true, action, data: { id: data.id, ...details.data } })
      } catch (error) {
        throw error
      }
    },
    async getVerify() {
      try {
        const details = await this.$store.dispatch('api/main/payroll/generalPayroll/fetchVerify', {
          id: this.summary.id
        })
        if (details.data.length !== 0) {
          this.modalHandler({
            show: true,
            action: 'viewVerify',
            data: { id: this.summary.id, ...details.data },
            width: 1000
          })
        }
      } catch (error) {
        this.$message.error(error.response.data.message)
      }
    },
    async viewSummary() {
      try {
        const details = await this.$store.dispatch('api/main/payroll/generalPayroll/viewSummary', this.summary.id)
        this.modalHandler({
          show: true,
          action: 'viewSummary',
          data: { id: this.summary.id, ...details.data },
          width: 1400
        })
      } catch (error) {
        this.$message.error(error.response.data.message)
      }
    },
    async viewPayslip(data) {
      try {
        const details = await this.$store.dispatch('api/main/payroll/generalPayroll/viewPayslip', data.id)
        this.modalHandler({
          show: true,
          action: 'viewEmployee',
          data: { ...details.data },
          width: 1400
        })
      } catch (error) {
        this.$message.error(error.response.data.message)
      }
    },
    async publish(status) {
      try {
        const summary = await this.$store.dispatch('api/main/payroll/generalPayroll/publish', {
          id: this.summary?.id,
          isPublished: status
        })
        this.summary = summary.data
        this.$notification.open({
          message:
            status === 'Yes'
              ? this.$t('notification.generate-payroll.published')
              : this.$t('notification.generate-payroll.unpublished'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.$refs.table.refresh()
      } catch (e) {
        this.$message.error(e.response)
      }
    },
    yearPickerSelectHandler(value) {
      this.filter.year = value
      this.$refs.table.refresh()
    },
    modalHandler(payload) {
      const { show = false, action = undefined, data = {}, width = 700 } = payload || {}
      this.modalData = { show, action, data, width }
    },
    async toggleStatus(id, status) {
      try {
        await this.$store.dispatch('api/main/payroll/generalPayroll/toggleStatus', {
          id,
          isPublished: status === 'Yes' ? 'No' : 'Yes'
        })
        this.$notification.open({
          message: this.$t('notification.generate-payroll.status'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.$refs.table.refresh()
      } catch (error) {
        this.$refs.table.refresh()
        this.$message.error(error.response.data.message)
      }
    },
    refreshTable() {
      this.$refs.table.refresh()
      this.modalHandler({ show: false })
    }
  },
  created() {
    const hasQuery = Object.keys(this.$route.query || {}).length
    if (hasQuery) {
      const urlQuery = this.$route.query
      if (urlQuery?.viewSummary === 'true') {
        this.modalHandler({ show: true, action: 'view', width: 1400 })
      }
    }
    this.getSummary()
    this.getEmployee()
  }
}
</script>

<style>
.generate-payroll #filter {
  margin-bottom: 20px !important;
}

.generate-payroll #filter .ant-col > * {
  display: inline-block;
}

.generate-payroll #filter .name {
  padding: 0 10px 0 0 !important;
}

/* .generate-payroll #filter .input {
    width: 100%;
  } */

.generate-payroll #filter .action-holder {
  text-align: right;
}

.generate-payroll #filter .action-holder .reset {
  margin: 0 10px;
}

@media (max-width: 788px) {
  .generate-payroll #filter .name {
    text-align: left;
  }
}

.first-data {
  max-width: 50%;
  margin: 0 0 20px 0;
}

.first-data .ant-card-body {
  padding: 0;
}

.first-data .ant-card-body .header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #e8e8e8;
  box-sizing: border-box;
}

.first-data .ant-card-body .header .status.complete {
  color: #2fc25b;
}

.first-data .ant-card-body .header .status.pending {
  color: #ffd300;
}

.first-data .ant-card-body .body {
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
}

.first-data .ant-card-body .body .detail {
  width: 25%;
  padding: 10px;
  margin-bottom: -1px;
  margin-top: 1px;
  border-bottom: 1px solid #e8e8e8;
  box-sizing: border-box;
}

.first-data .ant-card-body .body .detail::after {
  content: '';
  flex: auto;
  border-bottom: 1px solid #e8e8e8;
}

.first-data .ant-card-body .body .detail span {
  display: block;
}

.first-data .ant-card-body .action {
  margin: 10px;
  text-align: right;
}

.status {
  display: flex;
  align-items: center;
  text-transform: capitalize;
}

.status .point {
  display: inline-block;
  margin: 0 5px 0 0;
  width: 5px;
  height: 5px;
  background-color: #000;
  border-radius: 100%;
}

.status .point.rejected {
  background-color: #ff4d4f;
}

.status .point.approved,
.status .point.claimed {
  background-color: #52c41a;
}

.status .point.pending {
  background-color: #faad14;
}
</style>
