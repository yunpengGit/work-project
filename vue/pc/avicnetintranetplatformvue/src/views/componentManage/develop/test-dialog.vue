<!--
 * @Author: caofeng
 * @LastEditors: caofeng
 * @Date: 2021-07-22 19:07:34
 * @LastEditTime: 2021-08-12 17:09:24
 * @FilePath: \conferenceH5e:\项目\内网\avicnetintranetplatformvue\src\views\componentManage\develop\test-dialog.vue
-->
<template>
  <el-dialog
    title=""
    :visible="dialogVisible"
    width="450px"
    @update:visible="closeDialog"
  >
    <div slot="title" class="content-head">
      <p>
        <i :class="[`${testResult.icon}`]" />{{ testResult.txt }}
      </p>
    </div>

    <div class="content-body" v-html="jsonText" />
    <span slot="footer" class="dialog-footer">
      <el-button
        v-clipboard:copy="JSON.stringify(dataInfo, null, 4)"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
        type="primary"
      >复制内容</el-button>
    </span>
  </el-dialog>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    requestInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      type: 'loadding',
      dataInfo: '',
      resultOpt: [
        { type: 'success', txt: '测试成功', icon: 'el-icon-success' },
        { type: 'error', txt: '测试失败', icon: 'el-icon-error' },
        { type: 'loadding', txt: '测试中...', icon: 'el-icon-question' }
      ]
    }
  },
  computed: {
    jsonText () {
      return this.dataInfo ? `<pre>${JSON.stringify(this.dataInfo, null, 4)}</pre>` : ''
    },
    testResult () {
      return this.resultOpt.find(v => v.type === this.type)
    }
  },
  created () {
    this.serverRequest()
  },
  methods: {
    closeDialog () {
      this.$emit('update:dialogVisible', false)
    },
    onCopy () {
      this.$message.success('复制成功！')
    },
    onError () {
      this.$message.error('复制失败，请重试！')
    },
    // 后端调用第三方请求
    serverRequest () {
      const dataTypeArr = ['http', '', 'csb']
      const { dataType, url, method, version, apiName, head, body } = this.requestInfo
      const req = {
        method,	// 请求方式，post get
        version,	// 版本号
        apiName,	// 服务名称
        reqUrl: url,	// 请求地址
        header: head,	// request header
        contentBody: body,	// 参数合集
        requestType: dataTypeArr[dataType - 1]	// 协议类型，csb http
      }

      this.$api('componentManage.requestExec', req).then(res => {
        // 请求成功
        this.type = 'success'
        this.dataInfo = JSON.parse(res.data)
      }).catch(e => {
        // 请求失败
        this.type = 'error'
        this.dataInfo = e.data
      })
    },
    // 前端调用第三方请求
    clientRequest () {
      const { url, method, head, body } = this.requestInfo

      // 请求体
      const request = {
        url,
        method,
        responseType: 'json'
      }

      // 处理参数
      request[method.toLowerCase() === 'post' ? 'data' : 'params'] = body ? JSON.parse(body) : ''

      // 处理headers
      if (head) {
        request.headers = JSON.parse(head)
      }

      axios({ ...request }).then(response => {
        // 请求成功
      }).catch(e => {
        // 请求失败
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
  .el-dialog__header {
    padding-bottom: 0;
  }
  .content-head {
    p {
      display: flex;
      align-items: center;
      font-size: 16px;
    }
    i {
      font-size: 25px;
      margin-right: 5px;
      &.el-icon-success {
        color: green;
      }
      &.el-icon-error {
        color: red;
      }
      &.el-icon-question {
        color: orange;
      }
    }
  }
  .content-body {
    border: 1px solid #ddd;
    height: 200px;
    overflow: auto;
  }
}
</style>
