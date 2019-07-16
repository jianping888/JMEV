import request from '@/utils/request'

// 查询报文列表
export function getMonitoringList(params) {
  return request({
    url: '/MongoController/searchMsg',
    method: 'post',
    headers: {
      'Content-type': "application/x-www-form-urlencoded; charset=UTF-8"
    },
    params
  })
}