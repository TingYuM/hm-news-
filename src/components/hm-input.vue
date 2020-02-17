<template>
<!--封装通用hm-input组件 实现输入框不仅仅要收集数据 要需要表单效验功能 -->
 <div class="input_box">
   <input :type="type" class="hm-input" :class="[status]" :placeholder="placeholder" :value="value" @input="handleInput">
   <span class="tips" v-show="showTips">{{errMsg}}</span>
 </div>
</template>

<script>
// 默认输出是一个函数,本质上输出一个叫做default的变量或方法,系统允许取任意名字
export default {
  // 记录效验是否成功
  data () {
    return {
      // 记录校验是否成功
      status: ''
    }
  },
  computed: {
    showTips () {
      return this.status === 'error' && this.errMsg
    }
  },
  // 接收组件名hm-input传递的参数type类型 和效验规则 错误提示信息placeholder
  props: {
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    rules: {
      type: RegExp
    },
    errMsg: {
      type: String
    }
  },
  methods: {
    handleInput (e) {
      // this.value = e.target.value 父元素的数据不可以改 父传子修改数据(触发input事件，并且把值传递过去)this.$emit()
      const { value } = e.target
      this.$emit('input', value)
      // 使用rules效验value值 传值就效验不传值不效验
      if (!this.rules) return
      if (this.rules.test(value)) {
        this.status = 'success'
      } else {
        this.status = 'error'
      }
    }
  }
}

</script>

<style lang="scss" scoped>
// scoped原理：
// style加scoped属性 样式只会影响当前组件(当前作用域)
//   1.给当前组件所有的选择器 或 当前组件模板中所有元素身上随机生成属性div[data-v-1f24bdc7]  p[]
.input_box{
  padding-bottom: 15px;
  position: relative;
  .hm-input{
    width: 100%;
    height: 38px;
    background-color: transparent;
    border-bottom: 1px solid #666;
    font-size: 18px;
    &.error{
      border-color:red;
    }
    &.success{
      border-color:green;
    }
  }
  .tips{
    color:red;
    position: absolute;
    bottom: 0;
    left:0;
  }
}

</style>
