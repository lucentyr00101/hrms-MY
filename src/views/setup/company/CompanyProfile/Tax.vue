<template>
  <a-row id="tax" class="form" type="flex" :gutter="24">
    <a-col :span="12">
      <a-form-item :label="`${$t('table.column.tax-reference-code')}:`">
        <a-input
          v-decorator="[
            'code'
          ]"
          :maxLength="25"
          placeholder="example"
          :disabled="!mainParent.isEdit"
        />
      </a-form-item>
    </a-col>

    <a-col :span="12">
      <a-form-item :label="`${$t('table.column.tax-branch')}:`">
        <a-input
          v-decorator="[
            'branch'
          ]"
          :maxLength="25"
          placeholder="example"
          :disabled="!mainParent.isEdit"
        />
      </a-form-item>
    </a-col>

    <a-col :span="12">
      <a-form-item :label="`${$t('table.column.tax-email')}:`">
        <a-input
          v-decorator="[
            'email',
            {
              rules: [
                { pattern: mainParent.emailRegex, message: $t('error.email.validator') }
              ]
            }
          ]"
          placeholder="example"
          :disabled="!mainParent.isEdit"
        />
      </a-form-item>
    </a-col>

    <a-col :span="12">
      <a-form-item :label="`${$t('table.column.tax-website')}:`">
        <a-input
          v-decorator="[
            'website'
          ]"
          :maxLength="100"
          placeholder="example"
          :disabled="!mainParent.isEdit"
        />
      </a-form-item>
    </a-col>

    <a-col :span="12">
      <a-form-item :label="`${$t('table.column.tax-phone')}:`">
        <a-input
          v-decorator="[
            'phone',
            {
              rules: [
                { pattern: /^[\+\d][\d]*$/, message: $t('error.phone-number.validator') }
              ]
            }
          ]"
          :maxLength="15"
          placeholder="example"
          :disabled="!mainParent.isEdit"
        />
      </a-form-item>
    </a-col>

    <a-col :span="12">
      <a-form-item :label="`${$t('table.column.remarks')}:`">
        <a-input
          v-decorator="[
            'remarks'
          ]"
          :maxLength="100"
          placeholder="example"
          :disabled="!mainParent.isEdit"
        />
      </a-form-item>
    </a-col>

    <a-col :span="24">
      <a-form-item :label="`${$t('table.column.address')}:`">
        <a-input
          v-decorator="[
            'addressOne'
          ]"
          :maxLength="100"
          placeholder="Address 1"
          :disabled="!mainParent.isEdit"
        />
        <a-input
          v-decorator="[
            'addressTwo'
          ]"
          :maxLength="100"
          placeholder="Address 2"
          :disabled="!mainParent.isEdit"
        />
      </a-form-item>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'SetupCompanyProfileTax',
  computed: {
    mainParent() { return this.getParent('SetupCompanyProfile') }
  },
  methods: {}
}
</script>

<style></style>
