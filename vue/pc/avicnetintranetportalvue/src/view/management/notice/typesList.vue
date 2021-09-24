/*
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-04-09 10:44:58
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-04-09 10:44:59
 */
<template>
  <div>
    <sp-table
      :is-index="true"
      index-label="编号"
      :table-cols="tableCols"
      :api="onload"
    >
      <!-- 批量操作 -->
      <div slot="handle">
        <el-button type="primary" icon="el-icon-plus" @click="addType">新建类型</el-button>
      </div>
    </sp-table>
    <el-drawer
      :size="'40%'"
      :title="drawerTitle"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="drawerClose"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item v-show="false" label="分类ID：">
          <el-input v-model="form.id" />
        </el-form-item>
        <el-form-item label="公告类型：" prop="classificationName">
          <el-input v-model="form.classificationName" />
        </el-form-item>
        <el-form-item label="流程ID：">
          <el-input v-model="form.processId" />
        </el-form-item>
        <el-form-item label="流程说明：">
          <div class="w600">
            <el-input v-model="form.processName" :maxlength="300" type="textarea" :row="2" placeholder="请输入内容" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelFn">取消</el-button>
          <el-button type="primary" @click="saveFn">保存</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
const _cloneDeep = require('lodash.clonedeep')

export default {

  data () {
    return {
      drawerTitle: '新建分类',
      drawer: false,
      direction: 'rtl',
      tableCols: [
        {
          label: '公告分类',
          prop: 'classificationName'
        },
        {
          label: '流程Id',
          prop: 'processId'
        },
        {
          label: '流程说明',
          prop: 'processName'
        },
        {
          label: '添加时间',
          prop: 'createdDate'
        },
        {
          label: '操作',
          width: '180',
          template: (scope) => {
            return <div>
              <el-button type='text'
                on-click={() =>
                  this.editor(scope.row, 'edit')
                }>编辑</el-button>
              <el-button type='text'
                on-click={() =>
                  this.enable(scope.row)
                }>{scope.row.enableFlag === 0 ? '启用' : '停用'}</el-button>
            </div>
          }
        }
      ],
      form: {
        id: '',
        classificationName: '',
        processId: '',
        processName: ''
      },
      rules: {
        classificationName: [
          { required: true, message: '请输入公告类型', trigger: 'blur' },
          { max: 64, message: '长度最多 64 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onload (params) {
      return this.$api('noticeManage.noticeClassList')
    },
    drawerClose (done) {
      done()
      this.form = {}
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
      // }
    },
    addType () {
      this.drawer = true
      this.drawerTitle = '新建分类'
    },
    editor (row) {
      this.drawer = true
      this.drawerTitle = '编辑分类'
      this.form = row
    },
    enable (row) {
      if (row.enableFlag === 1) {
        this.$prompt('是否停用该类型通知公告？停用后，将不可发布此类型通知公告。', '提示', {
          type: 'warning',
          inputType: 'textarea',
          confirmButtonText: '停用',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入停用原因',
          inputValidator: (value) => !!value && value.trim() !== '',
          inputErrorMessage: '请输入停用原因'
        }).then(({ value }) => {
          this.$api('noticeManage.classificationChangeState', { classificationId: row.classificationId, enableFlag: 0, stopReason: value }).then(() => {
            this.$store.commit('UPDATE_ALL_TABLE_DATA')
            this.$message.success('停用成功')
          })
        }).catch(() => {
          // console.log(err)
        })
      } else {
        this.$confirm('请确认是否启用此类通知公共？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api('noticeManage.classificationChangeState', { classificationId: row.classificationId, enableFlag: 1 }).then(() => {
            this.$store.commit('UPDATE_ALL_TABLE_DATA')
            this.$message({
              message: '启用成功',
              type: 'success'
            })
          })
        }).catch(() => {
          // console.log(err)
        })
      }
    },
    cancelFn () {
      this.drawer = false
      this.form = {}
    },
    async saveFn () {
      const isValidate = await this.$refs.form.validate()
      if (!isValidate) return
      const data = _cloneDeep(this.form)
      let url = 'noticeManage.noticeClassAdd'
      let successMsg = '保存成功'
      if (data.classificationId) {
        url = 'noticeManage.noticeClassUpdate'
        successMsg = '更新成功'
      }
      this.$api(url, this.form).then(res => {
        this.drawer = false
        this.$message.success(successMsg)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__container .el-drawer__body{
  padding: 60px 20px;
}
</style>
