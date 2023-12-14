import router, { resetRouter } from './router'
// import store from './store'
import storage from 'store'
import store from '@/store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
// import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { i18nRender } from '@/locales'
// import { generatorDynamicRouter } from '@/router/generator-routers'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const allowList = ['/user/login'] // no redirect allowList
const loginRoutePath = '/user/login'
const defaultRoutePath = '/dashboard'

const generateRoutes = async () => {
  await store.dispatch('fetchPermissions')
  await store.dispatch('GenerateRoutes', store.getters.permissions)
  resetRouter()
}

router.beforeEach(async (to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`)
  /* has token */
  const token = storage.get(ACCESS_TOKEN)
  if (token) {
    await generateRoutes()
    if (!store.getters.currentUser) {
      await store.dispatch('api/auth/fetchCurrentUser')
    }
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      next()
    }
  } else {
    if (!allowList.includes(to.path)) {
      next({ path: loginRoutePath })
    }
  }
  next()
  // } else {
  //   if (allowList.includes(to.name)) {
  //     // 在免登录名单，直接进入
  //     next()
  //   } else {
  //     next({ path: loginRoutePath, query: { redirect: to.fullPath } })
  //     NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
  //   }
  // }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
