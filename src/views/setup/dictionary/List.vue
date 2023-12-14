<template>
  <div>
    <a-card class="antd-custom-table">
      <query-form
        :columns="columns"
        v-model="queryParam"
        @click="$refs.table.refresh(true)"
      />
    </a-card>
    <a-card class="antd-custom-table">
      <chosen-alert-box
        permissionNameAdd="setup_dictionary_add"
        permissionNameDelete="setup_dictionary_delete"
        :isActive="true"
        position="right"
        :totalSelected="selectedRowKeys.length"
        @delete="handleDelete(selectedRowKeys)"
        @open="handleAdd"
      />
      <s-table
        permissionName="setup_dictionary_view"
        rowKey="id"
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        :pagination="{
          'show-total': (total, range) => $tc('table.column.total-items', total),
          showSizeChanger: true,
          showQuickJumper: true
        }"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
      >
        <template slot="status" slot-scope="status, record">
          <a-switch :default-checked="record.status === 'Enable'" @change="(e)=>handleStatusChange(e,record)" />
        </template>
        <span slot="action" slot-scope="text, record, index">
          <a v-action:setup_dictionary_set-values @click="handleSetValues(text, record, index)">{{ $t('table.column.set-values') }}</a>
          <a-divider type="vertical" />
          <a v-action:setup_dictionary_edit @click="handleEdit(text, record, index)">{{ $t('table.dialog.edit') }}</a>
          <a-divider type="vertical" />
          <a v-action:setup_dictionary_delete @click="handleDelete([record.id])">{{ $t('table.top.delete') }}</a>
        </span>
      </s-table>
    </a-card>
    <AddTypeModal :currentValue="currentValue" :action="action" @closeModal="currentRow = null" @refreshTable="$refs.table.refresh(true)" />
    <ValuesListModal :currentRow="currentRow" />
  </div>
</template>

<script>
import { STable } from '@/components'
import QueryForm from '@/components/Table/QueryForm'
import ChosenAlertBox from '@/components/Table/ChosenAlertBox'
import { i18nRender } from '@/locales'
import AddTypeModal from '@/components/Setup/Dictionary/AddTypeModal'
import ValuesListModal from '@/components/Setup/Dictionary/ValuesListModal'
import InfoCircle from '@/assets/info-circle.svg'

export default {
  components: {
    QueryForm,
    STable,
    ChosenAlertBox,
    AddTypeModal,
    ValuesListModal
  },
  data () {
    return {
      currentRow: null,
      selectedRowKeys: [],
      action: null,
      currentValue: null,
      columns: [
        {
          title: i18nRender('table.column.type-name'),
          dataIndex: 'typeName',
          ellipsis: true
        },
        {
          title: i18nRender('table.column.code'),
          dataIndex: 'code'
        },
        {
          title: i18nRender('table.column.sort'),
          dataIndex: 'sort',
          hideInSearch: true
        },
        {
          title: i18nRender('table.column.status'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          hideInSearch: true
        },
        {
          title: i18nRender('table.column.remark'),
          dataIndex: 'remark',
          hideInSearch: true,
          ellipsis: true
        },
        {
          title: i18nRender('table.column.action'),
          dataIndex: 'id',
          hideInSearch: true,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 查询条件参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        window.localStorage.setItem('SD-Filter', JSON.stringify(this.queryParam))
        const data = await this.$store.dispatch('api/setup/dictionary/search', params)
        return data
      }
    }
  },
  created () {
    const queryParam = window.localStorage.getItem('SD-Filter')
    this.queryParam = queryParam ? JSON.parse(queryParam) : this.queryParam
  },
  methods: {
    handleAdd () {
      this.action = 'add'
      this.$store.commit('modal/TOGGLE_DICT_ADD_TYPE_MODAL')
    },
    handleEdit (text, record, index) {
      this.currentValue = record
      this.action = 'edit'
      this.$store.commit('modal/TOGGLE_DICT_ADD_TYPE_MODAL')
    },
    handleSetValues (text, record, index) {
      this.currentValue = record
      this.currentRow = record
      this.$store.commit('modal/TOGGLE_DICT_VALUES_LIST_MODAL')
    },
    async handleStatusChange (checked, row) {
      try {
        await this.$store.dispatch('api/setup/dictionary/updateStatus', { id: row.id, status: checked ? 'Enable' : 'Disable' })
        this.$notification.open({
          message: checked ? i18nRender('notification.dictionary-status.enable') : i18nRender('notification.dictionary-status.disable'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.$refs.table.refresh(true)
      } catch (e) {
        this.$message.error(e.response)
      }
    },
    async handleDelete (selectedKeys) {
      if (!selectedKeys.length) return
      this.$confirm({
        title: this.$t('table.dialog.dictionary-confirm'),
        okText: this.$t('table.dialog.yes'),
        cancelText: this.$t('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          try {
            await this.$store.dispatch('api/setup/dictionary/deleteDictionary', { entityIds: selectedKeys })
            this.$notification.open({
              message: this.$t('table.dialog.dictionary-type-deleted'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
            this.selectedRowKeys = []
            this.$refs.table.refresh()
          } catch (error) {
            this.selectedRowKeys = []
            this.$message.error(error.response.data.message)
          }
        }
      })
    },
    onSelectChange (selectedItems) {
      this.selectedRowKeys = selectedItems
    }
  }
}
</script>

<style lang="less" scoped>
  .query-form {
    padding: unset !important;
  }
</style>
