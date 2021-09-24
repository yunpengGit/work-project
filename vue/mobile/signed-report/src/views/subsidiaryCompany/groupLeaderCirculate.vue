<template>
    <div>
      <van-search v-model="searchValue" shape="round" placeholder="搜索" @search="onSearch"/>
      <van-tabs v-model="active" @change="tabChange">
        <van-tab title="组织架构">
          <div class="panel-breadcrumbs">
            <Breadcrumbs @dataId="departmentDetail"/>
          </div>
          <div class="content">
            <van-checkbox v-model="checkAll" @click="checkAllFn" class="check-all" v-if="list.length !== 0">
              <div class="box check-all-box">
                <span class="text">全选</span>
                <span class="num">{{chosenNum}}/{{sum}}</span>
              </div>
            </van-checkbox>
            <Panel>
              <div>
                <div class="list" v-for="(item, index) in departmentList" :key="index">
                  <span class="name">{{item.name}}</span>
                  <span @click="departmentDetail(item)">
                    <SvgIcon href="youjiantou" class="icon"/>
                  </span>
                </div>
              </div>
            </Panel>
            <van-checkbox-group v-model="chosen" ref="checkboxGroup" @change="checkboxGroupChange">
              <Panel>
                <van-checkbox v-for="(item, index) in list" :key="index" :name="item.id">
                  <div class="box">
                    <img :src="item.img" alt="" class="header">
                    <div class="name-box">
                      <span class="name">{{item.name1}}</span>
                      <span class="small-name">{{item.name2}}</span>
                    </div>
                  </div>
                </van-checkbox>
              </Panel>
            </van-checkbox-group>
          </div>
        </van-tab>
        <van-tab title="群组">
          <group ref="group" listType='groupLeader' @groupUpdateData='groupUpdateData'/>
        </van-tab>
      </van-tabs>
      <ChosenBoxSub listType="groupLeader" :list="sourceData" :sourceData="sourceData"/>
    </div>
</template>

<script>
import Vue from 'vue'
import {
  Toast,
  Search,
  Checkbox,
  CheckboxGroup,
  Tab,
  Tabs
} from 'vant'
import Breadcrumbs from '@c/Breadcrumbs'
import Panel from '@c/Panel'
import ChosenBoxSub from '@c/ChosenBoxSub'
import handleApi from '@a/subsidiaryCompany'
import group from './group'

if (process.env.NODE_ENV === 'development') {
  require('@m/handleInfo')
}
Vue.use(Toast)
  .use(Search)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Tab)
  .use(Tabs)

export default {
  data () {
    return {
      departmentList: [],
      staffList: [],
      searchValue: '',
      showCheckAll: true,
      isDetail: false,
      sum: 0,
      list: [],
      sourceData: [],
      active: 0
    }
  },
  created () {
    this.init()
  },
  computed: {
    chosen: {
      get () {
        let ids = []
        this.$store.state.handleChosen['groupLeaderData'].forEach(item => {
          if (item.isCheck) {
            ids.push(item.id)
          }
        })
        return ids
        // return this.$store.state.handleChosen['groupLeader'] ? this.$store.state.handleChosen['groupLeader'] : []
      },
      set (val) {
        let checkData = this.$store.state.handleChosen['groupLeaderData']
        // ! 数组对象去重
        const objArr = {}
        checkData = checkData.filter((item, index) => {
          if (!objArr[item.id]) {
            objArr[item.id] = item.id
            return true
          }
        })
        // console.log(this.sourceDataIds)
        checkData = checkData.map((item) => {
          // 判断当前数据对象是否包含在初始化数据对象中
          if (this.sourceDataIds.includes(item.id)) {
            if (val.includes(item.id)) {
              item.isCheck = true
            } else {
              item.isCheck = false
            }
          }
          return item
        })
        // console.log(checkData)
        this.$store.dispatch(`setGroupLeaderData`, checkData)
      }
    },
    chosenNum () {
      let arr = []
      this.chosen.forEach(item => {
        this.list.forEach(item1 => {
          if (item1.id === item) {
            arr.push(item1)
          }
        })
      })
      return arr.length
    },
    sourceDataIds () {
      let ids = []
      this.sourceData.map(item => {
        ids.push(item.id)
      })
      return ids
    },
    checkAll: {
      get () {
        return this.list.length !== 0 && this.list.length === this.chosenNum
      },
      set (val) {
        return val
      }
    }
  },
  methods: {
    tabChange () {
      // 在组织架构和群组之间切换时清除已选的数据
      // this.departmentList = []
      // this.list = []
      // this.$store.dispatch('setGroupLeader', [])
      // this.$store.dispatch('setGroupLeaderData', [])
      this.initBreadcrumbs()
      // 初始化 组织架构 or 群组
      if (this.active === 0) { // 组织架构
        this.init()
      } else if (this.active === 1) { // 群组
        this.$refs.group && this.$refs.group.initBreadcrumbs()
      }
      // if (this.active === 0) {
      //   this.departmentList = []
      //   this.list = []
      //   this.init()
      //   this.initBreadcrumbs()
      // } else if (this.active === 1) {
      //   this.$refs.group && this.$refs.group.initBreadcrumbs()
      // }
    },
    groupUpdateData ({ sourceData, list }) {
      this.sourceData = sourceData
      this.list = list
    },
    async departmentDetail (item) {
      this.isDetail = true
      await this.init(item)
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
    checkboxGroupChange () {
      this.$store.dispatch('setGroupLeader', this.chosen)
    },
    checkAllFn () {
      this.$refs.checkboxGroup.toggleAll(!this.checkAll)
    },
    onSearch () {
      if (this.searchValue === '') {
        this.init()
        let arr = this.$store.state.handle.breadcrumbs
        arr.splice(1)
        this.$store.dispatch('setBreadcrumbs', arr)
        // 清除已选节点
        this.$store.dispatch('setGroupLeader', [])
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
          this.$store.dispatch(`setGroupLeaderData`, [...this.$store.state.handleChosen['groupLeaderData'], ...res.data])
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
          this.staffList = staffList
          let arr = JSON.parse(JSON.stringify(staffList).replace(/name/g, 'name1'))
          this.list = arr
          this.sum = this.list.length
        }).catch((e) => {
          Toast.fail(e)
        })
      }
    },
    init (item) {
      let id = item && item.id
      handleApi['getAllOrg'](
        {
          parent: id,
          orgType: '10' // 2 部门 8 人员 10 人员+部门
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
        let departmentList = []
        let staffList = []
        this.sourceData = res.data
        this.$store.dispatch(`setGroupLeaderData`, [...this.$store.state.handleChosen['groupLeaderData'], ...res.data])
        res.data.forEach(item => {
          if (item.orgType !== '1' && item.orgType !== '2') {
            staffList.push(item)
          } else {
            departmentList.push(item)
          }
        })
        this.departmentList = departmentList
        this.staffList = staffList
        let arr = JSON.parse(JSON.stringify(staffList).replace(/name/g, 'name1'))
        this.list = arr
        this.sum = this.list.length
      }).catch((e) => {
        Toast.fail(e)
      })
    }
  },
  components: {
    Breadcrumbs,
    Panel,
    ChosenBoxSub,
    group
  }
}
</script>

<style scoped lang="less">
.panel-breadcrumbs{
  margin-bottom: 8px;
  padding-left: 12px;
  background-color: #fff;
}
.van-checkbox{
  &:last-child{
    .department-box,
    .box{
      border-bottom: 0;
    }
  }
}
.van-search__content{
  background-color: #EBEDF0;
}
.content{
  padding-bottom: 58px;
}
/deep/.van-checkbox__label{
  flex: 1;
}
.check-all{
  background-color: #fff;
  padding-left: 12px;
}
.check-all-box{
  padding-right: 20px;
  display: flex;
  justify-content: space-between;
  .text{
    font-size:17px;
    color:rgba(4,16,31,1);
  }
  .num{
    font-size:14px;
    color:rgba(149,149,149,1);
  }
}
.department-box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 8px;
  height: 60px;
  border-bottom: 1px solid #C5CED8;
  .name{
    font-size:17px;
    color:rgba(4,16,31,1);
  }
  .icon{
    padding: 20px;
    width: 12px;
    height: 18px;
  }
}
.box{
  display: flex;
  align-items: center;
  margin-left: 8px;
  height: 60px;
  border-bottom: 1px solid #C5CED8;
  .header{
    margin-right: 16px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .name-box{
    display: flex;
    flex-direction: column;
  }
  .name{
    font-size:17px;
    color:#04101F;
    line-height:17px;
  }
  .small-name{
    margin-top: 4px;
    font-size:14px;
    color:#7B8283;
    line-height:17px;
  }
}
.list{
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 8px;
  height: 60px;
  border-bottom: 1px solid #C5CED8;
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
