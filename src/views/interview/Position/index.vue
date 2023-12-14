<template>
  <div>
    <a-card id="filter">
      <a-row type="flex" :gutter="[50, 8]">
        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="80px" :span="12">{{ $t('table.column.time') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-range-picker v-model="filter.dateTimeRange" show-time allow-clear :placeholder="['Start Date & Time', 'End Date & Time']"/>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="80px" :span="12">{{ $t('table.column.position') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select v-model="filter.position" :options="positionList" allow-clear placeholder="All"/>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="80px" :span="12">{{ $t('table.column.department') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-tree-select v-model="filter.department" :tree-data="departmentList" tree-default-expand-all allow-clear placeholder="All"/>
              <!-- <a-select v-model="filter.department" :options="departmentList" allow-clear placeholder="All"/> -->
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="80px" :span="12">{{ $t('table.column.status') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select v-model="filter.status" :options="statusList" allow-clear placeholder="All"/>
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
        permissionNameAdd="interview_position_add"
        permissionNameDelete="interview_position_delete"
        :isActive="true"
        :totalSelected="selectedItems.length"
        position="right"
        @open="modalHandler({ show: true, action: 'add' })"
        @delete="deleteData"
      />
      <s-table
        permissionName="interview_position_view"
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
        <span slot="status" slot-scope="value, data">
          <a-switch
            :disabled="!$store.getters.permissions.includes('interview_position_update-status')"
            :checked="(value === 'Enable')"
            @click="toggleStatus(data.id, value)"
          />
        </span>
        <span slot="action" slot-scope="value, data">
          <a v-action:interview_position_edit class="action-button" @click="getDetails('update', data)">{{ $t('table.dialog.edit') }}</a>
        </span>
      </s-table>
      <Modal :data="modalData" />
    </a-card>
  </div>
</template>

<script>
import { i18nRender } from '@/locales'
import InfoCircle from '@/assets/info-circle.svg'

import ChosenAlertBox from '@/components/Table/ChosenAlertBox'
import Modal from './Modal'

export default {
  name: 'InterviewPosition',
  components: {
    ChosenAlertBox,
    Modal
  },
  data() {
    return {
      filter: { dateTimeRange: undefined, position: undefined, department: undefined, status: undefined },
      modalData: { show: false },
      selectedItems: [],
      queryParam: {},
      currentData: [],
      selectedNestedKeys: [],
      positionList: [],
      departmentList: [],
      statusList: [
        { value: 'Enable', label: 'Enabled' },
        { value: 'Disable', label: 'Disabled' }
      ],
      loadData: async (parameter) => {
        const { dateTimeRange, position, department, status } = this.filter
        const { pageNo, pageSize } = parameter
        const _parameter = {
          fromDate: (dateTimeRange?.[0]) ? this.formatDate(dateTimeRange[0], 'YYYY-MM-DD HH:mm:ss') : undefined,
          toDate: (dateTimeRange?.[1]) ? this.formatDate(dateTimeRange[1], 'YYYY-MM-DD HH:mm:ss') : undefined,
          position,
          department,
          status,
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const response = await this.$store.dispatch('api/interview/position/fetchList', params)
        // console.log(response)
        this.currentData = response.data
        return { data: response }
      }
    }
  },
  computed: {
    columns() {
      return [
        { title: i18nRender('table.column.position'), dataIndex: 'position', key: 'position' },
        { title: i18nRender('table.column.department'), dataIndex: 'department', key: 'department' },
        { title: i18nRender('table.column.remarks'), dataIndex: 'remarks', key: 'remarks', ellipsis: true },
        { title: i18nRender('table.column.created-time'), dataIndex: 'createdTime', key: 'createdTime', scopedSlots: { customRender: 'createdTime' } },
        { title: i18nRender('table.column.author'), dataIndex: 'author', key: 'author' },
        { title: i18nRender('table.column.status'), dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' } },
        { title: i18nRender('table.column.action'), dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  methods: {
    initiate() {
      // Set Filter
      const filter = window.localStorage.getItem('IP-Filter')
      this.filter = (filter) ? JSON.parse(filter) : this.filter

      this.getPositionList()
      this.getDepartmentList()
    },
    async getPositionList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchInterviewPositionDropdown')
        Array.isArray(list?.data?.data) && list.data.data.forEach((item) => {
          this.positionList = [ ...this.positionList, ...((this.positionList.find((data) => (data?.value === item.position)) || !item.position) ? [] : [ { value: item.position, label: item.position } ]) ]
        })
      } catch (error) {
        throw error
      }
    },
    async getDepartmentList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchDepartmentDropdown')
        this.departmentList = this.generateSelectTreeList(list?.data?.parentTree)
        // this.departmentList = list?.data.filter((item) => (item !== 'All')).map((item) => ({ value: item, label: item })) // api/dropdown/fetchDepartmentNamesDropdown
      } catch (error) {
        throw error
      }
    },
    async getDetails(action, data) {
      try {
        const details = await this.$store.dispatch('api/interview/position/fetchDetails', { id: data.id })
        this.modalHandler({ show: true, action, data: { id: data.id, ...details.data } })
      } catch (error) {
        throw error
      }
    },
    resetFilter() {
      this.filter = { dateTimeRange: undefined, position: undefined, department: undefined, status: undefined }
      this.refreshTable()
    },
    modalHandler(payload) {
      const { show = false, action = undefined, data = {} } = payload || {}
      this.modalData = { show, action, data }
    },
    onSelectChange(selectedItems) {
      this.selectedItems = [ ...selectedItems ]
    },
    async toggleStatus(id, status) {
      try {
        await this.$store.dispatch('api/interview/position/toggleStatus', { id, status: (status === 'Enable') ? 'Disable' : 'Enable' })
        this.$notification.open({
          message: (status === 'Enable') ? this.$t('notification.interview-position.disabled') : this.$t('notification.interview-position.enabled'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.$refs.table.refresh()
      } catch (error) {
        this.$refs.table.refresh()
        this.$message.error(error.response.data.message)
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
              await this.$store.dispatch('api/interview/position/delete', { entityIds: this.selectedItems })
              this.$notification.open({
                message: this.$t('notification.interview-position.deleted'),
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
      window.localStorage.setItem('IP-Filter', JSON.stringify(this.filter))
      this.getPositionList()
      this.getDepartmentList()
      this.$refs.table.refresh()
      this.modalHandler({ show: false })
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
    width: 100% !important;
  }

  #filter .action-holder {
    margin-top: 10px;
    text-align: right;
  }

  #filter .action-holder .reset {
    margin: 0 10px;
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
    background-color: #FF4D4F;
  }

  .status .point.approved, .status .point.claimed {
    background-color: #52C41A;
  }

  .status .point.pending {
    background-color: #FAAD14;
  }

  @media (max-width: 788px) {
    #filter .name {
      text-align: left;
    }
  }
</style>
