<template>
  <div>
    <FillEmployee :employee="employee" />
    <ChosenAlertBox
      :isActive="true"
      :totalSelected="selectedRowKeys.length"
      position="right"
      @open="handleAdd"
      @delete="handleDelete(selectedRowKeys)"
      :disabled="disabled"
    />
    <a-table
      rowKey="deductionId"
      ref="table"
      size="default"
      :columns="columns"
      :data-source="data"
      :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
      :pagination="{
        'show-total': (total, range) => $tc('table.column.total-items', total),
        showSizeChanger: true,
        showQuickJumper: true
      }"
    >
      <template slot="action" slot-scope="text, record">
        <a :disabled="disabled" @click="handleEdit(record)">{{ $t('table.dialog.edit') }}</a>
      </template>
    </a-table>
    <div style="display: flex">
      <a-space style="margin-left: auto; margin-top: 8px">
        <a-button v-show="action === 'edit'" class="confirm-btn" type="secondary" @click="cancel()">{{
          $t('table.dialog.cancel')
        }}</a-button>
        <a-button class="confirm-btn" v-if="disabled" type="primary" @click="disabled = false">{{
          $t('table.dialog.edit')
        }}</a-button>
        <a-button class="confirm-btn" v-if="!disabled" type="primary" @click="showConfirm()">{{
          $t('table.dialog.confirm')
        }}</a-button>
      </a-space>
    </div>
    <AddDeduction
      v-model="showAddModal"
      :action="action"
      :actionModal="actionModal"
      :currentValue="currentValue"
    />
  </div>
</template>

<script>
import ChosenAlertBox from '@/components/Table/ChosenAlertBox.vue'
import AddDeduction from '@/components/Setup/Employee/EmployeeSetup/Deduction/AddDeduction'
import InfoCircle from '@/assets/info-circle.svg'
import { i18nRender } from '@/locales'
import { mapGetters } from 'vuex'
import FillEmployee from '@/components/Setup/Employee/EmployeeSetup/FillEmployee.vue'
import { employeeSetupMixin } from '@/store/app-mixin'

export default {
  name: 'Deduction',
  components: { ChosenAlertBox, AddDeduction, FillEmployee },
  mixins: [employeeSetupMixin],
  data () {
    return {
      data: [],
      disabled: false,
      selectedRowKeys: [],
      deletedRowKeys: [],
      showAddModal: false,
      action: null,
      actionModal: null,
      currentValue: null
    }
  },
  computed: {
    ...mapGetters('api/setup/employee/employeeSetup', ['employee']),
    columns () {
      return [
        { title: i18nRender('table.column.deduction-type'), dataIndex: 'deductionType' },
        { title: i18nRender('table.column.sequence'), dataIndex: 'sequence' },
        { title: i18nRender('table.column.amount'), dataIndex: 'amount' },
        { title: i18nRender('table.column.from'), dataIndex: 'fromDate' },
        { title: i18nRender('table.column.to'), dataIndex: 'toDate' },
        {
          title: i18nRender('table.column.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  async created () {
    if (this.$route.params.id) {
      this.disabled = true
      this.action = 'edit'
      this.getEmployeeSetup(this.$route.params.id).then(res => {
        this.data = res.data.employeeSetupDeductionList
      })
    }
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
      console.log(this.selectedRowKeys)
    },
    cancel () {
      if (this.action === 'edit' && !this.disabled) {
        this.disabled = true
        // reset the value back to original
        this.data = this.employee.data.employeeSetupDeductionList
      } else {
        this.$multiTab.closeCurrentPage()
        this.$router.push({ name: 'setup-employee-employee-setup' })
      }
    },
    showNotification () {
      this.$notification.open({
        message: this.$t('table.dialog.deduction-saved'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    handleDelete (selectedRowKeys) {
      const _this = this
      if (selectedRowKeys.length > 0) {
        this.$confirm({
          title: _this.$t('delete.confirm'),
          okText: 'Yes',
          cancelText: 'No',
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
          onOk: () => {
            const newArray = _this.data.filter(item => !selectedRowKeys.includes(item.deductionId))
            _this.selectedRowKeys = []
            _this.data = newArray
            _this.$notification.open({
              message: this.$t('table.dialog.deduction-deleted'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
          }
        })
      }
    },
    showConfirm () {
      this.$confirm({
        centered: true,
        title: i18nRender('save.confirm'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        onOk: () => this.handleSubmit(),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />
      })
    },
    handleSubmit () {
      try {
        this.loading = true
        const data = {
          employeeSetupId: this.employee.data.id,
          employeeSetupDeductionList: this.data
        }
        this.$store.dispatch('api/setup/employee/employeeSetup/editEmployeeDeduction', data)
        .then((res) => {
          this.$store.commit('api/setup/employee/employeeSetup/SET_EMPLOYEE', res)
          this.$notification.open({
            message: i18nRender('table.dialog.deduction-saved'),
            icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
          })
          this.action = 'edit'
          this.disabled = true
        }).catch(err => {
          this.$message.error(err.response.data.message)
        })
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    handleAdd () {
      this.actionModal = 'add'
      this.showAddModal = true
    },
    handleEdit (val) {
      this.currentValue = val
      this.actionModal = 'edit'
      this.showAddModal = true
    }
  }
}
</script>
