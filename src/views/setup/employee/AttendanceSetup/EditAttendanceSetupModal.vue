<template>
  <div>
    <a-modal
      :title="$t('table.dialog.edit-attendance-type')"
      :width="800"
      v-model="editAttendanceSetupModal"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      @cancel="closeModal()"
      destroyOnClose
    >
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
        <a-form-item :label="`${$t('table.column.attendance-type')}: `">
          <a-input
            :maxLength="25"
            v-decorator="[
              'attendanceType',
              {
                rules: [{ required: true, message: `${$t('table.column.attendance-type')} ${$t('error.is-required')}` }]
              }
            ]"
          >
          </a-input
        ></a-form-item>
        <a-form-item :label="`${$t('table.column.descriptions')}: `">
          <a-textarea
            :maxLength="100"
            v-decorator="[
              'description',
              { rules: [{ message: `${$t('table.column.description')} ${$t('error.is-required')}` }] }
            ]"
          >
          </a-textarea
        ></a-form-item>
        <a-form-item :label="`${$t('table.column.status-name')}: `">
          <a-input
            :maxLength="25"
            v-decorator="[
              'statusName',
              { rules: [{ required: true, message: `${$t('table.column.status-name')} ${$t('error.is-required')}` }] }
            ]"
          >
          </a-input>
        </a-form-item>
        <a-form-item :label="`${$t('table.column.colour')}: `">
          <a-spin :spinning="loading">
            <a-select
              v-decorator="[
                'color',
                { rules: [{ required: true, message: `${$t('table.column.colour')} ${$t('error.is-required')}` }] }
              ]"
            >
              <a-select-option v-for="(color, i) in colors" :value="color.colorType" :key="i">
                {{ color.colorType }}
              </a-select-option>
            </a-select>
          </a-spin>
        </a-form-item>
        <a-form-item :label="`${$t('table.column.sort')}: `">
          <a-input
            :maxLength="2"
            style="width: 100%"
            v-decorator="[
              'sort',
              {
                rules: [
                  { required: true, message: `${$t('table.column.sort')} ${$t('error.is-required')}` },
                  { pattern: max99Reg, message: $t('error.sort.invalid') }
                ]
              }
            ]"
          >
          </a-input>
        </a-form-item>
        <a-form-item :label="`${$t('table.dialog.publish-in-dashboard')}: `">
          <a-checkbox-group v-decorator="['isPublish']" style="width: 100%">
            <a-checkbox value="Yes">{{
              form.getFieldValue('isPublish')?.[0] === 'Yes' ? $t('table.dialog.yes') : $t('table.dialog.no')
            }}</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 1, offset: 18 }">
          <a-button :loading="saving" class="confirm-btn" type="primary" @click="handleSubmit()">{{
            $t('table.dialog.confirm')
          }}</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { i18nRender } from '@/locales'
import InfoCircle from '@/assets/info-circle.svg'
import { max99Reg } from '@/utils/validators'

const fields = ['attendanceType', 'description', 'statusName', 'color', 'sort', 'isPublish']
export default {
  name: 'EditAttendanceSetupModal',
  props: {
    model: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      saving: false,
      loading: false,
      colors: []
    }
  },
  watch: {
    async editAttendanceSetupModal(visible) {
      if (visible) {
        this.setInitialValues()
        await this.fetchDropdowns()
      }
    }
  },
  computed: {
    max99Reg() {
      return max99Reg
    },
    editAttendanceSetupModal: {
      get() {
        return this.$store.state.modal.editAttendanceSetupModal
      },
      set() {
        // just to prevent error log when @cancel
      }
    }
  },
  methods: {
    setInitialValues() {
      fields.forEach((v) => this.form.getFieldDecorator(v))
      const data = {
        ...this.model,
        isPublish: [this.model.isPublish]
      }
      this.form.setFieldsValue(data)
    },
    async fetchDropdowns() {
      this.loading = true
      try {
        const { data } = await this.$store.dispatch('api/setup/employee/attendanceSetup/fetchDropdowns')
        this.colors = [...data?.colorType] || []
      } catch (e) {
        console.log(e)
        this.$message.error(e?.response?.data?.message || 'Something went wrong')
      }
      this.loading = false
    },
    closeModal() {
      this.form.resetFields()
      this.$store.commit('modal/TOGGLE_EDIT_ATTENDANCE_SETUP_MODAL')
    },
    handleSubmit() {
      const _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          _this.showInfo(values)
        }
      })
    },
    showNotification() {
      this.$notification.open({
        message: i18nRender('table.dialog.attendance-type-updated'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo(form) {
      const _this = this
      this.$confirm({
        title: i18nRender('table.dialog.confirm-msg'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        async onOk() {
          _this.saving = true
          try {
            const payload = {
              ...form,
              id: _this.model.id,
              isPublish: form.isPublish?.[0] || 'No'
            }
            await _this.$store.dispatch('api/setup/employee/attendanceSetup/updateAttendance', payload)
            _this.showNotification()
            _this.closeModal()
            _this.$emit('refreshTable')
          } catch (e) {
            console.log(e)
            _this.$message.error(e?.response?.data?.message || 'Something went wrong')
          }
          _this.saving = false
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
