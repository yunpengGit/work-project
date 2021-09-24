<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-04-08 14:31:10
 * @LastEditors: aq.hu
 * @LastEditTime: 2021-05-07 10:37:43
-->
<template>
  <div class="app-container">
    <sp-table
      keys="authRoleName, authRemark"
      :is-index="true"
      :table-cols="tableCols"
      :api="getList"
    />
    <empower
      v-if="empowerVisibile"
      :detail-drawer.sync="empowerVisibile"
      :role-id="roleId"
      :role-name="roleName"
      :selected-users-data="selectedUsersData"
      :users-data="usersData"
      @closeDetail="closeDetail"
      @addBilateralData="addBilateralData"
      @delBilateralData="delBilateralData"
      @resetBilateralData="resetBilateralData"
      @deleteUsersData="deleteUsersData"
      @changeUsersData="changeUsersData"
    />
    <detail
      v-if="detailVisibile"
      :role-id="roleId"
      :detail-drawer.sync="detailVisibile"
      @closeDetail="closeDetail"
    />
    <remove
      v-if="editVisibile"
      :role-id="roleId"
      :detail-drawer.sync="detailVisibile"
      @closeDetail="closeDetail"
    />
  </div>
</template>

<script>
import empower from './empower/index'
import detail from './detail/index'
import remove from './remove/index'
export default {
  components: { empower, detail, remove },
  data () {
    return {
      // 搜索框下拉数据
      usersData: [],
      // 已选人员
      selectedUsersData: [],
      roleId: '',
      roleName: '',
      // 添加授权窗口显示与否
      empowerVisibile: false,
      // 查看窗口显示与否
      detailVisibile: false,
      // 修改授权显示与否
      editVisibile: false,
      tableCols: [
        {
          label: '角色名称', prop: 'roleName'
        },
        {
          label: '授权用户数', prop: 'totalUsers'
        },
        {
          label: '角色备注', prop: 'remark', showOverflowTooltip: true
        },
        {
          label: '操作', template: scope => {
            return <div>
              <el-button
                type='text'
                v-hasPermi= { ['system:auths:add'] }
                on-click={() => this.empower(scope.row.roleId, scope.row.roleName)}
              >用户授权</el-button>
              <el-button
                type='text'
                v-hasPermi= { ['system:auths:query'] }
                on-click={() => this.getDetail(scope.row.roleId)}
              >查看</el-button>
              <el-button
                type='text'
                v-hasPermi={ ['system:auths:remove'] }
                on-click={() => this.edit(scope.row.roleId)}
              >删除授权</el-button>
            </div>
          }
        }
      ]
    }
  },
  methods: {
    // 初始化已选人员
    // changeAuthorizedusersData (data) {
    //   this.authorizedusersData = []
    //   data.map(res => {
    //     this.authorizedusersData.push(res)
    //   })
    //   // console.log(this.authorizedusersData)
    //   // this.authorizedusersData = data
    // },
    // 同时在搜索框和已选人员添加展示数据
    addBilateralData (data) {
      const selectedIndex = this.selectedUsersData.findIndex(ele => ele.customKey === data.customKey)
      const usersIndex = this.usersData.findIndex(ele => ele.customKey === data.customKey)
      if (selectedIndex === -1) {
        this.selectedUsersData.push(data)
      }
      if (usersIndex > -1) {
        this.usersData[usersIndex].checked = true
      }
    },
    // 同时在搜索框和已选人员删除展示数据
    delBilateralData (data) {
      const selectedIndex = this.selectedUsersData.findIndex(ele => ele.customKey === data.customKey)
      const usersIndex = this.usersData.findIndex(ele => ele.customKey === data.customKey)
      if (selectedIndex > -1) {
        this.selectedUsersData.splice(selectedIndex, 1)
      }
      if (usersIndex > -1) {
        this.usersData[usersIndex].checked = false
      }
    },
    // 根据搜索文字展示下拉框内容
    changeUsersData (data) {
      this.usersData = data
    },
    // 全部移除
    resetBilateralData () {
      this.selectedUsersData = []
      this.usersData = []
    },
    // 搜索下拉框的取消选中事件
    deleteUsersData (data) {
      const delIndex = this.selectedUsersData.findIndex(ele => ele.customKey === data.customKey)
      this.selectedUsersData.splice(delIndex, 1)
    },
    // 获取列表数据
    getList (params) {
      return this.$api('auths.roleList', params)
    },
    // 添加授权
    empower (roleId, roleName) {
      this.roleId = roleId
      this.roleName = roleName
      this.usersData = []
      this.selectedUsersData = []
      this.empowerVisibile = true
      // const submit = new Promise((resolve, reject) => {
      //   this.$api('role.roleAuthList', {
      //     label: 'test',
      //     roleId
      //   }).then(res => {
      //     if (res.code === 200) {
      //       if (!res.data.length) {
      //         resolve()
      //       } else {
      //         reject(res.data)
      //       }
      //     }
      //   })
      // })
      // submit.then(() => {
      //   this.roleId = roleId
      //   this.roleName = roleName
      //   this.usersData = []
      //   this.selectedUsersData = []
      //   this.empowerVisibile = true
      // }).catch((data) => {
      //   this.$confirm('本操作将删除该角色所有授权关系，删除授权后，所有授权用户将失去该角色权限', '提示', {
      //     title: '信息提示',
      //     dangerouslyUseHTMLString: true,
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消'
      //   }).then(res => {
      //     const delUserId = []
      //     data.map(ele => {
      //       delUserId.push(ele.userId)
      //     })
      //     const handleUserId = [...new Set(delUserId)]
      //     const submitUserId = handleUserId.join()
      //     this.$api('auths.delAuthRole', {
      //       roleId,
      //       userIds: submitUserId
      //     }).then(res => {
      //       if (res.code === 200) {
      //         this.roleId = roleId
      //         this.roleName = roleName
      //         this.usersData = []
      //         this.selectedUsersData = []
      //         this.empowerVisibile = true
      //       }
      //     })
      //   }).catch(() => {})
      // })
    },
    // 点击查看和删除按钮初始化路由
    initRoute () {
      const path = this.$route.path
      const queryParams = JSON.parse(JSON.stringify(this.$route.query))
      let routeFlag = false
      for (const i in queryParams) {
        if (i.includes('auths-remove-id') || i.includes('auths-detail-id')) {
          delete queryParams[i]
          routeFlag = true
        }
      }
      if (routeFlag) {
        this.$router.push({ path, query: queryParams })
      }
    },
    // 查看
    getDetail (roleId) {
      this.initRoute()
      this.roleId = roleId
      this.detailVisibile = true
    },
    // 删除授权
    edit (roleId) {
      this.initRoute()
      this.roleId = roleId
      this.editVisibile = true
    },
    // 关闭右侧窗口
    closeDetail () {
      this.detailVisibile = false
      this.empowerVisibile = false
      this.editVisibile = false
      this.selectedUsersData = []
    }
  }
}
</script>
