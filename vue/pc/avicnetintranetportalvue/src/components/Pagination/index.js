/*
 * @Descripttion:分页组件
 * @Author: zongmz
 * @Date: 2021-03-22 15:17:07
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-11 18:01:32
 */
import Params, { addRule, parse } from '../utils/router-params'
import { COMPONENT_NAME as FORM_COMPONENT_NAME } from '../SpForm'
import { mapState } from 'vuex'
export const COMPONENT_NAME = 'P'

addRule(COMPONENT_NAME, {
  parse (params) {
    params = params.split('.')
    return {
      pageNum: +params[0],
      pageSize: +params[1]
    }
  },
  componentization (params) {
    return Object.keys(params)
      .map(v => params[v])
      .join('.')
  }
})

export default function (Vue, UI) {
  if (!UI || !UI.Pagination) return
  const props = {
    ...UI.Pagination.props,
    ...{
      uid: { default: 0 },
      init: { type: Boolean, default: true }
    }
  }
  return {
    props,
    data () {
      const params = new Params(COMPONENT_NAME, this.uid)
      const parsedParams = params.parse(this.$route.query)
      return {
        params,
        timer: null,
        proxy: {
          props: {
            pageNum: parsedParams ? parsedParams.pageNum : this.pageNum,
            pageSize: parsedParams ? parsedParams.pageSize : this.pageSize
          },
          events: {
            pageNum: ['update:pageNum', 'current-change'],
            pageSize: ['update:pageSize', 'size-change']
          }
        }
      }
    },
    computed: mapState({
      updateTime: state => state.table.time,
      updateUID: state => state.table.uid
    }),
    watch: {
      updateTime () {
        if (
          this.updateUID === this.uid ||
          this.updateUID === 'UPDATE_ALL_TABLE_DATA'
        ) {
          this.emitChange()
        }
      },
      pageNum (value) {
        this.sync('pageNum', value)
      },
      pageSize (value) {
        this.sync('pageSize', value)
      },
      $route (newValue, oldValue) {
        const newQuery = this.params.parse(newValue.query)
        const oldQuery = this.params.parse(oldValue.query)

        if (!oldQuery && !newQuery) {
          return
        }
        if (oldQuery && !newQuery) {
          Object.keys(this.proxy.props).forEach(prop =>
            this.sync(prop, this[prop], false, false)
          )
          return
        }

        if (!oldQuery && newQuery) {
          Object.keys(this.proxy.props).forEach(prop =>
            this.sync(prop, newQuery[prop], false, false)
          )
          return
        }

        if (oldQuery && newQuery) {
          Object.keys(newQuery).forEach(prop => {
            newQuery[prop] !== oldQuery[prop] &&
              this.sync(prop, newQuery[prop], false, false)
          })
        }
      }
    },
    created () {
      const formParams = parse(
        FORM_COMPONENT_NAME,
        this.uid,
        this.$route.query
      )
      if (this.init || formParams !== null) {
        this.emitChange()
      }
    },
    methods: {
      sizeChange (pageSize) {
        this.sync('pageSize', pageSize)
      },
      currentChange (pageNum) {
        this.sync('pageNum', pageNum)
      },
      syncRouterParams (callback) {
        const arg = [].slice.call(arguments, 1)
        this.$router.push(
          {
            query: {
              ...this.$route.query,
              ...this.params.componentization(this.proxy.props)
            }
          },
          function () {
            callback && callback.apply(callback, arg)
          }
        )
      },
      emitChange (prop, value) {
        const parentListeners = this.$options._parentListeners
        const events = this.proxy.events[prop]

        if (Array.isArray(events)) {
          events.forEach(event => {
            parentListeners.hasOwnProperty(event) && this.$emit(event, value) // eslint-disable-line
          })
        }
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          const formParams = parse(
            FORM_COMPONENT_NAME,
            this.uid,
            this.$route.query
          )
          this.$emit(
            'change',
            formParams
              ? {
                ...this.proxy.props,
                ...formParams
              }
              : {
                ...this.proxy.props
              }
          )
        }, 30)
      },
      sync (prop, value, syncRouter = true, emitChange = true) {
        this.proxy.props[prop] = value
        if (syncRouter && emitChange) {
          this.syncRouterParams(this.emitChange, prop, value)
        }
        if (syncRouter && !emitChange) {
          this.syncRouterParams()
        }
      }
    },
    render (h) {
      const props = {
        background: true,
        layout: 'total, sizes, prev, pager, next, jumper, ->, slot'
      }

      Object.keys(this.$options.propsData).forEach(prop => {
        props[prop] = this[prop]
      })
      props.pageNum = this.proxy.props.pageNum
      props.pageSize = this.proxy.props.pageSize
      props.pagerCount = 5

      return h(
        'div',
        {
          class: 'clearfix'
        },
        [
          this.$slots.default,
          h('el-pagination', {
            props,
            on: {
              'size-change': this.sizeChange,
              'current-change': this.currentChange // pageNum
            }
          })
        ]
      )
    }
  }
}
