<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-04-14 10:15:50
 * @LastEditors: caofeng
 * @LastEditTime: 2021-08-20 16:49:52
-->
<template>
  <div class="auths-detail-list">
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
        uid="auths-detail-id"
        :height="tableHeight"
        :is-index="true"
        :table-cols="tableCols"
        :page-height="false"
        :api="getList"
      />
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
      // uid: 'auths-detail-id-01',
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
        }
      ],
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
        // console.log(1, ele.$el.className, surplusHeight)
      })
      this.tableHeight = `${contentHeight - surplusHeight}px`
      console.log(this.tableHeight)
    },
    closed () {
      this.$emit('closeDetail')
    },
    getList (params) {
      params.label = 'test'
      params.roleId = this.roleId
      return this.$api('auths.roleAuthList', params)
    }
  }
}
</script>

<style lang="scss">
.auths-detail-list {
  .filter-box {
    .el-form-item:nth-child(odd) {
      margin-left: 0;
    }
    .el-button {
      margin-bottom: 20px;
    }
  }
  .sp-pagination {
    position: inherit;
  }
}

.el-select-dropdown.el-popper{
  z-index: 3001 !important;
}
</style>
