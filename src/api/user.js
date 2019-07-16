import request from '@/utils/request'

// 修改密码
export function updatePassword(data) {
  return request({
    url: '/user/updatePassword',
    method: 'post',
    data
  })
}
// 查询用户列表
export function getUserlist() {
  return request({
    url: '/notice/userlist',
    method: 'post'
  })
}
// 获取当前用户信息
export function getMyInfo() {
  return request({
    url: '/user/online',
    method: 'get'
  })
}
