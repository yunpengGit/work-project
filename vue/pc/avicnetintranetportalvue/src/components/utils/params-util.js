/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-22 15:22:13
 * @LastEditors: zongmz
 * @LastEditTime: 2021-03-22 17:59:41
 */
import { COMPONENT_NAME as PAGINATION_COMPONENT_NAME } from '../Pagination/pagination'
import { COMPONENT_NAME as FORM_COMPONENT_NAME } from '../SpForm/SpForm'
import { parse } from './router-params'
export default {
  computed: {
    $_params () {
      const o = {}
      Object.keys(this.$route.query).forEach(v => {
        if (`${PAGINATION_COMPONENT_NAME}.` === v.substr(0, PAGINATION_COMPONENT_NAME.length + 1) || `${FORM_COMPONENT_NAME}.` === v.substr(0, FORM_COMPONENT_NAME.length + 1)) {
          const c = v.split('.')
          o[c[1]] = { ...o[c[1]], ...parse(c[0], c[1], this.$route.query) }
        }
      })
      return o
    }
  }
}
