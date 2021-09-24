const VantThemeConfig = require('./src/vant.theme')
const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const Autoprefixer = require('autoprefixer')
const Pxtorem = require('postcss-pxtorem')
const debug = process.env.NODE_ENV !== 'production'
const targetDomain = process.env.TARGET_DOMAIN

module.exports = {
  lintOnSave: true,
  assetsDir: 'assets',
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          Pxtorem({
            rootValue: 37.5, // 换算的基数
            selectorBlackList: ['weui', 'mu'], // 忽略转换正则匹配项
            propList: ['*'] // 对所有css属性进行转换rem
          }),
          Autoprefixer({// 浏览器兼容，自动添加前缀
            overrideBrowserslist: ['Android >= 4.0', 'iOS >= 7']
          })
        ]
      },
      less: {
        modifyVars: { ...VantThemeConfig }
      }
    }
  },
  // 链式配置
  chainWebpack: config => {
    // 图片打包后大小不变，使用image-webpack-loader压缩
    // 添加处理image的loader，默认大于4kb的打包在img文件下，否则转为Base64编码
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({ bypassOnDebug: true })
      .end()
  },
  // 基础配置
  configureWebpack: (config) => {
    // 开发生产共同配置
    Object.assign(config, {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@c': path.resolve(__dirname, './src/components'),
          '@u': path.resolve(__dirname, './src/utils')
        },
        // 省略后缀，由webpack自动为我们加上
        extensions: ['.js', '.json', '.vue', '.scss', '.css', '.less']
      }
    })

    // 为生产环境修改配置
    if (!debug) {
      config.mode = 'production'

      // 为下列文件开启Gzip压缩，GZip压缩不适用于图片上
      config.plugins.push(
        new CompressionPlugin({
          test: /\.js$|\.html$|\.json$|\.svg$|\.woff$|\.ttf$|\.css/, // 匹配文件名
          threshold: 1024, // 对超过1kb的文件进行压缩
          deleteOriginalAssets: false // 是否删除原文件
        })
      )
    } else { // 为开发环境修改配置
      config.mode = 'development'
    }
    // TODO 考虑是否需要splitChunks，公共代码抽离
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  devServer: {
    open: true, // 启动后在浏览器打开
    proxy: {
      // 设置代理
      '/api': {
        target: targetDomain, // 真实请求的目标地址
        changeOrigin: true,
        // ws: true,//开启websocket
        pathRewrite: {
          '^/api': ''
        }
      },
      '/server_img': {
        target: targetDomain,
        changeOrigin: true,
        pathRewrite: {
          '^/server_img': ''
        }
      }
    }

    // before: (app) => {
    // }
  },
  // 第三方插件配置
  pluginOptions: {
    // ...
  }
}
