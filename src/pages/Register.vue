<template>
<div class="register" @click="$router.go(-1)">
  <div class="close">
    <i class="iconfont iconicon-test"></i>
  </div>
  <div class="logo">
    <i class="iconfont iconnew"></i>
  </div>
  <div class="username">
    <hm-input  placeholder="用户名/手机号" v-model="form.username" :rules="/^1\d{4,10}$/" err-msg="请输入正确格式"></hm-input>
  </div>
  <div class="nickname">
     <hm-input placeholder="昵称" v-model="form.nickname" :rules="/^[\u4e00-\u9fa5]{3,8}$/" err-msg="昵称只能是3-8位的中文哟"></hm-input>
  </div>
  <div class="password">
    <hm-input type="password" placeholder="输入密码" v-model="form.password" :rules="/^\d{3,12}$/" err-msg="请确定格式是否正确"></hm-input>
  </div>
  <div class="register-btn">
    <van-button type="danger" size="large" @click="register">注册</van-button>
  </div>
  <div class="go-register">
    立即<router-link to='/login'>登录</router-link>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: '',
        nickname: ''
      }
    }
  },
  methods: {
    async register () {
      const res = await this.$axios.post('/register', this.form)
      console.log(res)
      if (res.data.statusCode === 400) {
        this.$toast.fail('用户名已存在')
      } else {
        this.$toast.success('注册成功')
        this.$router.push({
          name: 'login',
          params: {
            username: this.form.username,
            password: this.form.password
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// scoped: 作用域， 注意：style一旦加了scoped属性，样式只会影响到当前组件
// scoped原理：
// 1. 给当前组件的所有的选择器 加上一个属性选择  div[data-v-1f24bdc7]  p[]
// 2. 给当前组件中模板中的所有的元素添加一个属性 data-v-1f24bdc7
.register {
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
  .register-btn {
    margin-top: 30px;
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
