// 配浏览器自动打开（每次修改完配置文件 都需再重启项目）
module.exports = {
  devServer: {
    open: true
  },
  // 先终端下载yarn add postcss-px2rem 再配置rem
  css: {
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [
          require('postcss-px2rem')({
          // 设计图的rootFontSize,推荐写37.5
          // 假如原设计图是750remUnit:75/2=37.5好处是量设计图时不用再缩小)原设计图/10/2,ui给设计图都是两倍图
          // 如用第三方ui库会有问题。
          // 量设计图时把设计图缩小一倍
            remUnit: 36
          })
        ]
      }
    }
  }
}
