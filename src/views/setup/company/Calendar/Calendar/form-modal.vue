<template>
  <div>
    <a-modal
      :title="modalTitle"
      v-model="modal.show"
      :width="1200"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      :maskClosable="false"
      @cancel="closeModal()"
    >
      <a-form :form="form" layout="inline">
        <div style="display: flex; flex-wrap: wrap">
          <a-form-item
            :label="`${$t('table.column.calendar-name')}: `"
            style="flex-basis: 48%"
            :labelCol="{ lg: 8, md: 8, sm: 10 }"
            :wrapperCol="{ lg: 16, md: 13, sm: 24 }"
          >
            <a-input
              :maxLength="25"
              v-decorator="[
                'calendarName',
                { rules: [{ required: true, message: $t('error.calendar-name.required') }] }
              ]"
            />
          </a-form-item>
          <a-form-item
            :label="`${$t('table.column.descriptions')}: `"
            style="flex-basis: 48%"
            :labelCol="{ lg: 8, md: 8, sm: 8 }"
            :wrapperCol="{ lg: 16, md: 13, sm: 24 }"
          >
            <a-textarea
              :maxLength="100"
              :auto-size="{ minRows: 3, maxRows: 5 }"
              :span="24"
              v-decorator="['descriptions']"
            />
          </a-form-item>
        </div>
        <a-form-item style="display: block; padding-top: 20px" :wrapperCol="{ span: 24 }">
          <a-table
            :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
            rowKey="id"
            ref="table"
            size="default"
            :dataSource="dataSource"
            :columns="columns"
            :pagination="false"
            :scroll="{ y: 500 }"
            :loading="loading"
          >
            <span key="action" slot="action">
              <a id="edit" @click="() => {}">{{ $t('table.dialog.edit-date') }}</a>
            </span>
          </a-table>
          <div class="has-error" v-if="showCheckError">
            <span class="ant-form-explain">{{ $t('error.holiday.at-least-one') }}</span>
          </div>
        </a-form-item>
        <div style="display: flex; align-items: center; justify-content: right; padding-top: 10px">
          <a-form-item>
            <a-button
              v-if="modal?.action === 'view'"
              class="confirm-btn"
              type="primary"
              @click="mainParent?.modalHandler({ ...modal, action: 'edit' })"
              >{{ $t('table.dialog.edit') }}</a-button
            >
            <a-button
              v-else-if="/add|edit/gi.test(modal?.action)"
              class="confirm-btn"
              type="primary"
              @click="handleSubmit()"
              >{{ $t('table.dialog.confirm') }}</a-button
            >
          </a-form-item>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { i18nRender } from '@/locales'
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'AddCalendarModal',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      selectedRowKeys: [],
      showCheckError: false,
      dataSource: [],
      loading: false,
      fields: ['calendarName', 'descriptions']
    }
  },
  watch: {
    async modal(params) {
      if (params.show) {
        this.loading = true
        const data = await this.$store.dispatch('api/setup/company/calendarMasterList/fetchActiveList')
        this.dataSource = data.data
        this.loading = false
      }
      if (params.show && params.action !== 'add' && params?.data) {
        this.fields.forEach((v) => this.form.getFieldDecorator(v))
        const { calendarName, descriptions, holidays } = params.data
        this.selectedRowKeys = holidays.map((data) => {
          return data.id
        })
        this.form.setFieldsValue({
          calendarName,
          descriptions
        })
      }
    }
  },
  computed: {
    mainParent() {
      return this.getParent('SetupCompanyCalendar')
    },
    modalTitle() {
      return this.$t('table.dialog.calendar')
    },
    columns() {
      return [
        {
          title: i18nRender('table.column.holiday'),
          dataIndex: 'holiday',
          key: 'holiday'
        },
        {
          title: i18nRender('table.column.date'),
          dataIndex: 'date',
          key: 'date',
          customRender: (e, record, index) => {
            const { start_date: startDate, end_date: endDate } = record
            return `${this.formatDate(startDate, 'YYYY-MM-DD')} - ${this.formatDate(endDate, 'YYYY-MM-DD')}`
          }
        },
        {
          title: i18nRender('table.column.descriptions'),
          dataIndex: 'descriptions',
          key: 'descriptions',
          ellipsis: true
        },
        {
          title: i18nRender('table.column.title'),
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    closeModal() {
      this.form.resetFields()
      this.selectedRowKeys = []
      this.dataSource = []
    },
    validateSelectedRows() {
      if (this.selectedRowKeys.length === 0) {
        this.showCheckError = true
        return false
      }
      this.showCheckError = false
      return true
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) this.form.validateFields((err, values) => !err && this.validateSelectedRows() && this.showInfo())
      })
    },
    showNotification() {
      this.$notification.open({
        message:
          this.modal.action === 'edit'
            ? this.$t('notification.calendar.updated')
            : this.$t('notification.calendar.added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo() {
      this.$confirm({
        title: i18nRender('table.dialog.confirm-msg'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          const data = {
            ...(this.modal.action === 'edit' ? { id: this.modal.data.id } : {}),
            calendarName: this.form.getFieldValue('calendarName'),
            descriptions: this.form.getFieldValue('descriptions'),
            grantedHolidays: [...this.selectedRowKeys]
          }
          try {
            await this.$store.dispatch(
              `api/setup/company/calendar/${this.modal.action === 'edit' ? 'update' : 'add'}`,
              data
            )

            this.showNotification()
            this.closeModal()
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
          this.$emit('refreshTable')
        }
      })
    }
  }
}
</script>
