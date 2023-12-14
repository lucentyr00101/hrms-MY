<template>
  <div>
    <a-card class="antd-custom-table">
      <query-form :columns="filters" v-model="queryParam" @click="$refs.table.refresh(true)" />
    </a-card>
    <a-card class="antd-custom-table">
      <chosen-alert-box
        permissionNameAdd="setup_company_library_add"
        permissionNameDelete="setup_company_library_delete"
        :isActive="true"
        position="right"
        @open="modalHandler({ show: true, action: 'add' })"
        @delete="handleDelete(selectedRowKeys)"
        :totalSelected="selectedRowKeys.length"
      />
      <s-table
        permissionName="setup_company_library_view"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
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
      >
        <span slot="action" slot-scope="value, data">
          <a
            v-action:setup_company_library_view-edit-details
            @click="modalHandler({ show: true, action: 'view', data })"
            >{{ $t('table.dialog.view') }}</a
          >
          <a-divider type="vertical" />
          <a
            v-action:setup_company_library_download
            :style="data.attachments.length === 0 ? { color: 'grey' } : null"
            @click="downloadAttachments(data.id, data.title, data.attachments)"
            >{{ $t('table.dialog.download') }}</a
          >
        </span>
      </s-table>
      <FormModal :modal="formModal" @refreshTable="refreshTable" />
    </a-card>
  </div>
</template>

<script>
import QueryForm from '@/components/Table/QueryForm.vue'
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import FormModal from './form-modal.vue'
import { columns, filters } from './columns'
import { i18nRender } from '@/locales'

export default {
  name: 'SetupCompanyLibrary',
  components: {
    ChosenAlertBox,
    QueryForm,
    FormModal
  },
  data() {
    return {
      selectedRowKeys: [],
      queryParam: {},
      authors: [],
      formModal: { show: false },
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize,
          createdDate: this.queryParam?.createdDate || null,
          title: this.queryParam?.title || null,
          author: this.queryParam?.author || 'All'
        }
        window.localStorage.setItem('SCL-Filter', JSON.stringify(this.queryParam))
        const data = await this.$store.dispatch('api/setup/company/library/search', _parameter)
        return { data }
      }
    }
  },
  computed: {
    columns() {
      return columns
    },
    filters() {
      return filters(this.authors)
    }
  },
  async created() {
    const filter = window.localStorage.getItem('SCL-Filter')
    this.queryParam = filter ? JSON.parse(filter) : this.queryParam

    const { data } = await this.$store.dispatch('api/dropdown/fetchLibraryAuthorDropdown')
    this.authors = data
  },
  methods: {
    async downloadAttachments(selectedID, title, attachments) {
      if (attachments.length === 0) return
      await this.$store.dispatch('api/setup/company/library/download', {
        id: selectedID,
        title
      })
    },
    modalHandler(payload) {
      const { show = false, action = undefined, data = {} } = payload || {}
      this.formModal = { show, action, data }
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    refreshTable() {
      this.$refs.table.refresh()
      this.modalHandler({ show: false })
    },
    handleDelete(selectedKeys) {
      if (!selectedKeys.length) return
      this.$confirm({
        title: () => (
          <div class="confirm-modal-title">
            <div>
              <img src="/icons/info-dialog.svg" style="margin-right: 10px;" />
              <span>{i18nRender('delete.confirm')}</span>
            </div>
          </div>
        ),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: 'none',

        onOk: async () => {
          try {
            await this.$store.dispatch('api/setup/company/library/delete', {
              entityIds: selectedKeys
            })

            this.$notification.open({
              message: this.$t('notification.library.deleted'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
            this.onSelectChange([])
          } catch (error) {
            if (error?.response?.data?.message) this.$message.error(error?.response?.data?.message)
          }
          this.$refs.table.refresh()
        }
      })
    }
  }
}
</script>
