<template>
  <div>
    <a-modal
      class="modal-image-holder"
      :width="700"
      v-model="imageModal.show"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
    >
      <img :src="imageModal.data" />
    </a-modal>

    <a-modal
      :title="modalTitle"
      v-model="modal.show"
      :width="isModalView ? 1000 : 700"
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'none' } }"
      :maskClosable="false"
      @cancel="closeModal()"
    >
      <a-form :form="form" layout="horizontal" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }" v-if="!isModalView">
        <a-form-item :label="$t('table.column.employee')">
          <a-select
            show-search
            optionFilterProp="children"
            placeholder="Select"
            :options="mainParent.dropdown.employee.map((item) => ({ value: item.id, label: item.label }))"
            v-decorator="[
              'employeeId',
              {
                rules: [{ required: true, message: $t('error.employee.required') }]
              }
            ]"
          />
        </a-form-item>
        <a-form-item :label="$t('table.dialog.asset')">
          <a-select
            show-search
            optionFilterProp="children"
            placeholder="Select"
            :options="assetList"
            v-decorator="[
              'companyAssetId',
              {
                rules: [{ required: true, message: $t('error.asset.required') }]
              }
            ]"
          />
        </a-form-item>
        <div style="display: flex; align-items: center; justify-content: right; padding-right: 40px">
          <a-form-item>
            <a-button
              v-if="isModalView"
              class="confirm-btn"
              type="primary"
              @click="mainParent?.modalHandler({ ...modal, action: 'edit' })"
              >{{ $t('table.dialog.edit') }}</a-button
            >
            <a-button
              v-else-if="/add|edit/gi.test(modal?.action)"
              class="confirm-btn"
              type="primary"
              @click="handleSubmit()"
              >{{ $t('table.dialog.confirm') }}</a-button
            >
          </a-form-item>
        </div>
      </a-form>

      <div v-else :style="{ marginLeft: '50px' }">
        <a-row>
          <a-row>
            <a-col :span="4"
              ><div>{{ this.$t('table.column.employee-number') }}:</div></a-col
            >
            <a-col :span="8">{{ modal?.data?.employee?.employeeNumber || '-' }}</a-col>
            <a-col :span="4"
              ><div>{{ this.$t('table.column.department') }}:</div></a-col
            >
            <a-col :span="8">{{ modal?.data?.employee.department || '-' }}</a-col> </a-row
          ><br />
          <a-row>
            <a-col :span="4"
              ><div>{{ this.$t('table.column.employee') }}:</div></a-col
            >
            <a-col :span="8">{{ modal?.data?.employee?.fullName || '-' }}</a-col>
            <a-col :span="4"
              ><div>{{ this.$t('table.column.assets-type') }}:</div></a-col
            >
            <a-col :span="8">{{ modal?.data?.companyAsset?.assetType || '-' }}</a-col> </a-row
          ><br />
          <a-row>
            <a-col :span="4"
              ><div>{{ this.$t('table.column.assets-name') }}:</div></a-col
            >
            <a-col :span="8">{{ modal?.data?.companyAsset?.assetName || '-' }}</a-col>
            <a-col :span="4"
              ><div>{{ this.$t('table.column.serial-number') }}:</div></a-col
            >
            <a-col :span="8">{{ modal?.data?.companyAsset?.serialNumber || '-' }}</a-col> </a-row
          ><br />
          <a-row>
            <a-col :span="4"
              ><div>{{ this.$t('table.column.assets-value') }}:</div></a-col
            >
            <a-col :span="8">{{ modal?.data?.companyAsset?.value || '-' }}</a-col>
            <a-col :span="4"
              ><div>{{ this.$t('table.column.remarks') }}:</div></a-col
            >
            <a-col :span="8">{{ modal?.data?.companyAsset?.remarks || '-' }}</a-col> </a-row
          ><br />
          <a-row>
            <a-col :span="4"
              ><div>{{ this.$t('table.dialog.attachment') }}:</div></a-col
            >
            <a-col class="attachment" :span="20">
              <template v-if="modal?.data?.companyAsset?.attachments?.length > 0">
                <div v-for="(item, index) of modal?.data?.companyAsset.attachments" :key="index" class="value">
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
              </template>
              <span v-else class="value">--</span>
            </a-col>
          </a-row>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'MainEmployeeMgmtAssetsModal',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      assetList: [],
      imageModal: { show: false, data: {} },
      attachments: [],
      form: this.$form.createForm(this),
      fields: ['employeeId', 'companyAssetId']
    }
  },
  computed: {
    mainParent() {
      return this.getParent('MainEmployeeMgmtAssetsList')
    },
    isModalView() {
      return this.modal?.action === 'view'
    },
    isModalEdit() {
      return this.modal?.action === 'edit'
    },
    modalTitle() {
      if (this.isModalView) {
        return this.$t('table.dialog.view-assets')
      } else if (this.isModalEdit) {
        return this.$t('table.dialog.edit-assets')
      }
      return this.$t('table.dialog.add-assets')
    }
  },
  watch: {
    async modal(params) {
      const query = {}
      if (params.show && params.action !== 'add' && params?.data) {
        const { id } = params.data
        query.employeeManagementAssetId = id
      }
      const availableAssets = await this.$store.dispatch('api/dropdown/fetchCompanyAssetsDropdown', query)
      this.assetList = availableAssets.data.companyAsset.map((item) => ({
        value: item.id,
        label: item.companyAsset
      }))
      await this.$nextTick()
      if (params.show && params.action !== 'add' && params?.data) {
        this.fields.forEach((v) => this.form.getFieldDecorator(v))
        const { employee, companyAsset } = params.data
        this.form.setFieldsValue({
          employeeId: employee?.id,
          companyAssetId: companyAsset?.id
        })
      }
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file?.size / 1024 / 1024 < 1
      if (!isLt1M) this.$message.error(this.$t('error.max-1mb-file'))
      return !isLt1M
    },
    handleChange(info) {
      this.attachments = info.fileList
    },
    handleSubmit() {
      this.form.validateFields((err, values) => !err && this.showInfo())
    },
    showNotification() {
      this.$notification.open({
        message: this.isModalEdit ? this.$t('notification.assets.updated') : this.$t('notification.assets.added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo() {
      this.$confirm({
        title: this.$t('table.dialog.confirm-msg'),
        okText: this.$t('table.dialog.yes'),
        cancelText: this.$t('table.dialog.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          try {
            const data = {
              ...(this.isModalEdit ? { id: this.modal.data.id } : {}),
              employeeId: this.form.getFieldValue('employeeId'),
              companyAssetId: this.form.getFieldValue('companyAssetId')
            }
            await this.$store.dispatch(
              `api/main/employeeManagement/assetsLists/${this.isModalEdit ? 'update' : 'add'}`,
              data
            )
            this.showNotification()
            this.closeModal()
            this.$emit('refreshTable')
          } catch (e) {
            this.$message.error(e.response.data.message)
          }
        }
      })
    },
    closeModal() {
      this.attachments = []
      this.form.resetFields()
    }
  }
}
</script>

<style>
.attachment {
  display: flex;
  flex-wrap: wrap;
}

.image-holder {
  width: 120px;
  height: 120px;
  margin: 0 5px 10px 5px;
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
  width: 100%;
  margin: 20px auto 0 auto;
}

.modal-image-holder .ant-btn {
  display: block;
  margin: 20px auto 0 auto;
}
</style>
