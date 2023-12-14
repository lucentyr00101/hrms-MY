<template>
  <a-modal
    :width="800"
    :visible="visible"
    :title="$t('modal.roles.set-permission')"
    :okText="$t('table.dialog.confirm')"
    @cancel="closeModal"
    @ok="handleSubmit"
    :confirmLoading="saving"
  >
    <a-spin :spinning="loading">
      <a-tree
        v-model="checkedKeys"
        checkable
        :expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :selected-keys="selectedKeys"
        :tree-data="treeData"
        @expand="onExpand"
        @select="onSelect"
        @check="onCheck"
      />
    </a-spin>
  </a-modal>
</template>
<script>
import storage from 'store'
import { resetRouter } from '@/router'

export default {
  data() {
    return {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      checkedKeysChecks: [],
      treeData: [],
      saving: false,
      loading: false,
      visible: false
    }
  },
  props: {
    value: Boolean,
    userType: {
      type: String,
      default: () => null
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  watch: {
    checkedKeys(val) {
      console.log('onCheck', val)
    },
    async visible (visible) {
      if (visible) {
        this.loading = true
        try {
          console.log(this.userType)
          const { data } = await this.$store.dispatch('api/security/roles/fetchPermissionTree', { userType: this.userType })
          console.log('data', data)
          this.treeData = this.generateTree(data)
        } catch (e) {}
        this.loading = false
        this.setValues()
      }
    }
  },
  methods: {
    open() {
      this.visible = true
    },
    setValues() {
      this.selectedKeys = this.model?.securityUserPermissions.map((role) => role.id) || []
      this.checkedKeys = this.model?.securityUserPermissions.map((role) => role.id) || []
    },
    generateTree(data) {
      console.log(data)
      const lang = storage.get('lang')
      return data.reduce((list, item) => {
        const obj = {
          title: JSON.parse(item.name)[lang],
          key: item.id
        }
        item.children && (obj.children = this.generateTree(item.children))
        list.push(obj)
        return list
      }, [])
    },
    closeModal() {
      this.visible = false
    },
    onExpand(expandedKeys) {
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck(checkedKeys, info) {
      this.checkedKeys = checkedKeys
      this.checkedKeysChecks = info.halfCheckedKeys
    },
    onSelect(selectedKeys, info) {
      this.selectedKeys = selectedKeys
      this.checkedKeysChecks = info.halfCheckedKeys
    },
    async handleSubmit() {
      this.saving = true
      try {
        const data = {
          id: this.model.id,
          securityUserPermissions: [...this.checkedKeys],
          securityUserPermissionChecks: [...this.checkedKeysChecks]
        }
        console.log('data', data)
        await this.$store.dispatch('api/security/roles/setPermission', data)
        this.$notification.open({
          message: this.$t('notification.permission.updated'),
          icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        })
        await this.$store.dispatch('fetchPermissions')
        await this.$store.dispatch('GenerateRoutes', this.$store.getters.permissions)
        resetRouter()
        this.$emit('refreshTable')
        this.closeModal()
      } catch (e) {
        console.log(e)
        this.$message.error(e.response.data.message)
      }
      this.saving = false
    }
  }
}
</script>
