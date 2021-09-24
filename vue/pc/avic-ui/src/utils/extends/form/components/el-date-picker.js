/*
 * @Author: zongmingzhu@avic.com
 * @Date: 2021-01-18 20:15:31
 * @Last Modified by: zongmingzhu
 * @Last Modified time: 2018-09-17 16:54:13
 */

import mergeProps from '../utils/merge-props'

export default function (h, v) {
  const defaultProps = {
    props: {
      value: this.form[v.model],
      clearable: true
    },
    on: {
      input: (value) => {
        this.form[v.model] = value
      }
    }
  }

  mergeProps(v, defaultProps)

  return h('el-date-picker', defaultProps)
}
