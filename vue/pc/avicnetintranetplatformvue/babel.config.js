/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-31 09:05:30
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-10 10:22:57
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
  ]
}
