/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-16 14:32:35
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-31 15:13:59
 */
module.exports = {
  presets: [
    '@vue/babel-preset-jsx',
    ['@babel/preset-env', {
      corejs: '3',
      useBuiltIns: 'entry'
    }]
  ],
  plugins: [
    'transform-flow-comments'
  ],
  'env': {
    'development': {
      'plugins': ['dynamic-import-node']
    },
    'production': {
      'plugins': ['transform-remove-console']
    }
  }
}
