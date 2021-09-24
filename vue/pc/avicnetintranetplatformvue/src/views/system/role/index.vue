<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-04-08 14:30:57
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-06-01 13:08:21
-->
<template>
  <div class="role-manager app-container">
    <sp-table
      keys="roleManagerUserName"
      keys-more="roleManagerCreatedTime, roleManagerRoleNotes"
      :is-index="true"
      :table-cols="tableCols"
      :api="getList"
    >
      <div slot="handle">
        <el-button v-hasPermi="['system:role:add']" type="primary" @click="addRole">新增角色</el-button>
      </div>
    </sp-table>
    <editRole
      v-if="detailVisibile"
      :detail-drawer.sync="detailVisibile"
      :role-id="roleId"
      @closeDetail="closeDetail"
      @submitSuccess="submitSuccess"
    />
    <dataLimitAuth
      v-if="dataVisibile"
      :detail-drawer.sync="dataVisibile"
      :role-id="roleId"
      @closeDetail="closeDetail"
      @submitSuccess="submitSuccess"
    />
    <menuLimitAuth
      v-if="menuVisibile"
      :detail-drawer.sync="menuVisibile"
      :role-id="roleId"
      @closeDetail="closeDetail"
      @submitSuccess="submitSuccess"
    />
  </div>
</template>

<script>
import editRole from './editRole/index'
import dataLimitAuth from './dataLimitAuth/index'
import menuLimitAuth from './menuLimitAuth/index'
export default {
  components: { editRole, dataLimitAuth, menuLimitAuth },
  data () {
    return {
      detailVisibile: false,
      dataVisibile: false,
      menuVisibile: false,
      // 修改的角色Id
      roleId: '',
      tableCols: [
        {
          label: '角色名称', prop: 'roleName'
        },
        {
          label: '角色备注', prop: 'remark', showOverflowTooltip: true
        },
        {
          label: '创建时间', prop: 'createTime'
        },
        {
          label: '操作', template: scope => {
            return <div>
              <el-button
                type='text'
                v-hasPermi= { ['system:role:edit'] }
                on-click={() => this.handleEdit(scope.row.roleId)}
              >修改</el-button>
              <el-button
                type='text'
                v-hasPermi= { ['system:role:edit'] }
                on-click={() => this.upDataMenu(scope.row.roleId)}
              >菜单权限</el-button>
              <el-button
                type='text'
                v-hasPermi= { ['system:role:edit'] }
                on-click={() => this.upDataData(scope.row.roleId)}
              >数据权限</el-button>
              <el-button
                type='text'
                v-hasPermi={ ['system:role:remove'] }
                on-click={() => this.handleDelete(scope.row)}
              >删除</el-button>
            </div>
          }
        }
      ]
    }
  },
  methods: {
    // 更新列表
    refreshData () {
      this.$store.commit('UPDATE_ALL_TABLE_DATA')
    },
    // 操作成功的提示
    submitSuccess (operateTips = '操作成功') {
      this.detailVisibile = false
      this.dataVisibile = false
      this.menuVisibile = false
      this.refreshData()
      this.$message.success(operateTips)
    },
    // 修改角色弹窗
    handleEdit (roleId) {
      this.roleId = roleId
      this.detailVisibile = true
    },
    // 菜单权限弹窗
    upDataMenu (roleId) {
      this.roleId = roleId
      this.menuVisibile = true
    },
    // 数据权限弹窗
    upDataData (roleId) {
      this.roleId = roleId
      this.dataVisibile = true
    },
    // 关闭右侧弹窗事件
    closeDetail () {
      this.detailVisibile = false
      this.dataVisibile = false
      this.menuVisibile = false
      this.roleId = ''
    },
    // 获取列表数据
    getList (params) {
      const timeStamp = params.timeStamp
      if (timeStamp) {
        params.beginTime = timeStamp[0]
        params.endTime = timeStamp[1]
      }
      return this.$api('role.roleList', params)
    },
    // 新增角色
    addRole () {
      this.roleId = ''
      this.detailVisibile = true
    },
    // 删除角色
    handleDelete (data) {
      const roleId = data.roleId
      const roleName = data.roleName
      let confirmTitle = ''
      let submitType = ''
      const submit = new Promise((resolve, reject) => {
        this.$api('role.roleAuthList', {
          label: 'test',
          roleId
        }).then(res => {
          if (res.code === 200) {
            if (!res.data.length) {
              resolve()
            } else {
              reject()
            }
          }
        })
      })
      submit.then(() => {
        confirmTitle = `是否确认删除角色名称为"${roleName}"的数据项？`
        submitType = 'delete'
      }).catch(() => {
        confirmTitle = `<p>该角色存在授权用户无法删除。<p/><p>若删除改角色，请先删除所有授权用户。</p>`
        submitType = 'tips'
      }).finally(() => {
        this.$confirm(confirmTitle, '提示', {
          title: '信息提示',
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (submitType === 'delete') {
            this.$api('role.delRole', {
              roleId
            }).then(res => {
              if (res.code === 200) {
                this.refreshData()
                this.submitSuccess()
              }
            })
          }
        }).catch(() => {})
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// .role-manager{
//   padding: 10px;
// }
</style>
