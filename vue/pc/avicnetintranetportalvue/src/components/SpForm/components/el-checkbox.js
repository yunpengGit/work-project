/*
 * @Author: zongmingzhu
 * @Date: 2021-02-07 09:51:57
 * @Last Modified by: zongmingzhu
 * @Last Modified time: 2021-02-23 17:04:52
 */
import mergeProps from '../utils/merge-props'

export default function (h, v) {
  const defaultProps = {
    props: {
      value: [this.form[v.model]]
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
  if (Array.isArray(v.options)) {
    return h(
      'el-checkbox-group',
      defaultProps,
      v.options.map(v => {
        return h('el-checkbox', {
          props: {
            label: v.value
          }
        }, v.label)
      })
    )
  } else {
    return h('el-checkbox', defaultProps, v.options[0])
  }
}
