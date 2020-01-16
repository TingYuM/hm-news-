// 首页的使用全导入
import Vue from 'vue'
// 导入路由
import VueRouter from 'vue-router'
// 导入login页面
import Login from '../pages/login.vue'
// 导入注册页面
import Register from '../pages/Register.vue'
// 使用插件router
Vue.use(VueRouter)
// 配置路由规则
const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register }
  ]
})
// 导出路由
export default router
