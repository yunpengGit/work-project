<template>
    <div>
      <Panel>
        <Breadcrumbs @dataId="departmentDetail"/>
      </Panel>
      <Panel>
        <div>
          <div class="box" v-for="(item, index) in departmentList" :key="index">
            <img :src="groupHeader" alt="" class="group-header">
            <span class="name">{{item.name}}</span>
            <span @click="departmentDetail(item, item.type)">
              <SvgIcon href="youjiantou" class="icon"/>
            </span>
          </div>
        </div>
      </Panel>
      <Panel>
        <RadioList :list="list" :sourceData="sourceData" :listType="listType" v-if="parentType === 'otherDepartmentHandle'"/>
        <CheckboxListSub :list="list" :sum='sum' :sourceData="sourceData" :listType="listType" :showCheckAll='showCheckAll' v-else v-show="list.length > 0"/>
      </Panel>
    </div>
</template>

<script>
import Vue from 'vue'

import { Toast } from 'vant'
import CheckboxListSub from '@c/CheckboxListSub'
import RadioList from '@c/RadioList'
import Breadcrumbs from '@c/Breadcrumbs'
import Panel from '@c/Panel'

import api from '@a/subsidiaryCompany'
Vue.use(Toast)
export default {
  data () {
    return {
      groupHeader: require('./../../assets/img/groupHeader.png'),
      parentType: '',
      departmentList: [
        { name: '公共群组', type: 'commonGroup' },
        { name: '个人群组', type: 'ownGroup' }
      ],
      list: [],
      isDetail: false,
      sourceData: [],
      showCheckAll: true,
      sum: 0,
      groupType: ''
    }
  },
  props: {
    listType: {
      type: String
    }
  },
  mounted () {
    this.parentType = this.listType
  },
  created () {
    this.initBreadcrumbs()
  },
  methods: {
    departmentDetail (item, groupType) {
      if (item.name === '常用群组') {
        this.initgroup()
      } else {
        this.isDetail = true
        if (!groupType) {
          groupType = this.groupType
        }
        if (groupType) {
          this.initGroup({ item, type: groupType })
        }
      }
    },
    initgroup () {
      this.$store.dispatch('setBreadcrumbs', [{ name: '常用群组', id: '' }])
      this.list = []
      this.sourceData = []
      this.departmentList = [
        { name: '公共群组', type: 'commonGroup' },
        { name: '个人群组', type: 'ownGroup' }
      ]
    },
    initBreadcrumbs (item) {
      let breadcrumbsArr = this.$store.state.handle.breadcrumbs
      if (item) {
        breadcrumbsArr.push(item)
      } else {
        breadcrumbsArr = [{ name: '常用群组', id: '' }]
        this.initgroup()
      }
      this.$store.dispatch('setBreadcrumbs', breadcrumbsArr)
    },
    initGroup ({ item, type }) {
      let data = {}
      let getMethod
      if (type === 'ownGroup') {
        this.groupType = type
        getMethod = 'ownGroup'
        if (item.nodeType) {
          getMethod = 'ownGroupList'
          data.id = item.id
        }
      } else if (type === 'commonGroup') {
        this.groupType = type
        getMethod = 'commonGroup'
        if (item.nodeType === 'cate') {
          data.parent = item.id
        } else if (item.nodeType === 'group') {
          getMethod = 'commonGroupList'
          data.groupCate = item.id
        }
      }
      api[getMethod](data).then((res) => {
        if (res.data && res.data.length === 0) {
          Toast('没有更多数据了')
          return false
        }
        if (this.isDetail) {
          this.initBreadcrumbs(item)
        }
        this.sum = res.sum
        this.sourceData = res.data
        let departmentList = []
        let staffList = []
        this.$store.dispatch(`set${this.listType.replace(this.listType[0], this.listType[0].toUpperCase())}Data`, [...this.$store.state.handleChosen[`${this.listType}Data`], ...res.data])
        res.data.forEach(item => {
          if (item.nodeType) {
            departmentList.push(item)
          } else {
            staffList.push(item)
          }
          // if (item.nodeType === 'group') {
          //   departmentList.push(item)
          // } else if (item.nodeType === 'cate') {
          //   staffList.push(item)
          // }
        })
        this.departmentList = departmentList
        let arr = JSON.parse(JSON.stringify(staffList).replace(/name/g, 'name1'))
        this.list = arr
      }).catch((e) => {

      })
    }
  },
  components: {
    CheckboxListSub,
    RadioList,
    Breadcrumbs,
    Panel
  }
}
</script>

<style lang="less">
.van-tabs__line{
  background-color: #1E89FF;
}
.van-tab{
  font-size:16px;
  font-weight:600;
  color:rgba(4,16,31,1);
}
</style>
<style scoped lang="less">
*{
  box-sizing: border-box;
}
.box{
  position: relative;
  display: flex;
  // justify-content: space-between;
  align-items: center;
  margin-left: -12px;
  padding-left: 20px;
  height: 60px;
  border-bottom: 1px solid #C5CED8;
  .group-header{
    margin-right: 16px;
    height: 40px;
    width: 40px;
  }
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
    width: 16px;
    height: 18px;
  }
}
</style>
