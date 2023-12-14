<template>
  <a-month-picker v-model="monthValue" class="app-month-picker" dropdown-class-name="app-month-picker" format="MMMM" :placeholder="placeholder" @openChange="checkSelected"/>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'AppMonthPicker',
    model: {
      prop: 'value',
      event: 'select'
    },
    props: {
      value: { type: Object, default: null, required: false },
      placeholder: { type: String, default: 'Select Month', required: false }
    },
    data() {
      return {
        month: (!/null|undefined/ig.test(this.value?.date)) ? moment(this.value.date) : null
      }
    },
    computed: {
      monthValue: {
        get() { return this.month },
        set(newValue) {
          // console.log(newValue)
          this.month = newValue
          this.checkSelected()
          this.$emit('select', (this.month) ? { date: this.month, month: this.month.format('MMMM'), year: this.month.format('YYYY') } : null)
        }
      }
    },
    watch: {
      value(to) {
        this.month = (!/null|undefined/ig.test(to?.date)) ? moment(to.date) : null
      }
    },
    methods: {
      checkSelected() {
        setTimeout(() => {
          const selected = document.querySelector('.app-month-picker .ant-calendar-month-panel-selected-cell')
          if (!this.month && selected) { // Remove Initial Selected Month
            selected.classList.remove('ant-calendar-month-panel-selected-cell')
            selected.children[0].style.cssText = 'transition: none;'
            setTimeout(() => { selected.children[0].style.cssText = '' })
          }
        })
      }
    }
  }
</script>

<style>
  .app-month-picker .ant-calendar-month-panel-header {
    display: none;
  }
</style>
