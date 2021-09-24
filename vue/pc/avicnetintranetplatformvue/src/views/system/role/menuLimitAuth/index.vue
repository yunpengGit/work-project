<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-04-11 14:11:03
 * @LastEditors: caofeng
 * @LastEditTime: 2021-08-19 16:07:25
-->
<template>
  <div class="role-drawer-container">
    <el-drawer
      :visible="true"
      title="菜单权限"
      :size="580"
      custom-class="detail-drawer"
      destroy-on-close
      @close="closed"
    >
      <div class="role-edit-main">
        <div class="role-edit-scroll">
          <div class="role-edit-scroll-content">
            <el-form
              ref="editRole"
              :model="params"
              class="edit-role-form"
              label-width="130px"
              label-position="left"
            >
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="params.roleName" placeholder="请输入角色名称" :disabled="true" />
              </el-form-item>
              <el-form-item label="角色备注" prop="remark">
                <el-input v-model="params.remark" placeholder="请输入角色备注" :disabled="true" />
              </el-form-item>
              <el-form-item label="菜单权限">
                <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
                <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
                <el-checkbox v-model="params.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
                <el-tree
                  ref="menu"
                  class="tree-border"
                  :data="menuOptions"
                  show-checkbox
                  node-key="id"
                  :check-strictly="!params.menuCheckStrictly"
                  empty-text="加载中，请稍后"
                  :props="defaultProps"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="drawer-footer">
          <el-button @click="visibaleChange">取消</el-button>
          <el-button type="primary" :loading="loading" @click="submit">{{ loading ? '提交中': '确定' }}</el-button>
        </div>
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
      menuExpand: false,
      menuNodeAll: false,
      // 菜单列表
      menuOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      params: {
        roleName: '',
        remark: '',
        dataScope: ''
      },
      loading: false
    }
  },
  created () {
    const roleMenu = this.getMenuTreeselect(this.roleId)
    this.$api('role.getRole', {
      roleId: this.roleId
    }).then(res => {
      if (res.code === 200) {
        this.params = res.data
        this.$nextTick(() => {
          roleMenu.then(res => {
            this.$refs.menu.setCheckedKeys(res.checkedKeys)
          })
        })
      }
    })
  },
  methods: {
    // 所有菜单节点数据
    getMenuAllCheckedKeys () {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getHalfCheckedKeys()
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    // 查询菜单树结构
    getMenuTreeselect (roleId) {
      return this.$api('role.roleMenuTreeselect', {
        roleId
      }).then(res => {
        if (res.code === 200) {
          this.menuOptions = res.menus
          return res
        }
      })
    },
    closed () {
      this.$emit('closeDetail')
    },
    visibaleChange () {
      this.$emit('update:detail-drawer', false)
    },
    submit () {
      this.params.menuIds = this.getMenuAllCheckedKeys()
      console.log(this.params.menuIds)
      this.$api('role.updateRole', this.params).then(res => {
        if (res.code === 200) {
          this.$emit('submitSuccess')
        }
      })
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand (value, type) {
      if (type === 'menu') {
        const treeList = this.menuOptions
        for (let i = 0; i < treeList.length; i++) {
          if (this.$refs.menu.store.nodesMap[treeList[i].id].childNodes.length) {
            for (let t = 0; t < this.$refs.menu.store.nodesMap[treeList[i].id].childNodes.length; t++) {
              const id = this.$refs.menu.store.nodesMap[treeList[i].id].childNodes[t].data.id
              this.$refs.menu.store.nodesMap[id].expanded = value
            }
          }
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value
        }
      } else if (type === 'dept') {
        const treeList = this.deptOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll (value, type) {
      if (type === 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : [])
      } else if (type === 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : [])
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect (value, type) {
      if (type === 'menu') {
        this.params.menuCheckStrictly = value ? true : false
      } else if (type === 'dept') {
        this.params.deptCheckStrictly = value ? true : false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.role-drawer-container {
  .role-edit-main {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: relative;
    .role-edit-scroll {
      .role-edit-scroll-content {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
      }
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      position: absolute;
      left: 0;
      top: 0;
      padding-bottom: 64px;
    }
    .drawer-footer {
      width: 100%;
      box-sizing: border-box;
      position: absolute;
      left: 0;
      bottom: 0;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-shrink: 0;
      border-top: 1px solid #eee;
      background-color: #fff;
      z-index: 2;
    }
  }
}
.edit-role-form {
  padding: 16px;
  flex-grow: 1;
  overflow-y: auto;
}
.el-select {
  width: 100%;
}
</style>
