<template>
      <!--hm-comment评论组件包裹楼层hm-floor组件,楼层组件有parent时就渲染,没有parent表示没有回复则不渲染 -->
      <!-- 精彩跟帖 新闻详情都要使用,把需要渲染的评论的数据传递给评论组件 -->
  <div class="hm-comment">
    <div class="title">
      <!--精彩跟帖头像:渲染头像数据是绝对路径需拼接上域名 main.js中的基准路径-->
      <img :src="$axios.defaults.baseURL + comment.user.head_img" alt="">
      <div class="info">
        <div class="name">{{comment.user.nickname}}</div>
        <div class="time">{{comment.create_date | time('YYYY-MM-DD HH:mm:ss')}}</div>
      </div>
      <!--组件通讯子传父 点击回复传id-->
      <div class="reply" @click="reply(comment.id)">回复</div>
    </div>
    <!-- 渲染楼层数据(hm-comment评论组件中有回复评论时就渲染楼层组件)评论数据有parent则渲染楼层数据-->
    <hm-floor :index="index" v-if="comment.parent" :comment="comment.parent"></hm-floor>
    <div class="content">{{comment.content}}</div>
  </div>
</template>

<script>
// 递归楼层组件  评论hm-comment父组件有评论时则渲染楼层组件
import HmFloor from './hm-floor'
// 在hm-commemnt评论组件中确定数字 数字表示当前评论总共有多少个楼层
export default {
  data () {
    return {
      // getCommentLength(传一个开始评论为0, 传一个评论数据的this.comment)
      index: this.getCommentLength(0, this.comment)
    }
  },
  methods: {
    // 计算comment数据中parent的层级
    getCommentLength (num, comment) {
      // 如传递进来的commnet有parent数据
      if (comment.parent) {
        // 有parent回复的数据继续就调parent回复的数据 如没有parent数据则返回num数据
        return this.getCommentLength(num + 1, comment.parent)
      } else {
        return num
      }
    },
    // 点击回复 参数id表示当前点击是哪个楼层的回复
    reply (id) {
      console.log('点击回复评论', id)
      // 子传父 触发自定义事件 reply （父组件给子组件注册reply事件）
      this.$emit('reply', id)
    }
  },
  components: {
    HmFloor
  },
  props: {
    comment: Object
  }
}
</script>

<style lang="scss" scoped>
.hm-comment {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  .title {
    display: flex;
    margin-bottom: 10px;
    img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
    }
    .info {
      flex: 1;
      padding-left: 10px;
      .name {
        font-size: 14px;
      }
      .time {
        color: #888;
      }
    }
  }
  .content {
    font-size: 14px;
    padding: 10px 0;
  }
}
</style>
