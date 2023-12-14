<template>
  <div>
    <a-table :columns="columns" :data-source="ds" :pagination="false" rowKey="id" class="editable-table">
      <template v-for="col in editableColumns" :slot="col.dataIndex" slot-scope="text, record">
        <div :key="col.dataIndex">
          <a-form-item
            :wrapper-col="{ span: 24 }"
            :validate-status="!validateMinMax(col, record) ? 'error' : ''"
            :help="!validateMinMax(col, record) ? $t('error.min-max.validation') : ''"
          >
            <a-date-picker
              :value="text"
              :disabled="disabled"
              v-if="col.valueType === 'date'"
              @change="(date, dateString) => handleDateChange(date, dateString, record.key, col.dataIndex)"
            />
            <a-input
              style="text-align: center"
              :disabled="!record.editable"
              v-else
              :value="text"
              :addon-after="col.valueType === 'percent' ? '%' : ''"
              :maxLength="col.maxLength"
              @change="(e) => handleChange(e.target.value, record.key, col.dataIndex)"
              @keypress="isNumber($event)"
            />
          </a-form-item>
        </div>
      </template>
      <template slot="index" slot-scope="text, record, index">
        {{ index + 1 }}
      </template>
      <template slot="action" slot-scope="text, record">
        <a-space style="margin-top: -10px; vertical-align: top; text-align: right">
          <span v-if="record.editable">
            <a @click="() => save(record.key)">{{ $t('table.dialog.save') }}</a>
          </span>
          <span v-else>
            <a @click="() => edit(record.key)">{{ $t('table.dialog.edit') }}</a>
          </span>
          <span v-if="record.editable">
            <a @click="() => cancel(record.key)">{{ $t('table.dialog.cancel') }}</a>
          </span>
          <span v-else>
            <a @click="remove(record.key)">{{ $t('table.dialog.remove') }}</a>
          </span>
        </a-space>
      </template>
    </a-table>

    <a-button style="width: 100%; margin-top: 8px; margin-bottom: 8px" @click="handleAdd()"
      >+ {{ $t('table.dialog.add-row') }}</a-button
    >
    <span v-if="emptyRecord" class="error">{{ $t('table.dialog.column-validate-msg') }}</span>
    <slot :isEditing="isEditing" :result="ds"></slot>
  </div>
</template>

<script>
const newData = {
  key: 0,
  editable: true
}
export default {
  name: 'EditableTable',
  props: {
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    editableColumns: {
      type: Array,
      default() {
        return []
      }
    },
    dataSource: {
      type: Array,
      default() {
        return null
      }
    },
    editable: {
      type: Boolean,
      defualt: true
    }
  },

  data() {
    return {
      formLayout: 'horizontal',
      // mock data
      ds: [],
      count: 0,
      cacheData: [],
      emptyRecord: false
    }
  },
  computed: {
    isEditing() {
      let editing = false
      this.ds.forEach((el) => {
        if (el.editable === true) editing = true
      })
      return editing
    }
  },
  created() {
    this.ds = this.dataSource
    this.$watch('dataSource', () => {
      this.cacheData = this.ds.map((item) => ({ ...item }))
      this.editableColumns.forEach((el) => {
        newData[el] = ''
      })
      this.ds = this.dataSource.map((el, i) => ({ ...el, key: i }))
      this.count = this.ds.length
    })
    if (this.ds.length === 0) {
      this.handleAdd()
    }
    this.count = this.ds.length
  },
  methods: {
    isNumber: function (event) {
      if (!/\d/.test(event.key) && event.key !== '.') return event.preventDefault()
    },
    validateMinMax(col, record) {
      let minMaxValid = true

      if (col.smallerThan) {
        if (parseFloat(record[col.smallerThan]) < parseFloat(record[col.dataIndex])) {
          minMaxValid = false
        }
      }

      return minMaxValid
    },
    validateTable() {
      this.emptyRecord = false
      if (this.ds) {
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
    },
    edit(key) {
      const newData = [...this.ds]
      const target = newData.find((item) => key === item.key)

      if (target) {
        target.editable = true
        this.ds = newData
      }
    },
    async save(key) {
      const newData = [...this.ds]
      const target = newData.find((item) => parseInt(key) === parseInt(item.key))

      const valid = this.editableColumns.every((elj) => this.validateMinMax(elj, target))
      if (target && valid) {
        delete target.editable
        this.ds = newData
        this.cacheData = JSON.parse(JSON.stringify(newData))
        this.validateTable()
      }
    },
    handleChange(value, key, column) {
      // const newData = [...this.ds]
      // const target = newData.find((item) => key === item.key)
      // const reg = /^\d+(\.\d{1,2})?$/

      // if ((target && reg.test(value)) || value === '') {
      //   target[column] = value
      //   this.ds = newData
      // }

      const newData = [...this.ds]
      const target = newData.find((item) => key === item.key)

      target[column] = value
      this.ds = newData
    },
    cancel(key) {
      const newData = [...this.ds]
      const target = newData.find((item) => parseInt(key) === parseInt(item.key))

      if (target) {
        Object.assign(
          target,
          this.cacheData.find((item) => parseInt(key) === parseInt(item.key))
        )
        delete target.editable
        this.ds = newData
      }
    },
    handleAdd() {
      this.ds = [...this.ds, { ...newData, key: this.count }]
      this.count = this.ds.length
    },
    remove(key) {
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
      this.validateTable()
    }
  }
}
</script>

<style>
.editable-table .ant-table-thead > tr > th .ant-table-header-column {
  text-align: center;
  display: unset !important;
}
.editable-table .ant-table-row td:nth-child(4) .ant-form-item {
  margin-top: 2px;
}
.editable-table .ant-form-item-control {
  line-height: normal;
}
.error {
  color: red;
}
</style>
