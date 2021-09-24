/*
 * @Descripttion: 
 * @Author: pengpeng
 * @Date: 2021-05-26 15:48:10
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-05-27 14:05:39
 */
const autoprefixer = require('autoprefixer');
const pxtoviewport = require('postcss-px-to-viewport');
const targetDomain = process.env.TARGET_DOMAIN
const proxyConfig = {
  // 设置代理
  '/review': {
    target: targetDomain, // 真实请求的目标地址
    changeOrigin: true
    // ws: true,//开启websocket
    // pathRewrite: {
    // }
  }
}
module.exports = {
  assetsDir: "personnelChangeAssets",
  outputDir: 'dist',
  publicPath: './',
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtoviewport({
            viewportWidth: 375
          })
        ]
      }
    }
  },
  productionSourceMap: false,
  devServer: {
    open: true, // 启动后在浏览器打开
    proxy: process.env.NODE_ENV === 'development' ? proxyConfig : ''
  }
};
