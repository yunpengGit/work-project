<template>
    <div>
      <van-search v-model="searchValue" shape="round" placeholder="搜索" @search="onSearch"/>
      <van-tabs v-model="active" @change="tabChange">
        <van-tab title="组织架构">
          <div class="content" ref="organization">
            <Panel>
              <Breadcrumbs @dataId="departmentDetail"/>
            </Panel>
            <Panel>
              <div class="list">
                <div class="box" v-for="(item, index) in departmentList" :key="index">
                    <span class="name">{{item.name}}</span>
                    <span @click="departmentDetail(item)">
                      <SvgIcon href="youjiantou" class="icon"/>
                    </span>
                  </div>
              </div>
            </Panel>
            <Panel>
              <RadioList :list="list" :sourceData="sourceData" listType="otherDepartmentHandle"/>
            </Panel>
          </div>
        </van-tab>
        <van-tab title="群组">
          <group ref="group" listType='otherDepartmentHandle'/>
        </van-tab>
      </van-tabs>
      <RadioBoxSub :list="list"  listType="otherDepartmentHandle" :sourceData="sourceData"/>
    </div>
</template>

<script>
import Vue from 'vue'
import { Tab, Tabs, Toast, Search } from 'vant'
import RadioList from '@c/RadioList'
import Breadcrumbs from '@c/Breadcrumbs'
import Panel from '@c/Panel'
import RadioBoxSub from '@c/RadioBoxSub'
import group from './group'

import handleApi from '@a/subsidiaryCompany'
if (process.env.NODE_ENV === 'development') {
  require('@m/handleInfo')
}
Vue.use(Toast)
  .use(Search)
  .use(Tab)
  .use(Tabs)
export default {
  data () {
    return {
      departmentList: [],
      searchValue: '',
      list: [],
      isDetail: false,
      sourceData: [],
      active: 0
    }
  },
  computed: {
    isSubsidiaryCompany () {
      return this.$store.state.handle.subsidiaryCompany
    }
  },
  created () {
    this.init()
  },
  methods: {
    tabChange () {
      if (this.active === 0) {
        this.initBreadcrumbs()
      } else if (this.active === 1) {
        this.$refs.group && this.$refs.group.initBreadcrumbs()
      }
    },
    departmentDetail (item) {
      this.isDetail = true
      this.init(item)
    },
    initBreadcrumbs (item) {
      let breadcrumbsArr = this.$store.state.handle.breadcrumbs
      if (item) {
        breadcrumbsArr.push(item)
      } else {
        breadcrumbsArr = [{ name: '组织架构', id: '' }]
      }
      this.$store.dispatch('setBreadcrumbs', breadcrumbsArr)
    },
    onSearch () {
      if (this.searchValue === '') {
        this.init()
        let arr = this.$store.state.handle.breadcrumbs
        arr.splice(1)
        this.$store.dispatch('setBreadcrumbs', arr)
        // 清除已选节点
        this.$store.dispatch('setOtherDepartmentHandle', [])
      } else {
        handleApi.ownDepartmentSearch(
          {
            key: this.searchValue,
            type: 'getAllOrg'
          }
        ).then(res => {
          if (res.data && res.data.length === 0) {
            Toast('没有更多数据了')
            return false
          }
          this.sourceData = res.data
          let departmentList = []
          let staffList = []
          res.data.forEach(item => {
            if (item.orgType === '1' || item.orgType === '2') {
              departmentList.push(item)
            } else if (item.orgType === '8') {
              staffList.push(item)
            }
          })
          this.departmentList = departmentList
          let arr = JSON.parse(JSON.stringify(staffList).replace(/name/g, 'name1'))
          this.list = arr
        }).catch((e) => {
          Toast.fail(e)
        })
      }
    },
    init (item) {
      let parent = item && item.id
      handleApi['getAllOrg'](
        {
          parent,
          orgType: '10'// 2 部门 8 人员 10 人员+部门
        }
      ).then(res => {
        if (res.data && res.data.length === 0) {
          Toast('没有更多数据了')
          return false
        }
        if (this.isDetail) {
          this.initBreadcrumbs(item)
        } else {
          this.initBreadcrumbs()
        }
        this.sourceData = res.data
        let departmentList = []
        let staffList = []
        res.data.forEach(item => {
          if (item.orgType === '1' || item.orgType === '2') {
            departmentList.push(item)
          } else if (item.orgType === '8') {
            staffList.push(item)
          }
        })
        this.departmentList = departmentList
        let arr = JSON.parse(JSON.stringify(staffList).replace(/name/g, 'name1'))
        this.list = arr
      }).catch((e) => {
        Toast.fail(e)
      })
    }
  },
  components: {
    Breadcrumbs,
    Panel,
    RadioList,
    RadioBoxSub,
    group
  }
}
</script>

<style scoped lang="less">
.van-search__content{
  background-color: #EBEDF0;
}
.content{
  padding-bottom: 58px;
}
.box{
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 8px;
  height: 60px;
  border-bottom: 1px solid #C5CED8;
  &:last-child{
    border-bottom: 0;
  }
  .name{
    font-size:17px;
    color:rgba(4,16,31,1);
  }
  .icon{
    position: absolute;
    right: 0;
    top: 0;
    box-sizing: content-box;
    padding: 20px 20px 20px 315px;
    width: 12px;
    height: 18px;
  }
}
</style>
