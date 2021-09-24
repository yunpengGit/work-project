<template>
  <div class="home-schedule">
    <div class="continer-box clearfix">
      <span v-if="calendarDate.day" class="calendar-date">
        <span class="day">{{ +calendarDate.day }}</span>
        <span class="month">{{ +calendarDate.month }}月</span>
        <span class="year">{{ calendarDate.year }}</span>
      </span>
      <span class="fr info-btn-notext" @click="$router.push('/schedule/list')">
        <el-tooltip class="item" effect="dark" content="更多" placement="bottom">
          <span class="info-btn-notext-icon"><icon-svg name="gengduo" /></span>
        </el-tooltip>
      </span>
      <span class="fr info-btn-notext" @click="refreshFn">
        <el-tooltip class="item" effect="dark" content="刷新" placement="bottom">
          <span class="info-btn-notext-icon"><icon-svg name="shuaxin" /></span>
        </el-tooltip>
      </span>
      <div class="fr fix week-day">
        <span class="fl info-btn" @click="prevFn">
          <span class="info-btn-icon">
            上一周
          </span>
        </span>
        <span class="fl info-btn" @click="todayFn">
          <span class="info-btn-icon">
            今天
          </span>
        </span>
        <span class="fl info-btn" @click="nextFn">
          <span class="info-btn-icon">
            下一周
          </span>
        </span>
      </div>
    </div>
    <div class="schedule-cont">
      <div class="calendar-box">
        <calendar-week
          ref="calendarWeek"
          :calendar-type-list="calendarTypeList"
          :range-num="rangeNum"
          @scheduleFn="scheduleFn"
          @calendarDateFn="calendarDateFn"
        /></div>
      <!-- <el-calendar :range="calendarRange" /> -->
      <!-- < -->
      <el-scrollbar class="schedule-list-box">
        <div class="schedule-list">
          <div v-if="calendarList.length>0" class="list">
            <div v-for="item in calendarList" :id="item.eventId" :key="item.eventId" class="item">
              <div class="left">
                <div class="start">{{ item.startTime | formatDate('hh:mm') }}</div>
                <div class="end">{{ item.finishTime | formatDate('hh:mm') }}</div>
              </div>
              <div class="right" :class="{'shared':!item.selfOwned || item.timeConflicted}">
                <div class="info">
                  <div class="title ell" :title="item.subject">{{ item.subject }}</div>
                  <div class="name-address">
                    <span v-if="item.label" class="type">{{ item.label.name }}</span>
                    <span v-if="item.location" class="address ell">｜{{ item.location }}</span>
                  </div>
                </div>
                <div v-if="item.timeConflicted" class="tip">
                  <icon-svg name="richengchongtu" />日程冲突
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty">
            <img :src="tipIcon" alt="" class="icon">
            <div class="current">您很勤奋，今天没有日程</div>
            <div v-if="tomorrowCalendarList.length>0" class="tomorrow">明天有<span class="num">{{ tomorrowCalendarList.length }}</span>个日程</div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import iconSvg from '@/components/icon-svg'
import formatDate from '@/utils/format-date'
import CalendarWeek from './CalendarWeek'
import routeToNewTab from '@/mixins/routeToNewTab'
export default {
  name: 'Schedule',
  components: {
    iconSvg,
    CalendarWeek
  },
  filters: {
    formatDate
  },
  mixins: [routeToNewTab],
  data () {
    return {
      rangeNum: 7, // 日期区间数
      calendarDate: {},
      calendarList: [],
      tomorrowCalendarList: [],
      currServerTime: '',
      calendarTypeList: [],
      tipIcon: require('@/assets/home/components/schedule.png')
    }
  },
  created () { this.toDayCurrentScheduleFn() },
  methods: {
    calendarDateFn (val) {
      this.calendarDate = val
    },
    todayFn () {
      this.$refs.calendarWeek.todayFn()
    },
    refreshFn () {
      this.$refs.calendarWeek.refreshFn()
    },
    prevFn () {
      this.$refs.calendarWeek.prevFn()
    },
    nextFn () {
      this.$refs.calendarWeek.nextFn()
    },
    scheduleFn (start, end, dayList) {
      const today = new Date()
      const todayFormat = formatDate(today, 'yyyy-MM-dd')
      this.$api('home.dateAsDimension', { dateFrom: start || todayFormat, dateTo: end || todayFormat }).then(res => {
        this.currServerTime = res.currServerTime
        // console.log(res)
        if (start !== end) {
          // 明天
          const tomorrow = formatDate(today.setTime(today.getTime() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
          const tomorrowEle = res.data && res.data.find(ele => ele.eventDate === tomorrow)
          this.tomorrowCalendarList = tomorrowEle ? tomorrowEle.events : []
          if (dayList) {
            this.calendarTypeListFn(res.data, dayList)
          }
          // 今天
          const ele = res.data && res.data.find(ele => ele.eventDate === todayFormat)
          this.calendarList = ele ? ele.events : []
          this.toDayCurrentScheduleFn()
        } else {
          const ele = res.data && res.data.find(ele => {
            return ele.eventDate === start
          })
          this.calendarList = ele ? ele.events : []
          this.tomorrowCalendarList = []
        }
      })
    },
    toDayCurrentScheduleFn () {
      // 处理今天当前时间节点日程展示
      const toDayCurrentTimeNumber = +new Date()
      const event = this.calendarList.find(ele => {
        const time = ele.startTime
        const eleTimeNumber = +new Date(time)
        return eleTimeNumber > toDayCurrentTimeNumber
      })
      // console.log(123)
      // console.log(event)
      if (event && event.eventId) {
        const target = document.getElementById(event.eventId)
        if (target) {
          // console.log(target.parentNode.offsetTop)
          // console.log(target.offsetTop)
          // 获取当前子节点到父节点top的距离
          const height = target.offsetTop - target.parentNode.offsetTop
          // 设置当前 模块滚动条位置
          target.parentNode.scrollTop = height
        }
      }
    },
    calendarTypeListFn (dataList, dayList) {
      const arr = []
      dayList && dayList.forEach(day => {
        const obj = {
          dateTime: day.dateTime
        }
        dataList && dataList.forEach(data => {
          // console.log(day.dateTime, data.eventDate)
          if (day.dateTime === data.eventDate) {
            // console.log(true)
            if (data.events.length > 0) {
              const self = data.events.find(ele => {
                // console.log(ele.selfOwned)
                return ele.selfOwned === true
              })
              const shared = data.events.find(ele => {
                // console.log(ele.selfOwned)
                return ele.selfOwned === false
              })
              obj.self = !!self
              obj.shared = !!shared
            }
          }
        })
        arr.push(obj)
      })
      this.calendarTypeList = arr
      // console.log(arr)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14PX){
  .home-schedule {
    height: 100%;
    position: relative;
    background-color: #fff;
    background-image: url('../../../assets/home/schedule-bg.png');
    background-repeat: no-repeat;
    background-size: 509px 167px;
    .week-day{
      .info-btn{
        & + &{
          margin-left: 0;
        }
        .info-btn-icon{
          padding: 0 10px;
          position: relative;
          margin-left: 0;
          &:hover{
            z-index: 1;
          }
        }
        &:first-child{
          .info-btn-icon{
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
        }
        &:not(:first-child):not(:last-child){
          .info-btn-icon{
            border-radius: 0;
          }
        }
        &:not(:last-child){
          .info-btn-icon{
            margin-right: -1px;
          }
        }
        &:last-child {
          .info-btn-icon{
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
      }
    }
    .continer-box{
      .calendar-date{
        font-family: 'Helvetica';
        padding-top: 20px;
        .day{
          margin: 0 4px 0 17px;
          width: 45px;
          height: 48px;
          text-align: center;
          font-size: 40px;
          color: #191F24;
          line-height: 48px;
        }
        .month,
        .year{
          width: 36px;
          height: 25px;
          font-size: 18px;
          font-weight: 400;
          color: rgba(25, 31, 36, 0.5);
          line-height: 25px;
        }
      }
    }
    .schedule-cont {
      padding-top: 22px;
      height: calc(100% - 69px);
      width: 100%;
      .calendar-box{
        height: 89px;
      }
      .btn-box {
        position: absolute;
        width: 100%;
        top: -12px;
      }
      ::v-deep .schedule-list-box{
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        height: calc(100% - 94px);
        background-color: #fff;
        .el-scrollbar__wrap{
          height: 100%;
          .el-scrollbar__view{
            height: 100%;
          }
        }
        .schedule-list {
          box-sizing: border-box;
          padding: 8px 20px;
          margin-right: 6px;
          width: 100%;
          height: 100%;
          &::-webkit-scrollbar {
            width: 8px;
            height: 6px;
          }
          &::-webkit-scrollbar-thumb{
            background: #CCCCCC;
            border-radius: 10px;
            &:hover{
              background: rgba(0,0,0, 0.4);
            }
          }
          .list {
            .item {
              display: flex;
              padding: 8px 0;
              .left {
                font-family: "Helvetica";
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                padding: 2px 8px 2px 0;
                line-height: 18px;
                font-size: 16px * $sc;
                color: #191f24;
                .end {
                  margin-top: 13px;
                }
              }
              .right {
                flex: 1;
                display: flex;
                background-color: #FAFAFA;
                border-left: 4px solid #499CF8;
                border-radius: 4px;
                @if $fs == 14PX {
                  height: 63px;
                } @else {
                  height: 74px;
                }
                padding: 0 12px 0  10px;
                &.shared{
                  border-left-color: #EE8A42;
                }
                .info {
                  @if $fs == 14PX {
                    padding-top: 10px;
                  } @else {
                    padding-top: 12px;
                  }
                  flex: 1;
                  display: flex;
                  justify-content: flex-start;
                  flex-direction: column;
                  .title {
                    width: 240px;
                    height: 18px;
                    line-height: 18px;
                    font-size: 14px;
                    color: #191f24;
                  }
                  .name-address {
                    display: flex;
                    @if $fs == 14PX {
                      margin-top: 8px;
                    } @else {
                      margin-top: 10px;
                    }
                    font-size: 12px;
                    color: rgba(25, 31, 36, 0.64);
                    .address{
                      max-width: 200px;
                    }
                  }
                }
                .tip{
                  width: 94px;
                  color: #F47041;
                  font-size: 14px;
                  display: flex;
                  justify-content: flex-end;
                  align-items: center;
                  .icon{
                    margin-right: 4px;
                    width: 14px;
                    height: 14px;
                  }
                }
              }
            }
          }
          .empty{
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            .icon{
              width: 190px;
              height: 76px;
            }
            .current{
              text-align: center;
              font-size: 14px;
              color: rgba(25, 31, 36, 0.48);
              line-height: 20px;
            }
            .tomorrow{
              text-align: center;
              margin-top: 12px;
              height: 20px;
              font-size: 14px;
              color: #191F24;
              line-height: 20px;
              .num{
                color: #499CF8
              }
            }
          }
        }
      }
    }
  }
}
@import '@/ui/size/scale.scss'
</style>
