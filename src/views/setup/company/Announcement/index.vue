<template>
  <div>
    <a-card id="filter">
      <a-row type="flex" :gutter="[80, 8]">
        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="70px" :span="12">{{ $t('table.column.time') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-date-picker
                v-model="filter.dateTime"
                show-time
                allow-clear
                :placeholder="$t('error.date-time.select')"
              />
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="70px" :span="12">{{ $t('table.column.author') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-select
                v-model="filter.author"
                :options="authorList"
                show-search
                allow-clear
                :placeholder="$t('table.column.all')"
              />
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="8">
          <a-row type="flex">
            <a-col class="name" flex="70px" :span="12">{{ $t('table.column.title') }}:</a-col>
            <a-col class="input" flex="auto" :span="12">
              <a-input v-model="filter.title" allow-clear />
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
        permissionNameAdd="setup_company_announcement_add"
        permissionNameDelete="setup_company_announcement_delete"
        :isActive="true"
        :totalSelected="selectedItems.length"
        position="right"
        @open="modalHandler({ show: true, action: 'add' })"
        @delete="deleteData"
      />
      <s-table
        permissionName="setup_company_announcement_view"
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
        <span slot="postTime" slot-scope="value">{{ value ? formatDate(value) : '' }}</span>
        <span slot="status" slot-scope="value, data">
          <a-switch
            :disabled="!$store.getters.permissions.includes('setup_company_announcement_update-status')"
            :defaultChecked="value === 'Enable'"
            @click="toggleStatus(data.id, value)"
          />
        </span>
        <span slot="action" slot-scope="value, data">
          <a
            v-action:setup_company_announcement_view-acknowledge
            class="action-button"
            @click="getDetails('view', data)"
            >{{ $t('table.dialog.view') }}</a
          >
          <a-divider type="vertical" />
          <a-dropdown>
            <a v-action:setup_company_announcement_more class="action-button ant-dropdown-link">
              <span>{{ $t('table.dialog.more') }}</span>
              <a-icon :style="{ margin: '0 0 0 3px' }" type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item key="0">
                <a
                  v-action:setup_company_announcement_more_edit
                  class="action-button"
                  @click="getDetails('update', data)"
                  >{{ $t('table.dialog.edit') }}</a
                >
              </a-menu-item>
              <a-menu-item key="1">
                <a
                  v-action:setup_company_announcement_more_acknowledgement-list
                  class="action-button"
                  @click="getAcknowledgedList('list', data)"
                  >{{ $t('table.dialog.acknowledgement-list') }}</a
                >
              </a-menu-item>
            </a-menu>
          </a-dropdown>
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
  name: 'SetupCompanyAnnouncement',
  components: {
    ChosenAlertBox,
    Modal
  },
  data() {
    return {
      filter: { dateTime: undefined, author: undefined, title: undefined },
      modalData: { show: false },
      selectedItems: [],
      queryParam: {},
      currentData: [],
      selectedNestedKeys: [],
      authorList: [],
      loadData: async (parameter) => {
        const { dateTime, author, title } = this.filter
        const { pageNo, pageSize } = parameter
        const _parameter = {
          postTime: dateTime ? this.formatDate(dateTime, 'YYYY-MM-DD HH:mm:ss') : undefined,
          author,
          title,
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const response = await this.$store.dispatch('api/setup/company/announcement/fetchList', params)
        // console.log(response)
        this.currentData = response.data.data
        return response
      }
    }
  },
  computed: {
    columns() {
      return [
        { title: i18nRender('table.column.title'), dataIndex: 'title', key: 'title', ellipsis: true },
        { title: i18nRender('table.column.content'), dataIndex: 'content', key: 'content', ellipsis: true },
        {
          title: i18nRender('table.column.post-time'),
          dataIndex: 'postTime',
          key: 'postTime',
          ellipsis: true,
          scopedSlots: { customRender: 'postTime' }
        },
        { title: i18nRender('table.column.author'), dataIndex: 'author', key: 'author' },
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
    }
  },
  methods: {
    initiate() {
      // Set Filter
      const filter = window.localStorage.getItem('SCA-Filter')
      this.filter = filter ? JSON.parse(filter) : this.filter

      this.getAuthorList()
    },
    async getAuthorList() {
      try {
        const list = await this.$store.dispatch('api/dropdown/fetchAuthorDropdown')
        this.authorList = list?.data.filter((item) => item !== 'All').map((item) => ({ value: item, label: item }))
      } catch (error) {
        throw error
      }
    },
    async getAcknowledgedList(action, data) {
      try {
        const list = await this.$store.dispatch('api/setup/company/announcement/fetchAcknowledgedList', {
          companyAnnouncementId: data.id
        })
        this.modalHandler({ show: true, action, data: { id: data.id, list: list.data } })
      } catch (error) {
        throw error
      }
    },
    async getDetails(action, data) {
      try {
        const details = await this.$store.dispatch('api/setup/company/announcement/fetchDetails', { id: data.id })
        this.modalHandler({ show: true, action, data: { id: data.id, ...details.data } })
      } catch (error) {
        throw error
      }
    },
    resetFilter() {
      this.filter = { dateTime: undefined, author: undefined, title: undefined }
      this.refreshTable()
    },
    modalHandler(payload) {
      const { show = false, action = undefined, data = {} } = payload || {}
      this.modalData = { show, action, data }
    },
    onSelectChange(selectedItems) {
      this.selectedItems = [...selectedItems]
    },
    async toggleStatus(id, status) {
      try {
        await this.$store.dispatch('api/setup/company/announcement/toggleStatus', {
          id,
          status: status === 'Enable' ? 'Disable' : 'Enable'
        })
        this.$notification.open({
          message:
            status === 'Enable'
              ? this.$t('notification.announcement.disabled')
              : this.$t('notification.announcement.enabled'),
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
          okText: i18nRender('table.dialog.yes'),
          cancelText: i18nRender('table.dialog.no'),
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
          onOk: async () => {
            try {
              await this.$store.dispatch('api/setup/company/announcement/delete', { entityIds: this.selectedItems })
              this.$notification.open({
                message: this.$t('notification.announcement.deleted'),
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
    closeModal() {
      this.modalData.show = false
    },
    refreshTable() {
      window.localStorage.setItem('SCA-Filter', JSON.stringify(this.filter))
      this.getAuthorList()
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
  width: 100%;
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
  background-color: #ff4d4f;
}

.status .point.approved,
.status .point.claimed {
  background-color: #52c41a;
}

.status .point.pending {
  background-color: #faad14;
}

@media (max-width: 788px) {
  #filter .name {
    text-align: left;
  }
}
</style>
