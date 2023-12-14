<template>
  <div>
    <!-- Image Modal -->
    <a-modal
      class="modal-image-holder"
      :width="700"
      v-model="imageModal.show"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
    >
      <img :src="imageModal.data.fileLink" />
      <a-button type="approve" icon="download" @click="downloadImage(imageModal.data)">{{
        $t('table.dialog.download')
      }}</a-button>
    </a-modal>
    <!-- /Image Modal -->

    <a-row class="details-holder" type="flex" :gutter="[8, 30]">
      <a-col v-for="(item, index) of details" :key="index" :span="24">
        <span class="label">{{ item?.label }}:</span>
        <span class="value">{{ item?.value || '--' }}</span>
      </a-col>

      <a-col class="attachment" :span="24">
        <span class="label">{{ $t('table.column.attached') }}:</span>
        <div v-if="modal?.data?.attachments?.length > 0" class="image-wrapper">
          <div v-for="(item, index) of modal.data.attachments" :key="index" class="value">
            <div
              class="image-holder"
              :style="{ backgroundImage: `url(${item.fileLink})` }"
              @click="
                () => {
                  imageModal = { show: true, data: item }
                }
              "
            ></div>
          </div>
        </div>
        <span v-else class="value">--</span>
      </a-col>
    </a-row>

    <div :style="{ display: 'flex', justifyContent: 'flex-end', margin: '50px 0 0' }">
      <a-button v-if="!modal?.data?.isAcknowledged" type="approve" :style="{ margin: '0 5px' }" @click="acknowledge">{{
        $t('table.dialog.acknowledge')
      }}</a-button>
      <a-button v-else :style="{ margin: '0 5px' }" @click="mainParent.closeModal">{{
        $t('table.dialog.close')
      }}</a-button>
    </div>
  </div>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'
import { i18nRender } from '@/locales'

export default {
  name: 'SetupCompanyAnnouncementDetails',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      imageModal: { show: false, data: {} }
    }
  },
  computed: {
    mainParent() {
      return this.getParent('SetupCompanyAnnouncement')
    },
    details() {
      const { title, content, postTime, author } = this.modal?.data || {}
      const details = [
        { label: i18nRender('table.column.title'), value: title },
        { label: i18nRender('table.column.content'), value: content },
        { label: i18nRender('table.column.post-time'), value: this.formatDate(postTime, 'YYYY-MM-DD HH:mm:ss') },
        { label: i18nRender('table.column.author'), value: author }
      ]
      return details
    }
  },
  watch: {},
  methods: {
    downloadImage(image) {
      fetch(String(image.fileLink).replace('http:', 'https:'), { mode: 'cors' })
        .then((response) => response.blob())
        .then((imageBlob) => {
          const imageObjectURL = window.URL.createObjectURL(imageBlob)
          const link = document.createElement('a')
          link.download =
            image.fileOriginName || String(image).slice(image.lastIndexOf('/') + 1, image.lastIndexOf('?'))
          link.href = imageObjectURL
          link.click()
        })
    },
    acknowledge() {
      this.$confirm({
        title: this.$t('save.confirm'),
        okText: i18nRender('table.dialog.yes'),
        cancelText: i18nRender('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          const data = { companyAnnouncementId: this.modal.data.id }
          // console.log(data)
          try {
            await this.$store.dispatch('api/setup/company/announcement/acknowledge', data)
            this.$notification.open({
              message: this.$t('notification.announcement.acknowledged'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
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
  created() {}
}
</script>

<style>
.details-holder .ant-col {
  display: flex;
}

.details-holder .label {
  display: inline-block;
  min-width: 150px;
  text-align: right;
  margin: 0 50px 0 0;
}

.details-holder .value {
  display: inline-block;
  overflow: hidden;
}

.details-holder .attachment {
  margin: 30px 0 20px 0;
}

.details-holder .attachment .value {
  overflow: initial;
}

.image-holder {
  width: 120px;
  height: 120px;
  margin: 0 5px 5px 5px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 5px 5px 5px 2px #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  cursor: pointer;
}

.modal-image-holder img {
  display: block;
  width: auto;
  max-width: 100%;
  margin: 20px auto 0 auto;
}

.modal-image-holder .ant-btn {
  display: block;
  margin: 20px auto 0 auto;
}

.ant-btn-approve {
  color: #fff;
  background-color: #00c39d;
  border-color: #00c39d;
}

.ant-btn-approve:hover,
.ant-btn-approve:focus {
  color: #fff;
  background-color: #00d59d;
  border-color: #00d59d;
}
</style>
