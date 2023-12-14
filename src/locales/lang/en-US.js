import antdEnUS from 'ant-design-vue/es/locale-provider/en_US'
import momentEU from 'moment/locale/eu'
import global from './en-US/global'

import menu from './en-US/menu'
import setting from './en-US/setting'
import user from './en-US/user'

import dashboard from './en-US/dashboard'
import form from './en-US/form'
import result from './en-US/result'
import account from './en-US/account'
import table from './en-US/table'
import setup from './en-US/setup'
import notification from './en-US/notification'
import error from './en-US/error'
import messages from './en-US/messages'
import tabs from './en-US/tabs'

const components = {
  antLocale: antdEnUS,
  momentName: 'eu',
  momentLocale: momentEU
}

export default {
  message: '-',
  'layouts.usermenu.dialog.title': 'Message',
  'layouts.usermenu.dialog.content': 'Are you sure you would like to logout?',
  'layouts.userLayout.title': 'Login to your account.',
  ...components,
  ...global,
  ...menu,
  ...setting,
  ...user,
  ...dashboard,
  ...form,
  ...result,
  ...account,
  ...table,
  ...setup,
  ...notification,
  ...error,
  ...setup,
  ...messages,
  ...tabs
}
