<template>
  <div>
    <div class="header">{{ $t('table.dialog.payment-method') }}</div>
    <a-row style="padding-left: 50px; padding-right: 50px; margin-bottom: 20px">
      <a-table :columns="columns" row-key="id" :data-source="ds" :pagination="false">
        <template v-for="col in editableColumns" :slot="col.dataIndex" slot-scope="text, record">
          <div :key="col.dataIndex">
            <a-select
              :value="text"
              :options="companyBankDropdown"
              :disabled="editable"
              v-if="col.valueType === 'select'"
              @change="(value) => handleSelectChange(value, record.id, col.dataIndex)"
            />

            <a-input
              :value="text"
              v-else
              :disabled="editable"
              :maxLength="25"
              style="margin: -5px 0"
              @change="(e) => handleChange(e.target.value, record.id, col.dataIndex)"
            />
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
      <a-button v-if="!editable" style="width: 100%; margin-top: 8px; margin-bottom: 8px" @click="handleAdd()"
        >+ {{ $t('table.dialog.add-row') }}</a-button
      >
      <span class="error" v-if="emptyRecord">{{ $t('table.dialog.column-validate-msg') }}</span>
      <slot :result="ds"></slot>
    </a-row>
  </div>
</template>

<script>
import { employeeSetupMixin } from '@/store/app-mixin'

const newData = {
  id: 0,
  bank: '',
  accountNumber: ''
}

export default {
  name: 'PaymentEditableTable',
  mixins: [employeeSetupMixin],
  props: {
    form: { type: Object, default: null },
    value: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: { type: Boolean, default: false },
    editable: { type: Boolean, default: false }
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
  data() {
    return {
      // mock data
      ds: [],
      columns: [
        { title: '#', dataIndex: 'index', id: 'index', scopedSlots: { customRender: 'index' } },
        { title: 'Bank', dataIndex: 'bank', id: 'bank', scopedSlots: { customRender: 'bank' } },
        {
          title: 'Account Number',
          dataIndex: 'accountNumber',
          id: 'accountNumber',
          scopedSlots: { customRender: 'accountNumber' }
        },
        { title: 'Action', id: 'action', scopedSlots: { customRender: 'action' } }
      ],

      editableColumns: [
        { dataIndex: 'bank', valueType: 'select' },
        { dataIndex: 'accountNumber', valueType: 'text' }
      ],
      count: this.value.length,
      cacheData: [],
      saved: false,
      emptyRecord: false,
      companyBankDropdown: [],
      loadCompanyBankDropdown: async () => {
        const data = await this.$store.dispatch('api/dropdown/fetchCompanyBankDropdown')
        data.data.forEach((item) => {
          this.companyBankDropdown = [
            ...this.companyBankDropdown,
            {
              value: item.bankName,
              label: item.bankName
            }
          ]
        })
        return this.companyBankDropdown
      }
    }
  },
  created() {
    this.loadCompanyBankDropdown()
    this.$watch('value', () => {
      this.cacheData = this.ds.map((item) => ({ ...item }))
      // this.editableColumns.forEach((el) => {
      //     newData[el.dataIndex] = ''
      // })
      this.ds = this.value

      this.count = this.ds.length
    })
    this.handleAdd()
    // if (this.ds.length === 0) {
    //   this.ds.push(newData)
    // } else {
    //   this.ds.pop()
    //   console.log(this.ds)
    // }
    this.count = this.ds.length
  },
  methods: {
    handleSelectChange(value, id, col) {
      this.handleChange(value, id, col)
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
    paymentList() {
      return this.ds
    },
    handleChange(value, id, column) {
      console.log(id)
      const newData = [...this.ds]
      const target = newData.find((item) => id === item.id)

      target[column] = value
      this.ds = newData
    },
    cancel(id) {
      this.ds = JSON.parse(JSON.stringify(this.cacheData))
      this.ds[id].saved = true
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
      console.log(this.ds)
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
</style>
