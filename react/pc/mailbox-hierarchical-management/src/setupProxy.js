/*
 * @Author: your name
 * @Date: 2020-11-09 10:09:22
 * @LastEditTime: 2020-12-14 13:12:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\setupProxy.js
 */
const {createProxyMiddleware} = require("http-proxy-middleware");
// console.log(process.env.NODE_ENV)
const url = process.env.REACT_APP_BASE_URL

module.exports = function (app) {
  app.use('/api',
  createProxyMiddleware({
    // target: 'https://mailadmin.avicnet.cn:8080',
    target: url,
    // target: 'http://192.168.106.245:8080',
    changeOrigin: true,
    pathRewrite: {
      '^/api': ''
    }
  }));
};
