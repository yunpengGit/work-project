<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-01 13:28:28
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-11 23:03:27
-->
<template>
  <div class="agenda-container" v-if="agendaData">
    <div class="filter-container">
      <div class="filter-btn" @click="dateHandler">
        {{ filterDate(conductDate) }}
        <img src="@/assets/images/arrowDown.svg" alt="">
      </div>
      <!-- <div class="filter-btn" @click="filterHandler">
        筛选
        <img src="@/assets/images/filter.svg" alt="">
      </div> -->
    </div>
    <div v-for="(ele, index) in agendaData" :key="index" class="agenda-list">
      <!-- <div class="title">{{ ele.startTime }}</div> -->
      <div class="detail-container">
        <div
          class="detail"
        >
          <div class="content">
            <div
              @click="$router.push({
                name: 'manageSignInList',
                query: {
                  [$enc('agendaId')]: $enc(ele.id),
                  [$enc('conferenceId')]: $enc(routeParams.id),
                  [$enc('name')]: $enc(ele.name)
                }
              })"
            >
              <div class="time">{{ ele.startTime }} - {{ ele.endTime }}</div>
              <h4>{{ ele.name }}</h4>
              <div class="address">
                签到人数：<span>{{ ele.signedCount }}</span> / {{ ele.totalCount }}
              </div>
            </div>
            <div class="agenda-list" v-if="ele.children">
              <div
                v-for="(eleBrat, indexBrat) in ele.children"
                :key="indexBrat"
                class="agenda-item"
                :class="agendaChecked(ele.conductDate, eleBrat.startTime, eleBrat.endTime, indexBrat)"
                @click="$router.push({
                  name: 'manageSignInList',
                  query: {
                    [$enc('agendaId')]: $enc(eleBrat.id),
                    [$enc('conferenceId')]: $enc(routeParams.id),
                    [$enc('name')]: $enc(ele.name)
                  }
                })"
              >
                <div class="time">{{ eleBrat.startTime }} - {{ eleBrat.endTime }}</div>
                <h4>{{ eleBrat.name }}</h4>
                <div class="address">
                  签到人数：<span>{{ eleBrat.signedCount }}</span> / {{ eleBrat.totalCount }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-empty
      v-if="agendaData && !agendaData.length"
      :image="dataNull"
      description="这里什么都没有哦！"
    />
    <van-popup v-model="dateStartShow" position="bottom" :style="{ width: '100%' }" round>
      <van-picker show-toolbar title="选择议程时间" :columns="columnsDate" @confirm="startChoice" @cancel="dateStartShow = false"/>
    </van-popup>
  </div>
</template>

<script>
import dataNull from '@/assets/images/dataNull.png'
export default {
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      dataNull,
      agendaData: null,
      conductDate: '',
      dateStartShow: false,
      columnsDate: [
        {
          values: [],
          defaultIndex: 1
        }
      ]
    }
  },
  computed: {
    filterDate() {
      return function(date) {
        return `${this.formatCode(new Date(date))} ${this.judgeDate(date)}`
      }
    },
    agendaChecked() {
      return function(date, startTime, endTime) {
        const nowTime = new Date().getTime()
        const sTime = new Date(`${date} ${startTime}`).getTime()
        const eTime = new Date(`${date} ${endTime}`).getTime()
        if (nowTime >= eTime) {
          return 'agenda-item-before agenda-item-after'
        } else if (nowTime >= sTime) {
          return 'agenda-item-before'
        } else {
          return ''
        }
      }
    }
  },
  created() {
    console.log(this.routeParams)
    const conferenceId = this.routeParams.id
    const getAgendaTime = () => {
      return this.$api({
        url: 'manage.getAgendaTime',
        data: {
          conferenceId
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          const conductDate = data.filter(ele => ele.selected)
          return conductDate.length ? conductDate[0].date : ''
        }
      })
    }
    const getAgenda = async function() {
      const conductDate = await getAgendaTime()
      this.conductDate = conductDate
      if (!conductDate.length) {
        this.agendaData = []
      } else {
        this.getAgendaList(conductDate)
      }
    }.bind(this)
    getAgenda()
  },
  methods: {
    getAgendaList(conductDate) {
      const conferenceId = this.routeParams.id
      this.$api({
        url: 'manage.getAgendaList',
        data: {
          conferenceId,
          conductDate,
          resFlag: 2,
          signStatusEqual: 3
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          this.agendaData = data
        }
      })
    },
    // 时间选择
    dateHandler() {
      this.dateStartShow = true
      const startDate = this.routeParams.startTime.slice(0, 10)
      const endDate = this.routeParams.endTime.slice(0, 10)
      const startTimePrev = this.timeJump(startDate, -60)
      const endTimeNext = this.timeJump(endDate, 60)
      const columnsDate = this.timeArr(startTimePrev, endTimeNext)
      this.columnsDate[0].values = columnsDate
      const now = this.formatCode(new Date(this.formatRod(new Date())))
      const defaultIndex = this.columnsDate[0].values.findIndex(ele => ele === now)
      this.columnsDate[0].defaultIndex = defaultIndex
    },
    // 开始日期选择
    startChoice(val) {
      this.dateStartShow = false
      const conductDate = new Date(this.formatCodeSymbol(val[0]))
      this.conductDate = this.formatRod(conductDate)
      this.getAgendaList(this.conductDate)
    },
    // 将 2020-01-02 转换为 2020年01月01日
    formatCode(date) {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    },
    // 将时间戳 转换为 2020-02-02
    formatRod(date) {
      return `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${(date.getDate()) < 10 ? `0${date.getDate()}` : date.getDate()}`
    },
    // 将 2020年01月02日 转换为2020-01-02
    formatCodeSymbol(yearMonthDay) {
      const choiceYearMonthDay = yearMonthDay.slice(0, -1).replace(/([^\u0000-\u00FF])/g, '-')
      const yearMonthDayArr = choiceYearMonthDay.split('-')
      yearMonthDayArr.forEach((ele, index) => {
        if (ele < 10) {
          yearMonthDayArr[index] = `0${ele}`
        }
      })
      const paramsYearMonthDay = yearMonthDayArr.join('-')
      // 将小时转换为两位数
      const finalStartDate = `${paramsYearMonthDay}`
      return finalStartDate
    },
    // 计算两个日期之间相差的天数
    getDaysBetween(startTime, endTime) {
      const startDate = Date.parse(startTime)
      const endDate = Date.parse(endTime)
      const days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
      return days
    },
    // 判断日期是当前日期的前天 / 昨天 / 今天 / 明天 / 后天
    judgeDate(date) {
      const now = new Date()
      const nowFromat = this.formatRod(now)
      const getDaysBetween = this.getDaysBetween(nowFromat, date)
      switch (getDaysBetween) {
        case 2:
          return '后天'
        case 1:
          return '明天'
        case 0:
          return '今天'
        case -1:
          return '昨天'
        case -2:
          return '前天'
        default:
          return ''
      }
    },
    // 根据开始时间和结束时间将中间的日期处理成数组
    timeArr(startTime, endTime) {
      const result = []
      const differDay = this.getDaysBetween(startTime, endTime)
      for (let i = 0; i < differDay; i++) {
        const now = new Date(startTime)
        const tomorrow = new Date(now.setDate(now.getDate() + i))
        result.push(this.formatCode(tomorrow))
      }
      return result
    },
    // 根据时间向前推/向后推的天数 prevNum为正数向后推 为负数向前推
    timeJump(time, prevNum) {
      const now = new Date(time)
      return new Date(now.setDate(now.getDate() + prevNum))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.agenda-container {
  min-height: 100%;
  background-color: #f8f8f8;
  width: 100%;
  padding-top: 60px;
  .filter-container {
    width: 100%;
    height: 48px;
    line-height: 48px;
    background-color: #fff;
    padding: 0 16px;
    position: fixed;
    left: 0;
    top: 0;
    @include list(row, space-between, center);
    .filter-btn {
      @include list(row, flex-start, center);
      font-size: 13px;
      img {
        margin-left: 4px;
      }
    }
  }
  .agenda-list {
    .title {
      width: 100%;
      height: 56px;
      @include list(row,flex-start,center);
      font-size: 16px;
      line-height: 56px;
      padding: 0 12px;
    }
    .detail {
      width: 100%;
      padding: 0 12px;
      margin-bottom: 12px;
      .content{
        padding: 16px;
        border-radius: 16px;
        background-color: #fff;
        .time {
          font-size: 13px;
          color: rgba(88, 110, 129, 1);
          line-height: 18px;
          margin-bottom: 16px;
        }
        h4 {
          font-size: 16px;
          line-height: 21px;
          margin-bottom: 8px;
        }
        .address {
          font-size: 13px;
          color: rgba(25, 31, 36, 0.56);
          line-height: 18px;
          @include list(row,flex-start,center);
          span {
            margin-right: 4px;
            color: rgba(25, 31, 36, 1);
          }
        }
        .agenda-list {
          padding-top: 28px;
          .agenda-item {
            padding: 0 0 32px 20px;
            position: relative;
            &::after {
              content: '';
              display: block;
              width: 2px;
              height: 100%;
              @include absolute(3px,'','',3px);
              background-color: rgba(236, 236, 236, 1);
            }
            &::before {
              content: '';
              display: block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              @include absolute(2px,'','',0,2);
              background-color: rgba(216, 216, 216, 1);
            }
            &:nth-last-of-type(1) {
              border-bottom: 0;
              padding-bottom: 0;
              &::after {
                display: none;
              }
              .address::after {
                display: none;
              }
            }
          }
          .agenda-item-before {
            &::before {
              background-color: rgba(3, 190, 28, 1);
            }
          }
          .agenda-item-after {
            &::after {
              background-color: rgba(3, 190, 28, 1);
            }
          }
          .address {
            &::after {
              content: '';
              display: block;
              width: 315px;
              height: 1px;
              background-color: rgba(25, 31, 36, 0.08);
              @include absolute('',-16px,16px,'');
            }
          }
        }
      }
    }
  }
  .van-empty__image {
    width: 176px;
    height: 103px;
  }
}
</style>
