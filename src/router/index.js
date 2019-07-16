import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/warn/warnSearch',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },


  // {
  //   path: '*',
  //   redirect: '/404',
  //   hidden: true
  // }
]

export const asyncRouterMap = [
  {
    path: '/warn',
    component: Layout,
    redirect: '/warn/warnSearch',
    name: 'warn',
    meta: {
      title: '故障管理',
      url:'/warn',
      icon: 'example'
    },
    children: [{
        path: 'warnSearch',
        name: 'warnSearch',
        component: () => import('@/views/warn/warnSearch'),
        meta: {
          title: '故障查询',
          url:'/warnquery/list',
        }
      },
      {
        path: 'warnConfig',
        name: 'warnConfig',
        component: () => import('@/views/warn/warnConfig'),
        meta: {
          title: '故障配置',
          url:'/warn/list',
        }
      },
      {
        path: 'warnNotice',
        name: 'warnNotice',
        component: () => import('@/views/warn/warnNotice'),
        meta: {
          title: '故障通知',
          url:'/notice/list'
        }
      },
      {
        path: 'warnList',
        name: 'warnList',
        component: () => import('@/views/warn/warnList'),
        meta: {
          title: '详情统计',
          url:'/warntable/query'
        }
      },
      {
        path: 'warnCount',
        name: 'warnCount',
        component: () => import('@/views/warn/warnCount'),
        meta: {
          title: '故障统计',
          url:'/warntable/bar'
        }
      },
      {
        path: 'processedCount',
        name: 'processedCount',
        component: () => import('@/views/warn/processedCount'),
        meta: {
          title: '处理统计',
          url:'/warnDispose'
        }
      }
    ]
  },
  {
    path: '/basic',
    component: Layout,
    redirect: '/basic/tbox',
    name: 'basic',
    meta: {
      title: '基础数据管理',
      url:'/basic',
      icon: 'component'
    },
    children: [{
        path: 'tbox',
        name: 'tbox',
        component: () => import('@/views/basic/tbox'),
        meta: {
          title: '终端管理',
          url:'/basic/tbox',
          icon: ''
        }
      },
      {
        path: 'license',
        name: 'license',
        component: () => import('@/views/basic/license'),
        meta: {
          title: '车牌信息',
          url:'/licence/toLicence',
          icon: ''
        }
      },
      {
        path: 'employe',
        name: 'employe',
        component: () => import('@/views/basic/employe'),
        meta: {
          title: '单位管理',
          url: "/employe/toEmploye",
          icon: ''
        }
      },
      {
        path: 'carModule',
        name: 'carModule',
        component: () => import('@/views/basic/carModule'),
        meta: {
          title: '车型管理',
          url: "/parameter/toParameter",
          icon: ''
        }
      },
      {
        path: 'carInfo',
        name: 'carInfo',
        component: () => import('@/views/basic/carInfo'),
        meta: {
          title: '车辆管理',
          url: "/vehicle/toVehicle",
          icon: ''
        }
      },
      {
        path: 'movecar',
        name: 'movecar',
        component: () => import('@/views/basic/movecar'),
        meta: {
          title: '国标查询',
          url: "/movethecar/queryPage",
          icon: ''
        }
      },
      {
        path: 'certificate',
        name: 'certificate',
        component: () => import('@/views/basic/certificate'),
        meta: {
          title: '合格证查询',
          url: "/certificate/toCertificate",
          icon: ''
        }
      },
      {
        path: 'province',
        name: 'province',
        component: () => import('@/views/basic/province'),
        meta: {
          title: '省份查询',
          url: "/province/queryProvince",
          icon: ''
        }
      },{
        path: 'flow',
        name: 'flow',
        component: () => import('@/views/basic/flow'),
        meta: {
          title: '流量卡查询',
          url: "/chinamobile/getVehicleAccountGPRS",
          icon: ''
        }
      },{
        path: 'basicSeries',
        name: 'basicSeries',
        component: () => import('@/views/basic/basicSeries'),
        meta: {
          title: '静态字段管理',
          url: "/basicseries/toBasicSeries",
          icon: ''
        }
      },{
        path: 'exportTemplate',
        name: 'exportTemplate',
        component: () => import('@/views/basic/exportTemplate'),
        meta: {
          title: '导出模板管理',
          url: "/exportTemplate/toExportTemplate",
          icon: ''
        }
      }

    ]
  },
  {
    path: '/monitoring',
    component: Layout,
    redirect: '/monitoring/index',
    name: 'monitoring',
    meta: {
      title: '报文查询',
      url: "/monitoring",
      icon: 'example'
    },
    children: [{
      path: 'index',
      name: 'monitoringIndex',
      component: () => import('@/views/monitoring/index'),
      meta: {
        title: '报文查询',
        url: "/monitoring",
        icon: 'table'
      }
    }]
  },
  {
    path: '/management',
    component: Layout,
    redirect: '/management/role',
    name: 'management',
    meta: {
      title: '账户权限管理',
      url: "/sys",
      icon: 'user'
    },
    children: [{
        path: 'role',
        name: 'role',
        component: () => import('@/views/management/role'),
        meta: {
          title: '角色管理',
          url: "/role/toRole",
          icon: ''
        }
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/management/user'),
        meta: {
          title: '用户管理',
          url:'/user/list',
          icon: ''
        }
      },
      {
        path: 'resource',
        name: 'resource',
        component: () => import('@/views/management/resource'),
        meta: {
          title: '菜单管理',
          url:'/resource/toResource',
          icon: ''
        }
      },
      {
        path: 'vehicleGroup',
        name: 'vehicleGroup',
        component: () => import('@/views/management/vehicleGroup'),
        meta: {
          title: '车组管理',
          url: "/carSign",
          icon: ''
        }
      }
    ]
  },
  // {
  //   path: '*',
  //   redirect: '/404',
  //   hidden: true
  // }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
