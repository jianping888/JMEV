import request from '@/utils/request'

// 查询故障列表
export function getList(data) {
  return request({
    url: '/warnquery/listdata',
    method: 'post',
    data
  })
}
// 查询所有车型
export function getCarModel() {
  return request({
    url: '/warntable/queryModel',
    method: 'post'
  })
}
//查询所有分组
export function getGroupList() {
  return request({
    url: '/vehicleGroup/grouplist',
    method: 'post'
  })
}
// 查询报警项
export function getWarnTypeList() {
  return request({
    url: '/warn/listall',
    method: 'post'
  })
}
// 查询故障配置列表
export function getInstallList(data) {
  return request({
    url: '/warn/listdata',
    method: 'post',
    data
  })
}
// 查询故障通知列表
export function getNoticeList(data) {
  return request({
    url: '/notice/listdata',
    method: 'post',
    data
  })
}
// 查询详情统计列表
export function getDetailList(data) {
  return request({
    url: '/warntable/query',
    method: 'post',
    data
  })
}
// 查询故障统计列表
export function getWarnCount(data) {
  return request({
    url: '/warntable/bar',
    method: 'post',
    data
  })
}
// 查询故障处理统计列表
export function getProcessedCount(data) {
  return request({
    url: '/warnDispose/bar',
    method: 'post',
    data
  })
}
// 故障处理
export function disposeSave(data) {
  return request({
    url: '/warnquery/disposeSave',
    method: 'post',
    data
  })
}
// 批量故障处理
export function disposeSaveAll(data) {
  return request({
    url: '/warnquery/disposeSaveAll',
    headers: {
      'Content-type': "application/x-www-form-urlencoded; charset=UTF-8"
    },
    method: 'post',
    params:data
  })
}
//导入故障处理结果
export function uploadDispose(data) {
  return request({
    url: '/warnquery/disposeImp',
    data,
    method: 'post',
    headers: {
      'Content-type': "multipart/form-data"
    }
    
  })
}
// 新增故障配置
export function addConfig(data) {
  return request({
    url: '/warn/save',
    method: 'post',
    data
  })
}
// 删除故障配置
export function deleteConfig(data) {
  return request({
    url: '/warn/delete',
    headers: {
      'Content-type': "application/x-www-form-urlencoded; charset=UTF-8"
    },
    method: 'post',
    params:data
  })
}
// 修改故障配置
export function editConfig(data) {
  return request({
    url: '/warn/update',
    method: 'post',
    data
  })
}
// 增加故障通知策略
export function addNotice(data) {
  return request({
    url: '/notice/save',
    method: 'post',
    data
  })
}
// 修改故障通知策略
export function editNotice(data) {
  return request({
    url: '/notice/update',
    method: 'post',
    data
  })
}
// 删除故障通知策略
export function deleteNotice(data) {
  return request({
    url: '/notice/delete',
    method: 'post',
    headers: {
      'Content-type': "application/x-www-form-urlencoded; charset=UTF-8"
    },
    params:data
  })
}
// 查询故障处理意见
export function disposeDetail(data) {
  return request({
    url: '/warnquery/disposeDetail',
    method: 'post',
    headers: {
      'Content-type': "application/x-www-form-urlencoded; charset=UTF-8"
    },
    params:data
  })
}
// 省份查询
export function getProvinceAll(data) {
  return request({
    url: '/province/listall',
    method: 'post',
    data
  })
}
