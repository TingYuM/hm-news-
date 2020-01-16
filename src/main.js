// 导入先导js文件 再导入样式文件
import Vue from 'vue'
import App from './App.vue'
// 关联index的路由
import router from './router'
// 伸缩布局先下载yarn add 再导入
import 'lib-flexible'
// // 先终端下载 yarn add Vant 再导入插件后导入插件依赖样式包
// import Vant from 'vant'
// improt 'vant/lib/index.css'
// 导入通用样式
import './styles/base.css'
// 导入字体图标
import './styles/iconfont.css'
// 使用vant中的ui组件库插件 内部vant所有组件都会注册
// Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
