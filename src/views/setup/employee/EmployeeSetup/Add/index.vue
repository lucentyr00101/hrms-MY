<template>
  <a-card>
    <a-tabs @change="callback" v-model="activeKey">
      <a-tab-pane v-if="$store.getters.permissions.includes(el.permission)" v-for="(el, i) in tabMenu" :key="i">
        <span slot="tab" v-html="el.title">
        </span>
        <component :is="el.component" @titleIcon="titleIcon" :editable="false" class="tab"></component>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import { i18nRender } from '@/locales'
import EmployeeInformation from '../EmployeeInformation.vue'
import PayrollInformation from '../PayrollInformation/index.vue'
import WorkInformation from '../WorkInformation.vue'
import Deduction from '../Deduction.vue'
import Allowance from '../Allowance.vue'
import Resignation from '../Resignation.vue'
import { employeeSetupMixin } from '@/store/app-mixin'

const tabMenu = [
  {
    title: i18nRender('setup.employee.employee-information'),
    pathname: 'setup-employee-employee-setup-add-employee-information',
    component: 'employee-information',
    permission: 'setup_employee_employee-setup_view-edit-general-information'
  },
  {
    title: i18nRender('setup.employee.work-information'),
    pathname: 'setup-employee-employee-setup-add-work-information',
    component: 'work-information',
    permission: 'setup_employee_employee-setup_view-edit-work-information'
  },
  {
    title: i18nRender('setup.employee.payroll-information'),
    pathname: 'setup-employee-employee-setup-add-payroll-information',
    component: 'payroll-information',
    permission: 'setup_employee_employee-setup_view-edit-payroll-information'
  },
  {
    title: i18nRender('setup.employee.allowance'),
    pathname: 'setup-employee-employee-setup-add-allowance',
    component: 'allowance',
    permission: 'setup_employee_employee-setup_view-edit-allowance'
  },
  {
    title: i18nRender('setup.employee.deduction'),
    pathname: 'setup-employee-employee-setup-add-deduction',
    component: 'deduction',
    permission: 'setup_employee_employee-setup_view-edit-deduction'
  },
  {
    title: i18nRender('setup.employee.resignation'),
    pathname: 'setup-employee-employee-setup-add-resignation',
    component: 'resignation',
    permission: 'setup_employee_employee-setup_resignation'
  }
]

export default {
  components: { EmployeeInformation, PayrollInformation, Deduction, Resignation, Allowance, WorkInformation },
  name: 'EmployeeSetupAdd',
  mixins: [employeeSetupMixin],

  props: {
    status: { type: String, default: '' }
  },
  data () {
    return {
      tabMenu,
      activeKey: 0
    }
  },
  methods: {
    titleIcon () {
      this.addIcon = `&nbsp<img src="/icons/warning-icon.svg"/>`
      // this.tabMenu.forEach((item) => {
      //   // handle employee null
      //   if (this.employeeId) {
      //     if (item.component === 'work-information') {
      //       if (item.title !== `Work Information&nbsp<img src="/icons/warning-icon.svg"/>`) {
      //         item.title += this.addIcon
      //       }
      //     }
      //   }
      // })
    },
    callback (val) {
      this.$router.push({ name: tabMenu[val].pathname })
    }
  },
  watch: {
    $route (to, from) {
      this.activeKey = tabMenu.findIndex((el) => el.pathname === to.name)
    }
  },
  created () {
      this.activeKey = tabMenu.findIndex((el) => el.pathname === this.$route.name)
      console.log(this.$route.params.length > 0)
      this.titleIcon()
    }
  }

</script>

<style scoped>
.ant-card >>> .ant-card-body {
  padding-top: 0px;
}
</style>
