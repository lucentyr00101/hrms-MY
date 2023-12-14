<template>
  <div>
    <a-card>
      <a-tabs v-model="activeKey">
        <a-tab-pane v-if="$store.getters.permissions.includes(el.permission)" v-for="(el, i) in tabMenu" :key="i">
          <span slot="tab" v-html="el.title"> </span>
          <component :is="el.component" class="tab"></component>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import { i18nRender } from '@/locales'
import ClaimGroup from './ClaimGroup/index'
import ClaimType from './ClaimType.vue'

const tabMenu = [
  {
    title: i18nRender('table.column.claim-type'),
    component: 'claim-type',
    permission: 'setup_company_claim-setup_claim-type'
  },
  {
    title: i18nRender('table.top.claim-group'),
    component: 'claim-group',
    permission: 'setup_company_claim-setup_claim-group'
  }
]

export default {
  name: 'SetupCompanyClaimSetup',
  components: { ClaimGroup, ClaimType },
  data() {
    return {
      tabMenu,
      activeKey: !this.$store.getters.permissions.includes('setup_company_claim-setup_claim-type') ? 1 : 0
    }
  }
}
</script>
