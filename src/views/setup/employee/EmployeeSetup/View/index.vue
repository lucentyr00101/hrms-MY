<template>
  <a-card>
    <a-tabs @change="callback" v-model="activeKey">
      <a-tab-pane v-if="$store.getters.permissions.includes(el.permission)" v-for="(el, i) in tabMenu" :key="i" >
        <span slot="tab" v-html="el.title">
        </span>
        <component
          :is="el.component"
          @titleIcon="titleIcon"
          :editable="getEditable()"
          @handleEditable="handleEditable"
          class="tab"></component>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script scoped>
import EmployeeInformation from '../EmployeeInformation.vue'
import PayrollInformation from '../PayrollInformation/index.vue'
import WorkInformation from '../WorkInformation.vue'
import Deduction from '../Deduction.vue'
import Allowance from '../Allowance.vue'
import Resignation from '../Resignation.vue'
import { employeeSetupMixin } from '@/store/app-mixin'

export default {
  name: 'EmployeeSetupView',
  mixins: [employeeSetupMixin],
  data () {
    return {
      activeKey: 0,
      editable: true,
      tabMenu: [
        {
          title: this.$t('setup.employee.employee-information'),
          pathname: 'setup-employee-employee-setup-view-employee-information',
          component: 'employee-information',
          permission: 'setup_employee_employee-setup_view-edit-general-information'
        },
        {
          title: this.$t('setup.employee.work-information'),
          pathname: 'setup-employee-employee-setup-view-work-information',
          component: 'work-information',
          permission: 'setup_employee_employee-setup_view-edit-work-information'
        },
        {
          title: this.$t('setup.employee.payroll-information'),
          pathname: 'setup-employee-employee-setup-view-payroll-information',
          component: 'payroll-information',
          permission: 'setup_employee_employee-setup_view-edit-payroll-information'
        },
        {
          title: this.$t('setup.employee.allowance'),
          pathname: 'setup-employee-employee-setup-view-allowance',
          component: 'allowance',
          permission: 'setup_employee_employee-setup_view-edit-allowance'
        },
        {
          title: this.$t('setup.employee.deduction'),
          pathname: 'setup-employee-employee-setup-view-deduction',
          component: 'deduction',
          permission: 'setup_employee_employee-setup_view-edit-deduction'
        },
        {
          title: this.$t('setup.employee.resignation'),
          pathname: 'setup-employee-employee-setup-view-resignation',
          component: 'resignation',
          permission: 'setup_employee_employee-setup_resignation'
        }
      ],
      employeData: null
    }
  },
  components: { EmployeeInformation, PayrollInformation, Deduction, Resignation, Allowance, WorkInformation },
  methods: {
    titleIcon () {
      this.object = this.getEmployeeSetup(this.employeeId)
      console.log('all', this.employeeId)

      this.addIcon = `&nbsp<img src="/icons/warning-icon.svg"/>`
      if (this.object instanceof Promise) {
        this.object.then(all => {
          this.tabMenu.forEach((item) => {
            // handle null
            if (all.data.employeeSetupWorkInfoResponse === null) {
              if (item.component === 'work-information') {
                if (item.title !== `Work Information&nbsp<img src="/icons/warning-icon.svg"/>`) {
                  item.title += this.addIcon
                }
              }
            }
            // handle not null
            if (all.data.employeeSetupWorkInfoResponse !== null) {
              if (item.component === 'work-information') {
                if (item.title === `Work Information&nbsp<img src="/icons/warning-icon.svg"/>`) {
                 item.title = ''
                 item.title = 'Work Information'
                }
              }
            }
            if (item.component === 'payroll-information') {
              item.title = this.$t('setup.employee.payroll-information')
              if (!all.employee_setup_payroll_info && !all.data?.employeeSetupPayrollResponse) {
                item.title += this.addIcon
              }
            }
          })
        })
      }
    },
    callback (val) {
      const { id } = this.$route.params
      this.$router.push({ name: this.tabMenu[val].pathname, params: { id } })
    },
    getEditable () {
      return this.editable
    },
    handleEditable () {
      this.editable = !this.editable
    }
  },
  props: {
  },
  watch: {
    $route (to, from) {
      this.activeKey = this.tabMenu.findIndex((el) => el.pathname === to.name)
    }
  },
  created () {
    this.activeKey = this.tabMenu.findIndex((el) => el.pathname === this.$route.name)
    this.titleIcon()
  }
}
</script>
