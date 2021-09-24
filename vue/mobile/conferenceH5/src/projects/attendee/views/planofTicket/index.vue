<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-07-16 15:44:00
* @LastEditors: Please set LastEditors
* @LastEditTime:
-->
<template>
  <div class="ticket-container">
    <div class="attendee-tab">
      <span
        v-for="(ele, index) in ticketAttendeeList"
        :key="index"
        @click="handleAttendee(ele, index)"
        class="attendee-item"
        :class="activeIndex === index ? 'active-attendee-item' : ''"
      >
        {{ ele.fixAttributeCommonVO.attendeeName }}
      </span>
    </div>
    <div class="blue-bg"></div>
    <van-swipe
      class="my-swipe"
      @change="handleSwipe"
      :loop="false"
      :width="ticketTaskData.length > 1 ? 333 : ''"
      indicator-color="#2063F8"
      show-indicators
    >
      <van-swipe-item v-for="(ele, index) in ticketTaskData" :key="index">
        <div
          class="my-swipe-item"
          :style="{
            marginRight: ticketTaskData.length > 1 ? '0px' : '16px',
            backgroundImage:
              index % 2 == 0
                ? 'url(' + require('../../../../assets/images/ticketBgc.svg') + ') '
                : 'url(' + require('../../../../assets/images/ticketBgc1.svg') + ') '
          }"
        >
          <div class="title">
            <span class="title-text">{{ ele.cardName }}</span>
            <span class="card-type">{{ ele.cardStatusStr }}</span>
          </div>
          <div class="date">
            <span class="label"><img src="@/assets/images/blackTime.svg" alt="" /></span>
            <div>
              <!-- 生效和失效至少一个存在展示如下 -->
              <span
                class="text"
                v-if="(ele.effectiveTime && ele.effectiveTime.length) || (ele.invalidTime && ele.invalidTime.length)"
                >{{ ele.effectiveTime && ele.effectiveTime.length ? filterDate(ele.effectiveTime) : '暂无' }} -
                {{ ele.invalidTime && ele.invalidTime.length ? filterDate(ele.invalidTime) : '暂无' }}
                <span>
                  {{
                    ele.effectiveTime && ele.effectiveTime.length && ele.invalidTime && ele.invalidTime.length
                      ? filterDays(ele.effectiveTime, ele.invalidTime) + '天'
                      : ''
                  }}
                </span></span
              >
              <!-- 生效和失效均无时展示如下 -->
              <span class="text" v-else>暂无有效期信息</span>
            </div>
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
    <div class="hotel-info" :style="{ 'padding-top': ticketTaskData.length > 1 ? '35px' : '20px' }">
      <div class="info-item">
        <div class="label">证件状态</div>
        <div class="value">{{ ticketInfoData.cardStatusStr || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="label">使用说明</div>
        <div class="value">
          {{ ticketInfoData.description || '无' }}
        </div>
      </div>
      <div class="info-item">
        <div class="label">取证须知</div>
        <div class="value">{{ ticketInfoData.notice || '无' }}</div>
      </div>
    </div>
    <div class="hotel-info">
      <div v-for="(ele, index) in contacterData" :key="index">
        <div class="info-item">
          <div class="label">联络人</div>
          <div class="value">{{ ele.contacterName }}</div>
        </div>
        <div class="info-item">
          <div class="label">联系电话</div>
          <div class="value phone">
            <div>{{ ele.mobile || '-' }}</div>
            <a :href="`tel:${ele.mobile}`" v-if="ele.mobile.length">
              <img src="@/assets/images/phone.svg" alt="" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      activeIndex: 0,
      currentAttendeeId: '', // 当前参会人的attendeeId
      ticketAttendeeList: [], // 参会人列表
      ticketTaskData: [], // 任务列表
      showSwipe: true,
      contacterData: [], // 联络人列表
      // 证件信息
      ticketInfoData: {
        roomFormVO: {
          hotelVO: {}
        }
      }
    }
  },
  computed: {},
  created() {
    const stayAttendeeArr = JSON.parse(this.routeParams.ticketAttendeeList)
    this.ticketAttendeeList = stayAttendeeArr
    this.currentAttendeeId = this.ticketAttendeeList[0].id
    this.getCardTaskData()
    this.getContacterData()
  },
  mounted() {},
  methods: {
    // 将时间2021-08-25 18:00:00 处理为 2021.08.25
    filterDate(time) {
      const str = time.replace(/-/g, '.')
      const newStr = str.slice(0, str.length - 9)
      return newStr
    },
    // 有几天
    filterDays(start1, end1) {
      const start = start1.slice(0, 10)
      const end = end1.slice(0, 10)
      const timestamp = Date.parse(new Date(end)) - Date.parse(new Date(start))
      const days = timestamp / (1000 * 3600 * 24)
      return days
    },
    // 切换顶部参会人tab
    handleAttendee(ele, index) {
      this.activeIndex = index
      this.currentAttendeeId = ele.fixAttributeCommonVO.attendeeId
      this.getCardTaskData()
    },
    // 切换轮播
    handleSwipe(index) {
      const infoObj = this.ticketTaskData.find((item, i) => {
        return index === i
      })
      this.ticketInfoData = infoObj
    },
    // 获取任务列表
    getCardTaskData() {
      const conferenceId = this.routeParams.conferenceId
      const paramsData = {}
      paramsData.conferenceId = conferenceId
      paramsData.attendeeId = this.currentAttendeeId
      paramsData.publish = 1
      this.$api({
        url: 'attendeeApi.getCardTask',
        data: paramsData
      }).then(res => {
        if (res.success) {
          const data = res.result.list
          this.ticketTaskData = data
          this.ticketInfoData = this.ticketTaskData[0]
        }
      })
    },

    // 查询联络人
    getContacterData() {
      const conferenceId = this.routeParams.conferenceId
      const paramsData = {}
      paramsData.conferenceId = conferenceId
      paramsData.contacterRoleIds = '5'
      this.$api({
        url: 'attendeeApi.getContacter',
        data: paramsData
      }).then(res => {
        if (res.success) {
          const data = res.result.list
          this.contacterData = data
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.ticket-container {
  position: relative;
  background-color: #f2f5fc;
  height: 100%;
  .attendee-tab {
    height: 54px;
    padding: 10px 12px;
    background: #ffffff;
    min-width: 100%;
    overflow-y: auto;
    white-space: nowrap;
    .attendee-item {
      display: inline-block !important;
      padding: 0 14px;
      height: 33px;
      line-height: 33px;
      background: #f1f1f1;
      border-radius: 17px;
      font-size: 15px;
      color: #191f24;
      margin-right: 10px;
      text-align: center;
    }
    .active-attendee-item {
      background: linear-gradient(136deg, #2946bf 0%, #537ce1 100%);
      color: #ffffff;
    }
  }
  .blue-bg {
    height: 105px;
    background: linear-gradient(180deg, #2946bf 0%, #537ce1 100%);
  }
  .my-swipe {
    position: absolute;
    width: 100%;
    top: 54px;
    height: 160px;
    .my-swipe-item {
      margin: 16px;
      background-repeat: no-repeat;
      height: 110px;
      box-shadow: 0px 2px 6px 0px rgba(107, 127, 153, 0.41);
      box-shadow: 0px 2px 16px 0px rgba(49, 78, 144, 0.5);
      border-radius: 4px;
      background-size: cover;
      padding: 16px 20px 21px 16px;
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 19px;
        .title-text {
          height: 34px;
          font-size: 22px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #102c70;
          line-height: 34px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .card-type {
          text-align: center;
          border-radius: 14px;
          width: 70px;
          height: 27px;
          background: linear-gradient(136deg, #d3dcff 0%, #c4d5ff 100%);
          line-height: 27px;
          color: #3a71e1;
        }
      }
      .date {
        display: flex;
        height: 20px;
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #102c70;
        line-height: 20px;
        img {
          margin-right: 3px;
        }
      }
    }
    ::v-deep .van-swipe__indicators {
      bottom: 14px;
    }
    ::v-deep .van-swipe__indicator--active {
      width: 14px;
      border-radius: 6px;
    }
    ::v-deep .van-swipe__indicator {
      background-color: #b3b8bb;
    }
  }
  .hotel-info {
    background-color: #fff;
    margin-bottom: 12px;
    padding-left: 24px;
    .info-item {
      font-size: 14px;
      display: flex;
      align-items: center;
      padding: 16px 24px 16px 0;
      border-bottom: 1px solid #f1f1f2;
      .label {
        width: 80px;
        color: rgba(25, 31, 36, 0.64);
        margin-right: 20px;
      }
      .value {
        flex: 1;
        color: #191f24;
        line-height: 20px;
      }
      .phone {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}
</style>
