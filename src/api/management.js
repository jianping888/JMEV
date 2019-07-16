import request from '@/utils/request'

// 查询角色管理表
export function getRoleList(data) {
  return request({
    url: '/role/queryPageRole',
    method: 'post',
    data
  })
}
//删除询角色
export function deleteRole(data) {
  return request({
    url: '/role/deleteRole',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    params:data
  })
}
//删除用户
export function deleteUser(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    params:data
  })
}
//查询用户列表
export function getUserListdata(data) {
  return request({
    url: '/user/listdata',
    method: 'post',
    data
  })
}

//查询菜单信息
export function getResourceList(data) {
  return request({
    url: '/resource/queryPageResource',
    method: 'post',
    data
  })
}

//查询车组信息
export function getVehicleGroup(data) {
  return request({
    url: '/vehicleGroup/query',
    method: 'post',
    data
  })
}

//查询角色菜单
export function getAllResource() {
  return request({
    url: '/resource/queryAllResource',
    method: 'post'
  })
}

//获取指定角色菜单
export function getAllResourceByRoleId(data) {
  return request({
    url: '/resource/queryAllResourceByRoleId',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    params:data
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/role/addRole',
    method: 'post',
    data
  })
}
// 修改角色
export function editRole(data) {
  return request({
    url: '/role/updateRole',
    method: 'post',
    data
  })
}


// 新增用户
export function addUser(data) {
  return request({
    url: '/user/save',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    params:data
  })
}
// 修改用户
export function editUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    params:data
  })
}

// 新增菜单
export function addResource(data) {
  return request({
    url: '/resource/addResource',
    method: 'post',
    data
  })
}
// 修改菜单
export function editResource(data) {
  return request({
    url: '/resource/updateResource',
    method: 'post',
    data
  })
}
//删除菜单
export function deleteResource(data) {
  return request({
    url: '/resource/deleteResource',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    params:data
  })
}

// 新增车组
export function addVehicleGroup(data) {
  return request({
    url: '/vehicleGroup/add',
    method: 'post',
    data
  })
}
// 修改车组
export function editVehicleGroup(data) {
  return request({
    url: '/vehicleGroup/update',
    method: 'post',
    data
  })
}
//删除车组
export function deleteVehicleGroup(data) {
  return request({
    url: '/vehicleGroup/delete',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    params:data
  })
}
// 查询已分配成员
export function getUserGroupByGid(params) {
  return request({
    url: '/vehicleGroup/queryUserGroupByGid',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    params
  })
}
// 查询未分配成员
export function getNoGroupUser(params) {
  return request({
    url: '/vehicleGroup/queryNoGroupUser',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    params
  })
}
// 查询已分配车辆
export function getGroupVehicle(data) {
  return request({
    url: '/vehicleGroup/getGroupVehicle',
    method: 'post',
    data
  })
}
// 查询未分配车辆
export function getNoGroupVehicle(data) {
  return request({
    url: '/vehicleGroup/queryNoGroupVehicle',
    method: 'post',
    data
  })
}
// 分配成员
export function addVehicleGroupUser(data) {
  return request({
    url: '/vehicleGroup/addVehicleGroupUser',
    method: 'post',
    data
  })
}
// 移除成员
export function removeGroupUser(data) {
  return request({
    url: '/vehicleGroup/removeGroupUser',
    method: 'post',
    data
  })
}
// 分配车辆
export function addGroupVehicle(data) {
  return request({
    url: '/vehicleGroup/addGroupVehicle',
    method: 'post',
    data
  })
}
// 移除车辆
export function removeGroupVehicle(data) {
  return request({
    url: '/vehicleGroup/removeGroupVehicle',
    method: 'post',
    data
  })
}
// 上传导入车辆
export function uploadVehicleGroup(data) {
  return request({
    url: '/vehicleGroup/importByVin',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  })
}