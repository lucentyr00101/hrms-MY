<template>
  <a-row id="general" class="form" type="flex" :gutter="24">
    <a-col class="avatar-holder" :span="24">
      <a-avatar :size="145" icon="user" :src="mainParent?.image?.url" />
      <!-- <div class="avatar" :style="{ background: (mainParent?.image?.url) ? `url(${mainParent.image.url})` : '' }"></div> -->
      <a-upload
        :file-list="mainParent.fileList"
        v-decorator="[
          'attached'
          // {
          //   rules: [
          //     { required: true, message: $t('error.attached.required') },
          //     { validator: validateFile }
          //   ]
          // }
        ]"
        accept="image/png, image/jpeg, image/jpg"
        :remove="handleRemove"
        :before-upload="beforeUpload"
        :disabled="!mainParent.isEdit"
      >
        <a-button :disabled="!mainParent.isEdit">
          <a-icon type="upload" />
          <span>{{ $t('table.dialog.click-to-upload') }}</span>
          <!-- <div class="ant-upload-text">Click to Upload</div> -->
        </a-button>
      </a-upload>
    </a-col>

    <a-col :span="12">
      <a-form-item :label="`${$t('table.column.company-name')}:`">
        <a-input
          v-decorator="[
            'companyName',
            {
              rules: [{ required: true, message: $t('error.company-name.required') }]
            }
          ]"
          :maxLength="25"
          placeholder="example"
          :disabled="!mainParent.isEdit"
        />
      </a-form-item>
    </a-col>

    <a-col :span="12">
      <a-form-item :label="`${$t('table.column.email')}:`">
        <a-input
          v-decorator="[
            'email',
            {
              rules: [{ pattern: mainParent.emailRegex, message: $t('error.email.validator') }]
            }
          ]"
          placeholder="example"
          :disabled="!mainParent.isEdit"
        />
      </a-form-item>
    </a-col>

    <a-col :span="12">
      <a-form-item :label="`${$t('table.column.registration-number')}:`">
        <a-input
          v-decorator="['registrationNumber']"
          :maxLength="25"
          placeholder="example"
          :disabled="!mainParent.isEdit"
        />
      </a-form-item>
    </a-col>

    <a-col :span="12">
      <a-form-item :label="`${$t('table.column.phone')}:`">
        <a-input
          v-decorator="[
            'phoneOne',
            {
              rules: [{ pattern: /^[\+\d][\d]*$/, message: $t('error.phone-number.validator') }]
            }
          ]"
          :maxLength="15"
          placeholder="Phone 1"
          :disabled="!mainParent.isEdit"
        />
      </a-form-item>
      <a-form-item label=" " :colon="false">
        <a-input
          v-decorator="[
            'phoneTwo',
            {
              rules: [{ pattern: /^[\+\d][\d]*$/, message: $t('error.phone-number.validator') }]
            }
          ]"
          :maxLength="15"
          placeholder="Phone 2"
          :disabled="!mainParent.isEdit"
        />
      </a-form-item>
    </a-col>

    <a-col :span="24">
      <a-form-item :label="`${$t('table.column.address')}:`">
        <a-input v-decorator="['addressOne']" :maxLength="100" placeholder="Address 1" :disabled="!mainParent.isEdit" />
      </a-form-item>
      <a-form-item label=" " :colon="false">
        <a-input v-decorator="['addressTwo']" :maxLength="100" placeholder="Address 2" :disabled="!mainParent.isEdit" />
      </a-form-item>
    </a-col>

    <a-col :span="12">
      <a-form-item :label="`${$t('table.column.country')}:`">
        <a-select
          v-decorator="[
            'country',
            {
              rules: [{ required: true, message: $t('error.country.required') }]
            }
          ]"
          :options="mainParent.countriesList"
          placeholder="Select"
          :disabled="!mainParent.isEdit"
        />
      </a-form-item>
    </a-col>

    <a-col :span="12">
      <a-form-item :label="`${$t('table.column.region')}:`">
        <a-select
          v-decorator="['region']"
          :options="mainParent.regionList"
          placeholder="Select"
          :disabled="!mainParent.isEdit"
        />
      </a-form-item>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'SetupCompanyProfileGeneral',
  computed: {
    mainParent() {
      return this.getParent('SetupCompanyProfile')
    }
  },
  methods: {
    // validateFile(rule, value, callback) {
    //   // if (this.mainParent.image.fileList.length === 0) {
    //   //   callback(new Error(this.$t('error.attached.required')))
    //   //   return false
    //   // }
    //   // if (this.mainParent.image.fileList.length > 5) {
    //   //   callback(new Error(this.$t('error.up-to-5-files-attached-only.required')))
    //   //   return false
    //   // }
    //   callback()
    // },
    handleRemove(file) {
      const index = this.mainParent.image.fileList.indexOf(file)
      const newFileList = this.mainParent.image.fileList.slice()
      newFileList.splice(index, 1)
      this.mainParent.image.fileList = newFileList.length > 0 ? newFileList : []
      this.mainParent.image.url = newFileList.length > 0 ? this.mainParent.image.url : undefined
    },
    beforeUpload(file) {
      this.mainParent.image.fileList = [file]
      // Convert File to Base64 Url
      const reader = new FileReader()
      reader.onload = () => {
        this.mainParent.image.url = reader.result
      }
      reader.readAsDataURL(file)
      // const isFileExist = Boolean((this.mainParent.image.fileList || []).find((item) => (item.name === file.name)))
      // this.mainParent.image.fileList = [ ...(this.mainParent.image.fileList || []), ...((!isFileExist) ? [ file ] : []) ]
      return false
    }
  }
}
</script>

<style lang="less">
.avatar-uploader {
  display: block;
  margin: 0 auto 40px auto;
  width: 150px;
  height: 150px;
  border-radius: 100%;
  box-sizing: border-box;
  overflow: hidden;

  & > .ant-upload {
    width: inherit;
    height: inherit;
    border-radius: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }

  .anticon {
    font-size: 24px;
  }
}

.avatar-holder {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 50px 0;

  .avatar {
    width: 145px;
    height: 145px;
    background-position: center !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    border-radius: 100%;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: 100%;
    background-color: #bfbfbf;
  }

  .ant-avatar {
    border: 2px dashed #d9d9d9;
  }

  .ant-upload {
    margin: 0 0 0 10px;
  }
}
</style>
