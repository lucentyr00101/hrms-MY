<template>
  <a-modal
    centered
    :okText="$t('table.dialog.confirm')"
    :cancelButtonProps="{ style: 'display: none;' }"
    :visible="visible"
    :destroyOnClose="true"
    :title="$t('table.dialog.add-leave')"
    :width="700"
    :confirm-loading="loading"
    @cancel="closeModal"
    @ok="showConfirm"
  >
    <a-form :form="form" layout="horizontal">
      <a-row :gutter="[8, 8]">
        <a-col :span="16">
          <a-form-item :label="$t('table.column.employee')">
            <a-select
              show-search
              placeholder="Select"
              v-decorator="[
                'employeeName',
                {
                  rules: [
                    { required: true, message: $t('error.employee.required') }
                  ]
                }
              ]"
            >
              <a-select-option v-for="(employees, index) in dropdown.employee" :key="index" :value="employees.value" @click="handleSelectChangeEmployee(employees)">{{ employees.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="16">
          <a-spin :spinning="leaveLoading">
            <a-form-item :label="$t('table.dialog.leave-type')">
              <a-select
                show-search
                placeholder="Select"
                v-decorator="[
                  'leaveType',
                  {
                    rules: [
                      { required: true, message: $t('error.leave-type.required') }
                    ]
                  }
                ]"
              >
                <a-select-option v-for="(leaveTypes, index) in leaveTypeEmp" :key="index" :value="leaveTypes.companyLeaveType" @click="handleSelectChangeLeaveType(leaveTypes)">{{ leaveTypes.companyLeaveType }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-spin>
        </a-col>
        <a-col :span="8" class="leaves-available">
          <a-icon type="info-circle" :style="{ color: '#1890ff' }"/> Leaves Available: {{ leaveBalance }}
        </a-col>
        <a-col :span="18">
          <div class="date"><span class="asterisk">*</span><span class="date-label">{{ $t('table.dialog.date') }}</span></div>
          <a-row style="padding-left: 10px; padding-right: 10px; margin-bottom: 10px">
            <a-table :columns="columns" row-key="id" :data-source="ds" :pagination="false" class="leaveType">
              <template
                v-for="col in editableColumns"
                :slot="col.dataIndex"
                slot-scope="text, record" >
                <span :key="col.dataIndex">
                  <a-select
                    :value="text"
                    :options="dateType"
                    v-if="col.valueType==='select'"
                    @change="(value) => handleChange(value, record.id, col.dataIndex)"
                  />
                  <a-range-picker
                    v-else
                    @change="(value) => handleChange(value, record.id, col.dataIndex)"
                  />
                </span>
              </template>
              <template slot="action" slot-scope="text, record">
                <a-space>
                  <span>
                    <a @click="remove(record.id)"><a-icon type="delete" :style="{ color: '#bfbfbf' }" /></a>
                  </span>
                </a-space>
              </template>
            </a-table>
            <a-button style="width: 100%; margin-top: 8px; margin-bottom:8px" @click="handleAdd()">+ {{ $t('table.dialog.add-row') }}</a-button>
            <span class="error" v-if="emptyRecord">{{ $t('table.dialog.column-validate-msg') }}</span>
          </a-row>
        </a-col>
        <a-col :span="16">
          <a-form-item :label="$t('table.dialog.reasons')">
            <a-textarea
            placeholder="Autosize height based on content lines="
            :autoSize="{ minRows: 3, maxRows: 6 }"
            :maxLength="100"
            v-decorator="[
              'reasons',
              {
                rules: [
                  { required: true, message: $t('error.reasons.required') }
                ]
              }
            ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="16">
          <div class="attachments"><span class="attachment">{{ $t('table.dialog.attachment') }} </span><span class="optional">{{ $t('table.dialog.optional') }}</span></div>
          <a-upload
            name="file"
            @change="handleUploadChange"
            v-decorator="['attachments']"
            :beforeUpload="() => false"
          >
            <a-button> <a-icon type="upload" /> {{ $t('table.dialog.click-to-upload') }} </a-button>
          </a-upload>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'
import moment from 'moment'
const newData = {
  id: 0,
  dateRange: '',
  dateType: ''
}
export default {
  props: {
    dropdown: {
      type: Object,
      default: null
    }
  },
  created () {
    this.handleAdd()
  },
  data () {
    return {
      visible: false,
      loading: false,
      form: this.$form.createForm(this, { name: 'addLeaveModal' }),
      employee: null,
      leaveType: null,
      leaveTypeEmp: [],
      leaveBalance: '0',
      ds: [],
      columns: [
        { title: 'Date Range', dataIndex: 'dateRange', id: 'dateRange', scopedSlots: { customRender: 'dateRange' } },
        { title: 'Date Type', dataIndex: 'dateType', id: 'dateType', scopedSlots: { customRender: 'dateType' } },
        { title: 'Action', id: 'action', scopedSlots: { customRender: 'action' } }
      ],
      editableColumns: [
        { dataIndex: 'dateRange', valueType: 'date' },
        { dataIndex: 'dateType', valueType: 'select' }
      ],
      dateType: [
        { value: '1st Half', label: '1st Half' },
        { value: '2nd Half', label: '2nd Half' },
        { value: 'Full Day', label: 'Full Day' }
      ],
      count: 0,
      emptyRecord: false,
      error1: false,
      error2: false,
      error3: false,
      error4: false,
      error5: false,
      attachments: [],
      leaveLoading: false
    }
  },
  methods: {
    view() {
      this.visible = true
    },
    closeModal() {
      this.visible = false
      this.ds = []
      this.emptyRecord = false
      this.handleAdd()
    },
    async handleSelectChangeEmployee (data) {
      this.leaveBalance = '0'
      this.leaveLoading = true
      this.employee = data.id
      const response = await this.$store.dispatch('api/main/hr/leaveBalance/fetchDetails', { id: this.employee })
      this.leaveTypeEmp = response.data.employeeLeaveBalances
      this.leaveLoading = false
    },
    handleSelectChangeLeaveType (data) {
      this.leaveType = data.companyLeaveTypeId
      this.leaveBalance = data.entitledDays
    },
    handleAdd () {
      this.ds = [...this.ds, { ...newData, id: this.count }]
      this.count = this.ds.length
    },
    remove (id) {
      const newData = []
      let newKey = 0
      this.ds.forEach((el, i) => {
        if (el.id !== id) {
          newData.push({ ...el, id: newKey })
          newKey++
        }
      })

      this.ds = newData
      this.count = this.count - 1
    },
    validateTable () {
      this.emptyRecord = false
      if (this.ds.length === 0) {
        this.emptyRecord = true
      } else {
        this.ds.forEach((el) => {
          this.editableColumns.forEach((elj) => {
            if (!el[elj.dataIndex]) {
              this.emptyRecord = true
            }
          })
        })
      }
      return !this.emptyRecord
    },
    handleChange (value, id, column) {
      const newData = [...this.ds]
      const target = newData.find((item) => id === item.id)
      target[column] = value
      this.ds = newData
    },
    handleUploadChange(info) {
      this.attachments = info.fileList
    },
    showConfirm () {
      this.form.validateFields((err) => {
        if (err) {
          this.error1 = true
        } else {
          this.error1 = false
        }
      })
      // validate editable table
      if (!this.validateTable()) {
        this.error2 = true
      } else {
        this.error2 = false
      }
      if (this.attachments.length > 5) {
        this.error3 = true
        this.$notification.open({
          message: this.$t('error.5attachments'),
          icon: <a-icon type="close-circle" theme="twoTone" two-tone-color="#ff0000" />
        })
      } else {
        this.error3 = false
      }
      // validate leaves available
      if (!this.error1 && !this.error2 && !this.error3 && this.leaveBalance === '0') {
        this.$notification.open({
          message: this.$t('error.leaves-available'),
          icon: <a-icon type="close-circle" theme="twoTone" two-tone-color="#ff0000" />
        })
        this.error4 = true
      } else {
        this.error4 = false
      }
      const dateListTotal = this.ds.map(item => {
        const a = moment(moment(item.dateRange['1']).format('YYYY-MM-DD'))
        const b = moment(moment(item.dateRange['0']).format('YYYY-MM-DD'))
        let noOfDays = a.diff(b, 'days') + 1
        let dataType = 0
        if (item.dateType === 'Full Time') {
          dataType = 1
        } else {
          dataType = 0.5
        }
        noOfDays = noOfDays * dataType
        return noOfDays
      })
      let sum = 0
      dateListTotal.forEach(item => {
        sum += item
      })
      if (!this.error1 && !this.error2 && !this.error3 && !this.error4 && sum > this.leaveBalance) {
        this.$notification.open({
          message: this.$t('error.leaves-duration'),
          icon: <a-icon type="close-circle" theme="twoTone" two-tone-color="#ff0000" />
        })
        this.error5 = true
      } else {
        this.error5 = false
      }
      // if both validation has no error
      if (!this.error1 && !this.error2 && !this.error3 && !this.error4 && !this.error5) {
        this.$confirm({
          centered: true,
          title: this.$t('save.confirm'),
          okText: this.$t('table.dialog.yes'),
          cancelText: this.$t('table.dialog.no'),
          onOk: () => this.handleSubmit(),
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />
        })
      }
    },
    async handleSubmit () {
      try {
        this.loading = true
        const transDateList = this.ds.map(item => {
          return { startDate: moment(item.dateRange['0']).format('YYYY-MM-DD'), endDate: moment(item.dateRange['1']).format('YYYY-MM-DD'), leaveDuration: item.dateType }
        })
        const data = {
          employeeId: this.employee,
          companyLeaveTypeId: this.leaveType,
          transactionDateList: transDateList,
          reasons: this.form.getFieldValue('reasons')
        }
        const blob = new Blob([JSON.stringify(data)], {
          type: 'application/json'
        })
        const formData = new FormData()
        formData.append('hrLeaveTransactionAddParam', blob)
        this.attachments.forEach(r =>
        formData.append('attachments', r.originFileObj)
        )
        await this.$store.dispatch('api/main/hr/leaveTransactions/add', formData)
        this.$notification.open({
          message: this.$t('notification.leave.added'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        this.closeModal()
        this.$parent.$parent.$refs.table.refresh(true)
        this.loading = false
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less">
.ant-form-item {
  margin-bottom: 0;
}
.leaves-available {
  position: relative;
  top: 47px;
  left: 18px;
}
.leaveType {
  .ant-table-thead {
    display: none
  }
}
.date {
  margin-top: 10px;
  .asterisk {
    margin-right: 4px;
    color: #f5222d;
    font-size: 14px;
    font-family: SimSun, sans-serif;
  }
  .date-label {
    color: rgba(0, 0, 0, 0.85);
  }
}
.attachments {
  margin: 10px 0;
  .attachment {
    color: rgba(0, 0, 0, 0.85);
  }
  .optional {
    color: #bfbfbf;
  }
}
.ant-calendar-picker {
  width: 235px;
}
.ant-table-tbody > tr > td:nth-child(2) {
  width: 145px;
}
.error {
  color: red;
}
</style>
