<template>
  <a-row id="candidate-screening" class="form" type="flex" :gutter="104">
    <a-col :span="12">
        <a-form-item :label="`${$t('table.column.screening-date')}:`">
          <a-date-picker
            v-decorator="[
              'screeningDate'
            ]"
            format="YYYY-MM-DD HH:mm"
            :show-time="{ defaultValue: mainForm.moment().second(0), format: 'HH:mm' }"
            placeholder="Select date & time"
            :style="{ width: '100%' }"
            :disabled-date="mainForm.disabledPassDate"
            :disabled-time="mainForm.disabledPassTime"
            :disabled="(!/^add$|^update$/ig.test($route.query?.action))"
          />
        </a-form-item>
    </a-col>

    <a-col :span="12">
      <a-form-item :label="`${$t('table.column.hr')}:`">
        <a-select
          v-decorator="[
            'employeeHrId'
          ]"
          :options="mainParent.employeeHRList"
          show-search
          placeholder="Select"
          :style="{ width: '100%' }"
          :disabled="(!/^add$|^update$/ig.test($route.query?.action))"
        />
      </a-form-item>
    </a-col>

    <a-col :span="24">
      <EmployeeEditableTable
        ref="editableTable"
        v-model="mainForm.screeningQuestionnaires"
        :columns="columns"
        :editableColumns="editableColumns"
        :delete-text="$t('table.dialog.remove')"
        :disabled="(!/^add$|^update$/ig.test($route.query?.action))"
      />
    </a-col>
  </a-row>
</template>

<script>
import { i18nRender } from '@/locales'

import EmployeeEditableTable from '@/components/Table/EmployeeEditableTable'

export default {
  name: 'InterviewInterviewFormScreening',
  components: {
    EmployeeEditableTable
  },
  data () {
    return {}
  },
  computed: {
    mainParent() { return this.getParent('InterviewInterview') },
    mainForm() { return this.getParent('InterviewInterviewForm') },
    columns() {
      return [
        { title: i18nRender('table.column.question'), dataIndex: 'question', scopedSlots: { customRender: 'question' } },
        { title: i18nRender('table.column.comments'), dataIndex: 'comments', scopedSlots: { customRender: 'comments' } },
        { title: i18nRender('table.column.action'), dataIndex: 'action', scopedSlots: { customRender: 'action' } }
      ]
    },
    editableColumns() {
      return [
        { dataIndex: 'question', valueType: 'text', maxLength: 100 },
        { dataIndex: 'comments', valueType: 'text', maxLength: 100 }
      ]
    }
  },
  methods: {},
  created() {}
}
</script>

<style>
  #candidate-screening.form .ant-form-item-label {
    width: 120px;
  }
</style>
