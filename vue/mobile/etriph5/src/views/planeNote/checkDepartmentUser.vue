<template>
  <div>
    <van-nav-bar left-arrow title="选择人员" @click-left="back"/>
    <div class="header">
      <van-field v-model="personName" @keyup.enter="searh" placeholder="搜索"></van-field>
      <p>{{userInfo.categoryName}} > {{department.name}}</p>
    </div>
    <van-list ref="list" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onload"   :error.sync="error"
              error-text="请求失败，点击重新加载">
      <van-pull-refresh class="pull-refresh__head" v-model="refreshLoading" @refresh="onRefresh">
        <van-cell-group>
            <van-cell @click="selectUser(item)" icon="user-o"  v-for="item in userList" :key="item.id" :value="item.email||'无邮箱'" :title="item.name"/>
        </van-cell-group>
      </van-pull-refresh>
    </van-list>
  </div>
</template>
<script>
import { NavBar, Cell, Field, CellGroup, List, PullRefresh } from 'vant'
import Vue from 'vue'
import ApiMumber from '@/api/mumber'
Vue.use(NavBar).use(Field).use(Cell).use(CellGroup).use(List).use(PullRefresh)

export default {
  data () {
    return {
      userList: [],
      userInfo: {},
      department: {},
      pageNum: 0,
      loading: false,
      error: false,
      finished: false,
      refreshLoading: false,
      personName: ''
    }
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.department = this.$route.params.department
  },
  methods: {
    selectUser (user) {
      this.$store.dispatch('setSelectedUser', user)
      this.$router.push('/checkEmails')
    },
    searh () {
      this.finished = false
      this.pageNum = 0
      this.userList = []
      this.$refs.list.check()
    },
    onRefresh () { // 下拉刷新
      this.pageNum = 1
      this.getList().then(res => {
        this.refreshLoading = false
        if (res.page.list.length) {
          this.userList = res.page.list
          if (res.page.list.length === 10) {
            this.$refs.list.check()
          } else {
            this.finished = true
          }
        } else {
          this.userList = []
          this.refreshLoading = false
        }
      }).catch(() => {
        this.refreshLoading = false
      })
    },
    back () {
      this.$router.replace('/checkDepartment')
    },
    onload () {
      this.pageNum++
      this.getList().then(res => {
        this.loading = false
        if (res.page.list.length) {
          this.userList = this.userList.concat(res.page.list)
        }
        if (res.page.list.length < 10) {
          this.finished = true
        }
      }).catch(() => {
        this.error = true
        this.loading = false
      })
    },
    getList () {
      const { categoryId, tel, personId } = this.userInfo
      const { pageNum, personName } = this
      return ApiMumber.getPersonPage({
        categoryId,
        obtUserName: tel,
        personId,
        deptId: this.department.id,
        pageNum,
        personName
      })
    }
  }
}
</script>
<style lang="less" scoped>
  @import "~vant/es/style/var";
  .header {
    background-color: @white;
    p {
      padding: 0 @padding-md @padding-md;
    }
  }
</style>
