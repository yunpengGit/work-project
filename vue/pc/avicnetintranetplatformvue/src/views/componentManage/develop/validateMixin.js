/*
 * @Author: caofeng
 * @LastEditors: caofeng
 * @Date: 2021-08-11 14:51:03
 * @LastEditTime: 2021-08-12 17:16:31
 * @FilePath: \conferenceH5e:\项目\内网\avicnetintranetplatformvue\src\views\componentManage\develop\validateMixin.js
 */

const validateMixin = {
  data () {
    return {
      rules: {
        label: [
          { required: true, message: '必填项', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        iconUrl: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        categoryId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        secretLevel: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        'componentAttr.reqParams.dataType': [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        'componentAttr.reqParams.version': [
          { required: true, validator: this.validateVersion, trigger: 'change' }
        ],
        'componentAttr.reqParams.apiName': [
          { required: true, validator: this.validateApiName, trigger: 'change' }
        ],
        'componentAttr.reqParams.method': [
          { required: true, validator: this.validateMethod, trigger: 'change' }
        ],
        'componentAttr.reqParams.url': [
          { required: true, validator: this.validateUrl, trigger: 'change' }
        ],
        'componentAttr.reqParams.head': [
          { validator: this.validateHead, trigger: 'change' }
        ],
        'componentAttr.reqParams.body': [
          { validator: this.validateBody, trigger: 'change' }
        ],
        'componentAttr.reqParams.list': [
          { required: true, validator: this.validateList, trigger: 'change' }
        ],
        'componentAttr.moreLink': [
          { validator: this.validateMoreLink, trigger: 'blur' }
        ]
      }
    }
  },
  created () {},
  computed: {
    dataType () { // 数据来源： 静态数据2 or 接口请求1
      return this.form.componentAttr.reqParams.dataType
    }
  },
  methods: {
    // 如果更多勾选 更多地址必须写
    validateMoreLink (rule, value, callback) {
      if (!this.form.componentAttr.showMoreBtn) {
        callback()
      } else if (!value) {
        callback(new Error('必填项'))
      } else {
        callback()
      }
    },
    // 校验百分比
    validatePercent (d) {
      const reg = /^([1-9]\d*|0\.|[1-9]\d*\.)(\d{1,2})?$/
      if (!reg.test(d.width)) {
        d.width = d.width.slice(0, d.width.length - 1)
      }
    },
    // 表单校验--csb版本号
    validateVersion (rule, value, callback) {
      if (this.dataType === '3' && !value) {
        callback(new Error('必填项'))
      } else {
        callback()
      }
    },
    // 表单校验--csb服务名称
    validateApiName (rule, value, callback) {
      if (this.dataType === '3' && !value) {
        callback(new Error('必填项'))
      } else {
        callback()
      }
    },
    // 表单校验--接口请求方式
    validateMethod (rule, value, callback) {
      if (this.dataType !== '2' && !value) {
        callback(new Error('必填项'))
      } else {
        callback()
      }
    },
    // 表单校验--接口请求地址
    validateUrl (rule, value, callback) {
      const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
      if (this.dataType !== '1') {
        callback()
      } else if (!value) {
        callback(new Error('必填项'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入合法的请求地址'))
      } else {
        callback()
      }
    },
    // 表单校验--接口请求head
    validateHead (rule, value, callback) {
      if (this.dataType !== '2' && value && !this.isJson(value)) {
        callback(new Error('必须为JSON数据'))
      } else {
        callback()
      }
    },
    // 表单校验--接口请求body
    validateBody (rule, value, callback) {
      if (this.dataType !== '2' && value && !this.isJson(value)) {
        callback(new Error('必须为JSON数据'))
      } else {
        callback()
      }
    },
    // 表单校验--静态数据
    validateList (rule, value, callback) {
      if (this.dataType !== '2') {
        callback()
      } else if (!value) {
        callback(new Error('必填项'))
      } else if (!this.isJson(value)) {
        callback(new Error('必须为JSON数据'))
      } else {
        callback()
      }
    },
    // 是否是json
    isJson (data) {
      try {
        JSON.parse(data)
        return true
      } catch (e) {
        return false
      }
    }
  }
}
export default validateMixin
