<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-04-11 13:52:02
 * @LastEditors: caofeng
 * @LastEditTime: 2021-08-23 15:44:52
-->
<template>
  <div class="role-drawer-container">
    <el-drawer
      :visible="true"
      title="数据权限"
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
              <el-form-item label="数据权限">
                <el-select v-model="params.dataScope" @change="dataScopeChange">
                  <el-option
                    v-for="item in scopeAuthData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-show="params.dataScope == 2" label="数据权限">
                <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
                <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
                <el-checkbox v-model="params.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox>
                <el-tree
                  ref="dept"
                  class="tree-border"
                  :data="deptOptions"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  :check-strictly="!params.deptCheckStrictly"
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
import { getDicts } from '@/api/system/dict/data'
export default {
  props: {
    roleId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      deptExpand: true,
      deptNodeAll: false,
      // 部门列表
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 权限范围选项
      scopeAuthData: [
        // {
        //   value: '1',
        //   label: '全部数据权限'
        // },
        // {
        //   value: '2',
        //   label: '自定义数据权限'
        // },
        // {
        //   value: '3',
        //   label: '本企业数据权限'
        // },
        // {
        //   value: '4',
        //   label: '本部门数据权限'
        // },
        // {
        //   value: '5',
        //   label: '本部门及以下数据权限'
        // },
        // {
        //   value: '6',
        //   label: '仅本人数据权限'
        // }
      ],
      params: {
        roleName: '',
        remark: '',
        dataScope: ''
      },
      loading: false,
      checkedKeys: []
    }
  },
  created () {
    const roleDeptTreeselect = this.getRoleDeptTreeselect(this.roleId)
    this.getScopeAuthData()
    this.$api('role.getRole', {
      roleId: this.roleId
    }).then(res => {
      if (res.code === 200) {
        this.params = res.data
        this.$nextTick(() => {
          roleDeptTreeselect.then(response => {
            this.checkedKeys = response.checkedKeys
            this.$refs.dept.setCheckedKeys(this.checkedKeys)
          })
        })
      }
    })
  },
  methods: {
    getScopeAuthData () {
      getDicts('role_data_auth').then(res => {
        const data = res.data.map(d => {
          return {
            value: d.dictValue,
            label: d.dictLabel
          }
        })
        this.scopeAuthData = data
      })
    },
    // 数据权限修改的时候重置tree的默认选择项
    dataScopeChange () {
      this.$refs.dept.setCheckedKeys(this.checkedKeys)
    },
    // 根据角色ID查询部门树结构
    getRoleDeptTreeselect (roleId) {
      return this.$api('role.roleDeptTreeselect', {
        roleId
      }).then(res => {
        if (res.code === 200) {
          this.deptOptions = res.depts
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
      this.params.deptIds = this.getDeptAllCheckedKeys()
      this.$api('role.dataScope', this.params).then(res => {
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
    },
    // 所有部门节点数据
    getDeptAllCheckedKeys () {
      // 目前被选中的部门节点
      const checkedKeys = this.$refs.dept.getHalfCheckedKeys()
      // 半选中的部门节点
      const halfCheckedKeys = this.$refs.dept.getCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
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
