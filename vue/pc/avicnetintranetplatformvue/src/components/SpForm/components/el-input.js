/*
 * @Author: zongmingzhu
 * @Date: 2021-02-07 09:52:21
 * @Last Modified by: zongmingzhu
 * @Last Modified time: 2021-02-09 09:52:22
 */
import mergeProps from '../utils/merge-props'
export default function (h, v) {
  const defaultProps = {
    props: { value: this.form[v.model], clearable: true },
    on: {
      input: value => {
        this.form[v.model] = value
      }
      // change: val => {
      //   this.submit()
      // },
      // blur: val => {
      //   this.submit()
      // }
    },
    attrs: {
      style: {
        'width': v.attrs && v.attrs.itemWidth + 'px'
      }
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
  mergeProps(v, defaultProps)
  return h('el-input', defaultProps)
}
