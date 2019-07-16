import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import {
  Message
} from 'element-ui'
import {
  getToken
} from '@/utils/auth' // 验权

const whiteList = ['/login', '/register'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({
        path: '/'
      })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取user_info
          let rolesId = [];
          res.user.sysRoles.forEach((value) => {
            rolesId.push(value.roleId)
          }) // note: roles must be a array! such as: ['editor','develop']
          store.dispatch('GenerateRoutes', {
            rolesId
          }).then(() => { // 根据roles权限生成可访问的路由表
            router.options.routes.forEach((item) => {
              if (item.name === 'Dashboard') {
                for(let value of store.getters.addRouters){
                  if (value.name === 'warn'){
                    item.redirect = '/warn/warnSearch' 
                    next({
                      path: item.redirect
                    })
                    return false
                  }
                  else{
                    item.redirect = store.getters.addRouters[0].path
                    next({
                      path: item.redirect
                    })
                  }
                }
              }
            })
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({
              path: '/'
            })
          })
        })
        next()
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
