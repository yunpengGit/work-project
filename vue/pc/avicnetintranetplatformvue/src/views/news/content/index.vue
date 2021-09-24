<!--
 * @Descripttion: 栏目列表
 * @Author: zongmz
 * @Date: 2021-03-19 14:41:50
 * @LastEditors: aq.hu
 * @LastEditTime: 2021-09-08 11:27:14
-->
<template>
  <div class="news-content">
    <div class="tree">
      <div class="tree-input">
        <el-input
          v-model="filterText"
          placeholder="请输入栏目名称搜索"
          suffix-icon="el-icon-search"
        />
      </div>
      <el-tree
        ref="tree"
        :data="columnTree"
        :props="defaultProps"
        :filter-node-method="filterNode"
        @node-click="treeClick"
      />
    </div>
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
    <sp-dialog :title="title" width="1200px" uid="content-dialog" />
  </div>
</template>

<script>
import Params from '@/components/utils/router-params'
export default {
  data () {
    return {
      title: '',
      columnTree: [],
      defaultProps: {
        label: 'name'
      },
      filterText: '',
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
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    $route (val) {
      console.log(val)
      console.log(new Params('F').parse(this.$route.query))
    }
  },
  created () {
    this.getTree()
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
    // 获取左侧栏目树
    getTree () {
      this.$api('news.catalogsTree', { filterType: 'SELF_MANAGE' }).then(res => {
        if (res.code === 200) {
          this.columnTree = res.data
        }
      })
    },
    // 关键词筛选树
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 点击树节点
    treeClick (data) {
      const params = new Params('P')
      const keyword = new Params('F')
      const parsedParams = params.parse(this.$route.query)
      const parsedKeyword = keyword.parse(this.$route.query)
      if (parsedParams) {
        parsedParams.pageNum = 1
        delete parsedKeyword.title
        delete parsedKeyword.status
        delete parsedKeyword.timeRange
        parsedKeyword.catalogId = data.id
        const bbb = params.componentization(parsedParams)
        const ccc = keyword.componentization(parsedKeyword)
        this.$router.push({
          query: {
            ...bbb,
            ...ccc
          }
        })
      }
      this.$store.commit('UPDATE_ALL_TABLE_DATA')
    },
    operation (row, type) {
      this.title = type === 'add' ? '内容新增' : type === 'edit' ? '内容编辑' : '内容查看'
      this.$store.commit('OPEN_DIALOG', {
        uid: 'content-dialog',
        props: {
          routerType: type,
          data: type !== 'add' ? row : null
        },
        component: require('../components/content-dialog').default
      })
      // if (type !== 'add') {
      //   this.$router.push({
      //     path: `/news-manage/content/content-${type}`,
      //     query: {
      //       id: row.id
      //     }
      //   })
      // } else {
      //   this.$router.push({
      //     path: `/news-manage/content/content-${type}`
      //   })
      // }
    },
    enAdisable (row) {
      // console.log(row, 23232)
      this.$confirm(`${row.status === 0 ? '发布后，该内容将显示在门户【综合信息】中' : '撤回后，该内容将不会在门户【综合信息】中显示'}`, '提示', {
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
.news-content {
  display: flex;
  .tree {
    width: 300px;
    margin-right: 16px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    background-color: #fff;
    ::v-deep .el-tree {
      flex-grow: 1;
    }
    .tree-input {
      margin: 10px 16px;
    }
  }
}
</style>
