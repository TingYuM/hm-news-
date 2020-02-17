<template>
  <!--hm-comment评论组件也就是父组件包裹楼层组件hm-floor,楼层组件有parent时就渲染,没有parent表示没有回复则不渲染 -->
  <!--wrapper递归组件:在组件中能够渲染自己本身
    1.必须给组件提供一个name属性
    2.在当前组件中 可通过name属性渲染当前组件自己本身
    3.递归组件一定要有渲染的条件不能无限渲染下去 一定要有v-if="false"-->
  <div class="wrapper">
    <hm-floor :index="index-1" v-if="comment.parent" :comment="comment.parent"></hm-floor>
    <div class="hm-floor">
      <!-- 递归渲染hm-floor组件 从上往下渲染index-1 -->
      <div class="title">
        <div class="name">{{index}} {{comment.user.nickname}}</div>
        <div class="time">{{comment.create_date | time('YYYY-MM-DD HH:mm:ss')}}</div>
        <div class="reply">回复</div>
      </div>
      <div class="content">{{comment.content}}</div>
    </div>
  </div>
</template>

<script>
// 使用递归组件 1.给组件提供一个name属性,2.在当前组件中通过name属性渲染当前组件自己本身,3.递归组件一定要有渲染的条件不能无限渲染下去 一定要有v-if="false"
export default {
  name: 'hm-floor',
  props: {
    // 评论组件传递进来的评论数据，楼层数据
    comment: Object,
    // 回复的楼层数为数字型
    index: Number
  }
}
</script>

<style lang="scss" scoped>
.hm-floor {
  border: 1px solid #ccc;
  background-color: #eee;
  padding: 10px;
  .title {
    display: flex;
    align-items: flex-end;
    padding-bottom : 10px;
    .name {
      font-size: 14px;
    }
    .time {
      margin-left: 5px;
      flex: 1;
    }
  }
  .content {
    font-size: 14px;
  }
}
</style>
