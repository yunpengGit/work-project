/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-26 11:43:53
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-31 15:14:17
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
            compress: {
              drop_debugger: true,
              drop_console: true // 生产环境自动删除console
            },
            warnings: false
          },
          sourceMap: false,
          parallel: true // 使用多进程并行运行来提高构建速度。默认并发运行数：os.cpus().length - 1。
        })
      )
    }
    // })
    // // 优化项配置
    // config.optimization = {
    //   runtimeChunk: 'single',
    //   splitChunks: { // 分割代码块
    //     cacheGroups: {
    //       vendor: { // 第三方库抽离
    //         chunks: 'all',
    //         test: /node_modules/,
    //         name: 'vendor',
    //         minChunks: 1, // 在分割之前，这个代码块最小应该被引用的次数
    //         maxInitialRequests: 5,
    //         minSize: 0, // 大于0个字节
    //         priority: 100// 权重
    //       },
    //       common: { // 公用模块抽离
    //         chunks: 'all',
    //         test: /[\\/]src[\\/]js[\\/]/,
    //         name: 'common',
    //         minChunks: 2, // 在分割之前，这个代码块最小应该被引用的次数
    //         maxInitialRequests: 5,
    //         minSize: 0, // 大于0个字节
    //         priority: 60
    //       },
    //       styles: { // 样式抽离
    //         name: 'styles',
    //         test: /\.(sa|sc|c)ss$/,
    //         chunks: 'all',
    //         enforce: true
    //       },
    //       runtimeChunk: {
    //         name: 'manifest'
    //       }
    //     }
    //   }
    // }
  },
  runtimeCompiler: true,
  productionSourceMap: false, // 是否生成map文件
  transpileDependencies: ['js-base64', 'websocket-stream', 'vue-grid-layout'], // 是否引用第三方 es6+ 的插件进行ie兼容
  devServer: {
    port: '8083', // 端口号
    host: 'dev-portal.avic.com',
    https: true, // https:{type:Boolean}
    open: true, // 配置自动启动浏览器
    hot: true,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: `https://portal-in-api.avicnet.cn`,
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
