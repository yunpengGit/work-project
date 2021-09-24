/*
 * @Author: your name
 * @Date: 2020-10-19 22:51:53
 * @LastEditTime: 2020-10-19 23:32:21
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \h\h5\babel.config.js
 */
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
}
