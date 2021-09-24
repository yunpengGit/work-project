<template>
    <div>
      <van-search v-model="searchValue" shape="round" placeholder="搜索" @search="onSearch"/>
      <div class="panel-breadcrumbs">
        <Breadcrumbs @dataId="departmentDetail"/>
      </div>
      <div class="content">
        <van-checkbox v-model="checkAll" @click="checkAllFn" class="check-all">
          <div class="box check-all-box">
            <span class="text">全选</span>
            <span class="num">{{chosenNum}}/{{sum}}</span>
          </div>
        </van-checkbox>
        <van-checkbox-group v-model="chosen" ref="checkboxGroup" @change="checkboxGroupChange">
          <Panel v-if="departmentList.length !== 0">
            <van-checkbox v-for="(item, index) in departmentList" :key="index" :name="item.id" label-disabled>
              <div class="department-box">
                <span class="name">{{item.name}}</span>
                <span @click="departmentDetail(item)">
                  <SvgIcon href="youjiantou" class="icon"/>
                </span>
              </div>
            </van-checkbox>
          </Panel>
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
      <ChosenBox listType="ownDepartmentCirculate" :list="sourceData" :sourceData="sourceData"/>
    </div>
</template>

<script>
import Vue from 'vue'
import {
  Toast,
  Search,
  Checkbox,
  CheckboxGroup
} from 'vant'
import Breadcrumbs from '@c/Breadcrumbs'
import Panel from '@c/Panel'
import ChosenBox from '@c/ChosenBoxSub'

import handleApi from '@a/subsidiaryCompany'
if (process.env.NODE_ENV === 'development') {
  require('@m/handleInfo')
}
Vue.use(Toast)
  .use(Search)
  .use(Checkbox)
  .use(CheckboxGroup)

export default {
  data () {
    return {
      departmentList: [],
      searchValue: '',
      showCheckAll: true,
      isDetail: false,
      sum: 0,
      list: [],
      sourceData: []
    }
  },
  created () {
    let arr = this.$store.state.handle.breadcrumbs
    arr.splice(1)
    this.$store.dispatch('setBreadcrumbs', arr)
    this.init()
  },
  computed: {
    chosen: {
      get () {
        let ids = []
        this.$store.state.handleChosen['ownDepartmentCirculateData'].forEach(item => {
          if (item && item.isCheck) {
            ids.push(item.id)
          }
        })
        // console.log(ids)
        return ids
        // return this.$store.state.handleChosen['ownDepartmentCirculate'] ? this.$store.state.handleChosen['ownDepartmentCirculate'] : []
      },
      set (val) {
        // console.log(val)
        let ownDepartmentCirculateData = this.$store.state.handleChosen['ownDepartmentCirculateData']
        // ! 数组对象去重
        const objArr = {}
        ownDepartmentCirculateData = ownDepartmentCirculateData.filter((item, index) => {
          if (!objArr[item.id]) {
            objArr[item.id] = item.id
            return true
          }
        })
        ownDepartmentCirculateData = ownDepartmentCirculateData.map((item) => {
          // console.log(item)
          // console.log(item.id)
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
        this.$store.dispatch(`setOwnDepartmentCirculateData`, [...ownDepartmentCirculateData])
        // let ownDepartmentCirculate = this.$store.state.handleChosen.ownDepartmentCirculate
        // let indexArr = []
        // if (ownDepartmentCirculate.length !== 0) {
        //   this.sourceData.forEach(item => {
        //     if (ownDepartmentCirculate.indexOf(item.id) !== -1) {
        //       indexArr.push(ownDepartmentCirculate.indexOf(item.id))
        //     }
        //   })
        // }
        // indexArr.forEach((item) => {
        //   ownDepartmentCirculate.splice(item, 1, null)
        // })
        // ownDepartmentCirculate = ownDepartmentCirculate.filter((item) => {
        //   return item
        // })
        // if (this.checkAll) {
        //   val = ownDepartmentCirculate
        // } else {
        //   val = new Set([...ownDepartmentCirculate, ...val])
        // }
        // this.$store.dispatch('setOwnDepartmentCirculate', [...val])
        // let arr = []
        // const obj = this.$store.state.handleChosen['ownDepartmentCirculateData']
        // this.$store.state.handleChosen.ownDepartmentCirculate.forEach(item => {
        //   this.sourceData.forEach(item1 => {
        //     if (item1.id === item) {
        //       arr.push(item1)
        //     }
        //   })
        // })
        // arr = [...obj, ...arr]
        // const objArr = {}
        // const deduplicationArr = arr.filter((item, index) => {
        //   if (!objArr[item.id]) {
        //     objArr[item.id] = item.id
        //     return true
        //   }
        // })
        // // const deduplicationArr = arr.reduce((cur, next) => {
        // //   // eslint-disable-next-line no-unused-expressions
        // //   // objArr[next.id] ? '' : objArr[next.id] = true && cur.push(next)
        // //   // eslint-disable-next-line no-unused-expressions
        // //   objArr[next.id] || (objArr[next.id] = cur.push(next))
        // //   // objArr[next.id] ? '' : objArr[next.id] = cur.push(next)
        // //   // if (!objArr[next.id]) {
        // //   //   console.log(objArr, cur, next)
        // //   //   objArr[next.id] = true && cur.push(next)
        // //   //   console.log(objArr, cur, next)
        // //   // }
        // //   return cur
        // // }, [])
        // let resultArr = []
        // this.$store.state.handleChosen.ownDepartmentCirculate.forEach(item => {
        //   deduplicationArr.forEach(item1 => {
        //     if (item1.id === item) {
        //       resultArr.push(item1)
        //     }
        //   })
        // })
        // this.$store.dispatch('setOwnDepartmentCirculateData', resultArr)
      }
    },
    sourceDataIds () {
      let ids = []
      this.sourceData.map(item => {
        ids.push(item.id)
      })
      return ids
    },
    chosenNum () {
      let arr = []
      this.chosen.forEach(item => {
        this.sourceData.forEach(item1 => {
          if (item1.id === item) {
            arr.push(item1)
          }
        })
      })
      return arr.length
    },
    checkAll: {
      get () {
        return this.sum !== 0 && this.sum === this.chosenNum
      },
      set (val) {
        return val
      }
    }
  },
  methods: {
    departmentDetail (item) {
      // 判断当前数据是否选中
      const index = this.$store.state.handleChosen['ownDepartmentCirculateData'].findIndex(obj => {
        return obj.isCheck === true && obj.id === item.id
      })
      if (index !== -1) {
        return
      }
      this.isDetail = true
      // if (this.isCheck(item)) {
      //   this.init(item, 'checkAll')
      // } else {
      //   this.init(item)
      // }
      this.init(item)
    },
    isCheck (item) {
      const id = item.id
      return this.$store.state.handleChosen['ownDepartmentCirculate'].find((item) => item === id)
    },
    initBreadcrumbs (item) {
      let breadcrumbsArr = this.$store.state.handle.breadcrumbs
      breadcrumbsArr.push(item)
      this.$store.dispatch('setBreadcrumbs', breadcrumbsArr)
    },
    checkboxGroupChange () {
      this.$store.dispatch('setOwnDepartmentCirculate', this.chosen)
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
        this.$store.dispatch('setOwnDepartmentCirculate', [])
      } else {
        handleApi.ownDepartmentSearch(
          {
            key: this.searchValue,
            type: 'getOrg'
          }
        ).then(res => {
          if (res.data && res.data.length === 0) {
            Toast('没有更多数据了')
            return false
          }
          this.sum = +res.sum
          this.sourceData = res.data
          this.$store.dispatch(`setOwnDepartmentCirculateData`, [...this.$store.state.handleChosen['ownDepartmentCirculateData'], ...res.data])
          let departmentList = []
          let staffList = []
          res.data.forEach(item => {
            if (item.orgType === '2') {
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
    init (item, type) {
      let id = item && item.id
      handleApi['getOrg'](
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
        }
        this.sum = +res.sum
        let departmentList = []
        let staffList = []
        this.sourceData = res.data
        this.$store.dispatch(`setOwnDepartmentCirculateData`, [...this.$store.state.handleChosen['ownDepartmentCirculateData'], ...res.data])
        // if (type) {
        //   this.$store.dispatch('setOwnDepartmentCirculate', [])
        // }
        res.data.forEach(item => {
          // if (type) {
          //   this.chosen.push(item.id)
          // }
          if (item.orgType === '2') {
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
    ChosenBox
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
    padding: 20px 20px 20px 295px;
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
</style>
