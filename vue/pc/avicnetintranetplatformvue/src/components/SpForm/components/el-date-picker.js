/*
 * @Author: zongmingzhu
 * @Date: 2021-02-07 09:52:06
 * @Last Modified by:   zongmingzhu
 * @Last Modified time: 2021-02-07 09:52:06
 */

import mergeProps from '../utils/merge-props'

export default function (h, v) {
  const defaultProps = {
    props: {
      value: this.form[v.model],
      clearable: true
    },
    attrs: {
      style: {
        width: v.attrs && v.attrs.itemWidth + 'px'
      }
    },
    on: {
      input: value => {
        this.form[v.model] = value
      }
      // ,
      // change: val => {
      //   this.submit()
      // }
    }
  }

  mergeProps(v, defaultProps)

  return h('el-date-picker', defaultProps)
}
