/*
 * @Author: zongmingzhu
 * @Date: 2021-02-07 09:52:29
 * @Last Modified by: zongmingzhu
 * @Last Modified time: 2021-02-09 09:34:27
 */

import mergeProps from '../utils/merge-props'

export default function (h, v) {
  const defaultProps = {
    props: {
      value: this.form[v.model],
      clearable: true
    },
    on: {
      input: value => {
        if (v.relational) {
          this.form[v.relational] = ''
        }
        this.form[v.model] = value
      }
      // ,
      // change: val => {
      //   this.submit()
      // }
    },
    attrs: {
      style: `width: ${v.attrs && v.attrs.itemWidth}px`
    }
  }
  mergeProps(v, defaultProps)

  if (typeof defaultProps.props['remote-method'] === 'function') {
    const oldRemoteMethod = defaultProps.props['remote-method']
    defaultProps.props['remote-method'] = function () {
      oldRemoteMethod.apply(v, arguments)
    }
  }

  return h(
    'el-select',
    defaultProps,
    Array.isArray(v.options) &&
    v.options.length !== 0 &&
    v.options.map(v => {
      return h('el-option', {
        props: {
          key: v.value,
          label: v.label,
          value: v.value
        }
      })
    })
  )
}
