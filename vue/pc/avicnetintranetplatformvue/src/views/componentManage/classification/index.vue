
<template>
  <div class="main">
    <sp-table
      keys="categoryName"
      :is-index="true"
      index-label="序号"
      :is-handle="true"
      :table-cols="tableCols"
      :api="onload"
    >
      <div slot="handle">
        <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增分类</el-button>
      </div>
    </sp-table>

    <el-dialog
      v-if="dialogVisible"
      :title="form.categoryId? '编辑':'新增'"
      :visible.sync="dialogVisible"
      class="add-dialog"
      width="450px"
    >

      <el-form
        ref="form"
        label-position="right"
        label-width="95px"
        :model="form"
        :rules="rules"
      >

        <el-form-item label="业务名称：" prop="categoryName">
          <el-input v-model="form.categoryName" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="备注：" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入备注"
          />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSure">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

export default {
  props: {},
  data () {
    return {
      tableCols: [
        { label: '名称', prop: 'categoryName', align: 'center' },
        { label: '状态', template: scope => scope.row.enableStatus ? '启用' : '停用' },
        { label: '备注', prop: 'remark' },
        { label: '操作', width: '160', template: scope => {
          return <div>
            <el-button type='text' on-click={() => this.onEdit(scope.row)}>编辑</el-button>
            <el-button type='text' on-click={() => this.onSwitch(scope.row)}>{scope.row.enableStatus ? '停用' : '启用'}</el-button>
            <el-button type='text' on-click={() => this.onDelete(scope.row)}>删除</el-button>
          </div>
        } }
      ],
      form: {
        categoryId: '',
        categoryName: '',
        remark: ''
      },
      dialogVisible: false,
      rules: {
        categoryName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onload (params) {
      return this.$api('componentManage.listCategory', params)
    },
    // 新增按钮点击
    onAdd () {
      this.dialogVisible = true
      this.form = {
        categoryId: '',
        categoryName: '',
        remark: ''
      }
    },
    // 编辑按钮点击
    onEdit ({ categoryId, categoryName, remark }) {
      this.form = {
        categoryId,
        categoryName,
        remark
      }
      this.dialogVisible = true
    },
    // 新增/编辑 -- 确定
    onSure () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$api(`componentManage.${this.form.categoryId ? 'updateCategory' : 'addCategory'}`, this.form).then((res) => {
            this.$message.success('操作成功')
            this.dialogVisible = false
            this.$store.commit('UPDATE_ALL_TABLE_DATA')
          })
        } else {
          return false
        }
      })
    },
    // 启用/停用
    onSwitch ({ categoryId, enableStatus }) {
      const text = enableStatus ? '停用' : '启用'
      this.$confirm(`确认${text}此分类吗？`, '提示', { type: 'warning' })
        .then(_ => {
          this.$api('componentManage.changeStateCategory', { categoryId, enableStatus: enableStatus ? 0 : 1 })
            .then(() => {
              this.$message.success(`此分类已被${text}`)
              this.$store.commit('UPDATE_ALL_TABLE_DATA')
            })
        })
    },
    // 删除
    onDelete ({ categoryId }) {
      this.$confirm('确认删除此分类吗？', '提示', { type: 'warning' })
        .then(_ => {
          this.$api('componentManage.deleteCategory', { categoryId }).then(() => {
            this.$message.success('此分类已被删除')
            this.$store.commit('UPDATE_ALL_TABLE_DATA')
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .el-dialog {
    .el-textarea__inner {
        padding: 5px 8px;
    }
  }
</style>
