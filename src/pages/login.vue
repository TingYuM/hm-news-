<template>
<div class="login">
  <div class="close">
    <i class="iconfont iconicon-test"></i>
  </div>
  <div class="logo">
    <i class="iconfont iconnew"></i>
  </div>
  <div class="username">
<!-- <auth-input placeholder="请输入用户名" :value="username" @input="fn"></auth-input> -->
<!-- 上面两句相当于 下面一句v-model="" v-model=""里面包括value(视图变)和input(数据变) -->
    <auth-input placeholder="请输入用户名" v-model="username" :rules="/^1\d{4,10}$/" err-msg="请输入正确格式"></auth-input>
  </div>
  <div class="password">
    <auth-input  type="password" placeholder="请输入密码" v-model="password" :rules="/^\d{3,12}$/" err-msg="请确定格式是否正确"></auth-input>
  </div>
  <div class="btn">
    <hm-button @click="login">登录</hm-button>
  </div>
</div>
</template>

<script>
// 哪里使用在哪里局部引用
import authInput from '../components/Authinput'
import HmButton from '../components/Button'
import axios from 'axios'
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  components: {
    authInput,
    HmButton
  },
  methods: {
    async login () {
      console.log('登录触发')
      // 如果密码和用户名都不输入 后面代码不执行
      if (!this.username || !this.password) return
      // 发送ajax请求
      const res = await axios.post('http://localhost:3000/login', {
        username: this.username,
        password: this.password
      })
      if (res.data.statusCode === 401) {
        alert('用户名或者密码错误')
      } else {
        alert('登录成功')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// scoped原理：
// style加scoped属性 样式只会影响当前组件(当前作用域)
// (1)给当前组件所有的选择器 身上随机生成属性div[data-v-1f24bdc7]  p[]
// (2)给当前组件中模板中所有元素添加一个随机属性 data-v-1f24bdc7
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
}
</style>
