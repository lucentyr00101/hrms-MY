<script>
import events from './events'
import { i18nRender } from '@/locales'

export default {
  name: 'MultiTab',
  data () {
    return {
      pathList: [],
      pages: [],
      activeKey: '',
      newTabIndex: 0
    }
  },
  created () {
    // bind event
    events.$on('open', val => {
      if (!val) {
        throw new Error(`multi-tab: open tab ${val} err`)
      }
      this.activeKey = val
    }).$on('close', val => {
      if (!val) {
        this.closeThat(this.activeKey)
        return
      }
      this.closeThat(val)
    }).$on('rename', ({ key, name }) => {
      console.log('rename', key, name)
      try {
        const item = this.pages.find(item => item.path === key)
        item.meta.customTitle = name
        this.$forceUpdate()
      } catch (e) {
      }
    })

    this.pages.push(this.$route)
    this.pathList.push(this.$route.path)
    this.selectedLastPath()
  },
  methods: {
    onEdit (targetKey, action) {
      this[action](targetKey)
    },
    remove (targetKey) {
      this.pages = this.pages.filter(page => page.path !== targetKey)
      this.pathList = this.pathList.filter(path => path !== targetKey)
      // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
      if (!this.pathList.includes(this.activeKey)) {
        this.selectedLastPath()
      }
    },
    selectedLastPath () {
      this.activeKey = this.pathList[this.pathList.length - 1]
    },

    // content menu
    closeThat (e) {
      // 判断是否为最后一个标签页，如果是最后一个，则无法被关闭
      if (this.pathList.length > 1) {
        this.remove(e)
      } else {
        this.$message.info(i18nRender('menu.multi-tab.closeThat.error'))
      }
    },
    closeLeft (e) {
      const currentIndex = this.pathList.indexOf(e)
      if (currentIndex > 0) {
        this.pathList.forEach((item, index) => {
          if (index < currentIndex) {
            this.remove(item)
          }
        })
      } else {
        this.$message.info(i18nRender('menu.multi-tab.closeLeft.error'))
      }
    },
    closeRight (e) {
      const currentIndex = this.pathList.indexOf(e)
      if (currentIndex < (this.pathList.length - 1)) {
        this.pathList.forEach((item, index) => {
          if (index > currentIndex) {
            this.remove(item)
          }
        })
      } else {
        this.$message.info(i18nRender('menu.multi-tab.closeRight.error'))
      }
    },
    closeAll (e) {
      const currentIndex = this.pathList.indexOf(e)
      this.pathList.forEach((item, index) => {
        if (index !== currentIndex) {
          this.remove(item)
        }
      })
    },
    closeMenuClick (key, route) {
      this[key](route)
    },
    renderTabPaneMenu (e) {
      return (
        <a-menu {...{ on: { click: ({ key, item, domEvent }) => { this.closeMenuClick(key, e) } } }}>
          <a-menu-item key="closeThat">{ i18nRender('menu.multi-tab.closeThat') }</a-menu-item>
          <a-menu-item key="closeRight">{ i18nRender('menu.multi-tab.closeRight') }</a-menu-item>
          <a-menu-item key="closeLeft">{ i18nRender('menu.multi-tab.closeLeft') }</a-menu-item>
          <a-menu-item key="closeAll">{ i18nRender('menu.multi-tab.closeAll') }</a-menu-item>
        </a-menu>
      )
    },
    // render
    renderTabPane (title, keyPath) {
      const menu = this.renderTabPaneMenu(keyPath)

      return (
        <a-dropdown overlay={menu} trigger={['contextmenu']}>
          <span style={{ userSelect: 'none' }}>{ i18nRender(title) }</span>
        </a-dropdown>
      )
    }
  },
  watch: {
    '$route': function (newVal) {
      this.activeKey = newVal.path
      if (this.pathList.indexOf(newVal.path) < 0) {
        this.pathList.push(newVal.path)
        this.pages.push(newVal)
      }
    },
    activeKey: function (newPathKey) {
      if (this.$route.path !== newPathKey) {
        this.$router.push({ path: newPathKey })
      }
    }
  },
  render () {
    const { onEdit, $data: { pages } } = this
    const panes = pages.map(page => {
      return (
        <a-tab-pane
          style={{ height: 0 }}
          tab={this.renderTabPane(page.meta.customTitle || page.meta.title, page.path)}
          key={page.path} closable={pages.length > 1}
        >
        </a-tab-pane>)
    })

    return (
      <div class="ant-pro-multi-tab">
        <div class="ant-pro-multi-tab-wrapper">
          <a-tabs
            hideAdd
            type={'editable-card'}
            v-model={this.activeKey}
            tabBarStyle={{ margin: 0, paddingLeft: '16px', paddingTop: '6px', background: '#fff' }}
            {...{ on: { edit: onEdit } }}>
            {panes}
          </a-tabs>
        </div>
      </div>
    )
  }
}
</script>
