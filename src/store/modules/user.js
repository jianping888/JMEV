import { login, logout } from '@/api/login'
import { getMyInfo } from "@/api/user";
import { getRoleList} from "@/api/management";
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    rolesList:[]
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROLES_LIST: (state, rolesList) => {
      state.rolesList = rolesList
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password, userInfo.vcode).then(response => {
          const data = response.data
          setToken('38')
          commit('SET_TOKEN', '38')
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取当前用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getMyInfo().then(response => {
          const data = response
          if (data.user.sysRoles && data.user.sysRoles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.user.sysRoles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.user.username)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    
    // 获取角色列表
    GetRoleList({commit},query){
      return new Promise((resolve,reject)=>{
        getRoleList(query).then(res=>{
          commit('SET_ROLES_LIST',res.pageInfo.list);
          resolve(res)
        }).catch(error=>{
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },
    
    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user
