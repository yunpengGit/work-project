/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-26 11:43:53
 * @LastEditors: zongmz
 * @LastEditTime: 2021-07-28 17:12:30
 */

const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const production = process.env.NODE_ENV === 'production'
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  // 基本路径
  publicPath: '/',
  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // webpack 设置,可覆盖默认配置
  chainWebpack: config => {
    config.external = {
      vue: 'Vue'
    }
    config.resolve.alias.set('@', resolve('src') + '/')
  },
  configureWebpack: config => {
    config.entry.app = ['babel-polyfill', './src/main.js']
    if (production) {
      // 为生产环境修改配置
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            // compress: {
            //   drop_debugger: true,
            //   drop_console: true // 生产环境自动删除console
            // },
            warnings: false
          },
          sourceMap: false,
          parallel: true // 使用多进程并行运行来提高构建速度。默认并发运行数：os.cpus().length - 1。
        })
      )
    }
  },
  runtimeCompiler: true,
  productionSourceMap: false, // 是否生成map文件
  transpileDependencies: ['js-base64'], // 是否引用第三方 es6+ 的插件进行ie兼容
  devServer: {
    port: '8085', // 端口号
    host: 'dev-platform.avic.com',
    https: true, // https:{type:Boolean}
    open: true, // 配置自动启动浏览器
    hot: true,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        // target: `http://10.129.136.163:8080`, // 测试环境专有云
        target: `https://portal-in-api.avicnet.cn`, // 预生产
        changeOrigin: true,
        pathRewrite: {
          [process.env.VUE_APP_BASE_API]: ''
        }
      },
      '/mock': {
        target: `http://10.129.136.174:3000/mock/18`,
        // target: 'http://192.168.2.124:10001', // 马雪
        // target: 'http://192.168.2.103:10001', // 王占旭
        changeOrigin: true,
        pathRewrite: {
          '/mock': ''
        }
      }
    }
  }
}
