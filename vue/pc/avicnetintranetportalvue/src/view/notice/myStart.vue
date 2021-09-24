<template>
  <div class="mySee">
    <sp-table
      keys="noticeTitle,noticeStatus,noticeTimeRange"
      :is-index="true"
      index-label="编号"
      :is-handle="true"
      :table-cols="tableCols"
      :api="onload"
    >
      <template v-slot:form>
        <el-button type="primary" icon="el-icon-plus" @click="$router.push('/notice/myStart/addNotice')">新建公告</el-button>
      </template>
    </sp-table>

    <el-dialog v-if="recallDialogVisible" :visible.sync="recallDialogVisible" width="450px" class="reason-dialog" :show-close="false">
      <el-form ref="ruleForm" :model="recallForm" :rules="rules">
        <el-form-item label="备注原因：" prop="restartReason">
          <el-input v-model="recallForm.restartReason" type="textarea" :rows="5" placeholder="请填写【撤回】该条通知公告的原因" />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="recallDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSureRecall">确 定</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script>
const status = [
  // { label: '不限', value: '' },
  { label: '驳回', value: '2' },
  { label: '草稿', value: '1' },
  { label: '待审核', value: '3' },
  { label: '已发布', value: '4' },
  { label: '已取消', value: '5' }
]

export default {
  name: 'MySee',
  data () {
    return {
      status,
      secretLevel: [],
      expand: false,
      search: {
        auditStatusArr: ''
      },
      tableCols: [],
      recallForm: {
        id: '',
        restartReason: ''
      },
      rules: {
        restartReason: [
          { required: true, message: '请输入撤回原因', trigger: 'blur' }
        ]
      },
      recallDialogVisible: false
    }
  },
  created () {
    this.$api('common.getMj').then(res => {
      this.secretLevel = res.data
      this.formatTableCols()
    })
  },
  methods: {
    onload (params) {
      if (params.timeRange) {
        params.beginTime = params.timeRange ? params.timeRange[0] : null
        params.endTime = params.timeRange ? params.timeRange[1] : null
        delete params.timeRange
      }
      return this.$api('notice.allList', params)
    },
    onDelete (row) {
      this.$confirm('请确认是否删除？')
        .then(_ => {
          this.$api('notice.listDel', { id: row.id }).then(() => {
            this.$message.success('删除成功')
            this.$store.commit('UPDATE_ALL_TABLE_DATA')
          }).catch(() => {
            this.$message.error('删除失败，请稍后再试')
          })
        })
        .catch(_ => {})
    },
    onRecall (row) {
      this.recallDialogVisible = true
      this.recallForm.restartReason = ''
      this.recallForm.id = row.id
    },
    onSureRecall () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const { id, restartReason } = this.recallForm
          this.$api('notice.listRecall', { id, restartReason }).then(() => {
            this.$message.success('撤回成功')
            this.recallDialogVisible = false
            this.$store.commit('UPDATE_ALL_TABLE_DATA')
          })
        } else {
          return false
        }
      })
    },
    onSubject (row) {
      this.$confirm('请确认是否提交审批？')
        .then(_ => {
          this.$api('notice.listSubmit', { id: row.id }).then(() => {
            this.$message.success('提交成功，等待审核')
            this.$store.commit('UPDATE_ALL_TABLE_DATA')
          }).catch(() => {
            this.$message.error('提交失败，请重新提交')
          })
        })
        .catch(_ => {})
    },
    formatTableCols () {
      this.tableCols = [
        { label: '标题',
          'show-overflow-tooltip': true,
          template: scope => {
            // return <a href={`${window.location.protocol}//${window.location.host}/notice/detail?id=${scope.row.id}&type=myStart`} target='_blank' class='title'>{scope.row.title}</a>
            return <a class='title ell' on-click={() => this.toDetail(scope.row)}>{scope.row.title}</a>
          }
        },
        { label: '已阅人数', width: '150', prop: 'readNum', align: 'center' },
        { label: 'MJ', width: '150', template: scope => this.secretLevel.find(v => Number(v.dictValue) === scope.row.highSecretLevel).dictLabel },
        { label: '状态', width: '150', template: scope => this.status.find(d => d.value === scope.row.auditStatus).label },
        { label: '发布时间', prop: 'publishDate', width: '150' },
        { label: '失效时间', prop: 'effectiveDate', width: '150' },
        { label: '操作',
          width: '180',
          template: scope => {
            return <div>
              { scope.row.selfFlag && (scope.row.auditStatus === '1' || scope.row.auditStatus === '2' || scope.row.auditStatus === '5')
                ? <div>
                  <el-button type='text' on-click={() => this.$router.push(`/notice/myStart/editNotice?id=${scope.row.id}`)}>编辑</el-button>
                  <el-button type='text' on-click={() => this.onSubject(scope.row)}>提交</el-button>
                  <el-button type='text' on-click={() => this.onDelete(scope.row)}>删除</el-button>
                </div> : null
              }
              { scope.row.selfFlag && (scope.row.auditStatus === '3' || scope.row.auditStatus === '4')
                ? <el-button type='text' on-click={() => this.onRecall(scope.row)}>撤回</el-button> : null
              }
            </div>
          }
        }
      ]
    },
    toDetail (row) {
      this.$router.push(`/notice/myStart/detail?id=${row.id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  cursor: pointer;
    &:hover {
      color: #1E89FF;
  }
}
::v-deep .reason-dialog {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 20px 20px 0 20px;
    .el-form-item {
      margin-bottom: 10px;
    }
  }
}
::v-deep .el-date-editor{
  input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
    font-size: 12px;
  }
}
</style>
