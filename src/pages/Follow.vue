<template>
<!--follow组件我的关注:-->
  <div class="follow">
    <!-- 头部 -->
    <hm-header>我的关注</hm-header>
    <div class="item" v-for="item in followList" :key="item.id">
      <div class="left">
        <img :src="$axios.defaults.baseURL + item.head_img" alt="">
      </div>
      <div class="center">
        <p class="name">{{item.nickname}}</p>
        <p class="time">{{item.create_date | time}}</p>
      </div>
      <div class="right" @click="unfollow(item.id)">取消关注</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      followList: []
    }
  },
  created () {
    // 获取关注列表
    this.getFollowList()
    // 测试有关注的数据 10010 和 10086 没有时可这样添加数据
    // this.follow(2)
  },
  methods: {
    async getFollowList () {
      // 发送请求,解析状态码和数据后做渲染（接口:用户关注列表）使用10010账号登录才有关注的数据
      const res = await this.$axios.get('/user_follows')
      console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.followList = data
      }
      console.log(this.followList)
    }
  },
  // 取消关注:1.注册点击事件 2.发送ajax请求接口:取消关注 3.重新渲染
  async unfollow (id) {
  // 点击取消弹出对话框 只有点击确定时才会触发 并给用户一个确认框
    try {
      await this.$dialog.confirm({
        title: '提示',
        message: '再次确定是否取消'
      })
      // 发送请求 取消关注用户
      const res = await this.$axios.get(`/user_unfollow/${id}`)
      console.log(res)
      const { statusCode } = res.data
      if (statusCode === 200) {
        this.$toast.success('取关成功')
        // 重新发送请求，获取用户列表
        this.getFollowList()
      }
    } catch {
      this.$toast('取消操作')
    }
  },
  // 关注用户: 1.注册点击事件 2.发送ajax请求接口:关注用户 3.重新渲染
  async follow (id) {
    const res = await this.$axios.get(`/user_follows/${id}`)
    console.log(res)
    const { statusCode } = res.data
    if (statusCode === 200) {
      // 重新发送请求，获取用户列表
      this.getFollowList()
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  border-bottom: 1px solid #ccc;
  display: flex;
  padding: 20px;
  align-items: center;
  .left {
    img {
      width: 40px;
      height: 40px;
      border-radius: 20px;
    }
  }
  .center {
    flex: 1;
    padding-left: 10px;
    .name {
      font-size: 18px;
      color: #000;
    }
    .time {
      color: #999;
      font-size: 14px;
    }
  }
  .right {
    height: 30px;
    line-height: 30px;
    background-color: #ddd;
    padding: 0 10px;
    border-radius: 15px;
    color: #000;
  }
}
</style>
