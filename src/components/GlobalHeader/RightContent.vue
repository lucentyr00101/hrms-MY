<template>
  <div :class="wrpCls">
    <NoticeIcon/>
    <avatar-dropdown :menu="showMenu" :class="prefixCls" />
    <select-lang :class="prefixCls" />
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import SelectLang from '@/components/SelectLang'
import NoticeIcon from '../NoticeIcon/NoticeIcon.vue'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    SelectLang,
    NoticeIcon
},
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showMenu: true,
      currentUser: {}
    }
  },
  computed: {
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    }
  }
}
</script>
