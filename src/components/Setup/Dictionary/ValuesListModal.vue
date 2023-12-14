<template>
  <a-modal
    centered
    :okButtonProps="{ style: { display: 'none' } }"
    :cancelButtonProps="{ props: { type: 'primary' }}"
    :cancelText="$t('table.dialog.close')"
    :visible="dictValuesList"
    :destroyOnClose="true"
    :title="$t('table.column.set-values')"
    @cancel="$store.commit('modal/TOGGLE_DICT_VALUES_LIST_MODAL')"
    :width="1200"
  >
    <query-form
      :columns="columns"
      v-model="queryParam"
      @click="$refs.table.refresh(true)"
    />
    <a-row>
      <a-col class="col">
        <a-button
          icon="plus"
          type="primary"
          @click="handleAdd"
        >
          {{ $t('table.dialog.add') }}
        </a-button>
      </a-col>
    </a-row>
    <s-table
      rowKey="id"
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :pagination="{
        'show-total': (total, range) => `Total ${total} items`,
        showSizeChanger: true,
        showQuickJumper: true
      }"
    >
      <template slot="status" slot-scope="status, record">
        <a-switch :default-checked="record.status === 'Enable'" @change="(e)=>handleStatusChange(e,record)" />
      </template>
      <span slot="action" slot-scope="text, record, index">
        <a @click="handleEdit(text, record, index)">{{ $t('table.dialog.edit') }}</a>
        <a-divider type="vertical" />
        <a @click="handleDelete([record.id])">{{ $t('table.top.delete') }}</a>
      </span>
    </s-table>
    <add-values-modal :currentRow2="currentRow2" :action="action" :currentValue="currentValue" @closeModal="currentRow2 = null" @refreshTable="$refs.table.refresh(true)" />
  </a-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { i18nRender } from '@/locales'
import { STable } from '@/components'
import QueryForm from '@/components/Table/QueryForm'
import AddValuesModal from '@/components/Setup/Dictionary/AddValuesModal'
import InfoCircle from '@/assets/info-circle.svg'

export default {
  components: {
    STable,
    QueryForm,
    AddValuesModal
  },
  props: {
    currentRow: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      columns: [
        { title: i18nRender('table.column.value'), dataIndex: 'value' },
        { title: i18nRender('table.column.code'), dataIndex: 'code' },
        { title: i18nRender('table.column.sort'), dataIndex: 'sort', hideInSearch: true },
        { title: i18nRender('table.column.remark'), dataIndex: 'remark', hideInSearch: true, ellipsis: true },
        {
          title: i18nRender('table.column.status'),
          dataIndex: 'status',
          hideInSearch: true,
          scopedSlots: { customRender: 'status' }
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
          size: pageSize,
          dictionaryTypeId: this.currentRow2.id
        }
        const params = Object.assign(_parameter, this.queryParam)
        const data = await this.$store.dispatch('api/setup/dictionary/searchValue', params)
        console.log(data)
        return data
      },
      action: null,
      currentValue: null
    }
  },
  computed: {
    ...mapGetters('modal', ['dictValuesList']),
    currentRow2: {
      get () {
          return this.currentRow
      },
      set () {
          // just to prevent error
      }
    }
  },
  methods: {
    handleAdd () {
      this.action = 'add'
      this.$store.commit('modal/TOGGLE_ADD_DICT_VALUES_MODAL')
    },
    handleEdit (text, record, index) {
      this.currentValue = record
      this.action = 'edit'
      this.$store.commit('modal/TOGGLE_ADD_DICT_VALUES_MODAL')
    },
    async handleStatusChange (checked, row) {
      try {
        await this.$store.dispatch('api/setup/dictionary/updateStatusValue', { dictionaryValueId: row.id, status: checked ? 'Enable' : 'Disable' })
        this.$notification.open({
          message: checked ? i18nRender('notification.dictionary-value-status.enable') : i18nRender('notification.dictionary-value-status.disable'),
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
        title: this.$t('table.dialog.dictionary-value-confirm'),
        okText: this.$t('table.dialog.yes'),
        cancelText: this.$t('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          try {
            await this.$store.dispatch('api/setup/dictionary/deleteValue', { entityIds: selectedKeys })
            this.$notification.open({
              message: this.$t('table.dialog.dictionary-value-deleted'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
            this.$refs.table.refresh()
          } catch (error) {
            this.$message.error(error.response.data.message)
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .col {
    text-align: right;
    margin: 15px 10px 20px;
  }
</style>
