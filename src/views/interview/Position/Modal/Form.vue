<template>
  <a-form :form="form" :label-col="{ span: 7 }" :wrapper-col="{ span: 15 }" @submit="handleSubmit">
    <a-form-item :label="`${$t('table.column.position')}: `">
      <a-input
        v-decorator="[
          'position',
          {
            rules: [
              { required: true, message: $t('error.position.required') }
            ]
          }
        ]"
        :maxLength="25"
        placeholder="example"
        :disabled="modal?.action === 'view'"
      />
    </a-form-item>

    <a-form-item :label="`${$t('table.column.department')}: `">
      <a-tree-select
        v-decorator="[
          'department',
          {
            rules: [
              { required: true, message: $t('error.department.required') }
            ]
          }
        ]"
        :tree-data="mainParent.departmentList"
        tree-default-expand-all
        placeholder="Select"
        :disabled="modal?.action === 'view'"
      />
    </a-form-item>

    <a-form-item :label="`${$t('table.column.remarks')}: `" :style="{ margin: 0 }">
      <a-input
        v-decorator="[
          'remarks'
        ]"
        type="textarea"
        :maxLength="100"
        style="width: 100%"
        placeholder="Autoheight based on content lines="
        :disabled="modal?.action === 'view'"
      />
    </a-form-item>
    <p :style="{ margin: '0 55px 24px 0', textAlign: 'right' }">{{ form.getFieldValue('remarks')?.length || 0 }} / 100</p>

    <div :style="{ display: 'flex', justifyContent: 'flex-end', margin: '20px 50px 0' }">
      <!-- <a-button :style="{ marginRight: '20px' }" @click="closeModal">{{ $t('table.dialog.cancel') }}</a-button> -->
      <a-button v-if="modal?.action === 'view'" class="confirm-btn" type="primary" @click="mainParent?.modalHandler({ ...modal, action: 'update' })">{{ $t('table.dialog.edit') }}</a-button>
      <a-button v-else-if="/add|update/ig.test(modal?.action)" class="confirm-btn" type="primary" @click="handleSubmit">{{ $t('table.dialog.confirm') }}</a-button>
    </div>
  </a-form>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'InterviewPositionForm',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      fileList: [],
      fields: ['position', 'department', 'remarks']
    }
  },
  computed: {
    mainParent() { return this.getParent('InterviewPosition') }
  },
  watch: {
    modal: {
      deep: true,
      handler(to) {
        if (to.show) {
          this.initiate()
        } else {
          this.closeModal()
        }
      }
    }
  },
  methods: {
    initiate() {
      this.mainParent.getDepartmentList()
      this.applyFormData()
    },
    applyFormData() {
      if (/view|update/ig.test(this?.modal?.action) && this?.modal?.data) {
        const { position, department, remarks } = this?.modal?.data || {}
        this.form.setFieldsValue({ position, department, remarks })
      }
    },
    closeModal() {
      this.$store.commit('modal/TOGGLE_ALLOWANCE_MODAL')
      this.form.resetFields()
      this.fileList = []
    },
    handleSubmit(result) {
      this.form.validateFields((err, values) => !err && this.showInfo(result))
    },
    showNotification() {
      this.$notification.open({
        message: (this.modal.action === 'update') ? this.$t('notification.interview-position.updated') : this.$t('notification.interview-position.added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo() {
      this.$confirm({
        title: this.$t('save.confirm'),
        okText: 'Yes',
        cancelText: 'No',
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          const data = {
            ...((this.modal.action === 'update') ? { id: this.modal.data.id } : {}),
            position: this.form.getFieldValue('position'),
            department: this.form.getFieldValue('department'),
            remarks: this.form.getFieldValue('remarks') || ''
          }
          // console.log(data)
          try {
            await this.$store.dispatch(`api/interview/position/${this.modal.action}`, data)
            this.showNotification()
            this.closeModal()
            this.mainParent.refreshTable()
          } catch (error) {
            this.$message.error(error.response.data.message)
          }
        },
        onCancel: () => {
          // console.log('Cancel')
        }
      })
    }
  },
  created () {
    this.fields.forEach(v => this.form.getFieldDecorator(v))
    this.initiate()
  }
}
</script>

<style>
.checkboxForm .ant-form-item-control{
  width: 150px;
}

.ant-upload-list-item-name {
  width: 90%;
}
</style>
