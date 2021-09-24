/*
 * @Author: zongmingzhu
 * @Date: 2021-02-07 10:17:03
 * @Last Modified by: zongmingzhu
 * @Last Modified time: 2021-02-08 18:10:07
 */
const cache = {}
// 缓存相同的请求
import api from '@/api-manage'
export const input = (label, model, options = {}, placeholder, rules) => {
  return {
    label,
    model,
    type: 'el-input',
    rules,
    attrs: {
      inheritAttrs: true,
      placeholder: placeholder || `请输入${label.replace('：', '')}`,
      ...options
    }
  }
}
export const selectInput = (inputConfig, selectConfig, afterConfig) => {
  const select = {
    label: selectConfig.label,
    model: selectConfig.model,
    type: 'el-select',
    options: selectConfig.options,
    slot: 'prepend',
    default: selectConfig.default || '',
    props: {
      disabled: false,
      filterable: false,
      placeholder: '请选择'
    },
    class: ['input_select_search'],
    ...selectConfig.props
  }
  const after = afterConfig
  const input = {
    label: inputConfig.label,
    model: inputConfig.model,
    type: 'el-input_select',
    attrs: {
      inheritAttrs: true,
      placeholder:
        inputConfig.placeholder || `请输入${inputConfig.label.replace('：', '')}`
    },
    ...inputConfig.options,
    children: select,
    after
  }
  return input
}
export const date = (label, model, format, tips, pickerOptions, attrs) => {
  return {
    label,
    model,
    type: 'el-date-picker',
    props: {
      type: 'datetime',
      placeholder: tips || '请选择结束时间',
      valueFormat: format || 'yyyy-MM-dd',
      format: format || 'yyyy-MM-dd',
      pickerOptions: pickerOptions
    },
    attrs: {
      ...attrs
    }
  }
}
export const datetimerange = (label, model, format, pickerOptions, isUnLink, attrs) => {
  return {
    label,
    model,
    type: 'el-date-picker',
    props: {
      type: 'datetimerange',
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '结束日期',
      valueFormat: format || 'yyyy-MM-dd HH:mm:ss',
      format: format || 'yyyy-MM-dd HH:mm:ss',
      pickerOptions: pickerOptions,
      'unlink-panels': isUnLink
    },
    attrs: {
      ...attrs
    }
  }
}
export const daterange = (label, model, format, pickerOptions, isUnLink, attrs) => {
  return {
    label,
    model,
    type: 'el-date-picker',
    props: {
      type: 'daterange',
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '结束日期',
      valueFormat: format || 'yyyy-MM-dd',
      format: format || 'yyyy-MM-dd',
      pickerOptions: pickerOptions,
      'unlink-panels': isUnLink
    },
    attrs: {
      ...attrs
    }
  }
}

export const asyncSelect = (
  label,
  model,
  apiConfig,
  attr,
  isMultiple = false
) => {
  /**
   * isMultiple 是否多选
   * apiConfig:
   * {
   *  api:'请求key',
   *  params:'参数',
   *  label:'lable映射',
   *  value:'value映射'
   * }
   */
  return {
    label,
    model,
    type: 'el-select',
    options: [],
    props: {
      disabled: true,
      filterable: true,
      multiple: isMultiple,
      placeholder: `请选择${label.replace('：', '')}`
    },
    attrs: {
      ...attr
    },
    init () {
      if (!apiConfig) return
      const key = apiConfig.api + JSON.stringify(apiConfig.params)
      if (!cache[key]) {
        cache[key] = api.request(apiConfig.api, apiConfig.params)
      }
      cache[key].then(response => {
        if (!Array.isArray(response.data)) {
          response = response.data
        }
        if (!response[apiConfig.data]) return

        if (typeof response[apiConfig.data] === 'string') {
          try {
            response[apiConfig.data] = JSON.parse(response[apiConfig.data])
          } catch (error) {
            throw new Error(error)
          }
        }
        this.props.disabled = false
        this.options = response[apiConfig.data].map(v => {
          return {
            label: v[apiConfig.label] || v,
            value: v[apiConfig.value] || v
          }
        })
        if (apiConfig.isAll) {
          this.options.unshift({ label: '全部', value: null })
        }
      })
    }
  }
}
export const select = (label, model, options, attr, isMultiple) => {
  if (!Array.isArray(options)) return asyncSelect(label, model, options, attr, isMultiple)
  return {
    label,
    model,
    type: 'el-select',
    options: options,
    props: {
      disabled: false,
      filterable: true,
      multiple: isMultiple,
      placeholder: `请选择${label.replace('：', '')}`
    },
    attrs: {
      ...attr
    }
  }
}
/**
 * apiConfig:
 * {
 *  api:'请求key',
 *  params:'参数',
 *  label:'lable映射',
 *  value:'value映射'
 *  props: {} 支持 Tree props属性 参考 https://www.antdv.com/components/tree-select-cn/
 *  children: string 非异步使用参数 用来获取字数据 默认为 children
 *  isLeaf: string 根据那个参数来判断是否有子集
 *  async: {
 *    api: 'http://xxx.com'
 *    params: [] 指定参数集合 如果需要自定义 修改格式为 ['parentId=id']
 *  }
 * }
 */
export const cascader = (label, model, apiConfig, options = {}, attrs) => {
  let config = {}
  if (options.props) {
    config = options.props
    delete options.props
  }
  let props = {
    disabled: false,
    filterable: true,
    placeholder: `请选择${label.replace('：', '')}`,
    clearable: true,
    'collapse-tags': true,
    props: {
      expandTrigger: 'hover',
      emitPath: config.emitPath,
      checkStrictly: config.checkStrictly,
      label: apiConfig.label,
      value: apiConfig.value,
      lazy: apiConfig.lazyConfig ? true : false,
      lazyLoad: (node, resolve) => {
        const config = apiConfig.lazyConfig
        if (!config) return
        if (node.level >= config.level) {
          resolve([])
          return
        }
        const params = {}
        if (typeof config.params === 'object') {
          for (const i in config.params) {
            params[i] = node.data ? node.data[apiConfig.value] : ''
          }
        }
        api.request(config.api, params).then(response => {
          if (!Array.isArray(response.data)) {
            response = response.data
          }
          if (!response[config.data]) return
          if (typeof response[config.data] === 'string') {
            try {
              response[config.data] = JSON.parse(response[config.data])
            } catch (error) {
              throw new Error(error)
            }
          }
          const options = response[config.data].map(v => {
            if (Object.prototype.hasOwnProperty.call(v, 'lable')) {
              v.label = v.lable
            }
            const objData = {
              leaf: node.level >= config.level - 1 ? true : false
            }
            objData[apiConfig.label] = v[apiConfig.label || 'label']
            objData[apiConfig.value] = v[apiConfig.value || 'value']
            return objData
          })
          resolve(options)
        })
      }
    }
  }
  props = { ...props, ...options }
  props.props = { ...props.props, ...config }
  return {
    label,
    model,
    type: 'el-cascader',
    props,
    options: [],
    init () {
      if (!apiConfig) {
        this.options = [{ label: '无数据', value: '' }]
        return
      }
      const key = apiConfig.api + JSON.stringify(apiConfig.params)
      if (!cache[key]) {
        cache[key] = api.request(apiConfig.api, apiConfig.params)
      }
      cache[key].then(response => {
        if (!Array.isArray(response.data)) {
          response = response.data
        }
        if (!response[apiConfig.data]) return
        if (typeof response[apiConfig.data] === 'string') {
          try {
            response[apiConfig.data] = JSON.parse(response[apiConfig.data])
          } catch (error) {
            throw new Error(error)
          }
        }
        this.props.disabled = false
        this.options = response[apiConfig.data].map(v => {
          if (Object.prototype.hasOwnProperty.call(v, 'lable')) {
            v.label = v.lable
          }
          const objData = {
            disabled: !props.props.selectDisable
          }
          objData[apiConfig.label] = v[apiConfig.label || 'label']
          objData[apiConfig.value] = v[apiConfig.value || 'value']

          if (props.props.children) {
            objData[props.props.children] = v[props.props.children]
          }
          return objData
        })
      })
    },
    attrs: {
      ...attrs
    }
  }
}

export const asyncRadio = (
  label,
  model,
  apiConfig,
  attr,
  type = 'el-radio'
) => {
  /**
   * apiConfig:
   * {
   *  api:'请求key',
   *  params:'参数',
   *  label:'lable映射',
   *  value:'value映射'
   * }
   */
  return {
    label,
    model,
    type,
    options: [],
    props: {
      disabled: true
    },
    attrs: {
      ...attr
    },
    init () {
      if (!apiConfig) return
      const key = apiConfig.api + JSON.stringify(apiConfig.params)
      if (!cache[key]) {
        cache[key] = api.request(apiConfig.api, apiConfig.params)
      }
      cache[key].then(response => {
        if (!Array.isArray(response.data)) {
          response = response.data
        }
        if (!response[apiConfig.data]) return

        if (typeof response[apiConfig.data] === 'string') {
          try {
            response[apiConfig.data] = JSON.parse(response[apiConfig.data])
          } catch (error) {
            throw new Error(error)
          }
        }
        this.props.disabled = false
        this.options = response[apiConfig.data].map(v => {
          return {
            label: v[apiConfig.label] || v,
            value: v[apiConfig.value] || v
          }
        })
        if (apiConfig.isAll) {
          this.options.unshift({ label: '不限', value: null })
        }
      })
    }
  }
}
export const radio = (label, model, options, attr) => {
  if (!Array.isArray(options)) return asyncRadio(label, model, options, attr)
  return {
    label,
    model,
    type: 'el-radio',
    options: options,
    props: {
      disabled: false
    },
    attrs: {
      ...attr
    }
  }
}

export const radioDiy = (label, model, options, attr) => {
  const type = 'el-radio-diy'
  if (!Array.isArray(options)) return asyncRadio(label, model, options, attr, type)
  return {
    label,
    model,
    type,
    options: options,
    props: {
      disabled: false
    },
    attrs: {
      ...attr
    }
  }
}

export const asyncCheckbox = (
  label,
  model,
  apiConfig,
  attr
) => {
  /**
   * apiConfig:
   * {
   *  api:'请求key',
   *  params:'参数',
   *  label:'lable映射',
   *  value:'value映射'
   * }
   */
  return {
    label,
    model,
    type: 'el-checkbox',
    options: [],
    props: {
      disabled: true
    },
    attrs: {
      ...attr
    },
    init () {
      if (!apiConfig) return
      const key = apiConfig.api + JSON.stringify(apiConfig.params)
      if (!cache[key]) {
        cache[key] = api.request(apiConfig.api, apiConfig.params)
      }
      cache[key].then(response => {
        if (!Array.isArray(response.data)) {
          response = response.data
        }
        if (!response[apiConfig.data]) return

        if (typeof response[apiConfig.data] === 'string') {
          try {
            response[apiConfig.data] = JSON.parse(response[apiConfig.data])
          } catch (error) {
            throw new Error(error)
          }
        }
        this.props.disabled = false
        this.options = response[apiConfig.data].map(v => {
          return {
            label: v[apiConfig.label] || v,
            value: v[apiConfig.value] || v
          }
        })
        if (apiConfig.isAll) {
          this.options.unshift({ label: '不限', value: null })
        }
      })
    }
  }
}
export const checkbox = (label, model, options, attr) => {
  if (!Array.isArray(options)) return asyncCheckbox(label, model, options, attr)
  return {
    label,
    model,
    type: 'el-checkbox',
    options: options,
    props: {
      disabled: false
    },
    attrs: {
      ...attr
    }
  }
}
