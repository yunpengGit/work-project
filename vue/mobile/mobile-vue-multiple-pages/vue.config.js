const Autoprefixer = require('autoprefixer')
const Pxtorem = require('postcss-pxtorem')

let objectProject = {
  index: {
    entry: 'src/views/index/main.js', // page 的入口
    template: 'src/public/index.html', // 模板来源
    filename: 'index.html', // 在 dist/index.html 的输出
    // 当使用 title 选项时，template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    title: 'Index Page',
    // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk。
    chunks: ['chunk-vendors', 'chunk-common', 'index']
  },
  source: {
    entry: 'src/views/source/main.js',
    template: 'src/public/source.html',
    filename: 'source.html',
    title: 'Index Page',
    chunks: ['chunk-vendors', 'chunk-common', 'source']
  },
  schedule: {
    entry: 'src/views/schedule/main.js',
    template: 'src/public/index.html',
    filename: 'schedule.html',
    title: 'Index Page',
    chunks: ['chunk-vendors', 'chunk-common', 'schedule']
  }
}
let page = {}
let projectname = process.argv[3] // 获取执行哪个文件
if (process.env.NODE_ENV === 'development') {
  page = objectProject
} else {
  page[projectname] = objectProject[projectname]
}
module.exports = {
  publicPath: './', // 官方要求修改路径在这里做更改，默认是根目录下，可以自行配置
  outputDir: 'dist' + projectname, // 标识是打包哪个文件
  // 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希。
  filenameHashing: true,
  pages: page,
  productionSourceMap: false,
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          Pxtorem({
            // rootValue: 75, // source
            rootValue: 37.5,
            selectorBlackList: ['weui', 'mu'],
            propList: ['*']
          }),
          Autoprefixer({
            overrideBrowserslist: ['Android >= 4.0', 'iOS >= 7']
          })
        ]
      }
    }
  },
  devServer: {
    proxy: {
      // 设置代理
      '/api': {
        target: 'http://192.168.106.89:8080/', // 真实请求的目标地址
        changeOrigin: true,
        // ws: true,//开启websocket
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    open: true,
    port: 80,
    https: false,
    hotOnly: false
  }
}
