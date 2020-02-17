
<template>
<!--
  (1)个人中心 profile 发送ajax请求 获取个人详细信息 进行渲染到页面(头像 昵称 日期 等)
  (2)个人详细信息 发送请求时 要携带token 通过token后台才能验证用户信息的身份
    1. 登录成功时 把token和user_id用户的id存到localStorage中
    2. 对于要登录的接口(也就是要token的接口) 要通过headers中的Authorization携带token
    3. profile个人中心，发请求时加headers请求头,请求头中携带token和user_id 这样就可以拿到个人信息后存到profile里 通过插值表达式{{}}把昵称 性别.. 渲染出来
-->
 <div class="profile">
   <div class="user-info"  @click="$router.push('/EditProfile')">
     <div class="avatar">
       <!--两种解决方案 计算属性 或 使用v-if-->
       <img v-show="loading" :src="avatar"  alt="">
       <!-- <img v-if="profile.head_img" :src="$axios.defaults.baseURL + profile.head_img" alt="">
       <img v-else src="../assets/avatar.jpg" alt=""> -->
     </div>
     <div class="info">
       <p>
          <i v-if="profile.gender === 1" class="iconfont iconxingbienan"></i>
          <i v-else class="iconfont iconxingbienv"></i>
          <span>{{profile.nickname}}</span>
       </p>
       <p>{{profile.create_date | time}}</p>
     </div>
     <div class="icon">
       <i class="iconfont iconjiantou1"></i>
     </div>
   </div>
   <div class="list">
    <hm-nav name="我的关注" desc="关注的用户" @click="$router.push('/follow')"></hm-nav>
    <hm-nav name="我的跟帖" desc="跟帖/回复" @click="$router.push('/my-comments')"></hm-nav>
    <hm-nav name="我的收藏" desc="文章/视频" @click="$router.push('/my-favorite')"></hm-nav>
    <hm-nav name="设置" @click="$router.push('/EditProfile')"></hm-nav>
    <hm-nav name="退出登录" @click="logout"></hm-nav>
   </div>
 </div>
</template>

<script>
import img from '../assets/avatar.jpg'
export default {
  computed: {
    avatar () {
      if (this.profile.head_img) {
        return this.$axios.defaults.baseURL + this.profile.head_img
      } else {
        return img
      }
    }
  },
  data () {
    return {
      profile: {},
      loading: false
    }
  },
  async created () {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('user_id')
    const res = await this.$axios.get(`/user/${userId}`, {
      headers: {
        Authorization: token
      }
    })
    console.log(res)
    this.profile = res.data.data
    this.loading = true
    console.log(this.profile)
  },
  methods: {
    async logout () {
      // aysnc与await await只会等成功结果，如果promise失败了，会抛出异常
      // try .. catch 把报错代码丢到try中，try中代码报错就走catch，如try中代码不报错catch就不执行 e则是错误信息
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '你确定要退出本系统吗?'
        })
        // 点击确定 删除token信息
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        // 跳转到登录页面
        this.$router.push('/login')
        // 给一个提示消息
        this.$toast.success('退出成功')
      } catch {
        // console.log('点击了取消')
        this.$toast('操作取消')
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.profile {
  .user-info {
    padding: 20px;
    display: flex;
    border-bottom: 5px solid #ccc;
    .avatar {
      width: 70px;
      height: 70px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .icon {
      width: 30px;
      i {
        line-height: 70px;
      }
    }
    .info {
      flex: 1;
      margin-left: 10px;
      p:first-child {
        height: 30px;
        line-height: 30px;
        font-size: 18px;
        color: #000;
      }

      p:last-child {
        font-size: 14px;
        color: #999;
      }
      .iconxingbienan {
        color: rgb(171, 213, 242);
      }
      .iconxingbienv {
        color: pink;
      }
    }
  }
  .list {
    padding: 0 20px;
  }
}
</style>
