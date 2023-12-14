<template>
  <div>
    <a-table :columns="columns" :data-source="ds" :pagination="false" class="editable-table">
      <span v-for="(c, i) in columns" :key="i" :slot="c.dataIndex"><span v-html="c.customTitle"></span></span>
      <template v-for="col in editableColumns" :slot="col.dataIndex" slot-scope="text, record">
        <div :key="col.dataIndex">
          <a-form-item
            class="custom-form"
            :wrapper-col="{ span: 24 }"
            :validate-status="!checkRequired(col, record) ? 'error' : ''"
            :help="!checkRequired(col, record) ? $tc('isRequired', col.title) : ''"
          >
            <a-input
              :disabled="disabled"
              v-if="col.valueType === 'text'"
              :value="text"
              :max-length="col.maxLength"
              @change="(e) => handleChange(e.target.value, record.key, col.dataIndex)"
            />
            <a-checkbox
              :disabled="disabled"
              v-else-if="col.valueType === 'checkbox'"
              :checked="text"
              @change="(e) => handleChange(e.target.checked, record.key, col.dataIndex)"
            />
            <a-select
              :disabled="disabled"
              v-else-if="col.valueType === 'select'"
              :value="text"
              @change="(e) => handleChange(e, record.key, col.dataIndex)"
              :options="col.valueEnums"
            />
          </a-form-item>
        </div>
      </template>
      <template slot="index" slot-scope="text, record, index">
        {{ index + 1 }}
      </template>
      <template slot="action" slot-scope="text, record">
        <a-space>
          <span>
            <a :disabled="disabled" @click="() => remove(record.key)">{{ $t('table.dialog.delete') }}</a>
          </span>
        </a-space>
      </template>
    </a-table>

    <a-button style="width: 100%; margin-top: 8px; margin-bottom: 8px" @click="handleAdd()"
      >+ {{ $t('table.dialog.add-row') }}</a-button
    >
    <span v-if="emptyRecord" class="error">{{ $t('table.dialog.column-validate-msg') }}</span>
    <slot :result="ds"></slot>
  </div>
</template>

<script>
const newData = {
  key: 0
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
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      formLayout: 'horizontal',
      // mock data
      ds: [],
      count: 0,
      cacheData: [],
      emptyRecord: false,
      valid: true,
      trigger: false
    }
  },
  computed: {},
  created() {
    this.ds = this.dataSource
    this.editableColumns.forEach((el) => {
      newData[el.dataIndex] = el.defaultValue !== undefined ? el.defaultValue : ''
    })
    this.$watch('dataSource', () => {
      this.cacheData = this.ds.map((item) => ({ ...item }))
      this.ds = this.dataSource.map((el, i) => ({ key: i, ...el }))
      this.count = this.ds.length
      if (this.ds.length === 0) {
        this.handleAdd()
      }
    })
    if (this.ds.length === 0) {
      this.handleAdd()
    }

    this.count = this.ds.length
  },
  destroyed() {
    console.log('destroy')
  },
  methods: {
    isNumber: function (event) {
      if (!/\d/.test(event.key) && event.key !== '.') return event.preventDefault()
    },

    checkRequired(col, record) {
      let valid = true
      this.valid = true
      if (col.required && this.trigger) {
        if (!record[col.dataIndex]) {
          valid = false
          this.valid = false
        }
      }

      return valid
    },
    validateTable() {
      this.trigger = true
      let valid = true
      if (this.ds.length === 0) {
        return true
      } else {
        this.ds.every((el) => {
          this.editableColumns.every((elj) => {
            valid = this.checkRequired(elj, el)
            return valid
          })
          return valid
        })
      }
      if (valid) {
        this.trigger = false
      }
      return valid
    },
    resetFields() {
      this.trigger = false
      this.ds = []
    },

    handleChange(value, key, column) {
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
    }
  }
}
</script>

<style>
.custom-form.ant-form-item {
  margin-bottom: 0;
}
.error {
  color: red;
}
</style>
