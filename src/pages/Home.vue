<template>
<!--home组件首页:-->
  <div class="home">
    <div class="header">
      <div class="left">
        <i class="iconfont iconnew"></i>
      </div>
      <!--所有首页搜索框 看似是input搜索框 其实点击时会跳转的页面-->
      <div class="search">
        <i class="iconfont iconsearch"></i>
        <span>搜索新闻</span>
      </div>
      <!-- 点击小头像 从首页'/'跳转到个人中心'/profile'页面 发现没有token会跳转到login登录页 由于路由配置next('login')会报错-->
      <div class="right" @click="$router.push('/profile')">
        <i class="iconfont iconwode"></i>
      </div>
    </div>
    <!-- tab栏必须v-model="active"绑定一个值 指定当前激活的tab栏的下标（默认显示的第几个）
      sticky:开启粘性布局 吸顶功能,animated: 开启转场动画,swipeable: 支持左右滑动 -->

    <!--vant-list:需在每一个van-tab中都要有一个List组件,保证每一栏都可以分开加载自己的数据
      finished: 列表是否加载完成 每个tab栏列表都要有是否完成要每一个tab加finished
      loading: 列表加载状态 给通用的loading而不是每个tab栏都加loading(同一时间只能有一个loading加载)，加载完的loading应为false ,如当前tab栏正在加载情况下 其它tab栏则不可加载
      load事件： 用于加载更多的数据
      :immediate-check="false" : 阻止页面打开时就加载数据
      :offset="50" : 距离底部50厘米 显示开始加载下一页数据
    -->
    <!--van-tabs:是来回切换的tab栏,van-tab:是每个tbl栏下tab栏,hm-post:是每个tab分类下tab栏内遍历的文章里包裹List组件,保证每栏都可分开加载自己的数据-->
    <van-tabs v-model="active" sticky animated swipeable>
      <!--发送请求获取所有tab分类数据 做渲染 已登录有关注分类 没有登录无关注分类-->
      <van-tab v-for="item in tabList" :key="item.id" :title="item.name">
        <!--下拉刷新（有新状态时下拉可刷新）在List组件中-->
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <!--上拉加载更多-->
          <van-list v-model="loading" :finished="item.finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false" :offset="50">
        <!--渲染文章的内容:post="post"要渲染的数据传个post组件（先获取所有分类数据 再获取所有分类下对应文章）-->
        <hm-post v-for="post in item.postList" :key="post.id" :post="post"></hm-post>
        </van-list>
      </van-pull-refresh>
    </van-tab>
  </van-tabs>
 </div>
</template>

<script>
// 导入通用组件
import HmPost from '../components/hm-post'
export default {
  data () {
    return {
      // 2: 默认激活tab栏 active: 0, 登 或 没登 默认都显示头条数据（token表示已登录过 无token表示没登录过）
      active: localStorage.getItem('token') ? 1 : 0,
      // 存放所有tab分类
      tabList: [],
      // 每页显示的条数
      pageSize: 5,
      // List的加载状态 每个tab分类下tab文章内的list组件
      loading: false,
      // 是否下拉时刷新状态（有新状态时下拉可刷新true/false）
      refreshing: false
    }
  },
  // 获取所有的分类, 获取某个分类下对应文章 this.getPostList(this.active)
  async created () {
    // 一定先获取所有分类数据再获取分类下对应文章数据 async函数返回的还是一个promise对象  要先等分类获取成功
    await this.getTabList()
    this.getPostList()
  },
  methods: {
    // 1: 发送请求获取所有tab分类（接口:栏目列表）已登录有关注分类 没有登录无关注分类
    async getTabList () {
      const res = await this.$axios.get('/category')
      // console.log('获取所有tab分类数据', res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // 如把所有文章数据都存到postList中 缺点:数据之间会相互影响并重复性发请求,解决:每一个tabList对象都存一份文章列表数据,给tabList中每个对象都加个postList属性
        data.forEach(item => {
          // 保证每一个tab有自己的文章列表,每个分类都有postList属性,动态给item添加响应式数据（先给每个data添加postList属性 再赋值给tabList data中数据就会被劫持）
          item.postList = []
          // 每一个tab都有自己的pageIndex,记录了每一个tab加载到了第几页
          item.pageIndex = 1
          // 给每一个tab添加上finished属性 （提示列表是否加载完成）
          item.finished = false
        })
        // 当把一个数组赋值给tabList里的数据时,data中所有的数据就都会被劫持最后成为动态 响应式数据
        this.tabList = data
      }
    },
    // 获取当前分类下对应的文章 （分页 加载更多 切换..都需获取分类下的文章 方便多次使用封装）
    async getPostList () {
      // 获取某个分类下头条对应文章 分类的id (拿文章的接口需要分类的id而分类id只有在成功获取分类数据时才有id)
      const id = this.tabList[this.active].id
      // 发送ajax请求 获取某个文章数据 （接口:文章列表）
      const res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.tabList[this.active].pageIndex,
          pageSize: this.pageSize
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // 把获取的data中数据添加到tabList中
        // 打断点看代码的执行,在想打断点的地方加个单词debugger代码会自动打断点 eslint不允许使用debugger原有项目上线后影响执行 想使用在packge.json中配置
        // debugger
        // 把获取的data数据拼接到postList中 [...this.tabList[this.active].postList是原来数据, ...data 新获取的data数据]相当于把两个数据拼接到新数据中
        this.tabList[this.active].postList = [...this.tabList[this.active].postList, ...data]
        // 把loading状态改成false 才能触发下一次的 下拉加载
        this.loading = false
        setTimeout(() => {
        // 下拉刷新的状态关闭
          this.refreshing = false
        }, 1000)
        // 判断是否还有更多数据,如本次请求获取的数据小于每页条数 说明当前分类没有更多文章
        if (data.length < this.pageSize) {
          // 没有更多数据
          this.tabList[this.active].finished = true
        }
        console.log(this.tabList[this.active].postList)
      }
    },
    // 加载更多的数据
    onLoad () {
      setTimeout(() => {
        console.log('数据加载中,finished为true时就不再触发')
        // 如当前tab栏下的finished为true时不再触发load事件
        if (this.tabList[this.active].finished) {
          return
        }
        // 当前tab下的当前页+1 后重新发送请求 加载更多数据
        this.tabList[this.active].pageIndex++
        this.getPostList()
      }, 3000)
    },
    // 下拉刷新状态
    onRefresh () {
      console.log('下拉时已刷新')
      // 下拉刷新状态后重置所有状态
      this.loading = true
      this.tabList[this.active].pageIndex = 1
      this.tabList[this.active].postList = []
      this.tabList[this.active].finished = false
      // 重新获取第一页新闻信息
      this.getPostList()
    }
  },
  // 切换分类时 要显示当前分类下对应文章 使用watch监听（active代表分类下标）
  watch: {
    active (value) {
      // 每次切换分类时让滚动条到最顶部 window.scrollTo(0, 0) 或 loading状态改成true
      this.loading = true
      // console.log('active发生改变重新发请求获取当前分类下对应文章', value, this.active)
      // 如分类发生改变 需重新发送ajax请求 获取文章数据（接口:文章列表）
      // 切换分类时 先判断当前分类下是否有数据 有数据 不需要再发请求
      if (this.tabList[this.active].postList.length > 0) {
        return
      }
      this.getPostList()
    }
  },
  // 局部注册通用组件
  components: {
    HmPost
  }
}
</script>

<style lang="scss" scoped>
.home {
  .header {
    height: 50px;
    line-height: 50px;
    background-color: red;
    display: flex;
    text-align: center;
    color: #fff;
    .left,
    .right {
      width: 70px;
    }
    .search {
      flex: 1;
      height: 36px;
      line-height: 36px;
      background-color: rgba(255, 255, 255, .5);
      margin-top: 7px;
      border-radius: 18px;
      span {
        font-size: 14px;
        margin-left: 5px;
      }
    }
    .iconnew {
      font-size: 50px;
    }
    .iconwode {
      font-size: 24px;
    }
  }
}
</style>
