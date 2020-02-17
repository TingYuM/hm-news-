// 导入先导js文件 再导入样式文件
import Vue from 'vue'
import App from './App.vue'
// 关联index的路由
import router from './router'
// 伸缩布局先下载yarn add 再导入
import 'lib-flexible'
// 样式初始化及字体图标
import './styles/base.css'
import './styles/iconfont.css'
// 导入通用插件 使用时把axios挂载原型上 所有vue实例都可用
import axios from 'axios'

// 第三方组件库 先终端下载yarn add 再导入import 后使用Vue.use()
// 使用场景较多情况下 引入全局模式导入整个vant-ui组件库 import Vant from 'vant' 再使用Vue.use(Vant)
import HmButton from './components/hm-button.vue'
import HmInput from './components/hm-input.vue'
import HmNav from './components/hm-nav.vue'
import HmHeader from './components/hm-header.vue'
import { Button, Toast, Dialog, Field, RadioGroup, Radio, Cell, CellGroup, Uploader, List, Tab, Tabs, PullRefresh } from 'vant'
import moment from 'moment'
// 使用vant-ui组件库插件 vant内所有组件都为全局的注册
// 设置开发环境或者生产环境 消息提示的环境配置(true/false)
Vue.config.productionTip = false
Vue.use(Button)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(Field)
Vue.use(Radio)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(RadioGroup)
Vue.use(Uploader)
Vue.use(PullRefresh)
Vue.use(List)
Vue.use(Tab)
Vue.use(Tabs)
Vue.component('hm-button', HmButton)
Vue.component('hm-input', HmInput)
Vue.component('hm-nav', HmNav)
Vue.component('HmHeader', HmHeader)

// axios优化挂载Vue原型上
Vue.prototype.$axios = axios
// axios设置默认(基准路径)会自动拼接url参数
axios.defaults.baseURL = 'http://localhost:3000'
// axios配置响应拦截所有的响应(判断token是否失效)
axios.interceptors.response.use(function (response) {
// 在所有的响应请求里做判断状态码是否是401 且提示信息(用户信息验证失败) 就说明token有问题 如有问题跳转login登录页 并删除过期的token信息
  if (response.data.statusCode === 401 && response.data.message === '用户信息验证失败') {
    // 只要token校验失败，也去login
    router.push('/login')
    // 把过期的信息删除
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    // 给一个提示的消息
    Toast.fail('用户信息验证失败')
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
// axios配置请求拦截器(判断浏览器是否有token)config指请求的配置参数 通过config.headers设置请求头
axios.interceptors.request.use(function (config) {
  console.log('拦截到的请求', config)
  // 如有token 就给接口携带上token
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

// 过滤器--》不传时间格式为默认的格式 传时间格式按照时间的格式渲染
Vue.filter('time', function (input, format = 'YYYY-MM-DD') {
  return moment(input).format(format)
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
