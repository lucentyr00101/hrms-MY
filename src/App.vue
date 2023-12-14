<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'

export default {
  data () {
    return {
    }
  },
  computed: {
    locale () {
      // 只是为了切换语言时，更新标题
      const { title } = this.$route.meta
      const { companyName = '', profilePicture = {} } = this.companyDetails
      setDocumentTitle(`${(title) ? `${i18nRender(title)} - ` : ''}${companyName || domTitle}`)
      if (profilePicture?.fileLink) {
        document.querySelector('link[rel="icon"]').href = String(profilePicture.fileLink).replace('http:', 'https:')
      }
      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  },
  methods: {
    async initiate() {
      await this.$store.dispatch('GetCompanyLogoAndName')
    }
  },
  created() {
    this.initiate()
  }
}
</script>
