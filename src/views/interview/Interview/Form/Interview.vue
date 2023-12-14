<template>
  <a-row id="candidate-interview" class="form" type="flex" :gutter="104">
    <a-col :span="12">
      <a-form-item :label="`${$t('table.column.interviewer')}:`">
        <a-input v-decorator="['interviewer']" :style="{ width: '100%' }" disabled />
      </a-form-item>
    </a-col>

    <a-col :span="12">
      <a-form-item :label="`${$t('table.column.interview-time')}:`">
        <a-input v-decorator="['interviewTime']" :style="{ width: '100%' }" disabled />
      </a-form-item>
    </a-col>

    <a-col :span="12">
      <a-form-item :label="`${$t('table.column.ranks')}:`">
        <a-input
          v-decorator="[
            'ranks',
            {
              rules: [
                { required: true, message: $t('error.ranks.required') },
                { pattern: /^([1-9]|10)$/, message: $t('error.number.validator') }
              ]
            }
          ]"
          type="number"
          min="1"
          max="10"
          step="1"
          placeholder="example"
          :style="{ width: '100%' }"
          :disabled="!/^add$|^update$/gi.test($route.query?.action)"
        />
        <p :style="{ marginBottom: '5px', textAlign: 'left', lineHeight: 'normal' }">
          {{ $t('interview-candidate.one-ten-only') }}
        </p>
      </a-form-item>
    </a-col>

    <a-col :span="24">
      <EmployeeEditableTable
        ref="editableTable"
        v-model="mainForm.interviewQuestionnaires"
        :columns="columns"
        :editableColumns="editableColumns"
        :delete-text="$t('table.dialog.remove')"
        :disabled="!/^add$|^update$/gi.test($route.query?.action)"
      />
    </a-col>
  </a-row>
</template>

<script>
import { i18nRender } from '@/locales'

import EmployeeEditableTable from '@/components/Table/EmployeeEditableTable'

export default {
  name: 'InterviewInterviewFormInterview',
  components: {
    EmployeeEditableTable
  },
  data() {
    return {}
  },
  computed: {
    mainParent() {
      return this.getParent('InterviewInterview')
    },
    mainForm() {
      return this.getParent('InterviewInterviewForm')
    },
    columns() {
      return [
        {
          title: i18nRender('table.column.question'),
          dataIndex: 'question',
          scopedSlots: { customRender: 'question' }
        },
        {
          title: i18nRender('table.column.comments'),
          dataIndex: 'comments',
          scopedSlots: { customRender: 'comments' }
        },
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
  methods: {}
}
</script>

<style>
#candidate-interview.form .ant-form-item-label {
  width: 110px;
}
</style>
