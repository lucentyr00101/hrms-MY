<template>
  <div>
    <a-card>
      <div v-show="!addSocsoModal && !editSocsoModal">
        <ChosenAlertBox
          permissionNameAdd="setup_payroll_socso_add"
          permissionNameDelete="setup_payroll_socso_delete"
          :isActive="true"
          position="right"
          :totalSelected="selectedRowKeys.length"
          @open="openModal()"
          @delete="handleDelete(selectedRowKeys)"
        />
        <s-table
          permissionName="setup_payroll_socso_view"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :data="loadData"
          :columns="columns"
          ref="table"
          rowKey="id"
          :pagination="{
            'show-total': (total, range) => $tc('table.column.total-items', total),
            showSizeChanger: true,
            showQuickJumper: true
          }"
        >
          <a-switch
            :disabled="!$store.getters.permissions.includes('setup_payroll_socso_update-status')"
            key="status"
            slot="status"
            slot-scope="val, record"
            :default-checked="val === 'Enable' ? true : false"
            @change="e => handleStatus(e, record.id)"
          />
          <span slot="action" slot-scope="text, record">
            <a v-action:setup_payroll_socso_view-edit-details @click="editModal(record)">{{ $t('table.dialog.view') }}</a>
          </span>
        </s-table>
      </div>
      <add-socso-modal @refreshTable="$refs.table.refresh()"/>
      <edit-socso-modal :model="mdl" @refreshTable="$refs.table.refresh()" />
    </a-card>

  </div>
</template>

<script>
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'

import EditableTable from '@/components/Table/EditableTable.vue'
import { i18nRender } from '@/locales'
import AddSocsoModal from './AddSocsoModal.vue'
import EditSocsoModal from './EditSocsoModal.vue'
import { STable } from '@/components'
import InfoCircle from '@/assets/info-circle.svg'

const columns = [
  {
    title: i18nRender('table.column.socso-type'),
    dataIndex: 'socsoType',
    key: 'socsoType',
    ellipsis: true
  },
  {
    title: i18nRender('table.column.descriptions'),
    dataIndex: 'descriptions',
    key: 'descriptions',
    ellipsis: true
  },
  {
    title: i18nRender('table.column.status'),
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: i18nRender('table.column.action'),
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
    name: 'Socso',
    components: { ChosenAlertBox, EditableTable, AddSocsoModal, EditSocsoModal, STable },
    computed: {
      addSocsoModal: {
        get () {
          return this.$store.state.modal.addSocsoModal
        },
        set () {
          // just to prevent error log when @cancel
        }
      },
      editSocsoModal: {
        get () {
          return this.$store.state.modal.editSocsoModal
        },
        set () {
          // just to prevent error log when @cancel
        }
      }
    },

    data () {
        return {
            columns,
            selectedRowKeys: [],
            mdl: null,
            fields: [ 'socsoType', 'descriptions' ],
            queryParam: {},
            loadData: async (parameter) => {
              const { pageNo, pageSize } = parameter
              const _parameter = {
                page: pageNo - 1,
                size: pageSize
              }
              const params = Object.assign(_parameter, this.queryParam)
              const data = await this.$store.dispatch('api/setup/payroll/socso/fetchList', params)
              return data
            }
        }
    },
    methods: {
        openModal () {
            this.$store.commit('modal/TOGGLE_ADD_SOCSO_MODAL')
        },
        editModal (data) {
          this.$store.commit('modal/TOGGLE_EDIT_SOCSO_MODAL')
          this.mdl = { ...data }
        },
        onSelectChange (selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys)
            this.selectedRowKeys = selectedRowKeys
        },
        handleDelete(selectedKeys) {
          if (!selectedKeys.length) return
          this.$confirm({
            title: this.$t('table.dialog.delete-confirm'),
            okText: this.$t('table.dialog.yes'),
            cancelText: this.$t('table.dialog.no'),
            icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
            onOk: async () => {
              try {
                await this.$store.dispatch('api/setup/payroll/socso/deleteSocso', {
                  entityIds: selectedKeys
                })
                this.$notification.open({
                  message: this.$t('notification.socso.deleted'),
                  icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
                })
                this.onSelectChange([])
              } catch (e) {
                this.$message.error(e.response.data.message)
              }
              this.$refs.table.refresh()
            }
          })
        },
        async handleStatus (status, id) {
            try {
              await this.$store.dispatch('api/setup/payroll/socso/toggleStatus', { status, id })
               this.$notification['success']({
                message: status ? i18nRender('notification.socso.enabled') : i18nRender('notification.socso.disabled')
              })
            } catch (e) {
              console.log(e)
            }
        }
    }
}
</script>
