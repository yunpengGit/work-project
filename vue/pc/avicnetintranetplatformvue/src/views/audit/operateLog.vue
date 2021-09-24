<!--
 * @Author: aq.hu
 * @Date: 2021-04-09 10:48:16
 * @LastEditTime: 2021-08-23 15:26:42
 * @LastEditors: caofeng
 * @Description: 操作日志
-->
<template>
  <div class="app-container">
    <sp-table
      keys="operateUser"
      keys-more="operateRole,operateTime,operateModule,operateIp,operateDetail,operateType,operateDesc"
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
        { label: '操作人', width: '260', template: scope => {
          return `${scope.row.operNickName}(${scope.row.operName})`
        } },
        { label: '操作人角色', prop: 'roleName' },
        { label: '操作时间', prop: 'operTime' },
        { label: 'IP地址', prop: 'operIp' },
        { label: '访问模块', prop: 'title' },
        { label: '操作类型', template: scope => {
          return this.getType(scope.row.businessType)
        } },
        { label: '操作详情', prop: 'detail' },
        { label: '操作结果', template: scope => {
          return scope.row.state === '1' ? '异常' : '正常'
        } },
        // { label: '流程', prop: '' },
        { label: '描述信息', prop: 'errorMsg' }
      ]
    }
  },
  methods: {
    getList (params) {
      if (Array.isArray(params.operTime)) {
        params.beginTime = params.operTime ? params.operTime[0] : null
        params.endTime = params.operTime ? params.operTime[1] : null
        delete params.operTime
      }
      return this.$api('auditLog.operateList', params)
    },
    // 匹配操作类型
    getType (type) {
      let text = ''
      switch (type) {
        case 0:
          text = '其他'
          break
        case 1:
          text = '新增'
          break
        case 2:
          text = '修改'
          break
        case 3:
          text = '删除'
          break
        case 4:
          text = '授权'
          break
        case 5:
          text = '导出'
          break
        case 6:
          text = '导入'
          break
        case 7:
          text = '强退'
          break
        case 8:
          text = '生成代码'
          break
        case 9:
          text = '清空数据'
          break
        case 10:
          text = '下载'
          break
      }
      return text
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
