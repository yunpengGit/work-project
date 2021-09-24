<template>
  <div class="box">
    <van-pull-refresh
      v-model="isLoading"
      pulling-text="下拉加载之前的日程"
      loosing-text="释放即可加载"
      @refresh="onLoad(false)">
      <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多数据了"
      @load="onLoad(true)"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      >
        <!-- <van-skeleton
          title
          :row="3"
          :loading="skeletonLoading"
          class="skeleton"
        > -->
          <div class="no-data" v-if="noData"></div>
          <div v-else v-for="(item, index) in dataList" :key="index" :class="{'todayBefore':item.todayBefore}">
            <div class="day" v-if="item.isYear" :class="{today: item.isToday}">{{item.isToday?'今天 ':''}}{{item.day | formatDate('mm月dd日星期')}}</div>
            <div class="day" v-else :class="{today: item.isToday}">{{item.day | formatDate('yyyy年mm月dd日星期')}}</div>
            <div class="day-list">
              <div class="item" v-for="(listItem, listIndex) in item.list" :key="listIndex" :class="{orange: !listItem.isSelf}" @click="handlerClick(listItem)">
                <div class="left">
                  <span v-if="!listItem.isAllDay">{{listItem.startTime}}</span>
                  <span v-if="!listItem.isAllDay">{{listItem.endTime}}</span>
                  <span v-else>全天</span>
                </div>
                <div class="line"></div>
                <div class="right">
                  <span class="title"><SvgIcon v-if="listItem.isMobile === '1'" href="shoujihui" class="icon"/><span class="text">{{listItem.title?listItem.title:'(无标题)'}}</span></span>
                  <span class="info" v-if="!(!listItem.address&&listItem.user==='我')"><span v-if="listItem.user!=='我'" class="user">{{listItem.user}}</span><span class="line" v-if="listItem.user!=='我'&&listItem.user&&listItem.address"></span><span class="address">{{listItem.address}}</span></span>
                </div>
              </div>
            </div>
          </div>
        <!-- </van-skeleton> -->
      </van-list>
    </van-pull-refresh>
    <div class="btn" @click="addSchedule">
      <SvgIcon href="yaoqing" class="icon"/>
    </div>
    <dy-form ref="detail" :action="detailActionUrl"/>
    <dy-form ref="add" :action="addActionUrl"/>
  </div>
</template>

<script>
import Vue from 'vue'
import DyForm from './../../components/DyForm'
import { Skeleton, PullRefresh, List, Toast } from 'vant'
import 'lib-flexible'
let urlPrefix
if (process.env.NODE_ENV === 'development') {
  require('./../../../mock/scheduleData.js')
  urlPrefix = '/api'
} else {
  urlPrefix = location.origin
}
Vue.use(Skeleton).use(PullRefresh).use(List).use(Toast)
export default {
  components: {
    DyForm
  },
  data () {
    return {
      noData: false,
      skeletonLoading: true,
      detailActionUrl: '',
      addActionUrl: '',
      count: 1, // 标记是否为第一次加载
      loading: false,
      isLoading: false,
      finished: false,
      error: false,
      respCode: '', // 成功
      msg: '',
      isAfter: true, // true今天之后，false今天之前
      afterStartDay: '', // 向后的开始日期
      beforeStartDay: '', // 向前的开始日期
      num: 10, // 查出多少天
      dataList: [
        // {
        //   day: '', // 当前日期
        //   isToday: true, // 是否为今天
        //   week: '', // 星期几
        //   list: [
        //     {
        //       startTime: '',
        //       endTime: '',
        //       isAllDay: '',
        //       title: '',
        //       isSelf: true,
        //       user: '',
        //       link: 'baidu.com',
        //       address: ''
        //     }
        //   ]
        // }
      ]
    }
  },
  methods: {
    onLoad (isAfter) {
      let tomorrow = this.$route.query.tomorrow
      this.$http({
        url: urlPrefix + '/km/calendar/km_calendar_main/kmCalendarMain.do',
        method: 'post',
        data: {
          tomorrow,
          method: 'listAllCalendar',
          isAfter: isAfter, // 0向前，1向后
          afterStartDay: this.afterStartDay, // 向后的开始日期
          beforeStartDay: this.beforeStartDay, // 向前的开始日期
          num: 7 // 查出多少天
        }
      }).then((res) => {
        this.skeletonLoading = false
        this.loading = false
        this.isLoading = false
        if (res.respCode === '0000') {
          if (res.data && res.data.length === 0 && this.dataList.length === 0) {
            this.finished = true
            this.noData = true
            return
          }
          if (res.data && res.data.length === 0) {
            this.finished = true
            Toast('没有更多数据了')
            return
          }
          if (isAfter) {
            if (this.count === 1) {
              this.dataList = res.data
              this.count += 1
            } else {
              this.dataList = [...this.dataList, ...res.data]
            }
            this.afterStartDay = res.afterEndDay
          } else {
            this.dataList = [...res.data, ...this.dataList]
            this.beforeStartDay = res.beforeEndDay
          }
        } else {
          this.error = true
          Toast(res.msg)
        }
      }).catch((e) => {
        this.loading = false
        this.isLoading = false
        this.error = true
      })
    },
    handlerClick (item) {
      if (item.link) {
        if (item.link.indexOf('http') !== -1) {
          this.detailActionUrl = item.link
        } else {
          this.detailActionUrl = urlPrefix + item.link
        }
        window.open(this.detailActionUrl, '_top')
        // this.$refs.detail.submit()
      }
    },
    addSchedule () {
      this.addActionUrl = urlPrefix + '/km/calendar/km_calendar_main/kmCalendarMain.do?method=addEvent'
      window.open(this.addActionUrl, '_top')
      // this.$refs.add.submit()
    }
  },
  filters: {
    formatDate: function (value, format) {
      let date = new Date(value)
      let y = date.getFullYear()
      let mm = date.getMonth() + 1
      mm = mm < 10 ? ('0' + mm) : mm
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      let week
      if (date.getDay() === 0) week = '星期日'
      if (date.getDay() === 1) week = '星期一'
      if (date.getDay() === 2) week = '星期二'
      if (date.getDay() === 3) week = '星期三'
      if (date.getDay() === 4) week = '星期四'
      if (date.getDay() === 5) week = '星期五'
      if (date.getDay() === 6) week = '星期六'
      let str
      if (format === 'yyyy年mm月dd日星期') {
        str = `${y}年${mm}月${d}日  ${week}`
      } else if (format === 'mm月dd日') {
        str = `${mm}月${d}日`
      } else if (format === 'mm月dd日星期') {
        str = `${mm}月${d}日  ${week}`
      } else if (format === 'yyyy-mm-dd HH:mm:ss') {
        str = `${y}-${mm}-${d} ${h}:${m}:${s}`
      }
      return str
    }
  }
}
</script>

<style lang="scss">
.hide{
  display: none;
}

*{
  box-sizing: border-box;
}
.van-list{
  width: 100vw;
  min-height: 100vh;
}
.no-data{
  position: fixed;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  background: #fff url(./../../assets/no-data.png) no-repeat center center;
}
.box{
  background-color: #fff;
  min-height: 100vh;
  .btn{
    position: fixed;
    z-index: 999;
    bottom: 80px;
    right: 20px;
    width: 40px;
    height: 40px;
    .icon{
      font-size: 40px;
      color: #4285F4;
      width: 100%;
      height: 100%;
    }
  }
}
.skeleton{
  padding-top: 16px;
}
.day{
  padding: 18px 0 4px 16px;
  font-weight: 500;
  font-size: 15px;
  color: #3D434A;
  letter-spacing: -0.1px;
  line-height: 18px;
}
.today{
  color: #2A99FF;
}
.day-list{
  .item{
    padding-top: 8px;
    display: flex;
    .left{
      flex-shrink: 0;
      display: flex;
      width: 60px;
      padding-left: 16px;
      flex-direction: column;
      padding-right: 8px;
      justify-content: space-around;
      align-items: flex-start;
      font-size: 13px;
      color: #7B8184;
      letter-spacing: -0.21px;
      line-height: 16px;
      padding-bottom: 6px;
    }
    & > .line{
      flex-shrink: 0;
      margin-bottom: 8px;
      width: 2px;
      background-color: #77BEFF;
    }
    .right{
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 8px;
      padding-right: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #D8D8D8;
      .title{
        display: flex;
        flex-shrink: 0;
        font-size: 16px;
        color: #3D434A;
        line-height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        .icon{
          margin-top: -2px;
          margin-left: 5px;
          float: right;
          width: 16px;
          height: 24px;
        }
      }
      .info{
        display: flex;
        margin-top: 6px;
        font-size: 13px;
        color: #7B8184;
        letter-spacing: -0.21px;
        line-height: 14px;
        max-width: 240px;
        .user{
          max-width: 56px;
          flex-shrink: 0;
        }
        .line{
          flex-shrink: 0;
          margin: 0 4px;
          width: 1px;
          height: inherit;
          background-color: #D8D8D8;
        }
        .address{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .orange{
    background: #FFF7EE;
    box-shadow: inset 0 0 0 0 #C5CED8;
    .line{
      background-color:#FFB561;
    }
  }
  .blue{
    background: #EEF6FF;
    box-shadow: inset 0 0 0 0 #C5CED8;
  }
}
.todayBefore{
  .day{
    color: #ababab;
  }
  .day-list .item {
    .left, .right .title, .right .info{
      color: #ababab;
    }
  }
}
</style>
