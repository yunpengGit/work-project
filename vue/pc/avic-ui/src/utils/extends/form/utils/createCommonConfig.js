// 缓存相同的请求
const cache = {}

export const input = (label, model) => {
    return {
        label,
        model,
        type: 'el-input',
        attrs: {
            placeholder: `请输入${label.replace('：', '')}`
        }
    }
}

export const date = (label, model, format) => {
    return {
        label,
        model,
        type: 'el-date-picker',
        props: {
            type: 'datetime',
            placeholder: '请选择结束时间',
            valueFormat: format || 'yyyy-MM-dd',
            format: format || 'yyyy-MM-dd'
        }
    }
}

export const datetimerange = (label, model, format) => {
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
            format: format || 'yyyy-MM-dd HH:mm:ss'
        }
    }
}

export const asyncSelect = (label, model, apiConfig) => {
    /**
   * apiConfig:
   * {
   *  apiMethod:'请求方法',
   *  label:'label映射',
   *  value:'value映射',
   *  data:'返回的数据'
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
            placeholder: `请选择${label.replace('：', '')}`
        },
        init(vm) {
            if (!apiConfig) return
            const key = apiConfig.apiMethod + new Date()
            if (!cache[key]) {
                cache[key] = apiConfig.apiMethod
            }
            cache[key].then(response => {
                if (!response[apiConfig.data]) return
                if (typeof response[apiConfig.data] === 'string') {
                    try {
                        response[apiConfig.data] = JSON.parse(response[apiConfig.data])
                    } catch (error) {}
                }

                this.props.disabled = false
                this.options = response[apiConfig.data].map((v) => {
                    if (!v[apiConfig.label] !== 'obj') {
                        return {
                            label: v[apiConfig.label || 'label'],
                            value: v[apiConfig.value || 'value']
                        }
                    } else {
                        const obj = {
                            label: '',
                            value: ''
                        }
                        for (var pl in v) {
                            obj.label = v[pl]
                            obj.value = pl
                        }
                        return {
                            label: obj.label,
                            value: obj.value
                        }
                    }
                })
            })
        }
    }
}
export const select = (label, model, options) => {
    if (!Array.isArray(options)) return asyncSelect(label, model, options)
    return {
        label,
        model,
        type: 'el-select',
        options: options,
        props: {
            disabled: false,
            filterable: true,
            placeholder: `请选择${label.replace('：', '')}`
        }
    }
}

export const dateRange = (label, model, format) => {
    let type = 'datetimerange'
    if (format == 'yyyy-MM') {
        type = 'monthrange'
    } else if (format == 'yyyy-MM-dd') {
        type = 'daterange'
    } else if (format == 'yyyy-MM-dd HH:mm:ss') {
        type = 'datetimerange'
    }
    return {
        label,
        model,
        type: 'el-date-picker',
        props: {
            type: type,
            'range-separator': '至',
            'start-placeholder': '开始日期',
            'end-placeholder': '结束日期',
            valueFormat: format || 'yyyy-MM-dd HH:mm:ss',
            format: format || 'yyyy-MM-dd HH:mm:ss'
        }
    }
}
