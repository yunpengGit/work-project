/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-04-09 09:25:01
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-31 16:18:22
 */

import { Object } from 'core-js'
import getHeight from '@/mixins/getHeight'

export default function (Vue, UI) {
  if (!UI || !UI.Table) return

  const props = {
    ...UI.Table.props,
    ...{
      uid: { default: 0 },
      loading: { type: Boolean, default: false },
      tableCols: { required: true, type: Array, default: () => [] },
      api: { type: Function, default: () => {}, required: true },
      isIndex: { type: Boolean, default: false },
      indexLabel: { type: String, default: '序号' },
      keys: { type: String, default: '' },
      keysMore: { type: String, default: '' },
      pagination: { default: () => {
        return { pageNum: 1, pageSize: 10 }
      }
      },
      pageHieght: { type: [String, Boolean], default: true || '' },
      tableHieght: { type: String },
      inlineMode: { type: Boolean, default: false }, // 表格布局模式：行内【分页紧随表格，非固定页面底部】
      expandRowKeys: { type: Array, default: () => [] },
      rowKey: { type: String, default: 'id' },
      count: {
        default: 99
      },
      selection: {
        default: null
      },
      singleRow: {
        default: null
      },
      init: {
        default: true
      },
      layout: {
        default: 'total, sizes, prev, pager, next, jumper, ->, slot'
      },
      btnLayout: {
        default: 'submit,reset'
      }
    }
  }

  function getColumnProp (colProp, rowConfig, h) {
    return colProp(rowConfig)
  }

  return {
    render (h) {
      const props = {
        border: false,
        data: this.tableData,
        'empty-text': this.statusText,
        size: this.size,
        'expand-row-keys': this.expandRowKeys,
        'row-key': this.rowKey,
        'max-height': this.tableHieght ? this.tableHieght : (this.inlineMode ? '100%' : this.heightObj.table)
      }

      const on = {}
      on['row-click'] = rows => this.$emit('rowClick', rows)

      if (!Array.isArray(this.selection) && this.selection !== null) {
        props['highlight-current-row'] = true
        on['current-change'] = rows => this.$emit('update:selection', rows)
      }

      const tableColumn = this.tableCols.map(v => {
        const o = {
          props: {
            ...v
          }

        }
        if (typeof v.prop !== 'string') {
          o.scopedSlots = {
            default: props => {
              return getColumnProp.call(this, v.template, props, h)
            }
          }
          delete o.props.prop
        }
        return h('el-table-column', o)
      })

      if (this.$slots.default || this.$scopedSlots.default) {
        tableColumn.unshift(
          h(
            'el-table-column',
            {
              props: {
                type: 'expand',
                width: '65',
                align: 'center'
              },
              scopedSlots: this.$scopedSlots
            },
            this.$slots.default
          )
        )
      }

      if (this.isIndex && this.tableCols.length) {
        tableColumn.unshift(
          h('el-table-column', {
            props: {
              label: this.indexLabel,
              type: 'index',
              width: '65',
              align: 'center'
            }
          })
        )
      }

      if (Array.isArray(this.selection)) {
        on['selection-change'] = rows => this.$emit('update:selection', rows)
        tableColumn.unshift(
          h('el-table-column', {
            props: {
              type: 'selection',
              width: '65',
              align: 'center'
            }
          })
        )
      }

      Object.keys(this.$options.propsData).forEach(prop => {
        props[prop] = this[prop]
      })
      const pageHieght = typeof (this.pageHieght)
      // console.log(pageHieght, 222, this.pageHieght, typeof (pageHieght))
      return h(
        'section',
        {
          class: 'sp-page-box',
          style: {
            'height': pageHieght === 'boolean' && this.pageHieght === true ? this.heightObj.page : pageHieght === 'string' ? this.pageHieght : ''
          },
          ref: 'spPageBox'
        },
        [
          this.keys &&
          h(
            'sp-form',
            {
              props: {
                keys: this.keys,
                keysMore: this.keysMore,
                uid: this.uid,
                pagination: this.pagination
              },
              on: {
                change: this.change
              }
            },
            this.$slots.form
          ),
          h('section', {
            class: {
              'sp-table-page': true,
              'inline-mode': this.inlineMode
            }
          },
          [
            this.$slots.handle && h('section', { class: 'sp-handle' }, this.$slots.handle),
            h('section', { class: 'sp-table' },
              [
                h(
                  'el-table',
                  {
                    props,
                    on,
                    ref: `sp-table-${this.uid}`
                  },
                  tableColumn
                ),
                this.init && h('sp-pagination', {
                  props: {
                    total: this.total,
                    init: this.init,
                    uid: this.uid,
                    layout: this.layout
                  },
                  on: {
                    change: this.change
                  },
                  class: 'sp-pagination'
                })
              ]
            )
          ]
          )

        ]
      )
    },
    props,
    data () {
      return {
        tableData: [],
        total: 0,
        statusText: '正在加载配置...',
        tableIsHide: this.init === false
      }
    },
    mixins: [getHeight],
    methods: {
      change (params) {
        const getTableData = this.api.call(this, params) // eslint-disable-line
        getTableData.then(
          response => {
            let tableData = response.rows || response.data
            if (Array.isArray(tableData)) {
              this.tableData = tableData
            } else {
              // 统一表格参数规范前，尝试自动修正参数
              try {
                let count = 0
                Object.keys(response).forEach(key => {
                  if (Array.isArray(response[key])) {
                    count++
                    // console.warn(`尝试修正${key}为list`)
                    tableData = response[key]
                  }
                })
                if (count === 1) {
                  // 存在风险,需要添加捕获方法自查
                  this.tableData = tableData
                } else {
                  throw new Error('尝试自动读取表格数据项出错，请手动修正！')
                }
              } catch (error) {
                console.error(error)
                this.tableData = []
              }
            }
            if (Object.keys(response).indexOf('total') > -1) {
              this.total = response.total
            }
            if (this.tableData.length === 0) {
              this.statusText = '没有搜到您要查询的内容，换个搜索条件试试!'
            }
          },
          () => {
            // throw new Error(error)
            this.tableData = []
            this.statusText = '数据加载失败!'
          }
        )
        this.statusText = '正在加载数据...'
      }
    }
  }
}
