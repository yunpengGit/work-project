/*
 * @Description:
 * @Author: peng
 * @Date: 2021-08-11 09:35:33
 * @LastEditors: peng
 * @LastEditTime: 2021-08-24 10:53:19
 */
const targetDomain = process.env.TARGET_DOMAIN;
const proxyConfig = {
  // 设置代理
  "/sizzc": {
    target: targetDomain, // 真实请求的目标地址
    changeOrigin: true,
    // ws: true,//开启websocket
    // pathRewrite: {
    // }
  },
};
module.exports = {
  indexPath: "windowOfThought.html",
  assetsDir: "windowOfThoughtAssets",
  outputDir: "dist",
  publicPath: "./",
  productionSourceMap: false,
  devServer: {
    open: true, // 启动后在浏览器打开
    proxy: process.env.NODE_ENV === "development" ? proxyConfig : "",
  },
};
