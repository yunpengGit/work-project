/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-22 15:22:13
 * @LastEditors: zongmz
 * @LastEditTime: 2021-03-22 15:37:47
 */
const PAGINATION_NAME = process.env.VUE_APP_PAGINATION_NAME
const FORM_NAME = process.env.VUE_APP_FORM_NAME
import { parse } from './router-params'
export default {
  computed: {
    $_params () {
      const o = {}
      Object.keys(this.$route.query).forEach(v => {
        if (`${PAGINATION_NAME}.` === v.substr(0, PAGINATION_NAME.length + 1) || `${FORM_NAME}.` === v.substr(0, FORM_NAME.length + 1)) {
          const c = v.split('.')
          o[c[1]] = { ...o[c[1]], ...parse(c[0], c[1], this.$route.query) }
        }
      })
      return o
    }
  }
}
