<template>
  <div>
    <a-card>
      <a-tabs v-model="activeKey">
        <a-tab-pane v-if="$store.getters.permissions.includes(el.permission)" v-for="(el, i) in tabMenu" :key="i">
          <span slot="tab" v-html="el.title">
          </span>
          <component :is="el.component" class="tab"></component>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import LeaveGroup from './LeaveGroup.vue'
import LeaveType from './LeaveType.vue'

const tabMenu = [
  {
    title: 'Leave Type',
    component: 'leave-type',
    permission: 'setup_company_leave-setup_leave-type'
  },
  {
    title: 'Leave Group',
    component: 'leave-group',
    permission: 'setup_company_leave-setup_leave-group'
  }
]

export default {
  name: 'LeaveSetup',
  components: { LeaveGroup, LeaveType },
  data () {
    return {
      tabMenu,
      activeKey: !this.$store.getters.permissions.includes('setup_company_leave-setup_leave-type') ? 1 : 0
    }
  }
}
</script>
