const path = require('path')
// const CompressionPlugin = require('compression-webpack-plugin')
const debug = process.env.NODE_ENV !== 'production'

module.exports = {
  lintOnSave: true,
  assetsDir: 'assets',
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  // 链式配置
  // chainWebpack: config => {
  //   // 图片打包后大小不变，使用image-webpack-loader压缩
  //   // 添加处理image的loader，默认大于4kb的打包在img文件下，否则转为Base64编码
  //   config.module
  //     .rule('images')
  //     .use('image-webpack-loader')
  //     .loader('image-webpack-loader')
  //     .options({ bypassOnDebug: true })
  //     .end()
  // },
  // 基础配置
  configureWebpack: (config) => {
    // 开发生产共同配置
    Object.assign(config, {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@a': path.resolve(__dirname, './src/api'),
          '@c': path.resolve(__dirname, './src/components'),
          '@u': path.resolve(__dirname, './src/components'),
          '@m': path.resolve(__dirname, './src/mock')
        },
        extensions: ['.js', '.json', '.vue', '.scss', '.css', '.less']
      }
    })

    // 为生产环境修改配置
    if (!debug) {
      config.mode = 'production'

      // 为下列文件开启Gzip压缩，GZip压缩不适用于图片上
      // config.plugins.push(
      //   new CompressionPlugin({
      //     test: /\.js$|\.html$|\.json$|\.svg$|\.woff$|\.ttf$|\.css/, // 匹配文件名
      //     threshold: 1024, // 对超过1kb的文件进行压缩
      //     deleteOriginalAssets: false // 是否删除原文件
      //   })
      // )
    } else { // 为开发环境修改配置
      config.mode = 'development'
    }
    // TODO 考虑是否需要splitChunks，公共代码抽离
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  devServer: {
    open: true, // 启动后在浏览器打开
    // disableHostCheck: true,
    // host: 'localhost',
    port: 80,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
    // before: (app) => {
    // }
  }
}
