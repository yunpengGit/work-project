<template>
  <div class="anth-drawer-container">
    <el-drawer
      :visible="detailDrawer"
      title="选择授权用户"
      :size="820"
      custom-class="detail-drawer"
      destroy-on-close
      @update:visible="visibaleChange"
      @close="closed"
    >
      <div class="main-content">
        <div class="select-auth-users">
          <h3 class="el-icon-user-solid">选择授权用户</h3>
          <authSearch
            :role-id="roleId"
            :selected-users-data="selectedUsersData"
            :users-data="usersData"
            :authorized-users-data="authorizedUsersData"
            @selectedEvent="selectedEvent"
            @changeUsersData="changeUsersData"
          />
          <usersTree
            :role-id="roleId"
            :users-tree-data="usersTreeData"
            :authorized-users-data="authorizedUsersData"
            :empty-text="emptyText"
            :selected-users-data="selectedUsersData"
            @addBilateralData="addBilateralData"
            @delBilateralData="delBilateralData"
          />
        </div>
        <div class="selected-auth-users">
          <h3 class="el-icon-position">所选项</h3>
          <ul class="left-right-layout">
            <li>
              <span>已选人员</span>
              <div
                v-if="selectedUsersData.length>0"
                class="el-icon-delete"
                @click="deleteAll"
              >全部移除</div>
            </li>
            <li v-for="(ele, index) in selectedUsersData" :key="ele.customKey">
              <span>{{ ele.userName }}</span>
              <div
                class="el-icon-delete"
                @click="del(index)"
              />
            </li>
          </ul>
        </div>
      </div>
      <div class="drawer-footer">
        <el-button @click="visibaleChange">取消</el-button>
        <el-button type="primary" :loading="loading" :disabled="!selectedUsersData.length" @click="submit">{{ loading ? '提交中': '确定授权' }}</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import authSearch from './authSearch/index'
import usersTree from './usersTree/index'
export default {
  components: { authSearch, usersTree },
  props: {
    detailDrawer: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: String,
      default: ''
    },
    roleName: {
      type: String,
      default: ''
    },
    selectedUsersData: {
      type: Array,
      default: () => []
    },
    usersData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      // 已授权人员
      authorizedUsersData: [],
      // 企业树数据
      usersTreeData: [],
      // 确定授权按钮的loading
      loading: false,
      // tree未加载出之前的提示文字
      emptyText: '加载中...'
    }
  },
  created () {
    this.$api('auths.nameDepts', {
    }).then(res => {
      if (res.code === 200) {
        this.usersTreeData = res.data
        if (!res.data.length) {
          this.emptyText = '暂无数据'
        }
      } else {
        this.emptyText = '因网速问题加载失败，请刷新页面'
      }
    })
    this.$api('auths.roleAuthList', {
      label: 'test',
      roleId: this.roleId
    }).then(res => {
      if (res.code === 200) {
        this.authorizedUsersData = res.data
      }
    })
  },
  methods: {
    // 更新列表
    refreshData () {
      this.$store.commit('UPDATE_ALL_TABLE_DATA')
    },
    addBilateralData (data) {
      this.$emit('addBilateralData', data)
    },
    delBilateralData (data) {
      this.$emit('delBilateralData', data)
    },
    changeUsersData (data) {
      this.$emit('changeUsersData', data)
    },
    deleteAll () {
      this.$emit('resetBilateralData')
    },
    del (index) {
      const data = this.selectedUsersData[index]
      this.$emit('delBilateralData', data)
    },
    selectedEvent (index) {
      const checked = this.usersData[index].checked
      if (checked) {
        this.$emit('addBilateralData', this.usersData[index])
      } else {
        this.$emit('deleteUsersData', this.usersData[index])
      }
    },
    visibaleChange () {
      this.$emit('update:detail-drawer', false)
    },
    closed () {
      this.$emit('closeDetail')
    },
    submit () {
      const userIds = []
      this.selectedUsersData.map(ele => {
        userIds.push(ele.userId)
      })
      const handleUserId = [...new Set(userIds)]
      const submitUserId = handleUserId.join()
      this.loading = false
      this.$api('auths.addAuthRole', {
        roleId: this.roleId,
        userIds: submitUserId
      }).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.refreshData()
          this.$message.success('操作成功')
          this.$emit('closeDetail')
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.main-content {
  padding: 16px;
  display: flex;
  flex-grow: 1;
  overflow-y: auto;
  >div {
    box-sizing: border-box;
  }
  .select-auth-users {
    width: 488px;
    padding-right: 20px;
  }
  .selected-auth-users {
    flex: 1;
    padding: 0 15px;
    overflow-y: scroll;
    background-color: #F2F2F2;
    .left-right-layout li{
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
      .el-icon-delete {
        cursor: pointer;
        color: #FF6633;
      }
      .el-icon-delete:before {
        margin-right:4px;
      }
    }
  }
  .el-icon-user-solid:before, .el-icon-position:before {
    color: #AEAEAE;
    margin-right: 5px;
  }
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
.anth-drawer-container {
  .el-drawer__container .el-drawer__body {
    display: flex;
    box-orient: vertical;
    box-direction: normal;
    flex-direction: column;
  }
}
</style>
