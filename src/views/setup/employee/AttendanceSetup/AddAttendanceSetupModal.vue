<template>
  <div>
    <a-modal
      :title="$t('table.dialog.add-attendance-type')"
      :width="800"
      v-model="addAttendanceSetupModal"
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

export default {
  name: 'AddAttendanceSetupModal',
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
    async addAttendanceSetupModal(visible) {
      if (visible) {
        await this.fetchDropdowns()
      }
    }
  },
  computed: {
    max99Reg() {
      return max99Reg
    },
    addAttendanceSetupModal: {
      get() {
        return this.$store.state.modal.addAttendanceSetupModal
      },
      set() {
        // just to prevent error log when @cancel
      }
    }
  },
  methods: {
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
      this.$store.commit('modal/TOGGLE_ADD_ATTENDANCE_SETUP_MODAL')
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
        message: i18nRender('table.dialog.attendance-type-added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo(form) {
      this.$confirm({
        title: i18nRender('table.dialog.confirm-msg'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          this.saving = true
          try {
            const payload = {
              ...form,
              isPublish: form.isPublish?.[0] || 'No'
            }
            await this.$store.dispatch('api/setup/employee/attendanceSetup/addAttendance', payload)
            this.showNotification()
            this.closeModal()
            this.$emit('refreshTable')
          } catch (e) {
            console.log(e)
            this.$message.error(e?.response?.data?.message || 'Something went wrong')
          }
          this.saving = false
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
