module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  // 配置第三方组件库vant-ui的按需加载
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
}
