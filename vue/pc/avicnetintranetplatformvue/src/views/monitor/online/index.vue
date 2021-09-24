<!--
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-04-29 10:49:21
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-11 16:40:59
-->
<template>
  <div class="app-container">
    <sp-table keys="ipaddr,userName" :is-index="true" :api="getList" :table-cols="tableCols" />
  </div>
</template>

<script>
import formatDate from '@/utils/format-date'

export default {
  name: 'Online',
  data () {
    return {
      tableCols: [
        {
          label: '会话编号',
          prop: 'tokenId'
        },
        {
          label: '登录名称',
          prop: 'userName'
        },
        {
          label: '主机',
          width: '150',
          prop: 'ipaddr'
        },
        {
          label: '登录时间',
          width: '180',
          template: scope => {
            return formatDate(scope.row.loginTime, 'yyyy-MM-dd hh:mm:ss')
          }
        },
        {
          label: '操作',
          width: '100',
          template: (scope) => {
            return <div>
              <el-button type='text' v-hasPermi={ ['monitor:online:forceLogout'] } on-click={() => this.forceLogout(scope.row) }>强制退出</el-button>
            </div>
          }
        }
      ]
    }
  },
  methods: {
    getList (params) {
      return this.$api('online.onlineList', params)
    },
    forceLogout (row) {
      this.$confirm('是否确认强退名称为"' + row.userName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        this.$api('online.forceLogout', { tokenId: row.tokenId }).then(() => {
          this.msgSuccess('强退成功')
          this.$store.commit('UPDATE_ALL_TABLE_DATA')
        })
      })
    }
  }
}
</script>

