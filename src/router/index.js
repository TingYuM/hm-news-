// 所有使用全导入
import Vue from 'vue'
// 导入路由
import VueRouter from 'vue-router'
// 导入login页面
import Login from '../pages/login.vue'
// 导入注册页面
import Register from '../pages/Register.vue'
// 先建组件 再导import 后配路由
import Profile from '../pages/profile.vue'
import EditProfile from '../pages/EditProfile.vue'
import Follow from '../pages/Follow.vue'
import MyComments from '../pages/MyComments.vue'
import MyFavorite from '../pages/MyFavorite.vue'
import Home from '../pages/Home.vue'
import PostDetail from '../pages/PostDetail.vue'
// 第三方组件库 先下yarn add 再导import 后使用Vue.use()
Vue.use(VueRouter)
// 配置路由规则
const router = new VueRouter({
  routes: [
    { path: '/', component: Home, name: 'home' },
    { path: '/login', component: Login, name: 'login' },
    { path: '/register', component: Register, name: 'register' },
    { path: '/profile', component: Profile, name: 'profile' },
    { path: '/EditProfile', component: EditProfile, name: 'EditProfile' },
    { path: '/follow', component: Follow, name: 'follow' },
    { path: '/my-comments', component: MyComments, name: 'my-comments' },
    { path: '/my-favorite', component: MyFavorite, name: 'my-favorite' },
    // 获取某个文章详情(每篇文章都有id值标识) 动态路由参数
    { path: '/post-detail/:id', component: PostDetail, name: 'post-detail' }
  ]
})

// --------------- -------------配置导航守卫拦截未登录的用户 (步骤)
// (1)授权的路径 以下是需要登录后才可访问数据
const AuthUrls = [
  '/profile',
  '/edit-profile',
  '/follow',
  '/my-comments',
  '/my-favorite'
]
// (2)路由对象注册前置导航守卫
// 1: to到哪里去 2: from从哪里来 3: next是一个函数 4: next()放行(哪里来回哪里去) 5:next('/login')指定必去路径
router.beforeEach(function (to, from, next) {
  console.log('to从哪个路径来', to)
  console.log('form到哪个页面来', from)
  const token = localStorage.getItem('token')
  // 1.先判断要去的页面to的路径是否是要登录的页面,如果includes包含在里面再判断是否有token 有就next放行 没有就去登录
  // 1.要去个人中心 先判断是否登录，有token说明已登录，没有token跳到登录 不去个人中心 不做判断 直接跳 （如是假token在main.js响应拦截中还是跳登录页面）
  if (AuthUrls.includes(to.path)) { // AuthUrls.includes判断数组里是否包含某个值
    if (token) {
      next()
    } else {
      // 使用next('login') 方式跳转 如从首页'/'跳转到个人中心'/profile'页面 发现没有token会跳转到login登录页 由于路由配置next('login')页面会有报错 解决:使用router.push('login')
      router.push('login')
    }
  } else {
    next()
  }
})
// 导出路由
export default router
