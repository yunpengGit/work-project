<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-02 10:24:34
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-26 14:32:10
-->
<template>
  <div class="stats-container" v-if="isLoading">
    <h3 @click="dateShow = true"><span>{{targetDate}}</span> <img src="@/assets/images/arrowDown.svg" alt="" /></h3>
    <swiper :options="swiperOptions" v-if="conferenceStatus === 2">
      <swiper-slide v-for="(ele, index) in statsData" :key="index">
        <div
          class="stats-item"
        >
          <h4>{{ ele.title }} {{ ele.value }}</h4>
          <div class="stats-detail">
            <dl v-for="(eleChild, indexChild) in ele.data" :key="indexChild">
              <dt>{{ eleChild.text }}</dt>
              <dd>
                <div v-for="(eleDeep, indexDeep) in eleChild.value" :key="indexDeep">
                  <span>{{ eleDeep }}</span>
                </div>
                {{eleChild.unit}}
              </dd>
            </dl>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide v-for="t in mealArr" :key="t.typeCode">
        <div class="stats-item">
          <h4>{{ t.typeCode }}餐位使用率 {{ Number(t.todayPer).toFixed() }}%</h4>
          <div class="stats-detail">
            <dl>
              <dt>使用餐位</dt>
              <dd>
                <div>
                  <span>{{ t.todayMaxSeatNumCountSum }}</span>
                </div>
                个
              </dd>
            </dl>
            <dl>
              <dt>剩余餐位</dt>
              <dd>
                <div>
                  <span>{{ t.freeSeatNmuCount }}</span>
                </div>
                个
              </dd>
            </dl>
            <dl>
              <dt>参会人数</dt>
              <dd>
                <div>
                  <span>{{ mealTotal }}</span>
                </div>
                人
              </dd>
            </dl>
            <dl>
              <dt>用餐人数</dt>
              <dd>
                <div>
                  <span>{{ t.todayUserCount }}</span>
                </div>
                人
              </dd>
            </dl>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide v-for="(ele) in cardInfo" :key="ele.title">
        <div
          class="stats-item"
        >
          <h4>{{ ele.title }} {{ ele.value }}</h4>
          <div class="stats-detail">
            <dl v-for="(eleChild, indexChild) in ele.data" :key="indexChild">
              <dt>{{ eleChild.text }}</dt>
              <dd>
                <div v-for="(eleDeep, indexDeep) in eleChild.value" :key="indexDeep">
                  <span>{{ eleDeep }}</span>
                </div>
                {{eleChild.unit}}
              </dd>
            </dl>
          </div>
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
    <swiper :options="swiperOptions" v-else>
      <swiper-slide v-for="(ele, index) in statsDataTo" :key="index">
        <div
          class="stats-item"
        >
          <h4>{{ ele.title }} {{ ele.value }}</h4>
          <div class="stats-detail">
            <dl v-for="(eleChild, indexChild) in ele.data" :key="indexChild">
              <dt>{{ eleChild.text }}</dt>
              <dd>
                <div v-for="(eleDeep, indexDeep) in eleChild.value" :key="indexDeep">
                  <span>{{ eleDeep }}</span>
                </div>
                {{eleChild.unit}}
              </dd>
            </dl>
          </div>
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
    <!-- 日期选择器 -->
    <van-popup v-model="dateShow" position="bottom" :style="{ width: '100%' }" round>
      <van-picker show-toolbar title="选择日期" :columns="dateColumns"  @cancel="dateShow = false" @confirm="chooseDate"/>
    </van-popup>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  components: { swiper, swiperSlide },
  props: {
    conferenceData: {
      type: Object
    },
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      swiperOptions: {
        slidesPerView: 'auto',
        spaceBetween: 16,
        slidesOffsetBefore: 0,
        freeMode: true
      },
      // 进行中
      statsData: [
        { title: '签到率', value: '0%', data: [
          { text: '实到人数', value: '0', unit: '人' },
          { text: '应到人数', value: '0', unit: '人' },
          { text: '请假人数', value: '0', unit: '人' },
          { text: '未到人数', value: '0', unit: '人' }
        ] },
        { title: '车辆使用率', value: '0%', data: [
          { text: '使用车辆', value: '0', unit: '台' },
          { text: '空闲车辆', value: '0', unit: '台' },
          { text: '用车人次', value: '0', unit: '人' }
        ] },
        { title: '房间使用率', value: '0%', data: [
          { text: '使用房间', value: '0', unit: '间' },
          { text: '空闲房间', value: '0', unit: '间' },
          { text: '入住人数', value: '0', unit: '人' },
          { text: '离开人数', value: '0', unit: '人' }
        ] }
        // { title: '发证数量', value: '0张', data: [
        //   { text: '嘉宾证总数', value: '0', unit: '人' },
        //   { text: '剩余', value: '0', unit: '人' },
        //   { text: '车证总数', value: '0', unit: '人' },
        //   { text: '剩余', value: '0', unit: '人' }
        // ] }
      ],
      mealArr: [], // 进行中用餐分餐卡片展示数组
      mealTotal: '', // 进行中查询用餐中参会人数
      statsDataTo: [
        { title: '报名通过率', value: '0%', data: [
          { text: '通过人数', value: '0', unit: '人' },
          { text: '不通过人数', value: '0', unit: '人' },
          { text: '待审核人数', value: '0', unit: '人' },
          { text: '报名', value: '0', unit: '人' }
        ] },
        { title: '车辆分配率', value: '0%', data: [
          { text: '已分配人数', value: '0', unit: '人' },
          { text: '待分配人数', value: '0', unit: '人' },
          { text: '需接站人数', value: '0', unit: '人' },
          { text: '需送站人数', value: '0', unit: '人' }
        ] },
        { title: '房间分配率', value: '0%', data: [
          { text: '已分配人数', value: '0', unit: '人' },
          { text: '待分配人数', value: '0', unit: '人' },
          { text: '需分配人数', value: '0', unit: '人' }
        ] },
        { title: '餐位分配率', value: '0%', data: [
          { text: '已分配人数', value: '0', unit: '人' },
          { text: '待分配人数', value: '0', unit: '人' },
          { text: '需分配人数', value: '0', unit: '人' }
        ] },
        { title: '证件分配总数', value: '0', data: [
          { text: '已分配人数', value: '0', unit: '涨' },
          { text: '待分配人数', value: '0', unit: '人' },
          { text: '需分配人数', value: '0', unit: '人' }
        ] }
      ],
      cardInfo: [
        { title: '发证数量', value: '0张', data: [
          { text: '嘉宾证总数', value: '0', unit: '张' },
          { text: '剩余', value: '0', unit: '张' },
          { text: '车证总数', value: '0', unit: '张' },
          { text: '剩余', value: '0', unit: '张' }
        ] }
      ],
      conferenceStatus: null,
      isLoading: false,
      dateShow: false, // 日期选择器
      dateColumns: [{ values: [], defaultIndex: 0 }],
      targetDate: ''
    }
  },
  computed: {
    mealSeat() {
      return function(num) {
        let result = ''
        result = Number(num * 100).toFixed()
        return result
      }
    }
  },
  created() {
    this.getAgendaDate()
    this.targetDate = this.formatCode(new Date())
    this.getData()
  },
  methods: {
    // 开始日期渲染
    getAgendaDate() {
      const startTime = this.conferenceData.startTime
      const endTime = this.conferenceData.endTime
      const startDay = startTime.slice(0, 10)
      const endDay = endTime.slice(0, 10)
      // 根据会议开始时间向前退两个月
      const prevYearMonthDay = []
      for (let i = 0; i < 61; i++) {
        const now = new Date(startDay)
        const yesterday = new Date(now.setDate(now.getDate() - i))
        prevYearMonthDay.push(this.formatCode(yesterday))
      }
      for (let i = 0; i < prevYearMonthDay.length; i++) {
        this.dateColumns[0].values.unshift(prevYearMonthDay[i])
      }
      // 把开始时间和结束时间的日期补全
      const nowYearMonthDay = []
      const getDaysBetween = this.getDaysBetween(startDay, endDay)
      for (let i = 1; i < getDaysBetween; i++) {
        const now = new Date(startDay)
        const tomorrow = new Date(now.setDate(now.getDate() + i))
        nowYearMonthDay.push(this.formatCode(tomorrow))
      }
      for (let i = 0; i < nowYearMonthDay.length; i++) {
        this.dateColumns[0].values.push(nowYearMonthDay[i])
      }
      // 根据会议结束向后推两个月
      const NextYearMonthDay = []
      for (let i = 0; i < 61; i++) {
        const now = new Date(endDay)
        const tomorrow = new Date(now.setDate(now.getDate() + i))
        NextYearMonthDay.push(this.formatCode(tomorrow))
      }
      for (let i = 0; i < NextYearMonthDay.length; i++) {
        this.dateColumns[0].values.push(NextYearMonthDay[i])
      }
      const today = this.formatCode(new Date())
      const index = this.dateColumns[0].values.findIndex(ele => ele === today)
      this.dateColumns[0].defaultIndex = index
    },
    // 将 2020-01-02 转换为 2020年01月01日
    formatCode(date) {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    },
    // 计算两个日期之间相差的天数
    getDaysBetween(startTime, endTime) {
      const startDate = Date.parse(startTime)
      const endDate = Date.parse(endTime)
      const days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
      return days
    },
    // 选择日期
    chooseDate(val) {
      this.dateShow = false
      this.targetDate = val[0]
      this.getData()
    },
    async getData() {
      this.conferenceStatus = this.getConferenceStatus()
      const conferenceStatus = this.conferenceStatus
      if (conferenceStatus === 2) {
        // 进行中
        await this.getMeeting(2)
        await this.getCar(2)
        await this.getRoom(2)
        await this.getSeat(2)
        await this.getCard(2)
      } else {
        await this.getMeeting(1)
        await this.getCar(1)
        await this.getRoom(1)
        await this.getSeat(1)
        await this.getCard(1)
      }
      this.isLoading = true
    },
    // 会议状态
    getConferenceStatus() {
      // 1 → 未开始 / 2 → 进行中 / 3 → 已结束
      const startTime = new Date(this.conferenceData.startTime).getTime()
      const endTime = new Date(this.conferenceData.endTime).getTime()
      const nowTime = new Date().getTime()
      const oneDay = 1 * 24 * 60 * 60 * 1000
      let result = {}
      if (nowTime < startTime) {
        // 未开始
        result = { status: 1, time: Math.ceil((startTime - nowTime) / oneDay) }
      } else if (nowTime > startTime && nowTime < endTime) {
        // 进行中
        result = { status: 2, timeBeen: Math.ceil((nowTime - startTime) / oneDay), timeFinish: Math.ceil((endTime - nowTime) / oneDay) }
      } else {
        // 已结束
        result = { status: 3 }
      }
      return result.status
    },
    getMeeting(conferenceStatus) {
      return new Promise(resolve => {
        const id = this.routeParams.id
        // 1 → 会议
        this.$api({
          url: 'desk.getStat',
          data: {
            conferenceId: id,
            conferenceStatus,
            // 1会议 2车 3住 4餐 5证
            statisticsType: '1',
            targetDate: this.targetDate.replace(/年/g, '-').replace(/月/g, '-').replace(/日/g, '')
          }
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result.conferenceInfo
            if (conferenceStatus === 2) {
              this.statsData[0].value = `${Number(data.conferenceTodayCheckInCountPer).toFixed()}%`
              this.statsData[0].data[0].value = `${data.conferenceTodayRealCheckInCount}`
              this.statsData[0].data[1].value = `${data.conferenceTodayAgendaCheckInTotalCount}`
              this.statsData[0].data[2].value = `${data.conferenceTodayLeaveCount}`
              this.statsData[0].data[3].value = `${data.conferenceTodayNoCheckInCount}`
            } else {
              this.statsDataTo[0].value = `${Number(data.todayPassCountPer).toFixed()}%`
              this.statsDataTo[0].data[0].value = `${data.todayAuditPassCount}`
              this.statsDataTo[0].data[1].value = `${data.todayAuditNoPassCount}`
              this.statsDataTo[0].data[2].value = `${data.todayAuditWaitCount}`
              this.statsDataTo[0].data[3].value = `${data.todaySignCount}`
            }
            resolve()
          }
        })
      })
    },
    getCar(conferenceStatus) {
      return new Promise(resolve => {
        const id = this.routeParams.id
        // 2 → 车
        this.$api({
          url: 'desk.getStat',
          data: {
            conferenceId: id,
            conferenceStatus,
            // 1会议 2车 3住 4餐 5证
            statisticsType: '2',
            targetDate: this.targetDate.replace(/年/g, '-').replace(/月/g, '-').replace(/日/g, '')
          }
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result.vehicleInfo
            if (conferenceStatus === 2) {
              this.statsData[1].value = `${Number(data.todayUseVehiclePer).toFixed()}%`
              this.statsData[1].data[0].value = `${data.todayVehicleCount}`
              this.statsData[1].data[1].value = `${data.todayVehicleFreeCount}`
              this.statsData[1].data[2].value = `${data.todayUserCount}`
            } else {
              this.statsDataTo[1].value = `${Number(data.todayUseVehiclePer).toFixed()}%`
              this.statsDataTo[1].data[0].value = `${data.finishUserCount}`
              this.statsDataTo[1].data[1].value = `${data.waitUserCount}`
              this.statsDataTo[1].data[2].value = `${data.needArriveUserCount}`
              this.statsDataTo[1].data[3].value = `${data.needRetuenUserCount}`
            }
            resolve()
          }
        })
      })
    },
    getRoom(conferenceStatus) {
      return new Promise(resolve => {
        const id = this.routeParams.id
        // 3 → 车
        this.$api({
          url: 'desk.getStat',
          data: {
            conferenceId: id,
            conferenceStatus,
            // 1会议 2车 3住 4餐 5证
            statisticsType: '3',
            targetDate: this.targetDate.replace(/年/g, '-').replace(/月/g, '-').replace(/日/g, '')
          }
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result.roomInfo
            if (conferenceStatus === 2) {
              this.statsData[2].value = `${Number(data.todayUsePer).toFixed()}%`
              this.statsData[2].data[0].value = `${data.todayRoomCount}`
              this.statsData[2].data[1].value = `${data.roomFreeCount}`
              this.statsData[2].data[2].value = `${data.todayUserCount}`
              this.statsData[2].data[3].value = `${data.todayLeaveUserCount}`
            } else {
              this.statsDataTo[2].value = `${Number(data.todayUsePer).toFixed()}%`
              this.statsDataTo[2].data[0].value = `${data.finishUserCount}`
              this.statsDataTo[2].data[1].value = `${data.waitUserCount}`
              this.statsDataTo[2].data[2].value = `${data.needBookRoomUserCount}`
            }
            resolve()
          }
        })
      })
    },
    getSeat(conferenceStatus) {
      return new Promise(resolve => {
        const id = this.routeParams.id
        // 3 → 车
        this.$api({
          url: 'desk.getStat',
          data: {
            conferenceId: id,
            conferenceStatus,
            // 1会议 2车 3住 4餐 5证 6 分餐
            statisticsType: '6',
            targetDate: this.targetDate.replace(/年/g, '-').replace(/月/g, '-').replace(/日/g, '')
          }
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result.dinnerInfo
            if (conferenceStatus === 2) {
              this.mealArr = data.todaySpecifyList
              this.mealTotal = data.conferenceSignTotalCount
              console.log(1, this.mealArr)
            } else {
              this.statsDataTo[3].value = `${Number(data.todayPer).toFixed()}%`
              this.statsDataTo[3].data[0].value = `${data.finishUserCount}`
              this.statsDataTo[3].data[1].value = `${data.waitUserCount}`
              this.statsDataTo[3].data[2].value = `${data.needBookDinnerUserCount}`
            }
            resolve()
          }
        })
      })
    },
    getCard(conferenceStatus) {
      return new Promise(resolve => {
        const id = this.routeParams.id
        // 3 → 车
        this.$api({
          url: 'desk.getStat',
          data: {
            conferenceId: id,
            conferenceStatus,
            // 1会议 2车 3住 4餐 5证
            statisticsType: '5',
            targetDate: this.targetDate.replace(/年/g, '-').replace(/月/g, '-').replace(/日/g, '')
          }
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result.cardInfo
            if (conferenceStatus === 2) {
              this.cardInfo[0].value = `${data.todayUserAndVehicleCount}张`
              this.cardInfo[0].data[0].value = `${data.cardType1Count}`
              this.cardInfo[0].data[1].value = `${data.cardType1FreeCount}`
              this.cardInfo[0].data[2].value = `${data.cardType2Count}`
              this.cardInfo[0].data[3].value = `${data.cardType2FreeCount}`
              // this.statsData[3].value = `${data.todayUserAndVehicleCount}张`
              // this.statsData[3].data[0].value = `${data.cardType1Count}`
              // this.statsData[3].data[1].value = `${data.cardType1FreeCount}`
              // this.statsData[3].data[2].value = `${data.cardType2Count}`
              // this.statsData[3].data[3].value = `${data.cardType2FreeCount}`
            } else {
              this.statsDataTo[4].value = `${data.cardCount}张`
              this.statsDataTo[4].data[0].value = `${data.finishCardCount}`
              this.statsDataTo[4].data[1].value = `${data.waitUserCount}`
              this.statsDataTo[4].data[2].value = `${data.needBookCardUserCount}`
            }
            resolve()
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.stats-container {
  width: 100%;
  padding: 0 16px 16px;
  background-color: #fff;
  margin: 12px 0;
  > h3 {
    @include list(row, flex-start, center);
    padding: 16px 0 12px;
    span {
      font-size: 17px;
      font-weight: 500;
      margin-right: 4px;
    }
    img {
      width: 16px;
    }
  }
  .swiper-container {
    width: 100%;
    height: 100%;
    background-color: #fff;
    .swiper-slide {
      width: auto !important;
      @include list(row, flex-start, center);
      &:nth-of-type(1), &:nth-last-of-type(1){
        .stats-item {
          .stats-detail {
              dl:nth-last-of-type(1) {
              dd {
                color: rgba(225, 41, 4, 1);
                span {
                  color: rgba(225, 41, 4, 1);
                }
              }
            }
          }
        }
      }
      &:nth-child(even) {
        .stats-item {
          background-color: rgba(255, 249, 232, 1);
        }
      }
      .stats-item {
        background-color: #F1FAFF;
        padding: 10px;
        border-radius: 12px;
        > h4 {
          font-size: 15px;
          font-weight: 500;
          padding-bottom: 12px;
        }
        .stats-detail {
          @include list(row, flex-start, center);
          dl {
            margin-left: 22px;
            color: rgba(25, 31, 36, 0.56);
            &:nth-of-type(1) {
              margin-left: 0;
            }
            &:nth-last-of-type(1) {
              dd {
                color: rgba(0, 147, 20, 1);
                span {
                  color: rgba(0, 147, 20, 1);
                }
              }
            }
            dt {
              font-size: 13px;
              margin-bottom: 8px;
            }
            dd {
              @include list(row, flex-start, center);
              span {
                font-size: 16px;
                color: rgba(25, 31, 36, 1);
                font-weight: 500;
              }
            }
          }
        }
      }
    }
  }
}
</style>
