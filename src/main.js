// 导入先导js文件 再导入样式文件
import Vue from 'vue'
import App from './App.vue'
// 伸缩布局先下载yarn add 再导入
import 'lib-flexible'
// 导入通用样式
import './styles/base.css'
// 导入字体图标
import './styles/iconfont.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
