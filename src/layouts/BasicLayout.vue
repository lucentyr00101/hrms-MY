<template>
  <pro-layout
    :menus="menus"
    :collapsed="collapsed"
    :mediaQuery="query"
    :isMobile="isMobile"
    :handleMediaQuery="handleMediaQuery"
    :handleCollapse="handleCollapse"
    :i18nRender="i18nRender"
    v-bind="settings"
    :openOnceKey="false"
  >
    <!-- Ads begin
      广告代码 真实项目中请移除
      production remove this Ads
    -->
    <!-- <ads v-if="isProPreviewSite && !collapsed" /> -->
    <!-- Ads end -->

    <!-- 1.0.0+ 版本 pro-layout 提供 API，
          我们推荐使用这种方式进行 LOGO 和 title 自定义
    -->
    <multi-tab v-if="multiTab" />
    <template v-slot:menuHeaderRender>
      <div>
        <a-avatar v-if="(companyDetails?.profilePicture?.fileLink)" :size="31" shape="square" :src="String(companyDetails.profilePicture.fileLink).replace('http:', 'https:')"/>
        <logo-svg v-else/>
        <h1>{{ title }}</h1>
      </div>
    </template>
    <!-- 1.0.0+ 版本 pro-layout 提供 API,
          增加 Header 左侧内容区自定义
    -->
    <template v-slot:headerContentRender>
      <div>
        <a-tooltip title="刷新页面">
          <a-icon
            type="reload"
            style="font-size: 18px; cursor: pointer"
            @click="
              () => {
                $message.info('只是一个DEMO')
              }
            "
          />
        </a-tooltip>
      </div>
    </template>

    <setting-drawer v-if="isDev" :settings="settings" @change="handleSettingChange">
      <div style="margin: 12px 0">This is SettingDrawer custom footer content.</div>
    </setting-drawer>
    <template v-slot:rightContentRender>
      <right-content :top-menu="settings.layout === 'topmenu'" :is-mobile="isMobile" :theme="settings.theme" />
    </template>
    <!-- custom footer / 自定义Footer -->
    <template v-slot:footerRender>
      <global-footer />
    </template>
    <page-header-wrapper>
      <router-view />
    </page-header-wrapper>
    <LogoutModal
      :type="logoutType"
      v-model="showLogout"
    />
  </pro-layout>
</template>

<script>
import { updateTheme } from '@ant-design-vue/pro-layout'
import { i18nRender } from '@/locales'
import { mapState } from 'vuex'
import { CONTENT_WIDTH_TYPE, SIDEBAR_TYPE, TOGGLE_MOBILE_TYPE } from '@/store/mutation-types'

import defaultSettings from '@/config/defaultSettings'
import RightContent from '@/components/GlobalHeader/RightContent'
import GlobalFooter from '@/components/GlobalFooter'
import Ads from '@/components/Other/CarbonAds'
import LogoSvg from '../assets/logo.svg?inline'
import SettingDrawer from '@/components/SettingDrawer/SettingDrawer.vue'
import MultiTab from '@/components/MultiTab/MultiTab.vue'
// import { asyncRouterMap } from '@/config/router.config.js'

import LogoutModal from '@/components/Global/LogoutModal'

export default {
  name: 'BasicLayout',
  components: {
    SettingDrawer,
    RightContent,
    GlobalFooter,
    LogoSvg,
    Ads,
    MultiTab,
    LogoutModal
  },
  data () {
    return {
      interval: null,
      logoutType: 'passwordChanged', // passwordChanged, roleDisabled, userDisabled
      showLogout: false,
      // preview.pro.antdv.com only use.
      isProPreviewSite: process.env.VUE_APP_PREVIEW === 'true' && process.env.NODE_ENV !== 'development',
      // end
      isDev: process.env.NODE_ENV === 'development' || process.env.VUE_APP_PREVIEW === 'true',

      // base
      menus: [],
      // 侧栏收起状态
      collapsed: false,
      // title: defaultSettings.title,
      settings: {
        // 布局类型
        layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
        // CONTENT_WIDTH_TYPE
        contentWidth: defaultSettings.layout === 'sidemenu' ? CONTENT_WIDTH_TYPE.Fluid : defaultSettings.contentWidth,
        // 主题 'dark' | 'light'
        theme: defaultSettings.navTheme,
        // 主色调
        primaryColor: defaultSettings.primaryColor,
        fixedHeader: defaultSettings.fixedHeader,
        fixSiderbar: defaultSettings.fixSiderbar,
        colorWeak: defaultSettings.colorWeak,
        multiTab: defaultSettings.multiTab,
        hideHintAlert: false,
        hideCopyButton: false
      },
      // 媒体查询
      query: {},

      // 是否手机模式
      isMobile: false
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: (state) => state.addRouters,
      multiTab: (state) => state.app.multiTab,
      navTheme: (state) => state.app.theme,
      layout: (state) => state.app.layout,
      fixedHeader: (state) => state.app.fixedHeader,
      fixedSidebar: (state) => state.app.fixedSidebar
    }),
    title() { return this.companyDetails?.companyName || defaultSettings.title }
  },
  created () {
    this.startPoll()
    this.handleChangeDefault()
    const routes = this.$store.getters.addRouters.find((item) => item.path === '/')
    this.menus = (routes && routes.children) || []
    // 处理侧栏收起状态
    this.$watch('collapsed', () => {
      this.$store.commit(SIDEBAR_TYPE, this.collapsed)
    })
    this.$watch('isMobile', () => {
      this.$store.commit(TOGGLE_MOBILE_TYPE, this.isMobile)
    })
    this.$watch('layout', () => {
      this.settings.layout = this.layout
    })
    this.$watch('fixedHeader', () => {
      this.settings.fixedHeader = this.fixedHeader
    })
    this.$watch('fixedSidebar', () => {
      this.settings.fixSiderbar = this.fixedSidebar
    })
    this.$watch('navTheme', () => {
      this.handleChangeDefault()

      if (this.navTheme === 'realdark') {
        this.settings.theme = 'dark'
        document.documentElement.setAttribute('data-theme', 'realdark')
      } else {
        document.documentElement.setAttribute('data-theme', '')
      }
    })
  },
  mounted () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }

    // first update color
    // TIPS: THEME COLOR HANDLER!! PLEASE CHECK THAT!!
    if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true') {
      updateTheme(this.settings.primaryColor)
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
    this.interval = null
  },
  methods: {
    i18nRender,
    startPoll () {
      console.log('[POLLING STARTS]')
      const POLL_INTERVAL = 5000
      const func = async () => {
        this.checkAuthStatus()
      }
      this.interval = setInterval(func, POLL_INTERVAL)
    },
    async checkAuthStatus () {
      try {
        const { data } = await this.$store.dispatch('api/auth/checkStatus')
        const {
          isResetPassword: pwChanged,
          areRolesDisabled: roleDisabled,
          isDisabled: userDisabled
        } = data.data
        this.logoutType = pwChanged
          ? 'passwordChanged'
          : roleDisabled
            ? 'roleDisabled'
            : userDisabled
              ? 'userDisabled'
              : null
        this.logoutType && (this.showLogout = true)
      } catch (e) {
        if (e.response.data.data === null) {
          this.logoutType = 'roleDisabled'
          this.logoutType && (this.showLogout = true)
        }
        console.log(e)
      }
    },
    handleMediaQuery (val) {
      this.query = val
      if (this.isMobile && !val['screen-xs']) {
        this.isMobile = false
        return
      }
      if (!this.isMobile && val['screen-xs']) {
        this.isMobile = true
        this.collapsed = false
        this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
        // this.settings.fixSiderbar = false
      }
    },
    handleCollapse (val) {
      this.collapsed = val
    },
    handleSettingChange ({ type, value }) {
      console.log('type', type, value)
      type && (this.settings[type] = value)
      switch (type) {
        case 'contentWidth':
          this.settings[type] = value
          break
        case 'layout':
          if (value === 'sidemenu') {
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
          } else {
            this.settings.fixSiderbar = false
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fixed
          }
          break
      }
    },
    handleChangeDefault () {
      this.settings.layout = this.layout
      this.settings.fixedHeader = this.fixedHeader
      this.settings.fixSiderbar = this.fixedSidebar
      if (this.navTheme === 'dark' || this.navTheme === 'light') {
        this.settings.theme = this.navTheme
      } else if (this.navTheme === 'realdark') {
        document.documentElement.setAttribute('data-theme', 'realdark')
      }
    }
  }
}
</script>

<style lang="less">
  @import './BasicLayout.less';

  .ant-pro-sider-menu-logo h1 {
    max-width: 70%;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
