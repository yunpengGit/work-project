<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="ruleForm.nickName" placeholder="请输入用户昵称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="归属部门" prop="deptId">
            <treeselect v-model="ruleForm.deptId" :options="initData.deptOptions" :show-count="true" placeholder="请选择归属部门" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input v-model="ruleForm.phonenumber" placeholder="请输入手机号码" maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email" placeholder="请输入邮箱" maxlength="50" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item v-if="ruleForm.userId == undefined" label="用户名称" prop="userName">
            <el-input v-model="ruleForm.userName" placeholder="请输入用户名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="ruleForm.userId == undefined" label="用户密码" prop="password">
            <el-input v-model="ruleForm.password" placeholder="请输入用户密码" type="password" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户性别">
            <el-select v-model="ruleForm.sex" placeholder="请选择">
              <el-option v-for="dict in initData.sexOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group v-model="ruleForm.status">
              <el-radio v-for="dict in initData.statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="岗位">
            <el-select v-model="ruleForm.postIds" multiple placeholder="请选择">
              <el-option v-for="item in postOptions" :key="item.postId" :label="item.postName" :value="item.postId" :disabled="item.status == 1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色">
            <el-select v-model="ruleForm.roleIds" multiple placeholder="请选择">
              <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" :disabled="item.status == 1" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" :loading="disabledSubmit" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getUser, addUser, updateUser } from '@/api/system/user'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: {
    Treeselect
  },
  props: {
    userId: {
      type: String,
      default: ''
    },
    initData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      disabledSubmit: false,
      ruleForm: {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: '0',
        remark: undefined,
        postIds: [],
        roleIds: []
      },
      rules: {
        userName: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '归属部门不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: "'请输入正确的邮箱地址",
            trigger: ['blur', 'change']
          }
        ],
        phonenumber: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      },
      postOptions: [],
      roleOptions: []
    }
  },
  created () {
    getUser(this.userId).then(response => {
      this.postOptions = response.posts
      this.roleOptions = response.roles
      if (this.userId) {
        this.ruleForm = response.data
        this.ruleForm.postIds = response.postIds
        this.ruleForm.roleIds = response.roleIds
        this.ruleForm.password = ''
      } else {
        this.ruleForm.password = this.initPassword
      }
    })
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.disabledSubmit = true
          if (this.ruleForm.userId !== undefined) {
            updateUser(this.ruleForm).then(response => {
              if (response.code === 200) {
                this.disabledSubmit = false
                this.msgSuccess('修改成功')
                this.resetForm(formName)
              }
            }).catch(this.disabledSubmit = false)
          } else {
            addUser(this.ruleForm).then(response => {
              if (response.code === 200) {
                this.disabledSubmit = false
                this.msgSuccess('新增成功')
                this.resetForm(formName)
              }
            }).catch(this.disabledSubmit = false)
          }
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.$store.commit('CLOSE_DIALOG', {
        uid: 'user-dialog'
      })
      this.$store.commit('UPDATE_TABLE_DATA')
    }
  }
}
</script>

