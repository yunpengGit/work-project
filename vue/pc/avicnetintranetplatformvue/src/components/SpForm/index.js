import * as formItems from '@/form-search'
import { Base64 } from 'js-base64'
import { Object } from 'core-js'
import Params, { addRule, parse, componentization } from '../utils/router-params'
import { COMPONENT_NAME as PAGINATION_COMPONENT_NAME } from '../Pagination'

function removeEmptyParams (params) {
  let o = null
  let c = null
  let i = null
  for (i in params) {
    c = params[i]
    if (c !== '') {
      if (o === null) {
        o = {}
      }
      o[i] = c
    }
  }
  return o
}
export const COMPONENT_NAME = 'F'
addRule(COMPONENT_NAME, {
  parse (params) {
    return JSON.parse(Base64.decode(params))
  },
  componentization (params) {
    return Base64.encode(JSON.stringify(params))
  }
})

export default function (Vue, UI) {
  const props = {
    ...UI.Form.props,
    ...{
      uid: { default: 0 },
      pagination: {
        default: () => {
          return { pageNum: 1, pageSize: 10 }
        }
      },
      keys: {
        type: String,
        default: '',
        required: true
      },
      keysMore: {
        type: String,
        default: ''
      },
      count: {
        type: Number,
        default: 99
      },
      layout: {
        type: String,
        default: 'submit,reset'
      }
    }
  }

  return {
    data () {
      const params = new Params(COMPONENT_NAME, this.uid)
      const parsedParams = params.parse(this.$route.query) || {}
      const form = {}
      const initQueue = []
      const items = []
      const itemMores = []
      Object.keys(formItems)
        .filter((v) => ~this.keys.split(',').map((v) => v.trim()).indexOf(v))
        .sort((a, b) => this.keys.indexOf(a) - this.keys.indexOf(b))
        .forEach(v => Array.isArray(formItems[v]) ? formItems[v].forEach((v) => items.push(v)) : items.push(formItems[v])
        )

      items.forEach(item => {
        form[item.model] = parsedParams[item.model] || item.default || ''
        item.init && initQueue.push(item)
      })
      if (this.keysMore) {
        Object.keys(formItems)
          .filter((v) => ~this.keysMore.split(',').map((v) => v.trim()).indexOf(v))
          .sort((a, b) => this.keysMore.indexOf(a) - this.keysMore.indexOf(b))
          .forEach(v => Array.isArray(formItems[v]) ? formItems[v].forEach((v) => itemMores.push(v)) : itemMores.push(formItems[v])
          )
        itemMores.forEach(item => {
          form[item.model] = parsedParams[item.model] || item.default || ''
          item.init && initQueue.push(item)
        })
      }
      return {
        initQueue,
        params,
        items,
        itemMores,
        form,
        expand: false,
        expandClassList: 'sp-form-box'
      }
    },
    watch: {
      $route (newValue, oldValue) {
        const newQuery = this.params.parse(newValue.query)
        const oldQuery = this.params.parse(oldValue.query)
        if (!oldQuery && !newQuery) {
          // this.reset()
          return
        }
        if (oldQuery && !newQuery) {
          this.reset()
          return
        }

        if (!oldQuery && newQuery) {
          this.form = {
            ...this.form,
            ...newQuery
          }
          return
        }

        if (oldQuery && newQuery) {
          Object.keys(newQuery).forEach(prop => {
            if (newQuery[prop] !== oldQuery[prop]) {
              this.form[prop] = newQuery[prop]
            }
          })
        }
      }
    },
    mounted () {
      this.initQueue.forEach(v => {
        v.init(this)
      })
    },
    methods: {
      syncRouterParams (callback) {
        const arg = [].slice.call(arguments, 1)
        // 临时对路由数据处理
        const paginationRouterParams = parse(
          PAGINATION_COMPONENT_NAME,
          this.uid,
          this.$route.query
        )
        // 去空参
        let form = removeEmptyParams(arg[0])
        let query = {
          ...this.$route.query,
          ...this.params.componentization(form)
        }

        if (form === null) {
          delete query[`${COMPONENT_NAME}.${this.uid}`]
        }
        if (paginationRouterParams) {
          paginationRouterParams.pageNum = 1
          form = {
            ...form,
            ...paginationRouterParams
          }
          query = {
            ...query,
            ...componentization(
              PAGINATION_COMPONENT_NAME,
              this.uid,
              paginationRouterParams
            )
          }
        } else {
          form = {
            ...form,
            ...this.pagination
          }
          query = {
            ...query,
            ...componentization(
              PAGINATION_COMPONENT_NAME,
              this.uid,
              this.pagination
            )
          }
        }

        arg[0] = form || {}

        // 强制change
        if (JSON.stringify(query) === JSON.stringify(this.$route.query)) {
          callback && callback.apply(callback, arg)
          return
        }

        this.$router.push(
          {
            query
          },
          function () {
            callback && callback.apply(callback, arg)
          }
        )
      },
      submit () {
        this.$refs[`sp-form-${this.uid}`].validate(valid => {
          if (valid) {
            this.syncRouterParams(form => {
              this.$emit('change', form)
              this.expand = false
              window.postMessage({ type: 'expand', isExpand: this.expand })
            }, this.form)
          }
        })
      },
      reset () {
        this.$refs[`sp-form-${this.uid}`].resetFields()
        Object.keys(this.form).forEach(v => {
          try {
            this.form[v] = this.items.filter(c => c.model === v)[0].default || ''
          } catch (error) {
            this.form[v] = ''
          }
        })
        this.syncRouterParams(form => {
          this.$emit('reset', form)
        }, this.form)
      },
      toggle () {
        this.expand = !this.expand
        window.postMessage({ type: 'expand', isExpand: this.expand })
      },
      close () {
        this.expand = false
        window.postMessage({ type: 'expand', isExpand: this.expand })
      },
      stops (e) {
        // console.log(e, 22)
        e.preventDefault()
      }
    },
    props,
    render (h) {
      const props = {
        inline: true,
        model: this.form
      }
      Object.keys(this.$options.propsData).forEach(prop => {
        props[prop] = this[prop]
      })
      return <div ref='sp-form' class={this.expandClassList}>
        <el-form {...{ props: props }} label-position='right' nativeOnSubmit= {e => this.stops(e)} ref={'sp-form-' + this.uid}><div class='filter-box'>
          <div class='filter-box-dis'>
            {
              ...this.items.map((v, i) => {
                let rules = v.rules || []
                if (typeof rules === 'function') {
                  rules = rules.call(v, this)
                }
                return <el-form-item {...{ props: { label: v.label, prop: v.model, rules }}}>{require(`./components/${v.type}`).default.call(this, h, v)}</el-form-item>
              })
            }
            {
              !this.keysMore && <el-button {...{ on: { click: this.reset }}}>重置</el-button>
            }
            {
              !this.keysMore && <el-button {...{ props: { type: 'primary' }, on: { click: this.submit }}}>查询</el-button>
            }
            {
              this.keysMore && <el-button class='expand-btn' {...{ props: { type: 'text' }}} on-click={this.toggle}>高级搜索 <i class={this.expand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'}></i></el-button>
            }
            { this.$slots.default && h('div', { class: 'filter-handle' }, this.$slots.default) }
          </div>
          {
            this.expand && <div class='filter-box-dis expand-box-dis'>
              {
                ...this.itemMores.map((v, i) => {
                  let rules = v.rules || []
                  if (typeof rules === 'function') {
                    rules = rules.call(v, this)
                  }
                  return <el-form-item {...{ props: { label: v.label, prop: v.model, rules }}}>{require(`./components/${v.type}`).default.call(this, h, v)}</el-form-item>
                })
              }
              <div class='expand-box-btn'>
                {
                  this.layout.indexOf('reset') !== -1 && <el-button {...{ on: { click: this.reset }}}>重置</el-button>
                }
                {
                  this.layout.indexOf('submit') !== -1 && <el-button {...{ props: { type: 'primary' }, on: { click: this.submit }}}>查询</el-button>
                }
                <el-button {...{ on: { click: this.close }}}>关闭</el-button>
              </div>
            </div>
          }
        </div>
        </el-form>
      </div >
    }
  }
}
