<template>
  <a-card>
  <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; align-content: center">
      <a-space direction="vertical" :size="30" >

        <a-space direction="vertical" size="large">
          <a-form :form="form" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" @submit="handleSubmit">

            <a-form-item :style="{marginLeft: '135px'}">
              <a-space direction="vertical" :size="40">
                <a-avatar :size="150" icon="user" :src="imageUrl" :style="{marginLeft: '25px'}"/>
                <a-upload
                  class="upload"
                  name="file"
                  v-decorator="['profile']"
                  :beforeUpload="() => false"
                  @change="handleChange"
                >
                  <a-button :style="{width: '120%'}"> <a-icon type="upload" /> {{ $t('table.dialog.click-to-upload') }} </a-button>
                </a-upload>
              </a-space>
            </a-form-item>

            <a-form-item label="Employee Code: ">
              <a-input
                :maxLength="25"
                :disabled="true"
                v-decorator="['employeeCode', { initialValue: user?.employeeNumber} ]"
                placeholder="employee code"
              />
            </a-form-item>

            <a-form-item label="Email: ">
              <a-input
                :maxLength="25"
                :disabled="true"
                v-decorator="['email', { initialValue: user?.email}]"
                placeholder="example"
              />
            </a-form-item>

           <a-form-item label="Display name: ">
              <a-input
                :maxLength="25"
                v-decorator="['displayName', { initialValue: fullName }]"
                placeholder="example"
                @change="handleInput($event, fullName)"
              />
            </a-form-item>

            <div style="display: flex; flex-direction: column; float: right">
              <a-form-item>
                <a-button v-action:security_account-profile_update :style="{marginLeft: '60px'}" :disabled="disableUpdate" class="confirm-btn" @click="handleSubmit(user?.id)">{{ $t('table.dialog.update') }}</a-button>
              </a-form-item>

              <a-form-item :style="{marginLeft: '10px'}">
                <a-button v-action:security_account-profile_reset-password class="confirm-btn" type="primary" @click="handleResetPassword(user?.email)">{{ $t('table.dialog.reset-password') }}</a-button>
              </a-form-item>

            </div>
          </a-form>
        </a-space>
      </a-space>
    </div>
     <ResetPasswordModal :id="currentId" @clearId="currentId = ''" :apiUrl="apiUrl"/>
  </a-card>
</template>

<script>
import ResetPasswordModal from './ResetPasswordModal.vue'
import { i18nRender } from '@/locales'
import InfoCircle from '@/assets/info-circle.svg'
import { mapGetters } from 'vuex'

function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  components: { ResetPasswordModal },
  name: 'Account',
    data () {
    return {
      imageUrl: '',
      currentId: '',
      formLayout: 'vertical',
      form: this.$form.createForm(this),
      disableUpdate: true,
      apiUrl: 'api/security/account/resetPassword',
      resetPassword: false,
      uploadPhoto: false
    }
  },
  async created() {
    if (this.currentUser && this.currentUser.profilePicture) {
      this.imageUrl = this.currentUser.profilePicture.fileLink
    }
  },
  computed: {
    ...mapGetters('api/auth', ['currentUser']),
    fullName () {
      return this.user.nickName || this.user.firstName + ' ' + this.user.lastName
    },
    user () {
      return this.currentUser
    },
    ...mapGetters('api/setup/employee/employeeSetup', ['employee'])
  },
  methods: {
    handleChange(info) {
      this.disableUpdate = false
      this.uploadPhoto = true
      getBase64(info.file, (imageUrl) => {
        this.imageUrl = imageUrl
        this.image = { photo: imageUrl, file: info.file }
      })
    },
     showMessage (text) {
        this.$notification.open({
          message: i18nRender(text),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
      },
    async handleSubmit() {
      if (this.resetPassword) {
        try {
          await this.$store.dispatch('api/security/account/updateDisplayName', { id: this.user?.id, displayName: this.form.getFieldValue('displayName') })
          this.showMessage('notification.display-name.updated')
          this.resetPassword = false
          this.disableUpdate = true
        } catch (e) {
          this.$message.error(e.response.data.message)
        }
      }

      const file = this.image && this.image.file

      if (this.uploadPhoto) {
        try {
          const formData = new FormData()
          formData.append('file', file)
          formData.append(
            'securityAccountAddPhotoParam',
            new Blob(
              [
                JSON.stringify({
                  id: this.user?.id
                })
              ],
              { type: 'application/json' }
            )
          )
          await this.$store.dispatch('api/security/account/uploadPhoto', formData)
          this.showMessage('notification.profile-picture.updated')
          this.uploadPhoto = false
          this.disableUpdate = true
        } catch (e) {
          this.$message.error(e.response.data.message)
        }
      }
      await this.$store.dispatch('api/auth/fetchCurrentUser')
    },
    showInfo () {
        const _this = this
        this.$confirm({
          title: i18nRender('table.dialog.confirm-msg'),
          okText: i18nRender('table.dialog.yes'),
          cancelText: i18nRender('table.dialog.no'),
          icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
          onOk () {
            console.log('OK')
            _this.$message.success(i18nRender('table.dialog.account-updated'))
          },
          onCancel () {
            console.log('Cancel')
          }
        })
      },
      handleResetPassword (id) {
        this.currentId = id
        this.$store.commit('modal/TOGGLE_RESET_PASSWORD_MODAL')
      },
      handleInput (e, initialName) {
        if (e.target.value !== null || e.target.value !== '') {
          this.disableUpdate = false
          this.resetPassword = true
        }
        if (e.target.value === initialName) {
          this.disableUpdate = true
          this.resetPassword = false
        }
      }
  }
}
</script>

<style scoped lang="less">
.upload{
  &/deep/ .ant-upload-list {
    display: none !important;
  }
}
</style>
