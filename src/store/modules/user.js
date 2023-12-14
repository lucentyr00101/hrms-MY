import storage from 'store'
import store from '@/store'
import expirePlugin from 'store/plugins/expire'
import { getCompanyLogoAndName, login, getInfo, refreshToken, logout, fetchPermissions } from '@/api/login'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import { generatePermissions } from '@/utils/generatePermission'

storage.addPlugin(expirePlugin)
const user = {
  state: {
    company_details: JSON.parse(localStorage.getItem('company_details') || '{}'),
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    permissions: []
  },

  getters: {
    getCompanyDetails: (state) => (state.company_details),
    permissions: (state) => (state.permissions)
  },

  mutations: {
    SET_COMPANY_DETAILS: (state, payload = {}) => {
      state.company_details = payload
      localStorage.setItem('company_details', JSON.stringify(payload))
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PERMISSIONS(state, payload) {
      state.permissions = [...payload]
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    GetCompanyLogoAndName ({ commit }) {
      return new Promise((resolve, reject) => {
        getCompanyLogoAndName().then(response => {
          commit('SET_COMPANY_DETAILS', response?.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登录
    RefreshToken ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        refreshToken({ refreshToken: payload }).then(response => {
          const tokenExpiration = new Date().getTime() + (1000 * 60 * 60)
          const refreshTokenExp = new Date().getTime() + (1000 * 60 * 60 * 12)
          storage.set(ACCESS_TOKEN, response.data.accessToken, tokenExpiration)
          storage.set(REFRESH_TOKEN, response.data.refreshToken, refreshTokenExp)
          commit('SET_TOKEN', response.data.accessToken)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    Login ({ commit }, { type = 'default', userInfo }) {
      return new Promise((resolve, reject) => {
        if (type === 'google') {
          const tokenExpiration = new Date().getTime() + (1000 * 60 * 60)
          const refreshTokenExp = new Date().getTime() + (1000 * 60 * 60 * 12)
          storage.set(ACCESS_TOKEN, userInfo.accessToken, tokenExpiration)
          storage.set(REFRESH_TOKEN, userInfo.refreshToken, refreshTokenExp)
          commit('SET_TOKEN', userInfo.accessToken)
          store.dispatch('api/auth/fetchCurrentUser').then(
            (response) => {
              // console.log(response)
              resolve(response)
            }
          ).catch(
            (error) => {
              commit('SET_TOKEN', '')
              commit('SET_ROLES', [])
              storage.clearAll()
              reject(error)
            }
          )
        } else {
          login(userInfo).then(response => {
            const tokenExpiration = new Date().getTime() + (1000 * 60 * 60)
            const refreshTokenExp = new Date().getTime() + (1000 * 60 * 60 * 12)
            storage.set(ACCESS_TOKEN, response.data.accessToken, tokenExpiration)
            storage.set(REFRESH_TOKEN, response.data.refreshToken, refreshTokenExp)
            commit('SET_TOKEN', response.data.accessToken)
            resolve()
          }).catch(error => {
            reject(error)
          })
        }
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.result

          if (result.role && result.role.permissions.length > 0) {
            const role = result.role
            role.permissions = result.role.permissions
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          commit('SET_NAME', { name: result.name, welcome: welcome() })
          commit('SET_AVATAR', result.avatar)

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.clearAll()
          resolve()
        }).catch((err) => {
          console.log('logout fail:', err)
          reject(err)
          // resolve()
        }).finally(() => {
        })
      })
    },
    fetchPermissions({ state, commit }, payload) {
      const token = storage.get(ACCESS_TOKEN) || state.token
      return new Promise((resolve, reject) => {
        fetchPermissions(token)
          .then((response) => {
            commit(
              'SET_ROLES',
              response.data.grantedRoles.map((el) => el.name.toLowerCase())
            )
            commit('SET_PERMISSIONS', generatePermissions(response.data.grantedRoles))
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
}

export default user
