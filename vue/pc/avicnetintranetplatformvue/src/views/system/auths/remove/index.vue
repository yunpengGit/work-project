<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-04-14 11:02:15
 * @LastEditors: caofeng
 * @LastEditTime: 2021-08-20 16:50:52
-->
<template>
  <div class="auths-detail-remove">
    <el-drawer
      ref="authsDrawer"
      :visible="true"
      title="授权用户列表"
      :size="750"
      custom-class="detail-drawer"
      destroy-on-close
      @close="closed"
    >
      <sp-table
        ref="popupTable"
        keys="authNickName, authUserName, authPhone, authWorkNo, authCompanyName"
        uid="auths-remove-id"
        :height="tableHeight"
        :is-index="true"
        :table-cols="tableCols"
        :page-height="false"
        :api="getList"
        :selection.sync="selection"
      >
        <div slot="handle">
          <el-button
            type="danger"
            :loading="loading"
            :disabled="!selection.length"
            @click="operDelete"
          >
            删除
          </el-button>
        </div>
      </sp-table>
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
      selection: [],
      tableCols: [
        {
          label: '登录名', prop: 'userName'
        },
        {
          label: '姓名', prop: 'nickName'
        },
        {
          label: '员工编号', prop: 'workNo'
        },
        {
          label: '手机号', prop: 'phone'
        },
        {
          label: '所属企业', prop: 'companyName'
        },
        {
          label: '操作', template: scope => {
            return <div>
              <el-button
                type='text'
                v-hasPermi={ ['system:role:remove'] }
                on-click={() => this.handleDelete(scope.row.userId)}
              >删除授权</el-button>
            </div>
          }
        }
      ],
      // 批量删除的数据
      deleteData: [],
      loading: false,
      tableHeight: 0
    }
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.computedTableHeight)
      this.computedTableHeight()
    })
  },
  destroyed () {
    window.removeEventListener('resize', this.computedTableHeight)
  },
  methods: {
    // 动态计算table高度 - for IE 10
    computedTableHeight () {
      // drawer高度
      const contentHeight = this.$refs.authsDrawer.$el.clientHeight
      const popupTable = this.$refs.popupTable.$children
      // drawer的title高度
      let surplusHeight = 56
      // 拿到除table以外的所有元素的高度
      let handleFlag = false
      popupTable.forEach(ele => {
        if (ele.$el.className.includes('el-button') && !handleFlag) {
          handleFlag = true
          surplusHeight += ele.$el.clientHeight + 24
        }
        if (!ele.$el.className.includes('el-table') && !ele.$el.className.includes('el-button')) {
          surplusHeight += ele.$el.clientHeight
        }
      })
      this.tableHeight = `${contentHeight - surplusHeight}px`
    },
    // 更新列表
    refreshData () {
      this.$store.commit('UPDATE_ALL_TABLE_DATA')
    },
    closed () {
      this.$emit('closeDetail')
    },
    getList (params) {
      params.label = 'test'
      params.roleId = this.roleId
      return this.$api('auths.roleAuthList', params)
    },
    // 批量删除
    operDelete () {
      this.deleteData = []
      this.selection.map(ele => {
        this.deleteData.push(ele.userId)
      })
      this.runDelete(this.deleteData)
    },
    // 删除授权
    handleDelete (userId) {
      this.runDelete(userId)
    },
    runDelete (userId) {
      let tips = '删除授权后，该用户将失去该角色权限。'
      if (typeof userId !== 'string' && userId.length > 1) {
        tips = '删除授权后，所有授权用户将失去该角色权限。'
      }
      this.$confirm(tips, '提示', {
        title: '信息提示',
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.loading = true
        let submitUserId = ''
        if (typeof userId === 'string') {
          submitUserId = userId
        } else {
          submitUserId = this.deleteData.join()
        }
        this.$api('auths.delAuthRole', {
          roleId: this.roleId,
          userIds: submitUserId
        }).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.refreshData()
            this.$message.success('操作成功')
          }
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss">
.auths-detail-remove {
  .filter-box {
    .el-form-item:nth-child(odd) {
      margin-left: 0;
    }
  }
  .sp-pagination {
    position: inherit;
  }
}
</style>
