'use strict'

import moment from 'moment'

const global = {
  data() {
    return {}
  },
  filters: {},
  computed: {
    companyDetails() { return this.$store.getters['getCompanyDetails'] }
    // currentUserDetails() { return this.$store.getters['api/auth/currentUser'] || {} }
  },
  methods: {
    getParent(name) {
      let p = this.$parent
      while (typeof p !== 'undefined') {
        if (p.$options.name === name) {
          return p
        } else {
          p = p.$parent
        }
      }
      return undefined
    },
    generateSelectTreeList(list = []) {
      let treeList = []
      list.forEach((item) => {
        treeList = [
          ...treeList,
          {
            value: item.name,
            label: item.name,
            key: item.id,
            ...((item?.children?.length > 0) ? { children: this.generateSelectTreeList(item.children) } : {})
          }
        ]
      })
      return treeList
    },
    formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
      let formattedDate = date
      if (date && moment(date).isValid()) {
        formattedDate = moment(date).format(format)
      }
      return formattedDate
    }
  }
}

export default global
