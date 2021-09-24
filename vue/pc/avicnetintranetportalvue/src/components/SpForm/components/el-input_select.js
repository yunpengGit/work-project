/*
 * @Author: zongmingzhu
 * @Date: 2021-02-07 09:52:14
 * @Last Modified by: zongmingzhu
 * @Last Modified time: 2021-02-09 09:56:10
 */
import mergeProps from '../utils/merge-props'
export default function (h, v) {
  const children = v.children
  const after = v.after
  const slots = []
  const inputProps = {
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
    },
    nativeOn: {
      keyup: event => {
        if (event.keyCode === 13) {
          this.submit()
        }
        if (event.keyCode === 27) {
          this.reset()
        }
      }
    }
  }
  const afterProps = {
    class: ['input_select_button'],
    props: {
      icon: 'el-icon-search'
    },
    on: {
      click: () => {}
    }
  }
  const selectProps = {
    props: {
      value: this.form[children.model],
      clearable: false,
      filterable: false
    },
    on: {
      input: value => {
        this.form[children.model] = value
      },
      change: value => {
        this.form[children.model] = value
      }
    }
  }
  mergeProps(v, inputProps)
  if (children) {
    mergeProps(children, selectProps)
    const select = h(
      'el-select',
      selectProps,
      Array.isArray(children.options) &&
        children.options.length !== 0 &&
        children.options.map(c => {
          return h('el-option', {
            props: {
              key: c.value,
              label: c.label,
              value: c.value
            }
          })
        })
    )
    slots.push(select)
  }
  if (after) {
    mergeProps(after, afterProps)
    const afterEle = h(after.type, afterProps)
    slots.push(afterEle)
  }
  const input = h('el-input', inputProps, slots)
  return input
}
