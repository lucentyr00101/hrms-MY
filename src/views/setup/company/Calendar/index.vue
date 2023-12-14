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
import MasterListCalendar from './MasterList/index'
import RegularCalendar from './Calendar/index'

const tabMenu = [
  {
    title: i18nRender('menu.master-list'),
    component: 'master-list-calendar',
    permission: 'setup_company_calendar_master-list'
  },
  {
    title: i18nRender('menu.calendar'),
    component: 'regular-calendar',
    permission: 'setup_company_calendar_calendar'
  }
]

export default {
  name: 'Calendar',
  components: { MasterListCalendar, RegularCalendar },
  data() {
    return {
      tabMenu,
      activeKey: !this.$store.getters.permissions.includes('setup_company_calendar_master-list') ? 1 : 0
    }
  }
}
</script>
