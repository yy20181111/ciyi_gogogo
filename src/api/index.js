import axios from 'axios'
import router from '../router/index'
// 创建实例
const service = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  timeout: 5000
})

// 请求拦截
service.interceptors.request.use(
  config => {
   config.headers.Authorization = window.sessionStorage.getItem('admin-token')
    return config
  }, err => {
    console.log(err)
  }
)



// 响应拦截
service.interceptors.response.use(res => {
  return res
}, err => {
  console.log(err)
  router.push('/login')
})

export default service