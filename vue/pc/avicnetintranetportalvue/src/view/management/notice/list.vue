<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-04-06 16:28:17
 * @LastEditors: zongmz
 * @LastEditTime: 2021-04-26 14:42:22
-->
<template>
  <div>
    <sp-table
      :is-index="true"
      index-label="编号"
      keys="noticeTitle,noticeTimeRange,noticeStatus"
      :table-cols="tableCols"
      :api="onload"
    />
  </div>
</template>

<script>
import routeToNewTab from '@/mixins/routeToNewTab'
const auditStatus = {
  1: '草稿',
  2: '驳回',
  3: '待审核',
  4: '已发布',
  5: '已取消'
}
const secretLevel = { 60: 'JM', 50: 'MM', 40: '核心商SM', 30: 'NB', 20: '普通SM', 10: '公开' }
export default {
  mixins: [routeToNewTab],
  data () {
    return {
      tableCols: [
        {
          label: '标题',
          width: '380',
          template: (scope) => {
            return <div on-click={() =>
              this.routeToNewTab({ path: '/notice/detail', query: { id: scope.row.id }})
            } class='title'>{scope.row.title}
            </div>
          }
        },
        {
          label: '状态',
          template: (scope) => {
            return auditStatus[scope.row.auditStatus]
          }
        },
        {
          label: 'MJ',
          template: (scope) => {
            return secretLevel[scope.row.secretLevel]
          }
        },
        {
          label: '已阅人数',
          prop: 'readNum'
        },
        {
          label: '发布时间',
          width: '180',
          prop: 'publishDate'
        },
        {
          label: '失效时间',
          width: '180',
          prop: 'effectiveDate'
        },
        {
          label: '操作',
          width: '180',
          template: (scope) => {
            return <div>
              { scope.row.auditStatus === '1' || scope.row.auditStatus === '2' || scope.row.auditStatus === '5'
                ? '' : <el-button type='text'
                  on-click={() =>
                    this.enAdisable(scope.row)
                  }>撤回</el-button>
              }
            </div>
          }
        }
      ]
    }
  },
  methods: {
    onload (params) {
      if (params.timeRange && Array.isArray(params.timeRange)) {
        params.beginTime = params.timeRange[0]
        params.endTime = params.timeRange[1]
        delete params.timeRange
      }
      if (params.auditStatusArr) {
        params.auditStatus = params.auditStatusArr
        delete params.auditStatusArr
      }
      if (params.catalogId && Array.isArray(params.catalogId)) {
        params.catalogId = params.catalogId.join()
      }
      return this.$api('noticeManage.noticeList', params)
    },
    detail (row) {
      this.$router.push({
        path: `/notice-manage/detail`,
        query: {
          id: row.id
        }
      })
    },
    submit (row) {
      this.$confirm('请确认是否提交审批？', '提示', {
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api('noticeManage.noticeSubmitList', { id: row.id }).then(() => {
          this.$store.commit('UPDATE_ALL_TABLE_DATA')
          this.$message({
            message: `'提交成功，等待审核'`,
            type: 'success'
          })
        })
      }).catch(() => {})
    },
    enAdisable (row) {
      this.$prompt('请填写撤回原因，再确认撤回?', '提示', {
        type: 'warning',
        inputType: 'textarea',
        confirmButtonText: '撤回',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入撤回原因',
        inputValidator: (value) => !!value && value.trim() !== '',
        inputErrorMessage: '请输入撤回原因'
      }).then(({ value }) => {
        this.$api('noticeManage.noticeRecall', { id: row.id, restartReason: value }).then(() => {
          this.$store.commit('UPDATE_ALL_TABLE_DATA')
          this.$message({
            message: `'撤回成功！`,
            type: 'success'
          })
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  color: #1e89ff;
  cursor: pointer;
}
</style>

