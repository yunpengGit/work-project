<template>
  <el-drawer
    :title="drawerTitle"
    :visible="addDrawer"
    :size="616"
    custom-class="add-drawer"
    destroy-on-close
    @update:visible="visibaleChange"
    @close="closed"
  >
    <el-form
      ref="addOrg"
      :model="params"
      :rules="formRules"
      class="add-form"
      label-width="130px"
      label-position="left"
    >
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="params.deptName" maxlength="32" placeholder="请输入部门全称" />
      </el-form-item>
      <el-form-item label="上级机构" prop="parentId">
        <el-select
          ref="treeSelect"
          v-model="params.parentName"
          class="item-select"
          filterable
          remote
          :remote-method="getTree"
          placeholder="上级管理单位"
          prop="parentId"
          @blur="getTree()"
        >
          <el-option hidden :value="params.parentId" />
          <el-tree
            ref="deptTree"
            :data="deptData"
            node-key="id"
            :expand-on-click-node="false"
            @node-click="changeDept"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="排序号" prop="orderNum">
        <el-input v-model.number="params.orderNum" maxlength="4" placeholder="同一节点下的排序，数字大的排序靠前" />
      </el-form-item>

      <el-form-item label="办公地址" prop="address">
        <el-input v-model="params.address" maxlength="225" />
      </el-form-item>

      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="params.phone" maxlength="11" />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="params.remark" maxlength="225" />
      </el-form-item>
    </el-form>
    <div class="drawer-footer">
      <el-button @click="visibaleChange">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">{{ loading ? '提交中': '确定' }}</el-button>
    </div>
  </el-drawer>
</template>

<script>
export default {
  props: {
    addDrawer: {
      type: Boolean,
      default: false
    },
    // 新增时当前选中的树节点名称和id
    defaultName: {
      type: String,
      default: ''
    },
    defaultId: {
      type: String,
      default: ''
    },
    // 当前编辑的id
    currentId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      params: {
        deptName: '',
        parentId: '',
        parentName: '',
        orderNum: '',
        address: '',
        phone: '',
        remark: ''
      },
      deptData: [],
      formRules: {
        deptName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请选择上级单位', trigger: 'change' }
        ],
        orderNum: [
          { required: true, message: '请填写排序号', trigger: 'blur' },
          { type: 'number', message: '排序号为数字' }
        ]
      },
      drawerTitle: '添加部门',
      loading: false
    }
  },
  watch: {
    defaultId: {
      handler (val) {
        console.log(val)
        if (val !== '') {
          this.params.parentId = val
          this.params.parentName = this.defaultName
        }
      },
      immediate: true
    },
    currentId: {
      handler (val) {
        if (val !== '') {
          this.drawerTitle = '编辑部门'
          this.getDetail(val)
        } else {
          this.drawerTitle = '添加部门'
        }
      },
      immediate: true
    }
  },
  created () {
    if (this.defaultId !== '') {
      this.params.parentId = this.defaultId
      this.params.parentName = this.defaultName
    }
    this.getTree()
    if (this.currentId !== '') {
      this.getDetail(this.currentId)
    }
  },
  methods: {
    visibaleChange () {
      this.$emit('update:add-drawer', false)
    },
    // 获取详情
    getDetail (deptId) {
      this.$api('depts.deptDetail', { deptId }).then(res => {
        if (res.code === 200) {
          this.params = res.data
          this.params.orderNum = Number(res.data.orderNum)
        }
      })
    },
    // 获取上级管理单位
    getTree (query) {
      const deptName = query
      this.$api('depts.nameDepts', { deptName, withHasChildren: true }).then(res => {
        if (res.code === 200) {
          this.deptData = res.data
          if (query) {
            this.$refs.deptTree.store.defaultExpandAll = true
          }
        }
      })
    },
    // 选取上级管理单位
    changeDept (data) {
      this.params.parentId = data.id
      this.params.parentName = data.label
      this.$refs.treeSelect.blur()
    },
    // 提交
    submit () {
      this.$refs.addOrg.validate((valid) => {
        if (valid) {
          this.loading = true
          const paramsData = { ...this.params }
          delete paramsData.parentName
          if (!this.currentId) {
            this.$api('depts.addDept', { ...paramsData }).then(res => {
              if (res.code === 200) {
                this.loading = false
                this.$emit('submitSuccess', this.params.parentId)
              }
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.$api('depts.editDept', { ...paramsData }).then(res => {
              if (res.code === 200) {
                this.loading = false
                this.$emit('submitSuccess', this.params.parentId)
              }
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          return false
        }
      })
    },
    closed () {
      this.$refs.addOrg.resetFields()
      this.params.parentName = ''
      this.$emit('closeAdd')
    }
  }
}
</script>

<style lang="scss" scoped>
.add-form {
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
.item-select {
  width: 100%;
}
</style>

<style lang="scss">
.add-drawer {
  .el-drawer__body {
    display: flex;
    flex-direction: column;
  }
}
</style>
