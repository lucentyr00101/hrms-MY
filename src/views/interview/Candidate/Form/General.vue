<template>
  <a-row id="candidate-general" class="form" type="flex" :gutter="24">
    <a-col :span="7">
      <a-row class="form" type="flex" :gutter="24">
        <a-col class="avatar-holder" :span="24">
          <a-avatar :size="145" icon="user" :src="mainForm?.image?.url" />
          <a-upload
            :file-list="[]"
            v-decorator="[
              'avatar'
              // {
              //   rules: [
              //     { required: true, message: $t('error.attached.required') },
              //     { validator: validateFile }
              //   ]
              // }
            ]"
            accept="image/png, image/jpeg, image/jpg"
            :remove="handleRemove.bind(null, 'image')"
            :before-upload="beforeUpload.bind(null, 'image')"
            :disabled="!/^add$|^update$/gi.test($route.query?.action)"
          >
            <!-- <div v-if="(mainForm.image.url)" class="avatar" :style="{ background: `url(${mainForm.image.url})` }"></div>
            <div v-else>
              <a-icon type="upload" />
              <div class="ant-upload-text">Click to Upload</div>
            </div> -->
            <a-button :disabled="!/^add$|^update$/gi.test($route.query?.action)">
              <a-icon type="upload" />
              <span>{{ $t('table.dialog.click-to-upload') }}</span>
            </a-button>
          </a-upload>
        </a-col>

        <a-col class="file-uploader-wrapper" :span="24">
          <a-form-item class="column-layout" :label="`${$t('table.column.attached')} (optional):`">
            <a-upload
              class="files-uploader"
              :file-list="mainForm.attached.fileList"
              v-decorator="[
                'attached',
                {
                  rules: [
                    // { required: true, message: $t('error.attached.required') },
                    { validator: validateFile.bind(null, 'attached') }
                  ]
                }
              ]"
              :multiple="true"
              :remove="handleRemove.bind(null, 'attached')"
              :before-upload="beforeUpload.bind(null, 'attached')"
              :disabled="!/^add$|^update$/gi.test($route.query?.action)"
            >
              <a-button :disabled="!/^add$|^update$/gi.test($route.query?.action)">
                <a-icon type="plus" />
                <span>{{ $t('table.dialog.upload') }}</span>
              </a-button>
            </a-upload>
            <span class="text">{{ $t('interview-candidate.resume-certificate-etc') }}</span>
          </a-form-item>
        </a-col>
      </a-row>
    </a-col>

    <a-col :span="17">
      <a-row class="form" type="flex" :gutter="54">
        <a-col :span="12">
          <a-form-item :label="`${$t('table.column.name')}:`">
            <a-input
              v-decorator="[
                'employeeName',
                {
                  rules: [
                    { required: true, message: $t('error.name.required') },
                    {
                      pattern:
                        /^[a-zñA-ZÑ0-9][a-zñA-ZÑ0-9\-\s]*([a-zñA-ZÑ0-9],[a-zñA-ZÑ0-9\s])[a-zñA-ZÑ0-9][a-zñA-ZÑ0-9\-\s]*[a-zñA-ZÑ0-9]$/gi,
                      message: $t('error.name.format')
                    }
                  ]
                }
              ]"
              :maxLength="25"
              placeholder="Last Name, First Name"
              :disabled="!/^add$|^update$/gi.test($route.query?.action)"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item :label="`${$t('table.column.position-applied')}:`">
            <a-select
              v-decorator="[
                'positionApplied',
                {
                  rules: [{ required: true, message: $t('error.position-applied.required') }]
                }
              ]"
              :options="mainParent.activePositionAppliedList"
              placeholder="Select"
              :disabled="!/^add$|^update$/gi.test($route.query?.action)"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item :label="`${$t('table.column.email')}:`">
            <a-input
              v-decorator="[
                'email',
                {
                  rules: [
                    { required: true, message: $t('error.email.required') },
                    { pattern: mainForm.emailRegex, message: $t('error.email.validator') }
                  ]
                }
              ]"
              :maxLength="100"
              placeholder="email"
              :disabled="!/^add$|^update$/gi.test($route.query?.action)"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item :label="`${$t('table.column.gender')}:`">
            <a-select
              v-decorator="[
                'gender',
                {
                  rules: [{ required: true, message: $t('error.gender.required') }]
                }
              ]"
              :options="mainParent.genderList"
              placeholder="Select"
              :disabled="!/^add$|^update$/gi.test($route.query?.action)"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item :label="`${$t('table.column.id-number')}:`">
            <a-input
              v-decorator="['idNumber']"
              :maxLength="25"
              placeholder="id number"
              :disabled="!/^add$|^update$/gi.test($route.query?.action)"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item :label="`${$t('table.column.primary-mobile')}:`" help="country code + mobile: 60175523033">
            <a-input
              v-decorator="[
                'mobile',
                {
                  rules: [
                    { required: true, message: $t('error.mobile.required') },
                    { pattern: /^[\+\d][\d]*$/, message: $t('error.phone-number.validator') }
                  ]
                }
              ]"
              :maxLength="13"
              placeholder="mobile number"
              :disabled="!/^add$|^update$/gi.test($route.query?.action)"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item :label="`${$t('table.column.passport-number')}:`">
            <a-input
              v-decorator="['passportNumber']"
              :maxLength="25"
              placeholder="passport number"
              :disabled="!/^add$|^update$/gi.test($route.query?.action)"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item :label="`${$t('table.column.date-of-birth')}:`">
            <a-date-picker
              v-decorator="[
                'dateOfBirth',
                {
                  rules: [{ required: true, message: $t('error.date-of-birth.required') }]
                }
              ]"
              placeholder="Select date"
              :style="{ width: '100%' }"
              :disabled-date="mainForm.disabledFutureDate"
              :disabled="!/^add$|^update$/gi.test($route.query?.action)"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item :label="`${$t('table.column.marital-status')}:`">
            <a-select
              v-decorator="['maritalStatus']"
              :options="mainParent.maritalStatusList"
              placeholder="Select"
              :disabled="!/^add$|^update$/gi.test($route.query?.action)"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item :label="`${$t('table.column.passport-expiry-date')}:`">
            <a-date-picker
              v-decorator="['passportExpiryDate']"
              placeholder="Select date"
              :style="{ width: '100%' }"
              :disabled="!/^add$|^update$/gi.test($route.query?.action)"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item :label="`${$t('table.column.race')}:`">
            <a-select
              v-decorator="['race']"
              :options="mainParent.raceList"
              placeholder="Select"
              :disabled="!/^add$|^update$/gi.test($route.query?.action)"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item :label="`${$t('table.column.qualifications')}:`">
            <a-select
              v-decorator="[
                'qualifications',
                {
                  rules: [{ required: true, message: $t('error.qualifications.required') }]
                }
              ]"
              :options="mainParent.qualificationsList"
              placeholder="Select"
              :disabled="!/^add$|^update$/gi.test($route.query?.action)"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item :label="`${$t('table.column.status')}:`">
            <a-select
              v-decorator="[
                'status',
                {
                  rules: [{ required: true, message: $t('error.status.required') }]
                }
              ]"
              :options="mainParent.interviewStatusList"
              placeholder="Screening"
              :disabled="!/^add$|^update$/gi.test($route.query?.action)"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item :label="`${$t('table.column.interviewer')}:`">
            <a-select
              v-decorator="['interviewer']"
              :options="mainParent.interviewerList"
              show-search
              placeholder="Select"
              :disabled="!/^add$|^update$/gi.test($route.query?.action)"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item :label="`${$t('table.column.address')}:`">
            <a-input
              v-decorator="['address']"
              type="textarea"
              :maxLength="100"
              placeholder="Autosize height based on content lines="
              :disabled="!/^add$|^update$/gi.test($route.query?.action)"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item :label="`${$t('table.column.interview-time')}:`">
            <a-date-picker
              v-decorator="['interviewTime']"
              format="YYYY-MM-DD HH:mm"
              :show-time="{ defaultValue: mainForm.moment().second(0), format: 'HH:mm' }"
              placeholder="Select date"
              :style="{ width: '100%' }"
              :disabled-date="mainForm.disabledPassDate"
              :disabled-time="mainForm.disabledPassTime"
              :disabled="!/^add$|^update$/gi.test($route.query?.action)"
            />
          </a-form-item>

          <a-form-item :label="`${$t('table.column.2nd-interview-time')}:`">
            <a-date-picker
              v-decorator="['secondInterviewTime']"
              format="YYYY-MM-DD HH:mm"
              :show-time="{ defaultValue: mainForm.moment().second(0), format: 'HH:mm' }"
              placeholder="Select date"
              :style="{ width: '100%' }"
              :disabled-date="mainForm.disabledPassDate"
              :disabled-time="mainForm.disabledPassTime"
              :disabled="!/^add$|^update$/gi.test($route.query?.action)"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'InterviewCandidateFormGeneral',
  data() {
    return {}
  },
  computed: {
    mainParent() {
      return this.getParent('InterviewCandidate')
    },
    mainForm() {
      return this.getParent('InterviewCandidateForm')
    }
  },
  methods: {
    validateFile(property, rule, value, callback) {
      // if (this.mainForm[property].fileList.length === 0) {
      //   callback(new Error(this.$t('error.attached.required')))
      //   return false
      // }
      if (this.mainForm[property].fileList.length > 20) {
        callback(new Error(this.$t('error.up-to-20-files-attached-only.required')))
        return false
      }
      callback()
    },
    handleRemove(property, file) {
      const index = this.mainForm[property].fileList.indexOf(file)
      const newFileList = this.mainForm[property].fileList.slice()
      newFileList.splice(index, 1)
      this.mainForm[property].fileList = newFileList.length > 0 ? newFileList : []
      if (property === 'image') {
        this.mainForm[property].url = newFileList.length > 0 ? this.mainForm[property].url : undefined
      }
    },
    beforeUpload(property, file) {
      if (property === 'image') {
        this.mainForm[property].fileList = [file]
        // Convert File to Base64 Url
        const reader = new FileReader()
        reader.onload = () => {
          this.mainForm[property].url = reader.result
        }
        reader.readAsDataURL(file)
      } else {
        const isFileExist = Boolean((this.mainForm[property].fileList || []).find((item) => item.name === file.name))
        this.mainForm[property].fileList = [
          ...(this.mainForm[property].fileList || []),
          ...(!isFileExist ? [file] : [])
        ]
      }
      return false
    }
  },
  created() {}
}
</script>

<style lang="less">
#candidate-general {
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

    .avatar {
      width: inherit;
      height: inherit;
      background-position: center !important;
      background-size: cover !important;
      background-repeat: no-repeat !important;
      border-radius: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }
  }

  .file-uploader-wrapper {
    text-align: center;

    .label,
    .text {
      display: inline-block;
      margin: 10px 0 0 0;
    }
  }

  .files-uploader {
    display: flex;
    flex-direction: column-reverse;

    .ant-upload {
      display: block;
      width: 147.5px;
      height: 147.5px;
      margin: 0 auto;
    }

    button {
      width: 147.5px;
      height: 147.5px;
      border-width: 1px;
      border-style: dashed;
    }

    button .anticon {
      display: block;
      font-size: 16px;
    }

    button span {
      display: block;
      font-size: 18px;
    }

    .ant-upload-list {
      margin: 0 auto 10px auto;
      text-align: initial;
    }

    .ant-upload-list .ant-upload-list-item-name {
      width: 90%;
      // padding-right: 22px;
    }
  }

  .avatar-holder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 0 50px 0;

    .ant-avatar {
      border: 2px dashed #d9d9d9;
    }

    .ant-upload {
      margin: 20px 0;
    }
  }

  .column-layout {
    flex-direction: column;
    align-items: center;

    .ant-form-item-label {
      width: auto;

      label::after {
        margin: 0;
      }
    }
  }
}
</style>
