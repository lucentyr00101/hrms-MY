<template>
  <div>
    <a-modal
      centered
      :width="800"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      :visible="addBankModal"
      :destroyOnClose="true"
      :title="action2 === 'edit' ? $t('table.dialog.edit-banks') : $t('table.dialog.add-banks')"
      :confirm-loading="loading"
      @cancel="closeModal"
    >
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" class="custom-ant-form-item">
        <a-form-item :label="`${$t('table.column.banks')}: `">
          <a-input
            :maxLength="25"
            v-decorator="[
              'bankName',
              {
                rules: [{ required: true, message: $t('error.banks.required') }],
                initialValue: action2 === 'edit' ? currentRow.bankName : ''
              }
            ]"
          >
          </a-input>
        </a-form-item>
        <a-form-item :label="`${$t('table.column.descriptions')}: `">
          <a-input
            type="textarea"
            mode="tags"
            style="width: 100%"
            :maxLength="100"
            v-decorator="['descriptions', { initialValue: action2 === 'edit' ? currentRow.descriptions : '' }]"
          >
          </a-input>
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 1, offset: 18 }">
          <a-button class="confirm-btn" type="primary" @click="showConfirm()">{{
            $t('table.dialog.confirm')
          }}</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { i18nRender } from '@/locales'
import { mapGetters } from 'vuex'
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'Bank',
  props: {
    currentRow: {
      type: Object,
      default: () => null
    },
    action: {
      type: String,
      default: () => null
    }
  },
  data() {
    return {
      loading: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'addBank' })
    }
  },
  computed: {
    ...mapGetters('modal', ['addBankModal']),
    action2: {
      get() {
        return this.action
      },
      set() {
        // just to prevent error
      }
    }
  },
  methods: {
    closeModal() {
      this.$store.commit('modal/TOGGLE_ADD_BANK_MODAL')
      this.form.resetFields()
    },
    async showConfirm() {
      try {
        await this.form.validateFields()
        this.$confirm({
          centered: true,
          title: i18nRender('save.confirm'),
          okText: i18nRender('table.dialog.yes'),
          cancelText: i18nRender('table.dialog.no'),
          onOk: () => this.handleSubmit(),
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />
        })
      } catch (e) {}
    },
    async handleSubmit() {
      try {
        this.loading = true
        const isAdd = this.action === 'add'
        const data = {
          bankName: this.form.getFieldValue('bankName'),
          descriptions: this.form.getFieldValue('descriptions'),
          status: 'Enable',
          ...(isAdd ? {} : { id: this.currentRow.id })
        }
        try {
          isAdd
            ? await this.$store.dispatch('api/setup/company/banks/addBank', data)
            : await this.$store.dispatch('api/setup/company/banks/updateBank', data)
          this.$notification.open({
            message: isAdd ? i18nRender('notification.banks.added') : i18nRender('notification.banks.updated'),
            icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
          })
          this.closeModal()
          this.$emit('refreshTable')
        } catch (e) {
          this.$message.error(e.response.data.message)
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    }
  }
}
</script>

<style>
.custom-ant-form-item .ant-col-12 {
  width: 53%;
}
</style>
