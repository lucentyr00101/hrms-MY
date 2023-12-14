<template>
  <div v-show="Object.keys(employee).length === 0" class="ant-modal-masks">
    <div class="text">{{ $t('setup.employee.fill-up') }}</div>
  </div>
</template>

<script>
export default {
  name: 'FillEmployee',
  props: {
    employee: {
      type: Object,
      default: () => null
    }
  }
}
</script>

<style lang="less" scoped>
.ant-modal-masks {
  position: absolute;
  top: 50px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
  background-color: #80808073;
  .text {
    position: absolute;
    top: 46%;
    left: 50%;
    font-weight: bold;
    font-size: 21px;
    color: #000;
    transform: translate(-50%,-50%);
  }
}
</style>
