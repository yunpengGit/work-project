// const VantThemeConfig = require('./src/vant.theme')
module.exports = {
  lintOnSave: true,
  assetsDir: 'circulateAssets',
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
};
