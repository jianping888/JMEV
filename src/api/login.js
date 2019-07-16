import request from '@/utils/request'

export function login(username, password, vcode) {
  return request({
    url: '/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    params: {
      username,
      password,
      vcode
    }
  })
}

export function toRegister(params) {
  return request({
    url: '/user/addUser',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    params
  })
}

export function getInfo(userId) {
  return request({
    url: '/user/detail',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    params: {
      userId:userId
    }
  })
}
export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}
