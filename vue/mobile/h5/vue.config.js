/*
 * @Author: pengpeng
 * @Date: 2020-10-13 13:54:46
 * @LastEditors: pengpeng
 * @LastEditTime: 2020-10-23 11:09:59
 * @Description: file content
 */
const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const Autoprefixer = require('autoprefixer')
const Pxtorem = require('postcss-pxtorem')
const debug = process.env.NODE_ENV !== 'production'
const targetDomain = process.env.VUE_APP_TARGET_DOMAIN
module.exports = {
  lintOnSave: true,
  assetsDir: 'assets',
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          Pxtorem({
            rootValue: 37.5,
            selectorBlackList: ['weui', 'mu'],
            propList: ['*']
          }),
          Autoprefixer({
            overrideBrowserslist: ['Android >= 4.0', 'iOS >= 7']
          })
        ]
      }
      // less: {
      //   modifyVars: { ...VantThemeConfig }
      // }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({ bypassOnDebug: true })
      .end()
  },
  configureWebpack: (config) => {
    Object.assign(config, {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@c': path.resolve(__dirname, './src/components'),
          '@u': path.resolve(__dirname, './src/utils')
        },
        extensions: ['.js', '.json', '.vue', '.scss', '.css', '.less']
      }
    })
    if (!debug) {
      config.mode = 'production'

      config.plugins.push(
        new CompressionPlugin({
          test: /\.js$|\.html$|\.json$|\.svg$|\.woff$|\.ttf$|\.css/,
          threshold: 1024,
          deleteOriginalAssets: false
        })
      )
    } else {
      config.mode = 'development'
    }
  },
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api': {
        target: targetDomain,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
