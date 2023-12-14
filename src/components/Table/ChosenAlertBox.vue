<template>
  <div>
    <div style="display: flex; margin-bottom: 20px">
      <a-space :class="position === 'right' ? 'rightClass' : 'leftClass'">
        <a-button v-action="permissionNameAdd" :disabled="disabled" v-if="isActive" icon="plus" type="primary" @click="$emit('open')">
          {{ $t('table.dialog.add') }}
        </a-button>
        <slot name="action-button"></slot>
      </a-space>
    </div>
    <a-alert v-if="!hideAlert" showIcon style="margin-bottom: 16px; display: flex">
      <template slot="message">
        <span style="margin-right: 12px"
          >{{ $t('table.top.chosen') }}: <a style="font-weight: 600">{{ totalSelected }}</a></span
        >
      </template>
      <template slot="description" style="margin-left: auto">
        <a v-action="permissionNameDelete" :disabled="disabled" @click="handleDelete" v-show="totalSelected > 0">{{ $t('table.top.delete') }}</a>
      </template>
    </a-alert>
  </div>
</template>

<script>
export default {
  name: 'ChosenAlertBox',
  props: {
    permissionNameAdd: { type: String, default: null },
    permissionNameDelete: { type: String, default: null },
    totalSelected: { type: Number, default: 0 },
    position: { type: String, default: 'left' },
    isActive: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    hideAlert: { type: Boolean, default: false }
  },
  methods: {
    handleDelete() {
      if (this.totalSelected === 0) return
      this.$emit('delete')
    }
  }
}
</script>

<style scoped>
.ant-alert >>> .ant-alert-description {
  margin-left: auto;
}

.leftClass {
  margin-right: auto;
}

.rightClass {
  margin-left: auto;
}
</style>
