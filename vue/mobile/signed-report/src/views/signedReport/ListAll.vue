<template>
  <van-list
      class="list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onload"
    >
    <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
    <!-- <van-cell class="item" v-for="(item, index) in list" :key="index" @click="clickFn(item)">
      <div class="icon">
        <SvgIcon v-if="item.cate === '1'" href="shouwen"/>
        <SvgIcon v-else-if="item.cate === '2'" href="qianshou"/>
        <SvgIcon v-else href="fawen"/>
      </div>
      <div class="info">
        <div class="title">{{item.subject}}</div>
        <div class="bottom">
          <span class="date">{{item.time}}</span>
          <span class="text">{{item.unit}}</span>
          <span class="status" :class="{'reject':'11' == item.state}">{{active === 0?statusArr0.get(item.state):statusArr.get(item.state)}}</span>
        </div>
      </div>
    </van-cell> -->
    <div class="item" v-for="(item, index) in list" :key="index" @click="clickFn(item)">
      <div class="icon">
        <SvgIcon v-if="item.cate === '1'" href="shouwen"/>
        <SvgIcon v-else-if="item.cate === '2'" href="qianshou"/>
        <SvgIcon v-else href="fawen"/>
      </div>
      <div class="info">
        <div class="title">{{item.subject}}</div>
        <div class="bottom">
          <span class="date">{{item.time}}</span>
          <span class="text">{{item.unit}}</span>
          <span class="status" :class="{'reject':'11' == item.state}">{{active === 0?statusArr0.get(item.state):statusArr.get(item.state)}}</span>
        </div>
      </div>
    </div>
  </van-list>
    <!-- <div class="list">
      <div class="item" v-for="(item, index) in list" :key="index" @click="clickFn(item)">
        <div class="icon">
          <SvgIcon v-if="item.cate === 1" href="shouwen"/>
          <SvgIcon v-else-if="item.cate === 2" href="qianshou"/>
          <SvgIcon v-else href="fawen"/>
        </div>
        <div class="info">
          <div class="title">{{item.subject}}</div>
          <div class="bottom">
            <span class="date">{{item.time}}</span>
            <span class="text">{{item.unit}}</span>
            <span class="status" :class="{'reject':'11' == item.state}">{{statusArr.get(item.state)}}</span>
          </div>
        </div>
      </div>
    </div> -->
</template>

<script>
import Vue from 'vue'
import { Toast, List, Cell } from 'vant'
import api from '@a/signedReport'
// if (process.env.NODE_ENV === 'development') {
//   require('@m/signedReport')
// }
Vue.use(List).use(Cell)
const statusArr0 = new Map([
  ['10', '草稿'],
  ['20', '办理中'],
  ['11', '驳回'],
  ['30', '已办结'],
  ['40', '废弃']
])
const statusArr = new Map([
  ['10', '草稿'],
  ['20', '待审'],
  ['11', '驳回'],
  ['30', '发布'],
  ['40', '废弃']
])

export default {
  props: {
    config: {
      type: Object
    },
    active: {
      type: Number
    }
  },
  data () {
    return {
      statusArr0,
      statusArr,
      list: [],
      loading: false,
      finished: false,
      error: false,
      pageno: 1,
      fdSubject: ''
    }
  },
  created () { this.onload() },
  methods: {
    clickFn (item) {
      const link = item.link
      // window.open(link, '_blank')
      window.location.href = link
    },
    onload (fdSubject, isFilter) {
      const isType = type => obj => Object.prototype.toString.call(obj) === `[object ${type}]`
      const isString = isType('String')
      let searchText = this.$store.state.signedReport.searchText
      let pageno = 1
      let data = {}
      const filterParamsData = this.$store.state.signedReport.filterParamsData
      if (filterParamsData || fdSubject || searchText) {
        if (filterParamsData) {
          fdSubject = filterParamsData
          pageno = this.pageno
          if (isFilter) {
            pageno = 1
          }
          data = { ...fdSubject, pageno }
        }
        if (isString(fdSubject) || isString(searchText)) {
          if (searchText) {
            if (isFilter) {
              data = { ...data, ...{ 'q.docSubject': searchText } }
            } else {
              if (this.finished && searchText === this.fdSubject) {
                return
              }
              pageno = this.pageno
              if (searchText !== this.fdSubject) {
                pageno = 1
              }
              this.fdSubject = searchText
              data = { ...data, ...{ 'q.docSubject': searchText, pageno } }
            }
          }
        }
      } else {
        pageno = this.pageno
        data = { pageno: this.pageno }
      }
      api[this.config.initFn](data).then((res) => {
        if (pageno > 1) {
          if (searchText !== this.fdSubject) {
            this.list = res.data
          } else {
            if (this.list && this.list.length > 0) {
              this.list = [...this.list, ...res.data]
            }
          }
        } else {
          if (res.data && res.data.length > 0) {
            this.list = res.data
          } else {
            this.list = []
            Toast('没有对应数据')
          }
        }
        this.loading = false
        this.pageno = ++pageno
        if (this.list.length >= res.totalrows) {
          this.finished = true
        } else {
          this.finished = false
        }
      }).catch((e) => {
        this.error = true
      })
    }
  }
}
</script>

<style scoped lang="less">
.list{
  height: calc(100vh - 88px);
  overflow: auto;
  padding-bottom: 70px;
}
.item{
  background-color: #FFF;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  box-shadow:0px 0px 0px 0px rgba(197,206,216,1);
  border-bottom: 1px solid #C5CED8;
  &:last-child{
    border-bottom: 0;
  }
  .icon{
    flex-shrink: 0;
    margin-right: 16px;
    width: 32px;
    height: 32px;
  }
  .info{
    flex: 1;
    .title{
      font-size:16PX;
      color:rgba(0,14,32,1);
      line-height:20px;
    }
    .bottom{
      margin-top: 8px;
      display: flex;
      align-items: flex-start;
      .date{
        flex-shrink: 0;
        width: 90px;
        font-size:14PX;
        color:rgba(148,155,164,1);
        line-height: 18px;
      }
      .text{
        flex: 1;
        font-size:14PX;
        color:rgba(148,155,164,1);
        line-height: 18px;
      }
      .status{
        flex-shrink: 0;
        width: 40px;
        font-size:12PX;
        font-weight:600;
        color:rgba(30,137,255,1);
        line-height: 18px;
      }
      .reject{
        color:rgba(255,63,23,1);
      }
    }
  }
}
</style>
