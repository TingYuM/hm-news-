<template>
 <div class="input_box">
   <input :type="type" class="hm-input" :class="[status]" :placeholder="placeholder" :value="value" @input="handleInput">
   <span class="tips" v-show="showTips">{{errMsg}}</span>
 </div>
</template>

<script>
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
  // 接收组件名传递参数type和placeholder
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
      // console.log(e.target.value)
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
