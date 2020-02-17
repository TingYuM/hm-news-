<template>
<!--我的收藏中渲染的数据封装通用组件hm-post: -->
  <!-- 渲染文章数据 点击收藏中某个新闻时根据id跳转的页面-->
  <div class="hm-post" @click="$router.push(`/post-detail/${post.id}`)">
    <!-- 视频类的结构 如postList数据中type为2是视频类的新闻 如type为1是图片类型的新闻 -->
    <div class="video-post" v-if="post.type === 2">
      <div class="title txt-cut">{{post.title}}</div>
      <div class="video">
        <!-- 显示的是封面 点击时跳转视频详情 -->
        <img :src="post.cover[0].url" alt="">
        <!-- 播放按钮 -->
        <i class="iconfont iconshipin"></i>
      </div>
      <div class="bottom">
        <span>{{post.user.nickname}}</span>
        <span>{{post.comment_length}}跟帖</span>
      </div>
    </div>
    <!-- 单张图片的结构 -->
    <div class="single-img-post" v-else-if="post.cover.length < 3">
      <div class="info">
        <div class="title txt-cut">{{post.title}}</div>
        <div class="bottom">
          <span>{{post.user.nickname}}</span>
          <span>{{post.comment_length}}跟帖</span >
        </div>
      </div>
      <img :src="post.cover[0].url" alt="">
    </div>
    <!-- 多张图片的结构 -->
    <div class="multiple-img-post" v-else>
      <div class="title txt-cut">{{post.title}}</div>
      <div class="imgs">
        <img v-for="item in post.cover" :key="item.id" :src="item.url" alt="">
      </div>
      <div class="bottom">
        <span>{{post.user.nickname}}</span>
        <span>{{post.comment_length}}跟帖</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // 接收home组件中 渲染文章的内容具体数据写在hm-post组件中（文章封装传组件具体样式hm-post控制）
  props: {
    post: Object
  }
}
</script>

<style lang="scss" scoped>
.hm-post {
  .title {
    font-size: 14px;
  }
  .bottom {
    color: #888;
    span:first-child {
      margin-right: 10px;
    }
  }
}
.single-img-post {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .info {
    flex: 1;
    display: flex;
    height: 75px;
    // 修改flex主轴的方向（原样式为横着摆放 修改后为竖着摆放）
    flex-direction: column;
    justify-content: space-between;
  }
  img {
    width: 120px;
    height: 75px;
    // object-fit:样式 保证图片定死宽高的情况下不失真 cover(图片覆盖整个宽高大小自动居中且不失真) contain(图片宽高大小且居中会留白)
    // object-fit: cover contain 类似 background-size
    object-fit: cover;
  }
}
.multiple-img-post {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  .imgs {
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
    img {
      width: 112px;
      height: 74px;
      object-fit: cover;
    }
  }
}
.video-post {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  .video {
    position: relative;
    margin: 10px 0;
    img {
      width: 100%;
    }
    .iconshipin {
      width: 50px;
      height: 50px;
      background-color: rgba(0, 0, 0, .5);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      color: #fff;
      font-size: 30px;
      line-height: 50px;
      text-align: center;
    }
  }
}
</style>
