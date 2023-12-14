<template>
  <div>
    <a-card>
      <ChosenAlertBox
        permissionNameAdd="security_account-center_add"
        permissionNameDelete="security_account-center_delete"
        :isActive="true"
        :totalSelected="selectedItems.length"
        position="right"
        @open="modalHandler({ show: true, action: 'add' })"
        @delete="deleteData"
      />
      <s-table
        permissionName="security_account-center_view"
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
        <template slot="logo" slot-scope="value">
          <img v-if="(value)" class="logo" :src="value"/>
        </template>
        <span slot="status" slot-scope="value, data">
          <a-switch
            :disabled="!$store.getters.permissions.includes('security_account-center_update-status')"
            :checked="(value === 'Enable')"
            @click="toggleStatus(data.id, value)"
          />
        </span>
        <span slot="action" slot-scope="value, data">
          <a v-action:security_account-center_edit class="action-button" @click="getDetails('update', data)">{{ $t('table.dialog.edit') }}</a>
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
  name: 'AccountCenter',
  components: {
    ChosenAlertBox,
    Modal
  },
  data() {
    return {
      modalData: { show: false },
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
        const response = await this.$store.dispatch('api/security/accountCenter/fetchList', params)
        // console.log(response)
        this.currentData = response.data.data
        return response
      }
    }
  },
  computed: {
    columns() {
      return [
        { title: i18nRender('table.column.logo'), dataIndex: 'logo.fileLink', key: 'logo', scopedSlots: { customRender: 'logo' } },
        { title: i18nRender('table.column.countries'), dataIndex: 'country', key: 'country', ellipsis: true },
        { title: i18nRender('table.column.company-name'), dataIndex: 'companyName', key: 'companyName', ellipsis: true },
        { title: i18nRender('table.column.remarks'), dataIndex: 'remarks', key: 'remarks', ellipsis: true },
        { title: i18nRender('table.column.status'), dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' } },
        { title: i18nRender('table.column.action'), dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  methods: {
    async getDetails(action, data) {
      this.modalHandler({ show: true, action, data })
      // try {
      //   const details = await this.$store.dispatch('api/security/accountCenter/fetchDetails', { id: data.id })
      //   this.modalHandler({ show: true, action, data: { id: data.id, ...details.data } })
      // } catch (error) {
      //   throw error
      // }
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
        await this.$store.dispatch('api/security/accountCenter/toggleStatus', { id, status: (status === 'Enable') ? 'Disable' : 'Enable' })
        this.$notification.open({
          message: (status === 'Enable') ? this.$t('notification.account-center.disabled') : this.$t('notification.account-center.enabled'),
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
              await this.$store.dispatch('api/security/accountCenter/delete', { entityIds: this.selectedItems })
              this.$notification.open({
                message: this.$t('notification.account-center.deleted'),
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
      this.$refs.table.refresh()
      this.modalHandler({ show: false })
    }
  },
  created() {}
}
</script>

<style scoped>
  .logo {
    width: 100px;
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
</style>
