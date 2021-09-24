/*
 * @Author: zongmingzhu@avic.com
 * @Date: 2021-01-18 20:15:31
 * @Last Modified by: zongmingzhu
 * @Last Modified time: 2021-01-20 09:24:14
 */

import { Object } from 'core-js'

export default function (Vue, UI) {
  if (!UI || !UI.Dialog) return

  const props = {
    ...UI.Dialog.props,
    ...{
      uid: {
        default: 'global'
      }
    }
  }

  return {
    render (h) {
      const props = {}
      const dialogComponentConfig = this.$store.getters.getDialogComponents(
        this.uid
      )

      try {
        const dialogConfig =
          dialogComponentConfig.component.dialogConfig
        if (dialogConfig) {
          Object.keys(dialogConfig).forEach(prop => {
            props[prop] = dialogConfig[prop]
          })
        }
      } catch (error) { throw new Error(error) }

      Object.keys(this.$options.propsData).forEach(prop => {
        props[prop] = this[prop]
      })

      props.visible = this.$store.state.dialog.list.indexOf(this.uid) !== -1
      props['before-close'] = done => {
        this.$store.commit('CLOSE_DIALOG', { uid: this.uid })
        done()
      }

      return h(
        'div',
        {
          class: 'dialog-component'
        },
        [
          h(
            'el-dialog',
            {
              props
            },
            [
              props.visible &&
                h(dialogComponentConfig.component, {
                  props: dialogComponentConfig.props,
                  on: {
                    close: () => {
                      this.$store.commit('CLOSE_DIALOG', { uid: this.uid })
                    }
                  }
                })
            ]
          )
        ]
      )
    },
    props,
    data () {
      return {
        proxy: {}
      }
    }
  }
}
