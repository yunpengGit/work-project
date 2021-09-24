/*
 * @Description:
 * @Author: peng
 * @Date: 2021-07-06 11:29:22
 * @LastEditors: peng
 * @LastEditTime: 2021-07-06 17:04:50
 */
// https://github.com/michael-ciniawsky/postcss-load-config
module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8']
    },
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
      //selectorBlackList: ['van-']
    }
  }
}
