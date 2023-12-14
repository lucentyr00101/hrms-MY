<template>
  <div>
    <a-card id="filter">
      <a-row type="flex" :gutter="[24, 8]">
        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="100px" :span="12">{{ $t('table.column.time') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-date-picker v-model="filter.dateTime" show-time allow-clear placeholder="Select date & time"/>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="100px" :span="12">{{ $t('table.column.name') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select v-model="filter.name" :options="mainParent.interviewCandidatesList.name" show-search allow-clear placeholder="All"/>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="130px" :span="12">{{ $t('table.column.position-applied') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select v-model="filter.positionApplied" :options="mainParent.interviewCandidatesList.positionApplied" allow-clear placeholder="All"/>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="100px" :span="12">{{ $t('table.column.status') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select v-model="filter.status" :options="mainParent.interviewStatusList" allow-clear placeholder="All"/>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="100px" :span="12">{{ $t('table.column.id-number') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select v-model="filter.idNumber" :options="mainParent.interviewCandidatesList.id" allow-clear placeholder="All"/>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="130px" :span="12">{{ $t('table.column.email') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select v-model="filter.email" :options="mainParent.interviewCandidatesList.email" show-search allow-clear placeholder="All"/>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="100px" :span="12">{{ $t('table.column.interviewer') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select v-model="filter.interviewer" :options="mainParent.interviewCandidatesList.interviewer" allow-clear placeholder="All"/>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="100px" :span="12">{{ $t('table.column.ranks') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-input v-model="filter.ranks" allow-clear/>
            </a-col>
          </a-row>
        </a-col>
      </a-row>

      <div class="action-holder">
        <a-button class="reset" type="default" @click="resetFilter">{{ $t('reset') }}</a-button>
        <a-button class="query" type="primary" @click="refreshTable">{{ $t('query') }}</a-button>
      </div>
    </a-card>

    <a-card>
      <ChosenAlertBox
        permissionNameAdd="interview_candidate_add"
        permissionNameDelete="interview_candidate_delete"
        :isActive="true"
        :totalSelected="selectedItems.length"
        position="right"
        @open="formHandler({ action: 'add' })"
        @delete="deleteData"
      >
        <template v-slot:action-button>
          <a-button v-action:interview_candidate_export type="secondary" :disabled="(currentData.length === 0)" @click="handleExport">
            {{ $t('table.dialog.export') }}
          </a-button>
        </template>
      </ChosenAlertBox>
      <s-table
        permissionName="interview_candidate_view"
        ref="table"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :row-selection="{ selectedRowKeys: selectedItems, onChange: onSelectChange }"
        :pagination="{
          showSizeChanger: true,
          showQuickJumper: true,
          'show-total': (total) => $tc('table.column.total-items', total)
        }"
      >
        <span slot="createdTime" slot-scope="value">{{ (value) ? formatDate(value) : '' }}</span>
        <span slot="status" slot-scope="value" :class="[ 'status', String(value).replace(/\s/ig, '-').toLocaleLowerCase() ]">{{ value }}</span>
        <span slot="action" slot-scope="value, data">
          <a v-action:interview_candidate_view-edit-details class="action-button" @click="formHandler({ action: 'view', data })">{{ $t('table.dialog.view') }}</a>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { i18nRender } from '@/locales'
// import { ExportToCsv } from 'export-to-csv'
import moment from 'moment'
import InfoCircle from '@/assets/info-circle.svg'

import ChosenAlertBox from '@/components/Table/ChosenAlertBox'

// const csvExporter = new ExportToCsv({
//   fieldSeparator: ',',
//   quoteStrings: '"',
//   decimalSeparator: '.',
//   showLabels: true,a
//   showTitle: false,
//   filename: `Interview_Candidates_${moment().format('YYYYMMDDHHmmss')}`,
//   useTextFile: false,
//   useBom: true,
//   useKeysAsHeaders: true
//   // headers: ['ID', 'Employee Name', etc.] <--- disable useKeysAsHeaders before use
// })

export default {
  name: 'InterviewCandidateList',
  components: {
    ChosenAlertBox
  },
  data() {
    return {
      filter: { dateTime: undefined, name: undefined, positionApplied: undefined, status: undefined, idNumber: undefined, email: undefined, interviewer: undefined, ranks: undefined },
      selectedItems: [],
      queryParam: {},
      currentData: [],
      selectedNestedKeys: [],
      interviewStatusList: [],
      loadData: async (parameter) => {
        const { dateTime, name, positionApplied, status, idNumber, email, interviewer, ranks } = this.filter
        const { pageNo, pageSize } = parameter
        const _parameter = {
          time: (dateTime) ? this.formatDate(dateTime, 'YYYY-MM-DD HH:mm:ss') : undefined,
          employeeName: name,
          positionApplied,
          status: String(status).split('/')[1],
          idNumber,
          email,
          interviewer,
          ranks,
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const response = await this.$store.dispatch('api/interview/candidate/fetchList', params)
        // console.log(response)
        this.currentData = response.data.data
        return response
      }
    }
  },
  computed: {
    mainParent() { return this.getParent('InterviewCandidate') },
    columns() {
      return [
        { title: i18nRender('table.column.name'), dataIndex: 'employeeName', key: 'employeeName', ellipsis: true },
        { title: i18nRender('table.column.id-number'), dataIndex: 'idNumber', key: 'idNumber' },
        { title: i18nRender('table.column.position-applied'), dataIndex: 'positionApplied', key: 'positionApplied', width: '12%' },
        { title: i18nRender('table.column.email'), dataIndex: 'email', key: 'email', ellipsis: true, width: '15%' },
        { title: i18nRender('table.column.created-time'), dataIndex: 'createdTime', key: 'createdTime', width: '15%', scopedSlots: { customRender: 'createdTime' } },
        { title: i18nRender('table.column.interviewer'), dataIndex: 'interviewer.fullName', key: 'interviewer' },
        { title: i18nRender('table.column.ranks'), dataIndex: 'interviewCandidateInterview.ranks', key: 'ranks' },
        { title: i18nRender('table.column.status'), dataIndex: 'status', key: 'status', width: '12%', scopedSlots: { customRender: 'status' } },
        { title: i18nRender('table.column.action'), dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  methods: {
    initiate() {
      // Set Filter
      const filter = window.localStorage.getItem('IC-Filter')
      this.filter = (filter) ? JSON.parse(filter) : this.filter

      this.mainParent.getInterviewCandidatesList()
      this.mainParent.getInterviewStatusList()
    },
    resetFilter() {
      this.filter = { dateTime: undefined, name: undefined, positionApplied: undefined, status: undefined, idNumber: undefined, email: undefined, interviewer: undefined, ranks: undefined }
      this.refreshTable()
    },
    formHandler(payload) {
      const { action = undefined, data = {} } = payload || {}
      this.mainParent.changeView({ view: 'Form', query: { action, id: data?.id } })
    },
    onSelectChange(selectedItems) {
      this.selectedItems = [ ...selectedItems ]
    },
    async handleExport() {
      // if (this.currentData.length > 0) { csvExporter.generateCsv(this.currentData) }
      const { dateTime, name, positionApplied, status, idNumber, email, interviewer, ranks } = this.filter
      const _parameter = {
        time: (dateTime) ? this.formatDate(dateTime, 'YYYY-MM-DD HH:mm:ss') : undefined,
        employeeName: name,
        positionApplied,
        status: String(status).split('/')[1],
        idNumber,
        email,
        interviewer,
        ranks
      }
      try {
        const response = await this.$store.dispatch('api/interview/candidate/exportList', _parameter)
        const fileData = new Blob([ response ], { type: 'application/octet-stream' }) // Use this if the responseType is not blob like arraybuffer.
        const fileURL = window.URL.createObjectURL(fileData)
        const fileLink = document.createElement('a')
              fileLink.href = fileURL
              fileLink.setAttribute('download', `Interview_Candidates_${moment().format('YYYYMMDDHHmmss')}.csv`)
              fileLink.click()
      } catch (error) {
        throw error
      }
    },
    async deleteData() {
      if (this.selectedItems.length > 0) {
        this.$confirm({
          title: this.$t('delete.confirm'),
          okText: 'Yes',
          cancelText: 'No',
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
          onOk: async () => {
            try {
              await this.$store.dispatch('api/interview/candidate/delete', { entityIds: this.selectedItems })
              this.$notification.open({
                message: this.$t('notification.candidate.deleted'),
                icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
              })
              this.selectedItems = []
              this.$refs.table.refresh()
            } catch (error) {
              this.selectedItems = []
              this.$message.error(error.response.data.message)
            }
          },
          onCancel: () => {
            // console.log('Cancel')
          }
        })
      }
    },
    refreshTable() {
      window.localStorage.setItem('IC-Filter', JSON.stringify(this.filter))
      this.mainParent.getInterviewCandidatesList()
      this.mainParent.getInterviewStatusList()
      this.$refs.table.refresh()
    }
  },
  created() {
    this.initiate()
  }
}
</script>

<style scoped>
  #filter {
    margin: 0 0 20px 0;
  }

  #filter .name {
    padding: 5px 10px;
    text-align: right;
  }

  #filter .input > * {
    min-width: 100% !important;
  }

  #filter .action-holder {
    margin-top: 10px;
    text-align: right;
  }

  #filter .action-holder .reset {
    margin: 0 10px;
  }

  .status {
    text-transform: capitalize;
    color: #5E5E5E;
  }

  .status.confirmed {
    color: #52C41A;
  }

  .status.review, .status.under-review {
    color: #F8EE08;
  }

  .status.scheduled {
    color: #FF7300;
  }

  .status.rejected {
    color: #F00F0F;
  }

  @media (max-width: 788px) {
    #filter .name {
      text-align: left;
    }
  }
</style>
