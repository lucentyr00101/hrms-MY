<template>
  <div>
    <a-modal
      :title="editAction ? $t('table.dialog.edit-leave-settings') : $t('table.dialog.add-leave-settings')"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      v-model="leaveSettingModal"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      @cancel="closeModal()"
    >
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
        <a-form-item> <a-input v-decorator="['id']" hidden /></a-form-item>
        <a-form-item :label="`${$t('table.column.from-service-year')}: `">
          <a-input
            :maxLength="5"
            v-decorator="[
              'fromServiceYear',
              {
                rules: [
                  {
                    required: true,
                    message: $tc('isRequired', $t('table.column.from-service-year'))
                  },
                  { max: 5, message: $t('error.max-5-numerical-characters') }
                ]
              }
            ]"
            placeholder="example"
          >
          </a-input
        ></a-form-item>
        <a-form-item :label="`${$t('table.column.to-service-year')}: `">
          <a-input
            :maxLength="5"
            v-decorator="[
              'toServiceYear',
              {
                rules: [
                  { required: true, message: $tc('isRequired', $t('table.column.to-service-year')) },
                  { max: 5, message: $t('error.max-5-numerical-characters') }
                ]
              }
            ]"
            placeholder="example"
          >
          </a-input
        ></a-form-item>
        <a-form-item :label="`${$t('table.column.entitled-days')}: `">
          <a-input
            :maxLength="5"
            v-decorator="[
              'entitledDays',
              { rules: [{ required: true, message: $tc('isRequired', $t('table.column.entitled-days')) }] }
            ]"
            placeholder="example"
          >
          </a-input
        ></a-form-item>

        <a-form-item :wrapperCol="{ span: 1, offset: 18 }">
          <a-space style="margin-left: auto">
            <a-button type="primary" @click="handleSubmit">{{ $t('table.dialog.confirm') }}</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { i18nRender } from '@/locales'

import InfoCircle from '@/assets/info-circle.svg'

import pick from 'lodash.pick'

export default {
  name: 'LeaveSettingModal',
  props: {
    mdl: { type: Object, default: null }
  },
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      model: this.mdl
    }
  },
  computed: {
    leaveSettingModal: {
      get() {
        return this.$store.state.modal.leaveSettingModal
      },
      set() {
        // just to prevent error log when @cancel
      }
    },
    editAction() {
      return this.model && this.model.id
    }
  },
  watch: {
    mdl(val) {
      this.$nextTick(() => {
        const data = pick(val, ['id', 'fromServiceYear', 'toServiceYear', 'entitledDays'])
        Object.keys(data).map((key) => {
          data[key] = data[key]?.toString() || null
        })
        this.model = val
        this.form.setFieldsValue({ ...data })
      })
    }
  },
  methods: {
    yearValidator(_, value, callback) {
      if (!value) {
        return callback()
      }
      const valid = /^[0-9]{0,3}(\.[0-9]{0,2})?$/.test(value)
      if (valid) {
        return callback()
      }

      return callback(i18nRender('error.years.validation'))
    },
    closeModal() {
      this.$store.commit('modal/TOGGLE_LEAVE_SETTING_MODAL')
      this.model = null

      this.form.resetFields()
    },
    handleSubmit() {
      this.form.validateFields((err, values) => !err && this.showInfo(values))
    },

    showInfo(values) {
      const _this = this

      this.$confirm({
        title: i18nRender('table.dialog.confirm-msg'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        async onOk() {
          try {
            const data = { ...values }

            if (_this.editAction) {
              await _this.$store.dispatch('api/setup/company/leaveSetting/update', { ..._this.mdl, ...data })
              _this.$notification.success({
                message: i18nRender('table.dialog.leave-setting-updated')
              })
            } else {
              await _this.$store.dispatch('api/setup/company/leaveSetting/add', { ..._this.mdl, ...data })
              _this.$notification.success({
                message: i18nRender('table.dialog.leave-setting-added')
              })
            }

            _this.closeModal()
            _this.$emit('refreshTable')
          } catch (e) {
            _this.$message.error(e.response.data.message)
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
