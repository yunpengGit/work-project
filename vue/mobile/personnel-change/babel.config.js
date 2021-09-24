/*
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-05-26 15:48:10
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-04 10:24:51
 */

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'import',
      { libraryName: 'vant', libraryDirectory: 'es', style: true },
      'vant'
    ]
  ],
  'env': {
    'development': {
      'plugins': ['dynamic-import-node'] // 加快热更新速度
    },
    'production': {
      'plugins': ['transform-remove-console'] // 生产环境去除console
    }
  }
}
