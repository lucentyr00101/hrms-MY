import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

Vue.filter('NumberFormat', function (value) {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})

Vue.filter('dayjs', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('time', function (dataStr, pattern = 'HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('calendar', function (dataStr, pattern = 'D MMMM') {
  return moment(dataStr).format(pattern)
})

Vue.filter('momentDefault', function (dataStr, pattern = 'YYYY-MM-DD') {
  return moment(dataStr).format(pattern)
})

Vue.filter('excel', function (dataStr, pattern = 'YYYYMMDDHHmmss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('yesAndNo', function (dataStr) {
  return (dataStr || ['True', 'true'].indexOf(dataStr) > -1) ? 'Yes' : 'No'
})
