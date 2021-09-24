/*
 * @Author: zongmingzhu
 * @Date: 2021-02-07 09:51:45
 * @Last Modified by: zongmingzhu
 * @Last Modified time: 2021-02-07 10:14:39
 */

import mergeProps from '../utils/merge-props'

export default function (h, v) {
  const defaultProps = {
    props: {
      value: this.form[v.model],
      clearable: true,
      options: []
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
  defaultProps.props['options'] = v.options
  return h('el-cascader', defaultProps)
}
