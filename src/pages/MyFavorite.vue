<template>
<!--my-favorite组件我的收藏:-->
  <div class="my-favorite">
    <hm-header>我的收藏</hm-header>
    <!--遍历发送请求ajax获取收藏数据的数据做渲染-->
    <hm-post v-for="item in list" :key="item.id" :post="item"></hm-post>
  </div>
</template>

<script>
import HmPost from '../components/hm-post'
export default {
  components: {
    HmPost
  },
  data () {
    return {
      // 用于存放我的收藏数据
      list: []
    }
  },
  // 只要页面打开就渲染
  created () {
    // 获取我的收藏数据
    this.getFavoriteList()
  },
  methods: {
    // 发送请求ajax获取数据（接口:收藏文章列表）
    async getFavoriteList () {
      const res = await this.$axios.get('/user_star')
      // console.log('获取收藏的文章做渲染', res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        data.forEach(item => {
          // 我的收藏页面的数据中 没有comment_length属性(首页渲染数据中有comment_length) 但是有comments属性。
          item.comment_length = item.comments.length
        })
        this.list = data
      }
      console.log(this.list)
    }
  }
}
</script>
