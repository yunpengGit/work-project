<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-04-11 12:14:53
 * @LastEditors: aq.hu
 * @LastEditTime: 2021-04-29 16:37:56
-->
<template>
  <div class="role-drawer-container">
    <el-drawer
      :visible="detailDrawer"
      :size="580"
      :title="title"
      custom-class="detail-drawer"
      destroy-on-close
      @update:visible="visibaleChange"
      @close="closed"
    >
      <el-form
        ref="editRole"
        :model="params"
        :rules="formRules"
        class="edit-role-form"
        label-width="130px"
        label-position="left"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="params.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="权限字符" prop="roleKey">
          <el-input v-model="params.roleKey" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="角色顺序" prop="roleSort">
          <el-input-number v-model="params.roleSort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="角色备注" prop="remark">
          <el-input
            v-model="params.remark"
            type="textarea"
            maxlength="100"
            resize="none"
            show-word-limit
            :autosize="{minRows: 6, maxRows: 6}"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div class="drawer-footer">
        <el-button @click="visibaleChange">取消</el-button>
        <el-button type="primary" :loading="loading" @click="submit">{{ loading ? '提交中': '确定' }}</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  props: {
    roleId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 弹窗顶部title
      title: '',
      detailDrawer: true,
      // 提交的数据
      params: {
        roleName: '',
        remark: '',
        roleKey: '',
        roleSort: 0,
        status: 0
      },
      // form验证规则
      formRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleKey: [
          { required: true, message: '请输入权限字符', trigger: 'blur' }
        ],
        roleSort: [
          { required: true, message: '角色顺序不能为空', trigger: 'blur' }
        ]
      },
      // 确定按钮的loading开关
      loading: false
    }
  },
  created () {
    if (!this.roleId.length) {
      this.title = '创建角色'
    } else {
      this.title = '修改角色'
      this.$api('role.getRole', {
        roleId: this.roleId
      }).then(res => {
        if (res.code === 200) {
          this.params = res.data
        }
      })
    }
  },
  methods: {
    // 关闭弹窗
    closed () {
      this.$emit('closeDetail')
    },
    // 取消按钮关闭弹窗
    visibaleChange () {
      this.$emit('update:detail-drawer', false)
    },
    // 确定按钮提交数据
    submit () {
      this.$refs.editRole.validate(vaild => {
        if (vaild) {
          this.loading = true
          const roleId = this.roleId
          if (!this.params.menuIds) {
            this.params.menuIds = []
          }
          const params = this.params
          // 请求接口是新增还是修改
          let interfaceType = ''
          let successTips = ''
          let failTips = ''
          if (roleId.length) {
            interfaceType = 'role.updateRole'
            successTips = '角色修改成功'
            failTips = '角色修改失败'
          } else {
            interfaceType = 'role.addRole'
            successTips = '角色创建成功'
            failTips = '角色创建失败'
          }
          this.$api(interfaceType, params).then(res => {
            if (res.code === 200) {
              this.loading = false
              this.$emit('submitSuccess', successTips)
            }
          }).catch(() => {
            this.$message.error(failTips)
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-role-form {
  padding: 16px;
  flex-grow: 1;
  overflow-y: auto;
}
.drawer-footer {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  border-top: 1px solid #eee;
}
</style>
<style lang="scss">
.role-drawer-container {
  .detail-drawer {
    .el-drawer__body {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
