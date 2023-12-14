<template>
  <div class="resign-uploader">
    <a-modal destroyOnClose :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
    <p style="margin-bottom: 5px;">{{ $t('table.dialog.upload') }}:</p>
    <a-upload
      accept="image/*"
      :beforeUpload="() => false"
      list-type="picture-card"
      :file-list="fileList"
      @preview="handlePreview"
      @change="handleChange"
      name="files"
    >
      <div v-if="fileList.length < 10">
        <a-icon type="plus" />
        <div class="ant-upload-text">
          Upload
        </div>
      </div>
    </a-upload>
    <p class="upload-info">
      {{ $t('setup.employee.resignation.upload.info') }}
    </p>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default {
  name: 'ApprovedResignationUploader',
  data () {
    return {
      fileList: [],
      previewVisible: false,
      previewImage: null
    }
  },
  computed: {
    ...mapGetters('api/setup/employee/employeeSetup', ['employee'])
  },
  created () {
    this.loadAssets()
  },
  methods: {
    ...mapActions('api/setup/employee/employeeSetup', { getEmployeeSetup: 'get' }),
    ...mapActions('api/setup/employee/employeeSetup/resignation', ['upload']),
    handleChange ({ fileList: _fileList }) {
      if (this.fileList.length < 10) {
        this.fileList = _fileList
        this.handleUpload(this.fileList)
      }
    },
    async handleUpload (fileList) {
      const data = {
        id: this.employee.data?.id,
        previousAttachmentLinks: []
      }
      this.fileList.forEach(file => {
        if (file.url) {
          data.previousAttachmentLinks.push(file.url)
        }
      })
      const blob = new Blob([JSON.stringify(data)], {
        type: 'application/json'
      })
      const formData = new FormData()
      formData.append('employeeSetupResignationUploadParam', blob)
      this.fileList.forEach(file => {
        if (file.originFileObj) {
          formData.append('attachments', file.originFileObj)
        }
      })
      await this.upload(formData)
    },
    async loadAssets () {
      const handoverData = await this.$store.dispatch('api/main/employeeManagement/assetsLists/handover', this.employee?.data?.employeeNumber)
      const list = handoverData?.data?.attachments || []
      const files = list.map((attachment, index) => {
        return {
          uid: index,
          url: attachment
        }
      })
      this.fileList = [
        ...this.fileList,
        ...files
      ]
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    }
  }
}
</script>

<style lang="less">
.resign-uploader {
  display: flex;
  flex-wrap: wrap;

  & > p {
    width: 100%;
  }

  .ant-upload-picture-card-wrapper {
    width: auto;
    display: flex;
  }

  .upload-info {
    float: left;
    width: 300px;
    margin-left: 10px;
  }
}
</style>
