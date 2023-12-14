<template>
  <div>
    <a-modal
      :title="editAction ? $t('table.dialog.view-addtl-remun') : $t('table.dialog.add-addtl-remun')"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      v-model="addtlRemunModal"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      @cancel="closeModal()"
    >
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
        <a-form-item> <a-input v-decorator="['id']" hidden /></a-form-item>
        <a-form-item :label="`${$t('table.dialog.addtl-remu-type')}: `">
          <a-input
            :disabled="disabled"
            :maxLength="25"
            v-decorator="[
              'payrollAdditionalRemunerationType',
              { rules: [{ required: true, message: $tc('isRequired', $t('table.dialog.addtl-remu-type')) }] }
            ]"
            placeholder="example"
          >
          </a-input
        ></a-form-item>
        <a-form-item :label="`${$t('table.column.descriptions')}: `">
          <a-textarea
            :disabled="disabled"
            :auto-size="{ minRows: 2, maxRows: 6 }"
            :maxLength="100"
            style="width: 100%"
            v-decorator="['descriptions']"
          />
        </a-form-item>
        <a-form-item>
          <a-checkbox-group v-decorator="['taxCheckboxStatus']" style="margin-left: 67%; width: 100%">
            <a-row>
              <a-col :span="8">
                <a-checkbox :disabled="disabled" value="epf"> {{ $t('table.column.epf') }} </a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox :disabled="disabled" value="socso"> {{ $t('table.column.eis') }} </a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox :disabled="disabled" value="eis"> {{ $t('table.column.socso') }} </a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox :disabled="disabled" value="tax"> {{ $t('table.column.tax') }} </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 1, offset: 18 }">
          <a-space style="margin-left: auto">
            <a-button type="primary" v-if="editAction && disabled" @click="disabled = false">{{
              $t('table.dialog.edit')
            }}</a-button>
            <a-button type="primary" v-if="!disabled" @click="handleSubmit">{{ $t('table.dialog.confirm') }}</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { i18nRender } from '@/locales'

import InfoCircle from '@/assets/info-circle.svg'
import { addAddtlRemun, updateAddtlRemun } from '@/api/setup/payroll/addtl-remun'
import { taxCheckboxList } from './index.vue'
import pick from 'lodash.pick'

export default {
  name: 'AddlRemunModal',
  props: {
    mdl: { type: Object, default: null }
  },
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      model: this.mdl,
      disabled: false
    }
  },
  computed: {
    addtlRemunModal: {
      get() {
        return this.$store.state.modal.addtlRemunModal
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
        const data = pick(val, ['id', 'payrollAdditionalRemunerationType', 'descriptions'])
        this.model = val
        this.disabled = true
        this.form.setFieldsValue({ ...data, taxCheckboxStatus: taxCheckboxList.filter((el) => val[el] === 'True') })
      })
    }
  },
  methods: {
    closeModal() {
      this.$store.commit('modal/TOGGLE_ADDTL_REMUN_MODAL')
      this.model = null
      this.disabled = false
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
            const taxResult = {}
            taxCheckboxList.forEach((el) => {
              taxResult[el] = values.taxCheckboxStatus && values.taxCheckboxStatus.includes(el) ? 'True' : 'False'
            })
            const data = { ...values, ...taxResult }

            if (_this.editAction) {
              await updateAddtlRemun({ ...data, status: _this.mdl.status })
              _this.$notification.success({
                message: i18nRender('table.dialog.addtl-remu-type-updated')
              })
            } else {
              await addAddtlRemun({ ...data, status: 'Enable' })
              _this.$notification.success({
                message: i18nRender('table.dialog.addtl-remu-type-added')
              })
            }

            _this.closeModal()
            _this.$emit('refreshTable')
          } catch (e) {
            console.log(e)
            _this.$message.error(e.response.data.message)
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
