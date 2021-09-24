<!--
 * @Descripttion: 栏目列表
 * @Author: zongmz
 * @Date: 2021-03-19 14:41:50
 * @LastEditors: zongmz
 * @LastEditTime: 2021-04-26 11:43:01
-->
<template>
  <div>
    <sp-table
      :is-index="true"
      index-label="编号"
      keys="contentName,contentColumn,contentStatus,contentTimeRange"
      :table-cols="tableCols"
      :api="onload"
    >
      <!-- 批量操作 -->
      <div slot="handle">
        <el-button type="primary" icon="el-icon-plus" @click="operation('','add')">新建内容</el-button>
      </div>
    </sp-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableCols: [
        {
          label: '标题',
          prop: 'title'
        },
        {
          label: '栏目',
          width: '150',
          prop: 'catalogName'
        },
        {
          label: '状态',
          width: '80',
          prop: 'status',
          template: (scope) => {
            return scope.row.status !== 0 ? '已发布' : '未发布'
          }
        },
        {
          label: '发布时间',
          width: '180',
          prop: 'publishTime'
        },
        {
          label: '操作',
          width: '180',
          template: (scope) => {
            return <div>
              <el-button type='text'
                on-click={() =>
                  this.operation(scope.row, 'view')
                }>查看</el-button>
              <el-button type='text'
                on-click={() =>
                  this.operation(scope.row, 'edit')
                }>编辑</el-button>
              <el-button type='text'
                on-click={() =>
                  this.enAdisable(scope.row)
                }>{scope.row.status === 0 ? '发布' : '撤回'}</el-button>
              <el-button type='text' disabled={(() => scope.row.status !== 0)()}
                on-click={() =>
                  this.del(scope.row)
                }>删除</el-button>
            </div>
          }
        }
      ]
    }
  },
  methods: {
    onload (params) {
      if (params.timeRange && Array.isArray(params.timeRange)) {
        params.publishTimeFrom = params.timeRange[0]
        params.publishTimeTo = params.timeRange[1]
        delete params.timeRange
      }
      if (params.catalogId && Array.isArray(params.catalogId)) {
        params.catalogId = params.catalogId.join()
      }
      return this.$api('news.contents', params)
    },
    operation (row, type) {
      if (type !== 'add') {
        this.$router.push({
          path: `/news-manage/content/content-${type}`,
          query: {
            id: row.id
          }
        })
      } else {
        this.$router.push({
          path: `/news-manage/content/content-${type}`
        })
      }
    },
    enAdisable (row) {
      // console.log(row, 23232)
      this.$confirm(`${row.status === 0 ? '发布后，该内容将显示在门户【资讯栏目】中' : '撤回后，该内容将不会在门户【资讯栏目】中显示'}`, '提示', {
        confirmButtonText: `${row.status === 0 ? '发布' : '撤回'}`,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api('news.contentStatus', { id: row.id, status: row.status ? 0 : 1 }).then(() => {
          this.$store.commit('UPDATE_ALL_TABLE_DATA')
          this.$message({
            message: `${row.status === 0 ? '发布' : '撤回'}成功！`,
            type: 'success'
          })
        })
      }).catch(() => {})
    },
    del (row) {
      this.$confirm('删除后将不可恢复，请谨慎操作?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api('news.contentsDel', { id: row.id }).then(() => {
          this.$store.commit('UPDATE_ALL_TABLE_DATA')
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
