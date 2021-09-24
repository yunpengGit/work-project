/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-24 11:04:39
 * @LastEditors: zongmz
 * @LastEditTime: 2021-03-26 14:11:33
 */
import mergeProps from '../utils/merge-props'

export default function (h, v) {
  const defaultProps = {
    props: {
      value: this.form[v.model]
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
      'el-radio-group',
      defaultProps,
      v.options.map(v => {
        return h('el-radio', {
          props: {
            label: v.value
          }
        }, v.label)
      })
    )
  } else {
    return h('el-radio', defaultProps, v.options[0])
  }
}
