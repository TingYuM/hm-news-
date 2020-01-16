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

// vant-ui插件库 先终点打开下载yarn add vant 再导入
// import Vant from 'vant'
// import 'vant/lib/index.css'

// 封装组件框 使用场景较多情况下 引入全局模式
import HmButton from './components/hm-button.vue'
import HmInput from './components/hm-input.vue'
import { Button, Toast } from 'vant'

// 使用vant-ui组件库插件 vant内所有组件都为全局的注册
// Vue.use(Vant)
Vue.use(Button)
Vue.use(Toast)

Vue.component('hm-button', HmButton)
Vue.component('hm-input', HmInput)
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
