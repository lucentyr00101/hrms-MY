<template>
  <div>
    <a-table :columns="columns" :data-source="ds" :pagination="false">
      <div v-for="col in editableColumns" :key="col.dataIndex" :slot="col.dataIndex" slot-scope="text, record">
        <a-date-picker
        :value="text"
        :disabled="disabled"
        placeholder="Select date"
        :disabled-date="disabledDate"
        v-if="col.valueType==='date'"
        @change="(date, dateString) => handleDateChange(date,dateString, record.key, col.dataIndex)"/>
        <a-input
          :maxLength="col.maxLength ?? ((col.dataIndex === 'name' || col.dataIndex) === 'relation' ? 25 : 13)"
          :disabled="disabled"
          v-else
          style="margin: -5px 0"
          :value="text"
          @change="(e) => handleChange(e.target.value, record.key, col.dataIndex)"
        />
      </div>
      <template slot="index" slot-scope="text, record, index">
        {{ index+1 }}
      </template>
      <template slot="action" slot-scope="text, record">
        <a-space>
          <span>
            <a :disabled="disabled" @click="remove(record.key)">{{ deleteText || $t('table.dialog.delete') }}</a>
          </span>
        </a-space>
      </template>
    </a-table>
    <a-button :disabled="disabled" style="width: 100%; margin-top: 8px; margin-bottom:8px" @click="handleAdd()">+ {{ $t('table.dialog.add-row') }}</a-button>
    <span class="error" v-if="emptyRecord">{{ $t('table.dialog.column-validate-msg') }}</span>
    <slot :result="ds"></slot>
  </div>
</template>

<script>
import moment from 'moment'
const newData = {
  key: 0,
  initial: true
}
export default {
  name: 'EmployeeEditableTable',
  props: {
    columns: { type: Array, default () { return [] } },
    editableColumns: { type: Array, default () { return [] } },
    dataSource: { type: Array, default () { return [] } },
    deleteText: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  },
  data () {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      // mock data
      ds: this.dataSource,
      count: this.dataSource.length,
      cacheData: [],
      emptyRecord: false
    }
  },
  created () {
    this.ds = this.dataSource
    this.$watch('dataSource', () => {
      this.cacheData = this.ds.map((item) => ({ ...item }))
      this.editableColumns.forEach((el) => {
        newData[el] = ''
      })
      this.ds = this.dataSource.map((el, i) => ({ ...el, key: i }))
      this.count = this.ds.length
    })
    this.count = this.ds.length
  },
  methods: {
    disabledDate (current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day')
    },
    edit (key) {
      const newData = [...this.ds]
      const target = newData.find((item) => key === item.key)
      if (target) {
        this.ds = newData
      }
    },
    save (key) {
      const newData = [...this.ds]
      const newCacheData = [...this.cacheData]
      const target = newData.find((item) => parseInt(key) === parseInt(item.key))
      const targetCache = newCacheData.find((item) => key === item.key) || {}
      if (target) {
        delete target.initial
        this.ds = newData
        Object.assign(targetCache, target)
        this.cacheData = newCacheData
      }
    },
    handleChange (value, key, column) {
        const newData = [...this.ds]
        const target = newData.find((item) => key === item.key)
        target[column] = value
        this.ds = newData
        this.$emit('input', this.ds)
    },
    handleDateChange (date, dateString, key, dataIndex) {
        const newData = [...this.ds]
        const target = newData.find((item) => key === item.key)
        target[dataIndex] = dateString
        this.ds = newData
        this.$emit('input', this.ds)
    },
    cancel (key) {
      const newData = [...this.ds]
      const target = newData.find((item) => parseInt(key) === parseInt(item.key))
      if (target.initial) {
        this.remove(key)
      } else if (target) {
        console.log(Object)
        Object.assign(
          target,
          this.cacheData.find((item) => parseInt(key) === parseInt(item.key))
        )
        this.ds = newData
      }
    },
    handleAdd () {
      this.ds = [...this.ds, { ...newData, key: this.count }]
      this.count = this.ds.length
    },
    remove(key) {
      this.emptyRecord = false
      const newData = []
      let newKey = 0
      this.ds.forEach((el, i) => {
        if (el.key !== key) {
          newData.push({ ...el, key: newKey })
          newKey++
        }
      })

      this.ds = newData
      this.count = this.count - 1
      console.log(this.ds)
    },
    validateTableEmpty () {
      if (this.count === 0) return false
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
    }
  }
}
</script>

<style lang="less" scoped>
    .ant-calendar-picker {
      width: 100%;
    }
    .error {
        color: red;
    }
</style>
