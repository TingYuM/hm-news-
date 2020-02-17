<template>
<!--
  (1) 登录页login.vue 收集用户信息 发送ajax请求
  (2) 封装通用hm-input组件 实现输入框不仅仅要收集数据 要需要表单效验功能
  (3) 封装通用hm-button组件 使用到插槽和一个点击事件
 -->
<div class="login">
  <div class="close" @click="$router.go(-1)">
    <i class="iconfont iconicon-test"></i>
  </div>
  <div class="logo">
    <i class="iconfont iconnew"></i>
  </div>
  <div class="username">
<!-- <hm-input placeholder="请输入用户名" :value="username" @input="fn"></hm-input> -->
<!-- 上面两句相当于,下面一句v-model="" v-model=""里面包括value(视图变)和input(数据变) -->
    <hm-input placeholder="请输入用户名" v-model="username" :rules="/^1\d{4,10}$/" err-msg="请输入正确格式"></hm-input>
  </div>
  <div class="password">
    <hm-input  type="password" placeholder="请输入密码" v-model="password" :rules="/^\d{3,12}$/" err-msg="请确定格式是否正确"></hm-input>
  </div>
  <div class="btn">
    <hm-button @click="login">登录</hm-button>
    <!-- 使用vant-ui组件库先终端yarn add vant 为全局的所有组件库插件 yarn add babel-plugin-import根据需求按序安装具体插件 看文档导入-->
    <!-- <van-button type="warning">警告按钮</van-button> -->
  </div>
  <div class="go-register">
    立即<router-link to="/register">注册</router-link>
  </div>
</div>
</template>

<script>
// 局部引用: 哪里使用 在哪里import 文件名 form '文件路径'  使用在exprot default {对象下component：{写文件名HmButton}} 推荐不通用的场景局部注册
// 全局引用：在main.js通过 import HmButton from '文件路径' 使用 Vue.component('hm-button',HmButton){}  推荐使用场景较多的情况下全局注册
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  created () {
    console.log(this.$route)
    // const { username, password } = this.$route.params
    // this.username = username
    // this.password = password
  },

  methods: {
    async login () {
      console.log('登录触发')
      // 如密码和用户名都不输入 后面代码不执行
      if (!this.username || !this.password) return
      // 发送ajax请求
      const res = await this.$axios.post('login', {
        username: this.username,
        password: this.password
      })
      console.log(res)
      if (res.data.statusCode === 401) {
        this.$toast.fail('用户名或者密码错误')
      } else {
        console.log(res)
        // 跳转之前存储token以及用户的id 只要登录就要展示个人信息把token存浏览器中
        const { token, user } = res.data.data
        localStorage.setItem('token', token)
        localStorage.setItem('user_id', user.id)
        this.$toast.success('登录成功')
        this.$router.push('/profile')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  padding: 20px;
  .close {
    i {
      font-size: 27px;
    }
  }
  .logo {
    text-align: center;
    i {
      font-size: 126px;
      color: #d81e06;
    }
  }
  .btn {
    margin-top: 20px;
  }
  .go-register {
    text-align: center;
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    margin-top: 10px;
  }
}
</style>
