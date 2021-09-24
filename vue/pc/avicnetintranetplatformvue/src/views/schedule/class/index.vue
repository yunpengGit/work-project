<template>
  <div class="warper-box">
    <el-dialog
      :title="editValue.id ? '编辑分类' : '新增分类'"
      :visible.sync="editDialog"
      width="510px"
      top="200px"
    >
      <div>
        <el-form ref="form" label-position="left">
          <el-form-item label="分类名称：" label-width="120px">
            <el-input v-model="editValue.name" type="text" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取消</el-button>
        <el-button type="primary" @click="confirm('form')">确 定</el-button>
      </div>
    </el-dialog>
    <sp-table
      keys="labelNameLike,statusesIn"
      :is-index="true"
      :is-handle="true"
      :table-cols="tableCols"
      :api="onload"
    >
      <!-- 批量操作 -->
      <div slot="handle">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="edit({ id: null, name: '' })"
        >{{ editValue.labelId ? "编辑分类" : "新增分类" }}</el-button>
      </div>
    </sp-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 表格
      tableCols: [
        { label: '分类名称', prop: 'name' },
        {
          label: '状态',
          width: '100',
          template: (scope) => {
            return (
              <div
                style={{
                  color: scope.row.status === 'ENABLED' ? '#1E89FF' : '#f04134'
                }}
              >
                {this.statusObj[scope.row.status]}
              </div>
            )
          }
        },
        {
          label: '操作',
          width: '200',
          template: (scope) => {
            return (
              <div>
                <el-button type='text' on-click={() => this.edit(scope.row)}>
                  编辑
                </el-button>
                <el-button
                  type='text'
                  on-click={() => this.deleteWarning(scope.row)}
                >
                  {this.statusObj[`_${scope.row.status}`]}
                </el-button>
              </div>
            )
          }
        }
      ],
      statusObj: {
        ENABLED: '启用',
        DISABLED: '停用',
        _ENABLED: '停用',
        _DISABLED: '启用'
      },
      editDialog: false,
      editValue: {
        labelId: '',
        name: ''
      }
    }
  },
  created () {
  },
  methods: {
    onload (params) {
      return this.$api('schedule.getLabels', params)
    },
    refreshData () {
      this.$store.commit('UPDATE_ALL_TABLE_DATA')
    },
    deleteWarning (row) {
      const labelId = row.id
      const status = row.status === 'ENABLED' ? 'DISABLED' : 'ENABLED'
      this.$confirm(`请确认是否${this.statusObj[`_${row.status}`]}？`)
        .then((_) => {
          this.$api('schedule.putLabelsStatus', { status, labelId }).then(
            (res) => {
              if (res.code === 200) {
                this.refreshData()
              } else {
                this.$message.error(res.msg || '发生未知错误')
              }
            }
          )
        })
        .catch((_) => {})
    },
    edit (row) {
      this.editValue.labelId = row.id
      this.editValue.name = row.name
      this.editDialog = true
    },
    confirm () {
      if (!this.editValue.name) {
        return this.$message.error('请输入分类名称')
      }
      const apiUrl = this.editValue.labelId
        ? 'schedule.putLabels'
        : 'schedule.addLabels'
      this.$api(apiUrl, this.editValue).then((res) => {
        if (res.code === 200) {
          this.editDialog = false
          // this[this.editValue.labelId ? 'onload' : 'onSearch']()
          this.refreshData()
        } else {
          this.$message.error(res.msg || '发生未知错误')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
