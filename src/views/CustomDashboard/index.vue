<template>
  <div>
    <user-status />
    <a-tabs v-model="activeKey">
      <a-tab-pane v-if="$store.getters.permissions.includes(el.permission)" v-for="(el, i) in tabMenu" :key="i">
        <span slot="tab" v-html="el.title">
        </span>
        <component :is="el.component" class="tab"></component>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { i18nRender } from '@/locales'
import PersonalDashboard from './personal'
import AdminDashboard from './admin'
import UserStatus from './UserStatus'

const tabMenu = [
  {
    title: i18nRender('table.card.personal'),
    component: 'personal-dashboard',
    permission: 'dashboard_personal'
  },
  {
    title: i18nRender('table.card.administrative'),
    component: 'admin-dashboard',
    permission: 'dashboard_administrative'
  }
]

export default {
  components: { PersonalDashboard, UserStatus, AdminDashboard },
  data () {
    return {
      tabMenu,
      activeKey: !this.$store.getters.permissions.includes('dashboard_personal') ? 1 : 0
    }
  }
}
</script>

<style style="less" scoped>
.ant-tabs >>> .ant-tabs-nav-container {
  margin-top: 20px;
  border-radius: 5px;
}
</style>
