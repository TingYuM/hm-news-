<template>
<!--my-comments组件我的跟帖: -->
  <div class="my-comments">
    <hm-header>我的跟帖</hm-header>
    <!--
      第三方vant-ui中van-list组件有下拉加载更多数据功能 常用移动端分页
      包裹的内容可随意指定
      v-model="loading" loading指定当前加载状态 是布尔值 如loading为true正在加载中,加载完成loading为false 只有当loading为false时 才能触发load事件,如loading为true正在加载中 不会再次触发load事件 防止无限触发load
      finished:指定是否加载完成 如没有更多数据 是加载完成,如finished为true数据全部加载完成 不会再触发加载事件
      finished-text:指定加载完成的文本信息
      load:事件: 每次滚动到最底部 就会触发load事件 适合在load中加载更多的数据
      immediate-check: 关闭页面加载就立即触发load事件
      :offset="60" 快接近底部还有60厘米时触发事件
    -->
    <van-list v-model="loading" :finished="finished"  finished-text="没有更多了"
      @load="onLoad"  :immediate-check="false" :offset="60"  >
      <!-- ajax请求拿跟帖的数据做渲染 -->
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="time">{{item.create_date | time('YYYY-MM-DD HH:mm')}}</div>
        <!--如渲染数据item有parent数据代表有父级评论,父级跟帖数据:如该评论数据与父级评论就显示-->
        <div class="parent" v-if="item.parent">
          <p>回复： {{item.parent.user.nickname}}</p>
          <p>{{item.parent.content}}</p>
        </div>
        <div class="content">{{item.content}}</div>
        <div class="origin">
          <span class="one-txt-cut">原文：{{item.post.title}}</span>
          <span class="iconfont iconjiantou1"></span>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 跟帖列表
      commentList: [],
      // 当前页
      pageIndex: 1,
      // 每页的跳转
      pageSize: 5,
      // 指定加载状态 (到底部加载完成时会触发状态从false转true)
      loading: false,
      // 是否加载完成
      finished: false
    }
  },
  created () {
    this.getCommentList()
  },
  methods: {
    // 拿用户跟帖数据(接口:用户评论列表)
    async getCommentList () {
      // pageIndex: 指定当前页,pageSize: 指定每页的条数
      // ajax官网配置:如是put和post请求 数据通过data提供,如是get请求 数据通过params提供
      const res = await this.$axios.get(`/user_comments`, {
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      // 解析拿到的数据
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // 缺点:新获取的数据会覆盖原来的数据,解决:把data中所有数据拼接到commentList中
        this.commentList = [...this.commentList, ...data]
        // 当数据加载完成 把loading重新改成false,才能触发下一次的加载
        this.loading = false
        // 如果没有更多数据,要把finished改成true告诉组件没有更多数据 就不会继续触发
        // 当获取到数据的条数小于设定 < pageSize就说明没有更多数据
        if (data.length < this.pageSize) {
          // 没有更多数据
          this.finished = true
        }
      }
    },
    // 滚动到数据最底部时触发
    onLoad () {
      console.log('已到底部,需要加载更多数据')
      setTimeout(() => {
      // 滚到底部时加载更多数据控制当前页pageIndex + 1再重新发送ajax请求
        this.pageIndex++
        // 重新发送请求 加载下一页数据,加载的新数据拼接到原来数据的后面。
        this.getCommentList()
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  font-size: 14px;
  line-height: 30px;
  .content {
    color: #000;
  }
  .time {
    color: #888;
  }
  .origin {
    color: #888;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    .one-text-cut {
      flex: 1;
    }
  }
  .parent {
    margin: 10px 0;
    background-color: #ddd;
    padding: 10px;
    border: 5px;
    p:first-child {
      font-size: 12px;
    }
  }
}
</style>
