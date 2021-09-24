<!--
 * @Descripttion: 栏目列表
 * @Author: zongmz
 * @Date: 2021-03-19 14:41:50
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-05-25 11:53:28
-->
<template>
  <div>
    <sp-table
      keys="columnName,columnStatus"
      :table-cols="tableCols"
      :api="onload"
    >
      <!-- 批量操作 -->
      <div slot="handle">
        <el-button type="primary" icon="el-icon-plus" @click="operation('','add')">新建栏目</el-button>
      </div>
    </sp-table>
    <sp-dialog :title="title" width="1200px" uid="column-dialog" />
  </div>
</template>
<script>
export default {
  data () {
    return {
      title: '',
      tableCols: [
        {
          label: '排序',
          width: '80px',
          prop: 'showOrder'
        },
        {
          label: '栏目名称',
          prop: 'name'
        },
        {
          label: '状态',
          width: '80',
          prop: 'status',
          template: (scope) => {
            return scope.row.status !== 0 ? '已启用' : '未启用'
          }
        },
        {
          label: '最后修改时间',
          width: '180',
          prop: 'updateTime'
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
                }>{scope.row.status === 0 ? '启用' : '停用'}</el-button>
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
      return this.$api('news.catalogs', params)
    },
    operation (row, type) {
      this.title = type === 'add' ? '栏目新增' : type === 'edit' ? '栏目编辑' : '栏目查看'
      this.$store.commit('OPEN_DIALOG', {
        uid: 'column-dialog',
        props: {
          routerType: type,
          data: type !== 'add' ? row : null
        },
        component: require('../components/column-dialog').default
      })
    },
    async enAdisable (row) {
      let text = '启用栏目后，该栏目将显示在门户【综合信息】中'
      let subscribe = ''
      if (row.status === 0) {
        text = '启用栏目后，该栏目将显示在门户【综合信息】中'
      } else {
        text = '停用栏目后,该栏目将不会在门户【综合信息】中显示'
        const res = await this.$api('news.ifSubscribed', { id: row.id })
        if (res.data) {
          subscribe = '该栏目有用户订阅，是否仍要停用？'
        }
      }
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('div', null, [
          h('div', null, `栏目名称：${row.name}`),
          h('div', { style: 'color: rgba(25, 31, 36, 0.48);font-size: 12px;;lineHeight: 24px;' }, text),
          h('div', { style: 'color: #EA340F;lineHeight: 24px;' }, subscribe)
        ]),
        showCancelButton: true,
        confirmButtonText: `${row.status === 0 ? '启用' : '停用'}`,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api('news.catalogStatus', { id: row.id, status: row.status ? 0 : 1 }).then(() => {
          this.$store.commit('UPDATE_ALL_TABLE_DATA')
          this.$message({
            message: `${row.status === 0 ? '启用' : '停用'}成功！`,
            type: 'success'
          })
        })
      }).catch(() => {})
    },
    async del (row) {
      const h = this.$createElement
      const res = await this.$api('news.ifHasContents', { id: row.id })
      // console.log(res)
      if (res.data) {
        this.$msgbox({
          title: '提示',
          message: h('div', null, [
            h('div', null, `栏目名称：${row.name}`),
            h('div', { style: 'color: rgba(25, 31, 36, 0.48);font-size: 12px;;lineHeight: 24px;' }, '栏目从【栏目管理列表】删除后将不可恢复，请谨慎操作'),
            h('div', { style: 'color: #EA340F;lineHeight: 24px;' }, '该栏目下有内容，不可删除！')
          ]),
          showCancelButton: true,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { }).catch(() => {})
      } else {
        this.$msgbox({
          title: '提示',
          message: h('div', null, [
            h('div', null, `栏目名称：${row.name}`),
            h('div', { style: 'color: rgba(25, 31, 36, 0.48);font-size: 12px;;lineHeight: 24px;' }, '栏目从【栏目管理列表】删除后将不可恢复，请谨慎操作')
          ]),
          showCancelButton: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api('news.catalogsDel', { id: row.id }).then(() => {
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
}
</script>
