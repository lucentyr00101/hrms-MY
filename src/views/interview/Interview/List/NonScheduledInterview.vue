<template>
  <s-table
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
    <span slot="interviewTime" slot-scope="value">{{ (value) ? formatDate(value) : '' }}</span>
    <span slot="status" slot-scope="value" :class="[ String(value).replace(/\s/ig, '-').toLocaleLowerCase() ]">{{ value }}</span>
    <span slot="action" slot-scope="value, data">
      <a class="action-button" @click="formHandler({ action: 'view', data })">{{ $t('table.dialog.view') }}</a>
    </span>
  </s-table>
</template>

<script>
import { i18nRender } from '@/locales'

export default {
  name: 'InterviewInterviewListNonScheduledInterview',
  data() {
    return {
      selectedItems: [],
      queryParam: {},
      currentData: [],
      selectedNestedKeys: [],
      authorList: [],
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const response = await this.$store.dispatch('api/interview/interview/fetchList', { config: { list: 'unscheduledList' }, params })
        this.currentData = response.data
        return { data: response }
      }
    }
  },
  computed: {
    mainParent() { return this.getParent('InterviewInterview') },
    mainList() { return this.getParent('InterviewInterviewList') },
    columns() {
      return [
        { title: i18nRender('table.column.name'), dataIndex: 'employeeName', key: 'employeeName' },
        { title: i18nRender('table.column.id-number'), dataIndex: 'idNumber', key: 'idNumber' },
        { title: i18nRender('table.column.position-applied'), dataIndex: 'positionApplied', key: 'positionApplied', width: '12%' },
        { title: i18nRender('table.column.email'), dataIndex: 'email', key: 'email', ellipsis: true, width: '15%' },
        { title: i18nRender('table.column.interview-time'), dataIndex: 'interviewTime', key: 'interviewTime', width: '15%', scopedSlots: { customRender: 'interviewTime' } },
        { title: i18nRender('table.column.interviewer'), dataIndex: 'interviewer.fullName', key: 'interviewer' },
        { title: i18nRender('table.column.action'), dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  watch: {
    'mainList.tab'(to) {
      if (to === 'NonScheduledInterview') {
        this.refreshTable()
      }
    }
  },
  methods: {
    initiate() {},
    formHandler(payload) {
      const { action = undefined, data = {} } = payload || {}
      this.mainParent.changeView({ view: 'Form', query: { action, id: data?.id } })
    },
    onSelectChange(selectedItems) {
      this.selectedItems = [ ...selectedItems ]
    },
    refreshTable() {
      this.$refs.table.refresh()
    }
  },
  created() {
    this.initiate()
  }
}
</script>

<style scoped>
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
</style>
