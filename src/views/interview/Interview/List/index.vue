<template>
  <a-card>
    <a-tabs v-model="activeKey">
      <a-tab-pane v-if="$store.getters.permissions.includes(el.permission)" v-for="(el, i) in tabMenu" :key="i">
        <span slot="tab" v-html="el.title">
        </span>
        <component :is="el.component" class="tab"></component>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import { i18nRender } from '@/locales'
import ScheduledInterview from './ScheduledInterview'
import NonScheduledInterview from './NonScheduledInterview'

const tabMenu = [
  {
    title: i18nRender('tab-scheduled-interview'),
    component: 'scheduled-interview',
    permission: 'interview_interview_scheduled-interview'
  },
  {
    title: i18nRender('tab-non-scheduled-interview'),
    component: 'non-scheduled-interview',
    permission: 'interview_interview_non-scheduled-interview'
  }
]

export default {
  name: 'InterviewInterviewList',
  components: {
    ScheduledInterview,
    NonScheduledInterview
  },
  data() {
    return {
      tabMenu,
      activeKey: !this.$store.getters.permissions.includes('interview_interview_scheduled-interview') ? 1 : 0
    }
  }
}
</script>

<style lang="less" scoped>
  .tabs {
    overflow: initial;
  }
</style>
