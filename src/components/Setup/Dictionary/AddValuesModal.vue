<template>
  <a-modal
    centered
    :okText="$t('table.dialog.confirm')"
    :cancelText="$t('table.dialog.cancel')"
    :visible="addDictValuesModal"
    :destroyOnClose="true"
    :title="action2 === 'edit' ? $t('table.dialog.edit-value') : $t('table.dialog.add-value')"
    :confirm-loading="loading"
    @cancel="closeModal"
    @ok="showConfirm"
  >
    <a-form :form="form">
      <a-form-item :label="$t('table.column.value')">
        <a-input
          :maxLength="25"
          v-decorator="[
            'value',
            {
              rules: [
                { required: true, message: $t('error.value.required') }
              ],
              initialValue: action2 === 'edit' ? currentValue.value : ''
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
    currentRow2: {
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
    ...mapGetters('modal', ['addDictValuesModal']),
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
      this.$store.commit('modal/TOGGLE_ADD_DICT_VALUES_MODAL')
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
        if (this.action === 'add') {
          const data = {
            dictionaryTypeId: this.currentRow2.id,
            value: this.form.getFieldValue('value'),
            code: this.form.getFieldValue('code'),
            sort: this.form.getFieldValue('sort'),
            status: 'Enable',
            remark: this.form.getFieldValue('remark')
          }
          try {
            await this.$store.dispatch('api/setup/dictionary/addValues', data)
              this.$notification.open({
              message: i18nRender('notification.dictionary.value.added'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
            this.closeModal()
            this.$emit('refreshTable')
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
        } else {
          const data = {
            dictionaryTypeId: this.currentRow2.id,
            id: this.currentValue.id,
            value: this.form.getFieldValue('value'),
            code: this.form.getFieldValue('code'),
            sort: this.form.getFieldValue('sort'),
            status: this.currentValue.status,
            remark: this.form.getFieldValue('remark')
          }
          try {
            await this.$store.dispatch('api/setup/dictionary/editValues', data)
              this.$notification.open({
              message: i18nRender('notification.dictionary.value.edited'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
            this.closeModal()
            this.$emit('refreshTable')
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
        }
        this.loading = false
      } catch (e) {
        console.log(e)
        this.loading = false
      }
    }
  }
}
</script>
