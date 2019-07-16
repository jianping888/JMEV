import axios from 'axios'
import {
  Message,
  MessageBox
} from 'element-ui'
import store from '../store'
import {
  getToken
} from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 40000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
      Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非200是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res && res.code != 200 && res.code !== 10001 && res.code) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })

      //401:没有权限;
      if (res.code === 403 || res.code === 401) {
        MessageBox.alert(
          '你已被登出,请重新登录',
          '确定登出', {
            confirmButtonText: '确定',
            type: 'warning',
            callback: action => {
              store.dispatch('FedLogOut').then(() => {
                location.reload() // 为了重新实例化vue-router对象 避免bug
              })
            }
          }
        )
      }
      return Promise.reject(response)
    } else {
      return response.data
    }
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          Message({ message: '请求错误(400)', type: 'error',duration: 5 * 1000})
          break;
        case 401:
          Message({ message: '未授权，请重新登录(401)', type: 'error',duration: 5 * 1000})
          break;
        case 403:
          Message({ message: '拒绝访问(403)', type: 'error',duration: 5 * 1000})
          break;
        case 404:
          Message({ message: '请求出错(404)', type: 'error',duration: 5 * 1000})
          break;
        case 408:
          Message({ message: '请求超时(408)', type: 'error',duration: 5 * 1000})
          break;
        case 500:
          Message({ message: '服务器错误(500)', type: 'error',duration: 5 * 1000})
          break;
        case 501:
          Message({ message: '服务未实现(501)', type: 'error',duration: 5 * 1000})
          break;
        case 502:
          Message({ message: '网络错误(502)', type: 'error',duration: 5 * 1000})
          break;
        case 503:
          Message({ message: '服务不可用(503)', type: 'error',duration: 5 * 1000})
          break;
        case 504:
          Message({ message: '网络超时(504)', type: 'error',duration: 5 * 1000})
          break;
        case 505:
          Message({ message: 'HTTP版本不受支持(505)', type: 'error',duration: 5 * 1000})
          break;
        default:
          Message({ message: '连接出错!('+err.response.status+')', type: 'error',duration: 5 * 1000})
      }
    } else {
      Message({ message: error.msg, type: 'error',duration: 5 * 1000})
    }
    return Promise.reject(error)
  }
)

export default service
