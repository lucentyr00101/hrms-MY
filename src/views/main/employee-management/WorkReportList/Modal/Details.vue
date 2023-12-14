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
      <img :src="imageModal.data.fileLink">
      <a-button type="approve" icon="download" @click="downloadImage(imageModal.data)">Download</a-button>
    </a-modal>
    <!-- /Image Modal -->

    <a-row class="details-holder" type="flex" :gutter="[8, 30]">
      <a-col v-for="(item, index) of details" :key="index" :span="item.span || 24">
        <span class="label">{{ item?.label }}:</span>
        <span class="value">{{ item?.value || '--' }}</span>
      </a-col>

      <a-col class="attachment" :span="24">
        <span class="label">Attachment:</span>
        <div v-if="(modal?.data?.attachments?.length > 0)" class="image-wrapper">
          <div v-for="(item, index) of modal.data.attachments" :key="index" class="value">
            <div class="image-holder" :style="{ backgroundImage: `url(${item.fileLink})` }" @click="() => { imageModal = { show: true, data: item } }"></div>
          </div>
        </div>
        <span v-else class="value">--</span>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'MainEmployeeMngWorkReportListDetails',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data () {
    return {
      imageModal: { show: false, data: {} }
    }
  },
  computed: {
    mainParent() { return this.getParent('MainEmployeeMngWorkReportList') },
    details() {
      const { employeeSetup, employeeSetupWorkReport, contents, createdTime } = this.modal?.data || {}
      const details = [
        { label: 'Employee Number', value: employeeSetup?.employeeNumber, span: 12 },
        { label: 'Department', value: employeeSetup?.department, span: 12 },
        { label: 'Employee', value: employeeSetup?.fullName, span: 12 },
        { label: 'Created Time', value: this.formatDate(createdTime, 'YYYY-MM-DD HH:mm:ss'), span: 12 },
        { label: 'Report', value: employeeSetupWorkReport?.workReportType, span: 12 },
        { label: 'Content', value: contents, span: 24 }
      ]
      return details
    }
  },
  watch: {},
  methods: {
    downloadImage(image) {
      fetch(String(image.fileLink).replace('http:', 'https:'), { mode: 'cors' }).then(response => response.blob()).then(imageBlob => {
      const imageObjectURL = window.URL.createObjectURL(imageBlob)
      const link = document.createElement('a')
            link.download = image.fileOriginName || String(image).slice((image.lastIndexOf('/') + 1), image.lastIndexOf('?'))
            link.href = imageObjectURL
            link.click()
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
    min-width: 125px;
    /* text-align: right; */
    margin: 0 30px 0 0;
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
    background-color: #00C39D;
    border-color: #00C39D;
  }

  .ant-btn-approve:hover, .ant-btn-approve:focus {
    color: #fff;
    background-color: #00D59D;
    border-color: #00D59D;
  }
</style>
