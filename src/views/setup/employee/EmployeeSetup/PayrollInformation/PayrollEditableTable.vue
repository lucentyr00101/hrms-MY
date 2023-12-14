<template>
  <div class="payroll-history">
    <div class="header">
      {{ $t('table.card.payroll-previous-employer') }}
    </div>
    <a-table :columns="columns" row-key="id" :data-source="ds" :pagination="false">
      <template v-for="col in editableColumns" :slot="col.dataIndex" slot-scope="text, record">
        <div :key="col.dataIndex">
          <a-form-item>
            <!-- { required: true, message: `${$t('error.'+`${col.dataIndex}`+'.required')}`} -->
            <a-date-picker
              style="width: 120px"
              v-if="col.valueType === 'date'"
              v-decorator="[
                col.dataIndex + record.id,
                { rules: [{ validator: validateDate }], initialValue: (text && moment(text)) || undefined }
              ]"
              :disabled="!record.editable"
              :disabled-date="disabledDate"
              @change="(date, dateString) => handleDateChange(date, dateString, record.id, col.dataIndex)"
            />
            <a-input
              :disabled="!record.editable"
              :maxLength="10"
              v-else
              @blur="onBlur"
              v-decorator="[col.dataIndex + record.id, { rules: [{ validator: validate }], initialValue: text }]"
              style="margin: -5px 0"
              @change="(e) => handleChange(e.target.value, record.id, col.dataIndex)"
            />
          </a-form-item>
        </div>
      </template>
      <template slot="index" slot-scope="text, record, index">
        {{ index + 1 }}
      </template>
      <template v-if="!editable" slot="action" slot-scope="text, record">
        <a-space>
          <span>
            <a @click="remove(record.id)">{{ $t('table.dialog.delete') }}</a>
          </span>
        </a-space>
      </template>
    </a-table>
    <a-button :disabled="editable" style="width: 100%; margin-top: 8px; margin-bottom: 8px" @click="handleAdd()"
      >+ {{ $t('table.dialog.add-row') }}</a-button
    >
    <span v-if="emptyRecord" class="error">{{ $t('table.dialog.column-validate-msg') }}</span>
    <slot :result="ds"></slot>
    <div class="total-payroll">
      <a-table :columns="totalColumns" row-key="id" :data-source="totalDs" :pagination="false"> </a-table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

const newData = {
  id: 0,
  editable: true
}
export default {
  name: 'PayrollEditableTable',
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    form: { type: Object, default: null },
    disabled: { type: Boolean, default: false },
    editable: { type: Boolean, default: false }
  },

  data() {
    return {
      ds: [],
      cacheData: [],
      count: 0,
      startDate: null,
      endDate: null,
      emptyRecord: false,
      editing: false,
      dateFormat: 'YYYY-MM-DD',
      editableColumns: [
        { dataIndex: 'startDate', valueType: 'date', smallerThan: 'endDate' },
        { dataIndex: 'endDate', valueType: 'date' },
        { dataIndex: 'grossSalary', valueType: 'text' },
        { dataIndex: 'epfAmount', valueType: 'text' },
        { dataIndex: 'socsoAmount', valueType: 'text' },
        { dataIndex: 'eisAmount', valueType: 'text' },
        { dataIndex: 'taxAmount', valueType: 'text' }
      ],
      columns: [
        { title: '#', dataIndex: 'index', scopedSlots: { customRender: 'index' } },
        { title: 'Start Date', dataIndex: 'startDate', scopedSlots: { customRender: 'startDate' } },
        { title: 'End Date', dataIndex: 'endDate', scopedSlots: { customRender: 'endDate' } },
        { title: 'Gross Salary', dataIndex: 'grossSalary', scopedSlots: { customRender: 'grossSalary' } },
        { title: 'EPF', dataIndex: 'epfAmount', scopedSlots: { customRender: 'epfAmount' } },
        { title: 'SOCSO', dataIndex: 'socsoAmount', scopedSlots: { customRender: 'socsoAmount' } },
        { title: 'EIS', dataIndex: 'eisAmount', scopedSlots: { customRender: 'eisAmount' } },
        { title: 'Tax', dataIndex: 'taxAmount', scopedSlots: { customRender: 'taxAmount' } },
        { title: 'Action', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
      ],
      totalColumns: [
        { title: 'YTD TOTAL', dataIndex: 'totalIndex', scopedSlots: { customRender: 'totalIndex' } },
        { title: 'Gross Salary', dataIndex: 'totalGrossSalary', scopedSlots: { customRender: 'totalGrossSalary' } },
        { title: 'EPF', dataIndex: 'totalEpfAmount', scopedSlots: { customRender: 'totalEpfAmount' } },
        { title: 'SOCSO', dataIndex: 'totalSocsoAmount', scopedSlots: { customRender: 'totalSocsoAmount' } },
        { title: 'EIS', dataIndex: 'totalEisAmount', scopedSlots: { customRender: 'totalEisAmount' } },
        { title: 'Tax', dataIndex: 'totalTaxAmount', scopedSlots: { customRender: 'totalTaxAmount' } }
      ]
    }
  },
  computed: {
    isEditing() {
      let editing = false
      if (this.ds.length > 0) {
        this.ds.forEach((el) => {
          if (el.editable === true) editing = true
        })
      }
      return editing
    },
    totalDs() {
      return [
        {
          totalIndex: 'TOTAL',
          totalGrossSalary: this.getSumByKey(this.ds, 'grossSalary'),
          totalEpfAmount: this.getSumByKey(this.ds, 'epfAmount'),
          totalSocsoAmount: this.getSumByKey(this.ds, 'socsoAmount'),
          totalEisAmount: this.getSumByKey(this.ds, 'eisAmount'),
          totalTaxAmount: this.getSumByKey(this.ds, 'taxAmount')
        }
      ]
    }
  },
  created() {
    this.$watch('value', () => {
      this.cacheData = this.ds.map((item) => ({ ...item }))
      this.editableColumns.forEach((el) => {
        newData[el.dataIndex] = ''
      })
      this.ds = this.value
      // if (this.ds.length === 0) {
      //   this.ds = [newData]
      // }
      this.count = this.ds.length
    })
    this.count = this.ds.length
    this.$watch('editable', (newValue) => {
      this.ds = this.ds.map((data) => {
        data.editable = !newValue
        return data
      })
    })
  },
  methods: {
    moment,
    disabledDate(current) {
      return current && current > moment().endOf('day')
    },
    getSumByKey(arr, key) {
      const sum = arr.reduce((accumulator, current) => {
        const currentValue = Number(current[key])
        return accumulator + (isNaN(currentValue) ? 0 : currentValue)
      }, 0)
      return sum || ''
    },
    validateTable() {
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
    validate(rule, value, callback) {
      const regex = /^\d*\.?\d*$/
      const regexDp = /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/

      if (value && !regex.test(value)) {
        callback(new Error(this.$t('error.nan')))
      } else {
        if (value && !regexDp.test(value)) {
          callback(new Error(this.$t('error.2dp')))
        } else {
          callback()
        }
      }
    },
    payrollList() {
      return this.ds
    },
    onBlur(e) {
      const amount = e.target.id
      const value = this.form.getFieldValue(amount)

      if (value && isNaN(value)) this.form.setFieldsValue({ [amount]: value.replace(/[^\d]/g, '') })
    },
    edit(id) {
      const newData = [...this.ds]
      const target = newData.find((item) => id === item.id)

      if (target) {
        target.editable = true
        this.ds = newData
      }
    },
    handleDateChange(date, dateString, id, col) {
      this.handleChange(dateString, id, col)
    },
    handleChange(value, id, column) {
      console.log(id)
      const newData = [...this.ds]
      const target = newData.find((item) => id === item.id)

      target[column] = value
      this.ds = newData
    },
    validateDate(rule, value, callback) {
      let index = rule.field.match(/\d/g)
      if (!index) {
        callback()
        return
      }
      index = index.join('')

      const startDate = this.form.getFieldValue('startDate' + index)
      const endDate = this.form.getFieldValue('endDate' + index)

      const dateField = rule.field.replace(/[0-9]/g, '')

      if (dateField === 'startDate') {
        if (endDate) {
          if (startDate > endDate) {
            callback(new Error(this.$t('error.start-date.later')))
            return
          }
        }
      } else {
        if (startDate) {
          if (endDate < startDate) {
            callback(new Error(this.$t('error.end-date.earlier')))
            return
          }
        }
      }
      callback()
    },
    handleAdd() {
      this.ds = [...this.ds, { ...newData, id: this.count }]
      this.count = this.ds.length
    },
    remove(id) {
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
    }
  }
}
</script>

<style lang="less" scoped>
.error {
  color: red;
}

.header {
  background-color: #e8e8e8;
  font-size: 15px;
  padding: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

.total-payroll {
  padding-top: 25px;
  padding-left: 50px;
  padding-right: 135px;
}

.payroll-history {
  .ant-form-item {
    margin-bottom: 0;
  }
}
</style>
