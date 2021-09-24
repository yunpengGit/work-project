<template>
    <div>
      <van-nav-bar left-arrow title="选择部门" @click-left="back"/>
      <div class="header">
        <div flex="cross:center">
          <div flex-item="1">
            <van-field v-model="personName" class="input" left-icon="search" placeholder="搜索"></van-field>
          </div>
          <span v-if="personName" class="cancel" @click="personName=''" flex-item="0">取消</span>
        </div>
        <p>{{userInfo.categoryName}}<span v-if="department"> > {{department.name}}</span></p>
      </div>
      <van-cell-group v-show="!personName&&!department">
        <van-cell class="department-cell" v-for="item in depList" :key="item.id" :title="item.name" is-link @click="checkDepartment(item)" />
      </van-cell-group>
      <van-list v-show="personName||department" ref="list" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onload"   :error.sync="error"
                error-text="请求失败，点击重新加载">
        <van-pull-refresh class="pull-refresh__head" v-model="refreshLoading" @refresh="onRefresh">
          <van-cell-group>
            <van-cell @click="selectUser(item)" v-for="item in userList" :key="item.id">
              <div flex="cross:center">
                <svg-icon href="iconrenyuan" class="head-icon"/>
                <span class="user-name">{{item.name}}</span>
                <span>{{item.email||'无邮箱'}}</span>
              </div>
            </van-cell>
          </van-cell-group>
        </van-pull-refresh>
      </van-list>
    </div>
</template>
<script>
import { NavBar, Cell, Field, CellGroup, List, PullRefresh } from 'vant'
import Vue from 'vue'
import ApiMumber from '@/api/mumber'
import ApiDepartment from '@/api/department'
Vue.use(NavBar).use(Field).use(Cell).use(CellGroup).use(List).use(PullRefresh)

// TODO: 搜索功能未实现
export default {
  data () {
    return {
      depList: [],
      userInfo: {},
      personName: '',
      userList: [],
      pageNum: 0,
      loading: false,
      error: false,
      finished: false,
      refreshLoading: false,
      department: null // 默认选择部门
    }
  },
  watch: {
    personName (newValue) {
      if (newValue || this.department) {
        this.search()
      } else {
        this.getDepartmentList()
      }
    }
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.getDepartmentList()
  },
  methods: {
    checkDepartment (item) {
      this.personName = ''
      this.department = item
      this.search()
    },
    selectUser (user) { // 选择人员，跳回选择邮箱列表
      this.$store.dispatch('setSelectedUser', user)
      this.$router.replace('/checkEmails')
    },
    search () {
      this.finished = false
      this.pageNum = 0
      this.userList = []
      this.$refs.list.check()
    },
    onload () { // 人员列表加载逻辑
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
    onRefresh () { // 下拉刷新，人员列表
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
      if (this.department) { // 部门人员列表状态时，退回选择部门列表
        this.personName = ''
        this.department = null
        this.finished = false
        this.pageNum = 0
        this.userList = []
        this.loading = false
        this.error = false
        this.refreshLoading = false
      } else {
        this.$router.push('/checkEmails')
      }
    },
    getList () {
      const { categoryId, tel, personId } = this.userInfo
      const { pageNum, personName } = this
      return ApiMumber.getPersonPage({
        categoryId,
        obtUserName: tel,
        personId,
        deptId: this.department ? this.department.id : '',
        pageNum,
        personName
      })
    },
    getDepartmentList () { // 获取部门列表
      const { categoryId, tel, personId } = this.userInfo
      ApiDepartment.getDeptPage({
        categoryId,
        obtUserName: tel,
        personId
      }).then(res => {
        this.depList = res.page.list
      })
    }
  }
}
</script>
<style lang="less" scoped>
  @import "~vant/es/style/var";
  .header {
    background-color: @white;
    padding: 6px 22.5px 0;
    margin-bottom: 7.5px;
    .input {
      background: #EEEEEE;
      border-radius: 8px;
      height: 30px;
      line-height: 30px;
      padding: 0 7.5px;
      font-size: 11px;
      line-height: 30px;
    }
    p {
      padding: 7.5px 0;
      margin: 0;
      font-size: 10.5px;
      color: #4A4A4A;
    }
  }
  .cancel {
    font-size: 10.5px;
    color: #007EC8;
    margin-left: 6px;
  }
  .department-cell.van-cell  {
    font-size: 10.5px;
    color: #4A4A4A;
    padding: 4px 22.5px;
  }
  .user-cell.van-cell {
    font-size: 12px;
  }
  .head-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
  .user-name {
    width: 80px;
  }
</style>
