<!--
 * @Author: aq.hu
 * @Date: 2021-04-09 10:23:57
 * @LastEditTime: 2021-08-26 10:02:48
 * @LastEditors: caofeng
 * @Description: 登录日志
-->
<template>
  <div class="app-container">
    <sp-table
      keys="loginUser"
      keys-more="loginRole,accessTime,desc,loginIp"
      :is-index="true"
      :table-cols="tableCols"
      :api="getList"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableCols: [
        { label: '登录时间', prop: 'accessTime' },
        { label: '登录人', width: '300', template: scope => {
          return `${scope.row.nickName}(${scope.row.userName})`
        } },
        { label: '登录人角色', prop: 'roleName' },
        { label: '操作类型', template: scope => {
          return scope.row.operateType === '1' ? '登录' : '退出'
        } },
        { label: '浏览器类型', prop: 'browser' },
        { label: '登录IP', prop: 'ipaddr' },
        { label: '登录结果', template: scope => {
          return scope.row.state === '1' ? '失败' : '成功'
        } },
        { label: '描述信息', prop: 'msg' }
      ]
    }
  },
  methods: {
    getList (params) {
      if (Array.isArray(params.accessTime)) {
        params.beginTime = params.accessTime ? params.accessTime[0] : null
        params.endTime = params.accessTime ? params.accessTime[1] : null
        delete params.accessTime
      }
      return this.$api('auditLog.loginList', params)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .expand-box-dis {
  label {
    width: 85px;
  }
}
</style>
