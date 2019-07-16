import {
  asyncRouterMap,
  constantRouterMap
} from '@/router'
import {
  getAllResourceByRoleId
} from "@/api/management";
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, data) {
  let array = []
  data.forEach((value) => {
    routes.forEach(route => {
      const tmp = {
        ...route
      }
      if (value.url === tmp.meta.url) {
        if (tmp.children) {
          tmp.children = filterAsyncRouter(tmp.children, data)
        }
        array.push(tmp)
      }
    })
  })
  return array
}
// 去重
function duplicateRemoval(dataArray) {
  var uniques = [];
  var stringify = {};
  for (var i = 0; i < dataArray.length; i++) {
    var keys = Object.keys(dataArray[i]);
    keys.sort(function (a, b) {
      return (Number(a) - Number(b));
    });
    var str = '';
    for (var j = 0; j < keys.length; j++) {
      str += JSON.stringify(keys[j]);
      str += JSON.stringify(dataArray[i][keys[j]]);
    }
    if (!stringify.hasOwnProperty(str)) {
      uniques.push(dataArray[i]);
      stringify[str] = true;
    }
  }
  uniques = uniques;
  return uniques;
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    myRoleMenu: [], // 当前用户权限菜单
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_MYROLEMENU: (state, myRoleMenu) => {
      state.myRoleMenu = myRoleMenu
    }
  },
  actions: {
    GenerateRoutes({
      commit
    }, data) {
      let accessedRouters = []
      return new Promise(async (resolve) => {
        let dataArray = []
        const {
          rolesId
        } = data
        //   if (rolesId.includes(1)) {
        //   accessedRouters = asyncRouterMap
        // } else {
        for (let roleId of rolesId) {
          await getAllResourceByRoleId({
            roleId: roleId
          }).then(res => {
            dataArray = [...res.data, ...dataArray]
          })
        }
        
        commit('SET_MYROLEMENU', duplicateRemoval(dataArray))
        // }
        let temp = {} //用于id判断重复
        //遍历c数组，将每个item.id在temp中是否存在值做判断， 
        
        filterAsyncRouter(asyncRouterMap, duplicateRemoval(dataArray)).map((item, index) => {
          if (!temp[item.name]) {
            accessedRouters.push(item);
            temp[item.name] = true
          }
        })
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
