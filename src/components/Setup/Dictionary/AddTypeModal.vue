<template>
  <a-modal
    centered
    :okText="$t('table.dialog.confirm')"
    :cancelText="$t('table.dialog.cancel')"
    :visible="addDictTypeModal"
    :destroyOnClose="true"
    :title="action2 === 'edit' ? $t('table.dialog.edit-type') : $t('table.dialog.add-type')"
    :confirm-loading="loading"
    @cancel="closeModal"
    @ok="showConfirm"
  >
    <a-form :form="form">
      <a-form-item :label="$t('table.column.type-name')">
        <a-input
          :maxLength="25"
          v-decorator="[
            'typeName',
            {
              rules: [
                { required: true, message: $t('error.type-name.required') }
              ],
              initialValue: action2 === 'edit' ? currentValue.typeName : ''
            }
          ]"
        />
      </a-form-item>
      <a-form-item :label="$t('table.column.code')">
        <a-input
          :maxLength="10"
          v-decorator="[
            'code',
            {
              rules: [
                { required: true, message: $t('error.code.required') },
                { validator: noWhitespaceAllowed, message: $t('error.code.no-space') }
              ],
              initialValue: action2 === 'edit' ? currentValue.code : ''
            }
          ]"
        />
      </a-form-item>
      <a-form-item :label="$t('table.column.sort')">
        <a-input
          @keypress="isNumber($event)"
          :maxLength="3"
          style="width: 100%;"
          v-decorator="[
            'sort',
            {
              rules: [
                { required: true, message: $t('error.sort.required') }
              ],
              initialValue: action2 === 'edit' ? currentValue.sort : ''
            }
          ]"
        />
      </a-form-item>
      <a-form-item :label="$t('table.column.remark')">
        <a-textarea
          :autoSize="{ minRows: 3, maxRows: 6 }"
          :maxLength="100"
          v-decorator="[
            'remark',
            { initialValue: action2 === 'edit' ? currentValue.remark : '' }
          ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { i18nRender } from '@/locales'
import { mapGetters } from 'vuex'
import { noWhitespaceAllowed } from '@/utils/validators'
import InfoCircle from '@/assets/info-circle.svg'

export default {
  props: {
    currentRow: {
      type: Object,
      default: () => null
    },
    action: {
      type: String,
      default: () => null
    },
    currentValue: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      loading: false,
      form: this.$form.createForm(this, { name: 'addDictType' })
    }
  },
  computed: {
    ...mapGetters('modal', ['addDictTypeModal']),
    action2: {
      get () {
          return this.action
      },
      set () {
          // just to prevent error
      }
    }
  },
  methods: {
    noWhitespaceAllowed,
    isNumber: function (event) {
      if (!/\d/.test(event.key)) return event.preventDefault()
    },
    closeModal () {
      this.$store.commit('modal/TOGGLE_DICT_ADD_TYPE_MODAL')
      this.$emit('closeModal')
    },
    async showConfirm () {
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
    async handleSubmit () {
      try {
        this.loading = true
        const data = {
          ...(this.action2 === 'edit' ? { id: this.currentValue?.id } : {}),
          typeName: this.form.getFieldValue('typeName'),
          code: this.form.getFieldValue('code'),
          sort: this.form.getFieldValue('sort'),
          status: this.action2 === 'edit' ? this.currentValue?.status : 'Enable',
          remark: this.form.getFieldValue('remark') || ''
        }
        try {
          await this.$store.dispatch(
            `api/setup/dictionary/${this.action2 === 'edit' ? 'editDictionary' : 'addDictionary'}`,
            data
          )
          this.$notification.open({
            message: i18nRender(this.action2 === 'edit' ? 'notification.dictionary-type.updated' : 'notification.dictionary-type.added'),
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
