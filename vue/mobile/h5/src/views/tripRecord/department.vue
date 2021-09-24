<template>
    <div>
      <div class="header">
        <div style="display: flex;align-items: center;">
          <div style="width: auto;flex-grow: 1;flex-shrink: 1;">
            <van-field v-model="personName" class="input" left-icon="search" placeholder="搜索" @keyup.enter.native="enterSearchFn"></van-field>
          </div>
          <span v-if="personName" class="cancel" @click="personName=''" style="flex-grow: 0;flex-shrink: 0;">取消</span>
        </div>
        <p><span @click="getDepartmentList">{{userInfo.categoryName}}</span><span v-if="department"> > {{department.name}}</span></p>
      </div>
      <van-cell-group v-show="departmentShow">
        <van-cell class="department-cell" v-for="item in depList" :key="item.id" :title="item.name" is-link @click="checkDepartment(item)" />
      </van-cell-group>
      <van-list v-show="personName||department" ref="list" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onload"   :error.sync="error"
                error-text="请求失败，点击重新加载">
        <van-pull-refresh class="pull-refresh__head" v-model="refreshLoading" @refresh="onRefresh">
          <van-cell-group>
            <van-cell @click="selectUser(item)" v-for="item in userList" :key="item.id">
              <div style="display: flex;align-items: center;">
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
import { NavBar, Cell, Field, CellGroup, List, PullRefresh, Toast } from 'vant'
import Vue from 'vue'
import { getDeptPage, getPersonPage } from '@/api/tripRecord/department'
import { TOKEN, PERSONH5INFOMODEL } from '@/store/mutation-types'
Vue.use(NavBar).use(Field).use(Cell).use(CellGroup).use(List).use(PullRefresh)

export default {
  data () {
    return {
      departmentShow: true,
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
  created () {
    // this.$changePageTitle('选择邮箱')
    this.userInfo = Vue.ls.get(PERSONH5INFOMODEL)
    this.getDepartmentList()
  },
  methods: {
    checkDepartment (item) {
      // this.personName = ''
      this.department = item
      this.search()
    },
    selectUser (user) { // 选择人员，跳回选择邮箱列表
      if (user.email) {
        this.$emit('chooseUserEmail', user.email)
      } else {
        Toast('请选择有邮箱的人员!!!')
      }
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
        if (res.page.list.length > 0) {
          this.departmentShow = false
        } else if (this.pageNum === 1) {
          Toast(`${this.department.name}下无数据`)
          this.department = null
        }
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
        if (res.page.list.length > 0) {
          this.departmentShow = false
        }
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
    getList () {
      const { categoryId, tel, personId } = this.userInfo
      const { pageNum, personName } = this
      return getPersonPage({
        token: Vue.ls.get(TOKEN),
        categoryId,
        obtUserName: tel,
        personId,
        deptId: this.department ? this.department.id : '',
        pageNum,
        personName
      })
    },
    enterSearchFn () {
      if (this.personName || this.department) {
        this.search()
      } else {
        this.getDepartmentList()
      }
    },
    getDepartmentList () { // 获取部门列表
      this.userList = []
      this.department = null
      const { categoryId, tel, personId } = this.userInfo
      getDeptPage({
        token: Vue.ls.get(TOKEN),
        categoryId,
        obtUserName: tel,
        personId
      }).then(res => {
        this.departmentShow = true
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
    padding: 6px 13px 0;
    margin-bottom: 17px;
    .input {
      background: #EEEEEE;
      border-radius: 4px;
      height: 30px;
      padding: 0 7px;
      font-size: 11px;
      line-height: 30px;
    }
    p {
      padding: 8px 0;
      margin: 0;
      font-size: 14px;
      color: #4A4A4A;
    }
  }
  .cancel {
    font-size: 10px;
    color: #007EC8;
    margin-left: 6px;
  }
  .department-cell.van-cell  {
    font-size: 14px;
    color: #4A4A4A;
    padding: 8px 16px;
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
