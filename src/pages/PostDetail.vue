<template>
  <!--post-detail组件新闻详情(文章详情): -->
  <div class="post-detail">
    <!-- 新闻详情头部 @click="$router.back()后退 -->
    <div class="header">
      <div class="left">
        <i class="iconfont iconjiantou2" @click="$router.back()"></i>
        <i class="iconfont iconnew"></i>
      </div>
      <div class="right">
        <div class="btn-followed" v-if="post.has_follow" @click="unfollow">已关注</div>
        <div class="btn-follow" v-else @click="follow">关注</div>
      </div>
    </div>
    <!--渲染新闻内容 -->
    <div class="main">
      <div class="post-title">{{post.title}}</div>
      <div class="post-info">
        <span>{{post.user.nickname}}</span>
        <span>{{post.create_date | time}}</span>
      </div>
      <!--{{post.content}}插值不能识别标签 使用v-html="post.content" 识别标签-->
      <!--如type等于2为视频 要使用video标签渲染视屏,403资源有但不可使用 因引的是在线网站而不是自己数据库中的,在线视频必须做处理 在线视频图片有可能会遇到防盗链
        防盗链的方式: 加水印 或 后台配置防盗链 https://qsh5.cn/595.html 在结构index.html中加一行代码-->
      <div class="video" v-if="post.type === 2">
        <video :src="post.content" controls></video>
      </div>
      <div class="content" v-else v-html="post.content"></div>
    </div>
    <!-- 点赞和取消点赞 根据类名like判断用户是否点赞-->
    <div class="btns">
      <div class="good" @click="like" :class="{like: post.has_like}">
        <i class="iconfont icondianzan"></i>
        <span>{{post.like_length}}</span>
      </div>
      <div class="share">
        <i class="iconfont iconweixin"></i>
        <span>微信</span>
      </div>
    </div>
    <!-- 评论区域 -->
    <div class="post-commnet">
      <div class="title">精彩跟帖</div>
      <!-- 评论组件封装 精彩跟帖 新闻详情都要使用,把需要渲染的评论的数据传递给评论组件 （父组件给子组件注册reply事件）子传父 触发自定义事件 reply -->
      <hm-comment v-for="item in commentList" :key="item.id" :comment="item" @reply="reply"></hm-comment>
    </div>
    <!-- 底部区域 -->
    <div class="footer">
      <!-- 点击文本框时显示的文本域 动态控制文本框和文本域的显示 !isFocus-->
      <div class="comment-input" v-show="!isFocus">
        <input type="text" placeholder="写跟帖" @focus="handleFoucs">
        <div class="icon-comment">
          <i class="iconfont iconpinglun-"></i>
          <span class="num">{{post.comment_length}}</span>
        </div>
        <!--star收藏文章 点击时收藏文章成功后发请求 控制收藏前后的样式-->
        <i class="iconfont iconshoucang" @click="star" :class="{star: post.has_star}"></i>
        <i class="iconfont iconfenxiang"></i>
      </div>
      <!-- 文本域 取消文本框 恢复input输入框 @blur="handleBlur"失去焦点时恢复input框-->
      <div class="comment-textarea" v-show="isFocus">
        <textarea ref="textarea" rows="3" placeholder="回复" @blur="handleBlur" v-model="content"></textarea>
        <div class="send" @click="send">发送</div>
      </div>
    </div>
  </div>
</template>

<script>
import HmComment from '../components/hm-comment'
export default {
  components: {
    HmComment
  },
  data () {
    return {
      // 文章的详细信息（获取{{post.user是空undfin再访问.nickname会报错}}解决:post对象中存user 解决报错
      post: {
        user: {}
      },
      // 动态控制文本框和文本域的显示
      isFocus: false,
      // 存储评论列表的数据
      commentList: [],
      parentId: '',
      content: ''
    }
  },
  // 页面打开时发请求获取数据渲染 （由于ajax是异步导致post刚开始请求没有数据 异步需要时间）
  created () {
    // 获取文章详情
    this.getPostDetail()
    // 获取评论列表
    this.getCommentList()
  },
  methods: {
    // 获取新闻详情 成功获取新闻列表 后做渲染（当前点击的某个id的具体数据 结构中做渲染）
    async getPostDetail () {
      // 获取点击时的某个id 从地址栏获取当前点击具体新闻id
      const id = this.$route.params.id
      const res = await this.$axios.get(`/post/${id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.post = data
        console.log('成功获取当前点击的某个id的新闻列表', this.post)
      }
    },
    // 获取评论列表 成功获取评论列表 后做渲染 （接口:获取评论列表）从地址栏获取具体文章下评论id
    async getCommentList () {
      const id = this.$route.params.id
      const res = await this.$axios.get(`/post_comment/${id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.commentList = data
      }
      console.log('成功获取当前点击的某个id的评论列表', this.commentList)
    },
    // 点击关注成功后修改按钮状态（接口:关注用户）
    async follow () {
      // id：需要关注的文章作者的id（post当前文章.user作者.id）
      const id = this.post.user.id
      const res = await this.$axios.get(`/user_follows/${id}`)
      console.log(res)
      const { statusCode } = res.data
      if (statusCode === 200) {
        this.$toast.success('关注成功')
        // 关注成功后修改按钮状态（无需重新发请求）
        this.post.has_follow = true
      }
    },
    // 点击取消关注成功后修改按钮的状态
    async unfollow () {
      const id = this.post.user.id
      const res = await this.$axios.get(`/user_unfollow/${id}`)
      const { statusCode } = res.data
      if (statusCode === 200) {
        this.$toast.success('取消关注')
        // 取消关注成功后修改按钮的状态
        this.post.has_follow = false
      }
    },
    // 点赞和取消点赞成功后重新渲染（接口:取消点赞）
    async like () {
      // id:点赞文章的id（this.post当前点赞文章的.id）
      const id = this.post.id
      const res = await this.$axios.get(`/post_like/${id}`)
      console.log('点赞成功的数据', res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.getPostDetail()
        this.$toast.success(message)
      }
    },
    // 点击input输入框获取焦点 后显示文本域的输入框
    async handleFoucs () {
      console.log('获取焦点')
      // 获取焦点后isFocus状态修改为true显示文本域
      this.isFocus = true
      // 修改状态后控制textarea自动获得焦点 先获取到textarea后调用focus方法
      // console.log('操作组件$refs,操作dom使用res',this.$refs)
      // isFocus状态刚修改为true时 由于DOM异步更新的问题是获取不到数据 使用$nextTick搭配async 和 await （等dom结构渲染完在获取）
      await this.$nextTick()
      this.$refs.textarea.focus()
    },
    // 取消文本框 恢复input输入框
    handleBlur () {
      console.log('失去获取焦点')
      // 失去焦点前判断textarea有内容的情况要显示文本域 无内容则隐藏
      if (this.content) {
        return
      }
      this.isFocus = false
    },
    // 点击时收藏文章（接口:收藏文章）收藏成功后发请求修改状态
    async star () {
      console.log('收藏文章')
      const id = this.post.id
      const res = await this.$axios.get(`/post_star/${id}`)
      console.log('收藏文章成功的具体数据', res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getPostDetail()
      }
    },
    // 父组件PostDetail给子组件hm-comment注册reply事件 （子传父 触发自定义事件 reply ）
    async reply (id) {
      console.log('接收子组件事件及参数', id)
      // 记录回复评论的id
      this.parentId = id
      // 显示文本域
      this.isFocus = true
      // 等dom渲染完成后 获取焦点
      await this.$nextTick()
      this.$refs.textarea.focus()
    },
    // 点击发送（接口:发布评论）
    async send () {
      // 发送ajax请求，添加评论 （post.id:文章id,content评论内容 parent_id父级id也就是回复的id)
      const id = this.post.id
      const res = await this.$axios.post(`/post_comment/${id}`, {
        content: this.content,
        parent_id: this.parentId
      })
      console.log('具体文章的id 评论内容 具体回复id', res)
      // 解析成功后的状态码 判断状态码是否成功
      const { statusCode } = res.data
      if (statusCode === 200) {
        this.$toast.success('评论发布成功')
        // 评论发布成功后重新渲染 并所有重置为无评论之前状态
        this.getCommentList()
        this.isFocus = false
        this.content = ''
        this.parentId = ''
      }
    }
  },
  // 监听路由的变化,如地址栏改变时 需重新获取数据
  watch: {
    $route () {
      this.getPostDetail()
    }
  }
}
</script>

<style lang="scss" scoped>
.post-detail {
    padding-bottom: 100px;
  // 新闻头部
  .header {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    align-items: center;
    .left {
      display: flex;
      .iconnew {
        font-size: 50px;
      }
    }
    .right {
      .btn-followed {
        border: 1px solid #ccc;
        height: 30px;
        line-height: 30px;
        padding: 0 15px;
        border-radius: 15px;
      }
      .btn-follow {
        border: 1px solid red;
        height: 30px;
        line-height: 30px;
        padding: 0 15px;
        border-radius: 15px;
        background-color: red;
        color: #fff;
      }
    }
  }
  // 新闻内容
  .main {
    padding: 10px;
    .post-title {
      font-size: 18px;
      font-weight: 700;
    }
    .post-info {
      color: #888;
      padding: 10px 0;
      span:first-child {
        margin-right: 10px;
      }
    }
    video {
      width: 100%;
    }
  }
  //点赞和分享
  .btns {
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
    border-bottom: 3px solid #ddd;
    .good,
    .share {
      border: 1px solid #ccc;
      height: 30px;
      line-height: 30px;
      padding: 0 15px;
      border-radius: 15px;
      font-size: 12px;
      .iconfont {
        margin-right: 5px;
        font-size: 14px;
      }
      .iconweixin {
        color: rgb(1, 200, 1)
      }
    }
    .like {
      color: red;
      border-color: red;
    }
  }
  // 精彩跟帖
    .post-commnet {
    .title {
      font-size: 18px;
      text-align: center;
      padding: 10px 0;
    }
  }

  // 新闻底部
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px 0;
    background-color: #fff;
    .comment-input {
      display: flex;
      justify-content: space-around;
      align-items: center;
      input {
        width: 180px;
        height: 30px;
        background-color: #ddd;
        border-radius: 15px;
        padding-left: 20px;
      }
      .iconfont {
        font-size: 24px;
      }
      .star {
        color: red;
      }
      .icon-comment {
        position: relative;
        .num {
          position: absolute;
          background-color: red;
          height: 20px;
          line-height: 20px;
          color: #fff;
          padding: 0 10px;
          border-radius: 10px;
          right: -20px;
          top: -4px;
        }
      }
    }
    .comment-textarea {
      display: flex;
      width: 100%;
      padding: 0 20px;
      justify-content: space-between;
      align-items: flex-end;
      textarea {
        background-color: #ddd;
        width: 240px;
        height: 70px;
        border-radius: 10px;
        padding: 10px;
      }
      .send {
        width: 60px;
        height: 26px;
        line-height: 26px;
        background-color: red;
        color: #fff;
        text-align: center;
        border-radius: 13px;
      }
    }
  }
}
</style>
