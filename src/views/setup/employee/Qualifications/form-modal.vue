<template>
  <div>
    <a-modal
      :title="modalTitle"
      :width="800"
      v-model="modal.show"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      @cancel="closeModal()"
    >
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
        <a-form-item :label="`${$t('table.column.qualifications')}: `">
          <a-input
            :maxLength="25"
            v-decorator="[
              'qualifications',
              { rules: [{ required: true, message: $t('error.qualifications.required') }] }
            ]"
          >
          </a-input
        ></a-form-item>
        <a-form-item :label="`${$t('table.column.descriptions')}: `">
          <a-input :maxLength="100" type="textarea" mode="tags" style="width: 100%" v-decorator="['descriptions']">
          </a-input
        ></a-form-item>
        <div :style="{ display: 'flex', justifyContent: 'flex-end', margin: '20px 25px 0' }">
          <a-button
            v-if="modal?.action === 'view'"
            class="confirm-btn"
            type="primary"
            @click="mainParent?.modalHandler({ ...modal, action: 'update' })"
            >{{ $t('table.dialog.edit') }}</a-button
          >
          <a-button
            v-else-if="/add|edit/gi.test(modal?.action)"
            class="confirm-btn"
            type="primary"
            @click="handleSubmit"
            >{{ $t('table.dialog.confirm') }}</a-button
          >
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { i18nRender } from '@/locales'

export default {
  name: 'AddEmployeeQualificationModal',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      fields: ['qualifications', 'descriptions']
    }
  },
  computed: {
    mainParent() {
      return this.getParent('SetupEmployeeQualifications')
    },
    modalTitle() {
      return this.modal?.action === 'edit'
        ? this.$t('table.dialog.edit-qualifications')
        : this.$t('table.dialog.add-qualifications')
    }
  },
  watch: {
    modal(to) {
      if (to.show) {
        if (/view|edit/gi.test(to.action) && to?.data) {
          this.fields.forEach((v) => this.form.getFieldDecorator(v))
          const { qualifications, descriptions } = to.data
          this.form.setFieldsValue({ qualifications, descriptions })
        }
      }
    }
  },
  methods: {
    closeModal() {
      this.form.resetFields()
    },
    handleSubmit() {
      this.form.validateFields((err, values) => !err && this.showInfo())
    },
    showNotification() {
      this.$notification.open({
        message:
          this.modal.action === 'edit'
            ? this.$t('notification.qualification.updated')
            : this.$t('notification.qualification.added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo() {
      this.$confirm({
        title: () => (
          <div class="confirm-modal-title">
            <div>
              <img src="/icons/info-dialog.svg" style="margin-right: 10px" />
              <span>{i18nRender('save.confirm')}</span>
            </div>
          </div>
        ),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: 'none',
        onOk: async () => {
          const data = {
            ...(this.modal.action === 'edit' ? { id: this.modal.data.id } : {}),
            qualifications: this.form.getFieldValue('qualifications'),
            descriptions: this.form.getFieldValue('descriptions') || ''
          }
          try {
            await this.$store.dispatch(
              `api/setup/employee/qualifications/${this.modal.action === 'edit' ? 'update' : 'add'}`,
              data
            )
            this.showNotification()
            this.closeModal()
            this.$emit('refreshTable')
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
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
