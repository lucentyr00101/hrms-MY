<template>
  <div>
    <h3>{{ $t('table.column.assets') }}:</h3>
    <a-table
      style="margin-bottom: 20px;"
      :columns="columns"
      :data-source="list"
      :pagination="false"
    >
      <span slot="employeeName" slot-scope="text, record">{{ record.employee?.fullName }}</span>
      <span slot="action" slot-scope="text, record">
        <a-button
          v-if="isReturned(record)"
          type="danger"
          ghost
        >
          {{ $t('table.dialog.returned') }}
        </a-button>
        <a
          v-else
          @click="handleReturn(record)"
        >
          {{ $t('table.dialog.return') }}
        </a>
      </span>
    </a-table>
  </div>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'
import { mapActions } from 'vuex'

export default {
  name: 'ResignationAssetsList',
  props: {
    employee: {
      type: Object,
      default: () => null
    }
  },
  created () {
    this.loadAssets()
    this.$watch('employee', () => {
      this.loadAssets()
    })
  },
  data () {
    return {
      list: []
    }
  },
  computed: {
    columns () {
      return [
        { title: 'Employee Number', dataIndex: 'employee.employeeNumber' },
        { title: 'Employee', dataIndex: 'employeeName', scopedSlots: { customRender: 'employeeName' } },
        { title: 'Department', dataIndex: 'employee.department' },
        { title: 'Assets Type', dataIndex: 'companyAsset.assetType' },
        { title: 'Assets', dataIndex: 'companyAsset.assetName' },
        { title: 'Serial Number', dataIndex: 'companyAsset.serialNumber' },
        { title: 'Value', dataIndex: 'companyAsset.value' },
        { title: 'Action', scopedSlots: { customRender: 'action' } }
      ]
    }

  },
  methods: {
    ...mapActions('api/main/employeeManagement/assetsLists', ['returnAssets']),
    isReturned (record) {
      return record.companyAsset?.status === 'Available'
    },
    async loadAssets () {
      const handoverData = await this.$store.dispatch('api/main/employeeManagement/assetsLists/handover', this.employee?.data?.employeeNumber)
      this.list = handoverData?.data?.grantedManagementAssets || []
    },
    async handleReturn (record) {
      try {
        await this.returnAssets({
          data: {
            employeeManagementAssetId: record.id,
            employeeSetupId: this.employee?.data.id
          }
        })
        this.loadAssets()
      } catch (e) {
        this.$confirm({
          centered: true,
          title: this.$t('resignation.assets-still-assigned'),
          okText: this.$t('table.dialog.okay'),
          cancelButtonProps: { style: { display: 'none' } },
          onOk: () => {},
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />
        })
      }
    }
  }
}
</script>
