<template>
  <div class="calendar-main-container">
    <full-calendar ref="fullCalendar" :options="calendarOptions" />
    <div v-show="eventBoxDisplay" class="event-info-mask" @click="eventBoxDisplay = false" />
    <div v-show="eventBoxDisplay" class="event-info-box" :style="dialogStyle">
      <div class="event-box">
        <div class="event-box-head">
          <div class="title" :class="eventInfo.isOwner ? 'blue' : 'orange'">
            <i class="dot" /><span>{{ eventInfo.ownerName }}</span>的日程
          </div>
          <p v-if="eventInfo.userPermsType === 'READWRITE'">
            <icon-svg class="xieyoujian" name="xieyoujian" @click.native="editEvent" />
            <icon-svg class="del" name="del" @click.native="deletWarning" />
          </p>
        </div>
        <div class="event-box-body">
          <p class="title">
            <span class="icon-span"><icon-svg name="riqi" class="event-icon" /></span>
            <span>{{ eventInfo.subject }}</span>
          </p>
          <p>
            <span class="icon-span"><icon-svg name="shijian11" class="event-icon aaaaaaaaaa" /></span>
            <span>{{ getInfoTime }}</span>
          </p>
          <p v-if="eventInfo.location">
            <span class="icon-span"><icon-svg name="dizhi11" class="event-icon" /></span>
            <span>{{ eventInfo.location }}</span>
          </p>
          <p
            v-if="eventInfo.content2 && eventInfo.userPermsType === 'READWRITE'"
            class="location-group"
          >
            <span class="icon-span"><icon-svg name="shuoming" class="event-icon" /></span>
            <span>{{ eventInfo.content2 }}</span>
          </p>
          <p
            class="detail-group"
          >
            <i v-if="eventInfo.timeConflicted" class="el-icon-warning"> 日程有冲突</i>
            <span v-if="eventInfo.userPermsType === 'READWRITE'" @click="detailEvent">详情<icon-svg name="you" /></span>
          </p>
        </div>
      </div>
      <div class="arrow" :style="arrowStyle" />
    </div>
    <!-- 删除重复日程需要提醒 -->
    <el-dialog
      title="选择日程删除范围"
      width="390px"
      :visible="deleteDialog"
      @update:visible="deleteDialog= false"
    >
      <div class="radio-group-box">
        <span>日程删除范围：</span>
        <div>
          <el-radio-group v-model="rangeTypeIfRecurr">
            <el-radio label="CURR_ONLY">仅删除此日程</el-radio>
            <el-radio label="CURR_FUTURE">删除以后所有日程</el-radio>
            <el-radio label="ALL">删除所有日程</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取消</el-button>
        <el-button type="primary" @click="deletEvent">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { calendar } from '../../../utils/calendar' // 农历计算方法
import { getItem } from '@/utils/storage'
import iconSvg from '@/components/icon-svg'
import dayjs from 'dayjs'
export default {
  components: {
    FullCalendar,
    iconSvg
  },
  data () {
    return {
      userInfo: JSON.parse(getItem('userInfo')),
      fn: null,
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        moreLinkContent: function (arg) {
          const args = '还有' + arg.num + '项'
          return args
        },
        eventContent: function (data) {
          // console.log(data)
          const event = data.event.extendedProps
          let stime = ''
          let etime = ''
          if (event.crossDayEvent) {
            etime = `${dayjs(event.startTime2).format(
              event.wholeDay ? 'MM月DD日' : 'MM月DD日,HH:mm'
            )}`
          } else {
            if (event.wholeDay) {
              // etime = "全天";
            } else {
              stime = dayjs(event.startTime2).format('HH:mm')
            }
          }
          const html = `<div class="event-item">
                          <div class="stime">${stime}</div>
                          <div class="title">${event.subject}</div>
                          <div class="etime">${etime}</div>
                        </div>`
          return { html: html }
        },
        fixedWeekCount: false, // 如果为true，日历将始终为6周。如果为false，则日历将具有4、5或6周的时间，具体取决于月份。
        dayMaxEvents: true,
        views: {
          dayGrid: {
            dayMaxEvents: 4
          },
          // 对应月视图
          dayGridMonth: {
            dayCellContent (item) {
              const solar2lunar = calendar.solar2lunar(
                item.date.getFullYear(),
                item.date.getMonth() + 1,
                item.date.getDate()
              )
              const Festival = calendar.getFestival()[
                `${item.date.getMonth() + 1}-${item.date.getDate()}`
              ]
              const lFestival = calendar.getLunarFestival()[
                `${solar2lunar.lMonth}-${solar2lunar.lDay}`
              ]
              return {
                html: `<p><label>${solar2lunar.cDay}</label><span>${
                  (lFestival && lFestival.title) ||
                  (Festival && Festival.title) ||
                  solar2lunar.IDayCn
                }</span></p>`
              }
            }
          }
        },
        headerToolbar: false,
        initialView: 'dayGridMonth',
        locale: 'zh-cn',
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false // 设置时间为24小时
        },
        height: 'auto',
        // aspectRatio: 1.78, // 设置日历单元格宽度与高度的比例。
        events: [],
        dateClick: this.handleDateClick,
        eventClick: this.handleEventClick
      },
      calendarApi: null,
      eventBoxDisplay: false,
      dialogStyle: {},
      arrowStyle: {},
      eventInfo: {},
      deleteDialog: false,
      rangeTypeIfRecurr: 'ALL'
    }
  },
  computed: {
    getInfoTime () {
      const d_str = `日一二三四五六`
      if (this.eventInfo.eventId) {
        const sDate = dayjs(this.eventInfo.startTime2)
        const fDate = dayjs(this.eventInfo.finishTime)
        if (this.eventInfo.crossDayEvent) {
          if (this.eventInfo.wholeDay) {
            const sDateStr = sDate.format('MM月DD日 星期') + d_str.slice(sDate.day(), sDate.day() + 1)
            const fDateStr = fDate.format('MM月DD日 星期') + d_str.slice(fDate.day(), fDate.day() + 1)
            return `${sDateStr} - ${fDateStr}`
          } else {
            const sDateStr = sDate.format('MM月DD日 HH:mm 星期') + d_str.slice(sDate.day(), sDate.day() + 1)
            const fDateStr = fDate.format('MM月DD日 HH:mm 星期') + d_str.slice(fDate.day(), fDate.day() + 1)
            return `${sDateStr} - ${fDateStr}`
          }
        } else {
          if (this.eventInfo.wholeDay) {
            const sDateStr = sDate.format('MM月DD日 星期') + d_str.slice(sDate.day(), sDate.day() + 1)
            return `${sDateStr} 全天`
          } else {
            const sDateStr = sDate.format('MM月DD日 星期') + d_str.slice(sDate.day(), sDate.day() + 1)
            return `${sDateStr} ${sDate.format('HH:mm')} - ${fDate.format('HH:mm')}`
          }
        }
      } else {
        return ''
      }
    }
  },
  watch: {
    '$store.state.cache.events': {
      deep: true,
      immediate: true,
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.getEvents(newVal)
        }
      }
    },
    'calendarOptions.events': {
      deep: true,
      handler: function (newVal, oldVal) {
        this.eventBoxDisplay = false
      }
    }
  },
  mounted () {
    this.calendarApi = this.$refs.fullCalendar.getApi()
    // window.addEventListener('click', this.monitorClick)
  },
  created () {
    this.fn = this.resizeHandler()
    this.$nextTick(() => {
      this.fn()
      window.addEventListener('resize', this.fn)
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.fn)
  },
  methods: {
    // monitorClick (e = window.event || e) {
    //   const target = e.srcElement || e.target
    //   if (target.className === 'fc-daygrid-more-link') {
    //     const nodeLength = document.querySelectorAll('.event-more-mask').length
    //     if (!nodeLength) {
    //       const parentNode = document.querySelector('.fc-daygrid-body')
    //       const node = document.createElement('div')
    //       node.classList.add('event-more-mask')
    //       parentNode.appendChild(node)
    //       const nodeEle = document.querySelector('.event-more-mask')
    //       nodeEle.addEventListener('click', function (e) {
    //         console.log(e)
    //         e.preventDefault()
    //       })
    //     }
    //   }
    // },
    getEvents (list) {
      // 处理events数据
      const eventArr = []
      list.forEach((item) => {
        // console.log(item)
        item.events.forEach((event) => {
          const isOwner = this.userInfo.userId.toString() === event.ownerId
          const start = dayjs(event.startTime).format('YYYY-MM-DD')
          event.isOwner = isOwner
          if (event.crossDayEvent) {
            // 跨天的日程
            const i = eventArr.findIndex((e) => {
              return e.eventId === event.eventId && event.crossDayEvent
            })
            if (i > -1) {
              // 需要特殊处理一下跨天日程
              eventArr[i].end = event.finishTime
            } else {
              eventArr.push({
                ...event,
                start: `${start} ${isOwner ? '00:00:00' : '00:00:01'}`,
                end: event.finishTime,
                className: [
                  isOwner ? 'blue' : 'orange',
                  event.timeConflicted ? 'red' : ''
                ],
                title: event.subject,
                startTime2: event.startTime
              })
            }
          } else {
            // console.log(start, event.startTime)
            eventArr.push({
              ...event,
              start: `${start} 00:00:02`,
              // start: event.startTime,
              end: event.finishTime,
              className: [
                isOwner ? 'blue' : 'orange',
                event.timeConflicted ? 'red' : ''
              ],
              title: event.subject,
              startTime2: event.startTime
            })
          }
        })
      })
      this.$set(this.calendarOptions, 'events', eventArr)
    },
    // 编辑日程
    editEvent () {
      this.$emit('editEvent', this.eventInfo)
    },
    // 日程详情
    detailEvent () {
      this.$emit('detailEvent', this.eventInfo)
    },
    deletWarning () {
      if (this.eventInfo.recurrenceRule.recurr) {
        this.deleteDialog = true
      } else {
        this.$confirm('请确认是否删除？')
          .then((_) => {
            if (this.eventInfo.recurrenceRule.recurr) {
              this.rangeTypeIfRecurr = 'CURR_ONLY'
              this.deleteDialog = true
            } else {
              this.rangeTypeIfRecurr = 'ALL'
              this.deletEvent()
            }
          })
          .catch((_) => {})
      }
    },
    // 删除日程
    deletEvent () {
      const { eventId, startTime2 } = this.eventInfo
      this.$api('schedule.deletEvent', {
        eventId,
        rangeTypeIfRecurr: this.rangeTypeIfRecurr,
        targetEventDate:
          this.rangeTypeIfRecurr === 'ALL'
            ? ''
            : dayjs(startTime2).format('YYYY-MM-DD')
      })
        .then((res) => {
          if (res.code === 200) {
            this.$message.success('已删除')
            // 删除成功后更新视图
            this.deleteDialog = false
            this.$emit('formDrawerClose', true)
          } else {
            this.$message.error(res.msg || '发生未知错误')
          }
        })
        .catch(() => {})
    },
    prev () {
      this.calendarApi.prev()
    },
    // 切换下一个按钮事件
    next () {
      this.calendarApi.next()
    },
    // 点击今天按钮
    today () {
      this.calendarApi.today()
    },
    // 获取当前时间
    getDate () {
      return this.calendarApi.getDate()
    },
    // 视图开始时间
    activeStart () {
      return this.calendarApi.view.activeStart
    },
    // 视图结束时间
    activeEnd () {
      return this.calendarApi.view.activeEnd
    },
    handleDateClick (arg) {
      this.$emit('addEvent', arg.dateStr)
    },
    handleEventClick (event) {
      const { extendedProps } = JSON.parse(JSON.stringify(event.event))

      this.$api('schedule.getEvent', {
        eventId: extendedProps.eventId
      }).then((res) => {
        if (res.code === 200) {
          const resData = res.data
          extendedProps.recurrenceRule = resData.recurrenceRule
          extendedProps.content2 = resData.content
          extendedProps.userPermsType = resData.userPermsType
          if (extendedProps.crossDayEvent) {
            extendedProps.startTime2 = resData.startTime
            extendedProps.finishTime = resData.finishTime
          }
          this.eventInfo = {
            ...extendedProps
          }
          // console.log('this.eventInfo', this.eventInfo)
          this.eventBoxDisplay = true
          this.dialogStyle = {
            visibility: 'hidden'
          }
          this.arrowStyle = {
            visibility: 'hidden'
          }
          let boxHeight = 0
          const timer = setInterval(() => {
            boxHeight = document.querySelector('.event-info-box').offsetHeight
            if (boxHeight > 0) {
              clearInterval(timer)
              const mouseX = event.jsEvent.clientX
              const mouseY = event.jsEvent.clientY
              const screenWidth = window.screen.width
              if (screenWidth - mouseX < 360) {
                this.dialogStyle = {
                  right: `${screenWidth - mouseX - 30}px`,
                  left: 'auto',
                  top: `${mouseY - boxHeight - 10}px`
                }
                this.arrowStyle = {
                  bottom: '-10px',
                  right: '20px'
                }
              } else {
                this.dialogStyle = {
                  left: `${mouseX - 30}px`,
                  top: `${mouseY - boxHeight - 10}px`
                }
                this.arrowStyle = {
                  bottom: '-10px',
                  left: '20px'
                }
              }
            }
          }, 0)
        } else {
          this.$message.error(res.msg || '发生未知错误')
        }
      })
    },
    // 窗口高度变化重新计算日历区域高度
    resizeHandler () {
      let timer
      return () => {
        if (timer) {
          window.clearTimeout(timer)
        }
        timer = window.setTimeout(() => {
          const windowH = document.documentElement.clientHeight
          const headerH = document.querySelector('.page-frame-header').offsetHeight || 0
          const tagsH = document.querySelector('.tags-view-container').offsetHeight || 0
          const headBoxH = document.querySelector('.page-head-box').offsetHeight || 0
          const headOptionH = document.querySelector('.head-oprations').offsetHeight || 0
          const calendarH = windowH - headerH - tagsH - headBoxH - headOptionH
          // 当窗口高度低于768，不再变化
          if (calendarH >= 556) {
            this.calendarOptions.height = calendarH
          }
        }, 100)
      }
    }
  }
}
</script>
<style lang="scss" scope>
.calendar-main-container {
  width: 100%;
  >.fc {
    border-left: 1px solid #eef0f4;
  }
}
.fc-theme-standard .fc-scrollgrid {
  border: 0px solid rgba(0, 0, 0, 0.08);

  .fc-col-header {
    .fc-col-header-cell {
      border: 1px solid rgba(0, 0, 0, 0.08);

      .fc-scrollgrid-sync-inner {
        height: 40px;
        line-height: 40px;
        font-size: 13px;
        color: #191f24;
        text-align: left;

        .fc-col-header-cell-cushion {
          padding: 0 8px;
        }
      }
    }
  }
}

.fc-theme-standard td {
  height: 137px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}
// .fc-scrollgrid-sync-table > tbody > tr {
//   height: 135px;
// }
.fc-popover {
  width: 348px;
  background: #ffffff;
  border: none !important;
  box-shadow: 0px 4px 16px 0px rgba(25, 31, 36, 0.16);
  border-radius: 4px;
  .fc-popover-header {
    display: none;
  }
  .fc-popover-body .fc-more-popover-misc p {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    label {
      font-size: 28px;
      font-weight: 500;
      color: #191f24;
      margin: 0 4px;
    }
    span {
      color: rgba(25, 31, 36, 0.48);
    }
  }
}

.fc .fc-day {
  .fc-daygrid-day-top {
    flex-direction: row;
    height: 34px;
    margin-top: 2px;
    padding: 0 5px;

    p {
      margin: 0;
      display: flex;
      align-items: center;
      label {
        width: 26px;
        height: 26px;
        text-align: center;
        line-height: 24px;
        border-radius: 50%;
        font-size: 17px;
        font-weight: 500;
        color: #191f24;
        margin-right: 4px;
      }

      span {
        font-size: 13px;
        line-height: 18px;
        color: rgba(25, 31, 36, 0.48);
      }
    }
  }
  &.fc-day-today {
    .fc-daygrid-day-top {
      p {
        label {
          color: #fff;
          background: #1e89ff;
          font-size: 17px;
          font-weight: 500;
        }

        span {
          color: #1e89ff;
        }
      }
    }
  }
}
.fc-popover-body .fc-daygrid-event-harness {
  margin-bottom: 5px;
  .fc-daygrid-event.fc-event-end {
    margin-right: 0;
  }
}
.fc .fc-more-popover .fc-popover-body {
  padding: 10px 20px 10px 16px;
}

.fc-daygrid-day-events {
  margin-bottom: .5em !important;
  .fc-daygrid-event.fc-event-end {
      margin-right: 0px;
    }
  .fc-daygrid-event {
    width: 100%;
    border: none;
    border-radius: 0px;
    height: 24px;
    line-height: 24px;
    padding-left: 3px;
    &.fc-event-start {
      margin-left: 0px;
    }
    .event-item {
      width: 100%;
      height: inherit;
      font-size: 13px;
      display: flex;
      overflow: hidden;
      position: relative;
      .stime {
        flex-shrink: 0;
        margin-right: 4px;
        font-weight: 500;
      }
      .title {
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: auto;
      }
      .etime {
        padding-right: 4px;
        font-weight: 500;
      }
    }

    &.blue {
      background: #E9F6FE;
      .event-item {
        color: #206793;
      }
    }
    &.blue:hover {
      background: #C8E2FF;
    }
    &.blue.fc-event-start {
      border-left: 2px solid #1e89ff;
    }

    &.orange {
      background: #FFF6ED;
      .event-item {
        color: #CE6900;
      }
    }
    &.orange:hover {
     background: #FFE1C2;
    }
    &.orange.fc-event-start {
      border-left: 2px solid #ff8200;
    }
    &.red::after {
      content: "";
      border-bottom: 10px solid #ea340f;
      border-left: 10px solid transparent;
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }

  // .fc-daygrid-event-dot {
  //   display: none;
  // }
}
.fc-popover-body .fc-daygrid-event-harness {
  .fc-daygrid-event.fc-event-end {
    margin-right: 0px;
  }
  .fc-daygrid-event {
    border: none;
    border-radius: 0px;
    height: 28px;
    line-height: 28px;
    padding-left: 24px;
    border-radius: 4px;
    background: rgba(25, 31, 36, 0.02);
    color: #191f24;
    &:hover {
      background: rgba(25, 31, 36, 0.08);
    }
    &.fc-event-start {
      margin-left: -1px;
    }
    .event-item {
      font-size: 13px;
      display: flex;
      overflow: hidden;
      position: relative;
      color: #191f24;
      .stime {
        flex-shrink: 0;
        margin-right: 4px;
        font-weight: 500;
      }
      .title {
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: auto;
      }
      .etime {
        padding-right: 4px;
        font-weight: 500;
      }
    }

    // &.blue {
    //   background: #daf1ff;
    //   .event-item {
    //     color: #206793;
    //   }
    // }
    // &.blue:hover {
    //   background: #b1e1ff;
    // }
    &.blue.fc-event::before {
      content: "";
      position: absolute;
      top: 12px;
      left: 12px;
      width: 6px;
      height: 6px;
      background: #1e89ff;
      border-radius: 50%;
    }

    &.orange.fc-event::before {
      content: "";
      position: absolute;
      top: 12px;
      left: 12px;
      width: 6px;
      height: 6px;
      background: #FF8200;
      border-radius: 50%;
    }

    // &.orange {
    //   background: #ffe9d3;
    //   .event-item {
    //     color: #ce6900;
    //   }
    // }
    // &.orange:hover {
    //   background: #ffdab5;
    // }
    // &.orange.fc-event-start {
    //   // border-left: 3px solid #ff8200;
    // }
    &.red::after {
      content: "";
      border-bottom: 10px solid #ea340f;
      border-left: 10px solid transparent;
      position: absolute;
      bottom: 0;
      right: 0;
    }

  }

  // .fc-daygrid-event-dot {
  //   display: none;
  // }
}
.fc .fc-daygrid-day-bottom {
  font-size: 13px;
  color: rgba(25, 31, 36, 0.64);
  margin-top: 0;
  margin-left: 8px;
  padding: 4px 0;
  &:hover {
    color: #333;
  }
}

.fc .fc-daygrid-day.fc-day-today {
  background: #f3fbff;
}
.fc .fc-daygrid-day.fc-day-other {
  background: rgba(0, 0, 0, 0.02);
  .fc-daygrid-day-top {
    span {
      color: #191f24;
    }
  }
}
.event-info-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}
.event-more-mask {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 7;
  background-color: red;
}
.event-info-box {
  width: 360px;
  min-height: 150px;
  padding: 12px 16px;
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0px 4px 16px 0px rgba(25, 31, 36, 0.16);
  position: fixed;
  top: 40%;
  left: calc(50% - 180px);
  background: #fff;
  z-index: 2000;
  .event-box {
    &-head {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      .title {
        font-weight: 500;
        display: flex;
        align-items: center;
        >span {
            font-weight: 500;
          }
        .dot {
          margin-right: 8px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        &.orange {
          color: #ff8200;
          .dot {
            background: #ff8200;
          }
        }
        &.blue {
          color: #1e89ff;
          .dot {
            background: #1e89ff;
          }
        }
      }
      p {
        svg {
          width: 18px;
          height: 18px;
          cursor: pointer;
          color: #888;
          margin-left: 16px;
          &.xieyoujian:hover {
            color: #1e89ff;
          }
          &.del:hover {
            color: #ea340f;
          }
        }
      }
    }
    &-body {
      p {
        display: flex;
        align-items: baseline;
        margin-bottom: 8px;
        span{
          word-break: break-all;
        }
        .icon-span {
          font-size: 14px;
        }
        & > span{
          &:first-child{
            margin-right: 8px;
          }
        }
        &.title {
          font-size: 16px;
          font-weight: 500;
          color: #191f24;
          margin-bottom: 16px;
        }
        &.detail-group {
          display: block;
          margin-top: 18px;
          margin-bottom: 0;
          height: 25px;
          span {
            float: right;
            width: 76px;
            height: 24px;
            background: #1e89ff;
            box-shadow: 0px 1px 0px 0px rgb(0 0 0 / 8%);
            border-radius: 4px;
            color: #fff;
            text-indent: 17px;
            line-height: 24px;
            cursor: pointer;
            svg {
              height: 22px;
              width: 24px;
              margin-top: -2px;
              vertical-align: middle;
            }
          }
        }
      }
    }
  }
  .arrow {
    position: absolute;
    // bottom: -12px;
    // left: 20px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 12px solid #fff;
    border-radius: 2px;
  }
}
.radio-group-box {
  display: flex;
  & > span {
    width: 140px;
    flex-shrink: 0;
    color: rgba(25, 31, 36, 0.64);
  }
  .el-radio {
    margin-bottom: 15px;
  }
}
.fc .fc-daygrid-event {
  margin-top: 0;
}
</style>
