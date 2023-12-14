
import { mapState, mapActions } from 'vuex'

const baseMixin = {
  computed: {
    ...mapState({
      layout: state => state.app.layout,
      navTheme: state => state.app.theme,
      primaryColor: state => state.app.color,
      colorWeak: state => state.app.weak,
      fixedHeader: state => state.app.fixedHeader,
      fixedSidebar: state => state.app.fixedSidebar,
      contentWidth: state => state.app.contentWidth,
      autoHideHeader: state => state.app.autoHideHeader,

      isMobile: state => state.app.isMobile,
      sideCollapsed: state => state.app.sideCollapsed,
      multiTab: state => state.app.multiTab
    }),
    isTopMenu () {
      return this.layout === 'topmenu'
    }
  },
  methods: {
    isSideMenu () {
      return !this.isTopMenu
    }
  }
}

const employeeSetupMixin = {
  data () {
    return {
      employeeId: this.$route.params.id
    }
  },
   methods: {
    ...mapActions('api/setup/employee/employeeSetup', { getEmployeeSetup: 'get' })
  },
  async created () {
    if (this.employeeId) {
      await this.getEmployeeSetup(this.employeeId)
    }
  }
}

export {
  baseMixin, employeeSetupMixin
}
