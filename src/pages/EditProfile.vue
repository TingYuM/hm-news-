<template>
<!-- edit-profile.vue编辑个人信息组件 当跳转到编辑个人信息页面时 显示用户的默认信息 并且可以修改默认的信息-->
  <div class="edit-profile">
    <hm-header>编辑资料</hm-header>
    <!--头像:使用第三方uploader组件库,控制样式van-uploader定位到头像后隐藏为透明体-->
      <div class="box">
       <div class="avatar">
        <img :src="avatar" alt="">
        <!--after-read 代表文件上传后的回调函数 通过这个函数可获取到文件,Uploader组件不会自动上传图片 需手动上传 但组件会把你选择的那个文件告诉你-->
          <van-uploader :after-read="afterRead" />
      </div>
      <hm-nav name="昵称" :desc="profile.nickname" @click="showNickname"></hm-nav>
      <hm-nav name="密码" desc="******" @click="showPassword"></hm-nav>
      <hm-nav name="性别" :desc="profile.gender === 1 ? '男':'女'" @click="showGender"></hm-nav>
    </div>
    <!--昵称对话框:用户点击时弹出修改的对话框 第三方v-moder=""绑定一个布尔值 在data数据中提供,@confirm=""点击确定按钮时触发 -->
    <van-dialog v-model="isShowNickname" title="修改昵称" show-cancel-button @confirm="editNickname">
       <van-field v-model="nickname" placeholder="请输入用户名"/>
    </van-dialog>
    <!--密码的对话框 1.先控制对话框显示隐藏data(){中} 2.在结构上面<hm-nav>密码上注册点击事件methods:{中} 3.van-field输入框内双向数据绑定 原有数据赋值现有 4.@confirm="点击确定触发ajax" -->
    <van-dialog v-model="isShowPassword" title="修改密码" show-cancel-button @confirm="editPassword">
      <van-field v-model="password" placeholder="请输入用户密码"/>
    </van-dialog>
    <!-- 性别对话框 -->
    <van-dialog v-model="isShowGender" title="修改性别" show-cancel-button @confirm="editGender">
         <!-- name值表示单选框选中的值 加:代表数字 不加表示字符串 -->
      <van-radio-group v-model="gender">
         <van-cell-group>
           <van-cell title="男" clickable @click="gender = 1">
             <van-radio slot="right-icon" :name="1" />
           </van-cell>
           <van-cell title="女" clickable @click="gender = 0">
             <van-radio slot="right-icon" :name="0" />
           </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>
    <!-- 准备一个遮罩层 res操作某个dom $refs操作组件-->
    <div class="mask" v-show="isShowMask">
      <vueCropper
        ref="cropper"
        :img="option.img"
        :autoCrop="option.autoCrop"
        :autoCropWidth="option.autoCropWidth"
        :autoCropHeight="option.autoCropHeight"
        :fixed="option.fixed"
        :fixedNumber="option.fixedNumber">
      </vueCropper>
      <van-button type="primary" @click="crop">确定裁剪图片</van-button>
      <van-button type="danger" @click="isShowMask = false">取消</van-button>
    </div>
  </div>
</template>

<script>
import img from '../assets/avatar.jpg'
import { VueCropper } from 'vue-cropper'
export default {
  data () {
    return {
      profile: {},
      loading: false,
      // 是否显示 昵称 对话框
      isShowNickname: false,
      // 提供nickname数据默认为空
      nickname: '',
      // 是否显示 密码 对话框
      isShowPassword: false,
      password: '',
      // 是否显示 性别 对话框
      isShowGender: false,
      gender: 0,
      // 是否显示 遮罩层
      isShowMask: false,
      option: {
        img: '', // 这个img应该要是上传的那张图片，只不过现在我写死了
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 150, // 默认生成截图框宽度
        autoCropHeight: 150, // 默认生成截图框高度
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [4, 4] // 截图框的宽高比例
      }
    }
  },
  computed: {
    avatar () {
      if (this.profile.head_img) {
        // 如有头像，拼接上基准路径
        return this.$axios.defaults.baseURL + this.profile.head_img
      } else {
        // 如没有头像，显示默认头像
        return img
      }
    }
  },
  // 只要进入edit-profile页面 就会发送请求 拿到个人信息(将来修改 昵称 密码 成功后页面需重新渲染 封装函数)
  created () {
    this.getProfile()
    console.log(this.profile)
  },
  methods: {
    async getProfile () {
      // 如需要权限校验的接口(用户登录)需发送请求时候增加一个headers请求头 携带 token 和 user_id
      const userId = localStorage.getItem('user_id')
      const res = await this.$axios.get(`/user/${userId}`)
      this.profile = res.data.data
      this.loading = true
      console.log(this.profile)
    },
    // 封装一个函数，用于修改个人信息 根据data传递的数据来修改
    async editProfile (data) {
    // 前面登录成功时存储起来的用户user_id 以及 后台token登录信息
      const id = localStorage.getItem('user_id')
      // axios.post(url地址[, data数据(要修改的数据)[, config请求头]])  axios中的post请求参数
      const res = await this.$axios.post(`/user_update/${id}`, data)
      // 修改昵称成功后页面重新渲染
      if (res.data.statusCode === 200) {
        this.$toast.success('修改成功')
        this.getProfile()
      }
    },
    // 昵称: 只有点击 昵称 时才会显示修改对话框
    showNickname () {
      this.isShowNickname = true
      // 显示对话框时让nickname有值 把原有profile.nickname中的值 赋值给现在的nickname
      this.nickname = this.profile.nickname
    },
    // 修改昵称 点击确定按钮触发的事件 修改昵称 (发送ajax请求到后台修改昵称)
    editNickname () {
      this.getProfile({ nickname: this.nickname })
    },
    // 密码:只有点击 密码 时才会显示修改对话框
    showPassword () {
    // 显示对话框时让password有值 把原有profile.password中的值 赋值给现在的password
      this.isShowPassword = true
      this.password = this.profile.password
    },
    // 修改密码  点击确定按钮触发的事件 (发送ajax请求到后台修改密码)
    editPassword () {
      this.editProfile({ password: this.password })
    },
    // 性别:只有点击 性别 时才会显示修改对话框
    showGender () {
      this.isShowGender = true
      this.gender = this.profile.gender
    },
    // 修改性别  点击确定按钮触发的事件 (发送ajax请求到后台修改性别)
    editGender () {
      this.editProfile({ gender: this.gender })
    },
    // 方法1点击头像库上传,方法2先裁剪再上传
    async afterRead (file) {
      console.log('文件已上传file是上传的文件 conent是显示的图片', file)
      // 文件上传后显示图片裁剪div
      this.isShowMask = true
      // 裁剪好的图片为上传的这个图片
      this.option.img = file.content
    },
    // 图片裁剪方法
    crop () {
    // 获取cropper组件裁剪的图片base64,转file文件,拿到后发ajax请求把裁剪图片上传到后台
      this.$refs.cropper.getCropData(async imgData => {
        console.log('获取cropper组件的截图的图片默认base64', imgData)
        // 把裁剪后的data图片转成file文件 才可上传到服务器
        const file = this.convertBase64UrlToBlob(imgData)
        // 创建formData对象上传文件,参1:name属性 后端用于获取文件,有接口决定 参2:需要上传的文件
        const fd = new FormData()
        fd.append('file', file)
        const res = await this.$axios.post('/upload', fd, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
        // 文件上传接口只负责上传文件 文件上传成功后 需要获取上传成功的图片地址 发送请求(接口:编辑用户信息)修改头像
        console.log(res)
        // 从res.data 解构出状态statusCode和数据data,如状态码等于200就可拿到上传成功的文件 发请求修改文件
        const { statusCode, data } = res.data
        if (statusCode === 200) {
          // 发送请求修改头像
          this.editProfile({ head_img: data.url })
        }
        // 遮罩层给隐藏掉
        this.isShowMask = false
      })
    },
    // 将base64的图片编码转换为file文件才可上传
    convertBase64UrlToBlob (urlData) {
      let bytes = window.atob(urlData.split(',')[1])// 去掉url的头，并转换为byte
      // 处理异常,将ascii码小于0的转换为大于0
      let ab = new ArrayBuffer(bytes.length)
      let ia = new Uint8Array(ab)
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
      }
      return new Blob([ab], { type: 'image/jpeg' })
    }
  },
  // 方法1:头像:FormData()选文件上传到服务器 获取上传成功文件地址 ajax请求改文件
  /* async afterRead (file) {
       // 找到要上传的文件 需手动上传file文件 使用ajax异步上传文件必借助formData上传（百度）
       console.log(file.file)
       // 上传文件前做判断 文件类型 及 文件大小kb判断（1mb=2014kb）（1kb=1024字节）
       if (file.file.type !== 'image/jpeg') {
         this.$toast('只支持jpg图片')
         return
       }
       if (file.file.size / 1024 >= 20) {
         this.$toast('图片大小不可超20k')
         return
       }
       // 创建formData对象上传文件,参1:name属性 后端用于获取文件,有接口决定 参2:需要上传的文件
       const fd = new FormData()
       fd.append('file', file.file)
       const res = await this.$axios.post('/upload', fd, {
         headers: {
           Authorization: localStorage.getItem('token')
         }
       })
       // 文件上传接口只负责上传文件 文件上传成功后 需要获取上传成功的图片地址 发送请求(接口:编辑用户信息)修改头像
       console.log(res)
       // 从res.data 解构出状态statusCode和数据data,如状态码等于200就可拿到上传成功的文件 发请求修改文件
       const { statusCode, data } = res.data
       if (statusCode === 200) {
         console.log(data.url)
         this.editProfile({ head_img: data.url })
       }
     } */
  components: {
    VueCropper
  }
}
</script>
<style lang="scss" scoped>
.box {
  padding: 0 20px;
  .avatar {
    padding: 30px 0;
    position: relative;
    img {
      width: 70px;
      height: 70px;
      margin: 0 auto;
      border-radius: 50%;
    }
    .van-uploader {
      position: absolute;
      top: 30px;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
    }
  }
}
.van-dialog {
  padding: 10px;
  .van-field {
    margin-top: 10px;
    border: 1px solid #ccc;
  }
}
// 裁剪图片样式:要指定父盒子高度 因插件基于父盒子高度的100%
.mask {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 999;
  top: 0;
  left: 0;
  .van-button {
    position: fixed;
    top: 0;
  }
  .van-button:first-child {
    left: 0px;
  }
  .van-button:last-child {
    right: 0px;
  }
}
</style>
