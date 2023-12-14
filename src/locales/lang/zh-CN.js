import antdZnCN from 'ant-design-vue/es/locale-provider/zh_CN'
import momentCN from 'moment/locale/zh-cn'
import global from './zh-CN/global'

import menu from './zh-CN/menu'
import setting from './zh-CN/setting'
import user from './zh-CN/user'

import dashboard from './zh-CN/dashboard'
import form from './zh-CN/form'
import result from './zh-CN/result'
import account from './zh-CN/account'
import table from './zh-CN/table'
import setup from './zh-CN/setup'
import notification from './zh-CN/notification'
import error from './zh-CN/error'
import messages from './zh-CN/messages'
import tabs from './zh-CN/tabs'

const components = {
  antLocale: antdZnCN,
  momentName: 'zh-cn',
  momentLocale: momentCN
}

export default {
  message: '-',
  'layouts.usermenu.dialog.title': '信息',
  'layouts.usermenu.dialog.content': '您确定要注销吗？',
  'layouts.userLayout.title': '登录到您的账户。',
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
