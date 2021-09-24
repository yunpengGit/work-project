<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-07-16 15:44:00
* @LastEditors: Please set LastEditors
* @LastEditTime:
-->
<template>
  <div class="stay-container">
    <div class="attendee-tab">
      <span
        v-for="(ele, index) in stayAttendeeList"
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
      :width="stayTaskData.length > 1 ? 333 : ''"
      indicator-color="#2063F8"
      show-indicators
    >
      <van-swipe-item v-for="(ele, index) in stayTaskData" :key="index">
        <div
          class="my-swipe-item"
          :style="{
          'margin-right': stayTaskData.length > 1 ? '0px' : '16px',
            backgroundImage:
              index % 2 == 0
                ? 'url(' + require('../../../../assets/images/stayBgc.png') + ') '
                : 'url(' + require('../../../../assets/images/stayBgc1.svg') + ') '
          }"
        >
          <div class="title">
            {{ ele.roomFormVO.hotelVO.name }}
          </div>
          <div class="room-number">
            <span
v-if="hotelInfoData.roomNo.length"
              ><span class="number">{{ hotelInfoData.roomNo }}</span> <span class="text">房间</span></span
            >
            <div v-else class="no-number">暂无房间号</div>
          </div>
          <div class="date">
            <span class="label"><img src="@/assets/images/blackTime.svg" alt="" /></span>
            <span
class="text"
              >{{ ele.startDate.replace(/-/g, '.') }} - {{ ele.endDate.replace(/-/g, '.') }} ({{
                filterDays(ele.startDate, ele.endDate)
              }}晚)</span
            >
          </div>
          <div class="address">
            <span class="label"><img src="@/assets/images/blackPlace.svg" alt="" /></span>
            <span class="text">{{ ele.roomFormVO.hotelVO.address || '暂无酒店位置信息' }}</span>
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
    <div class="hotel-info" :style="{ 'padding-top': stayTaskData.length > 1 ? '88px' : '76px' }">
      <div class="info-item">
        <div class="label">房间位置</div>
        <div class="value">{{ hotelInfoData.description || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="label">住宿须知</div>
        <div class="value">{{ hotelInfoData.roomFormVO.hotelVO.notice || '无' }}</div>
      </div>
      <div class="info-item" style="border: none">
        <div class="label">前台电话</div>
        <div class="value phone">
          <div>{{ hotelInfoData.roomFormVO.hotelVO.businessPhone || '-' }}</div>
          <a
            :href="`tel:${hotelInfoData.roomFormVO.hotelVO.businessPhone}`"
            v-if="hotelInfoData.roomFormVO.hotelVO.businessPhone"
          >
            <img src="@/assets/images/phone.svg" alt="" />
          </a>
        </div>
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
      stayAttendeeList: [], // 参会人列表
      stayTaskData: [], // 任务列表
      showSwipe: true,
      // 酒店信息
      hotelInfoData: {
        roomFormVO: {
          hotelVO: {}
        }
      },
      contacterData: [] // 联络人列表
    }
  },
  computed: {},
  created() {
    const stayAttendeeArr = JSON.parse(this.routeParams.stayAttendeeList)
    this.stayAttendeeList = stayAttendeeArr
    this.currentAttendeeId = this.stayAttendeeList[0].id
    this.getRoomTaskData()
    this.getContacterData()
  },
  mounted() {},
  methods: {
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
      this.getRoomTaskData()
    },
    // 切换轮播
    handleSwipe(index) {
      const infoObj = this.stayTaskData.find((item, i) => {
        return index === i
      })
      this.hotelInfoData = infoObj
    },
    getRoomTaskData() {
      const conferenceId = this.routeParams.conferenceId
      const paramsData = {}
      paramsData.conferenceId = conferenceId
      paramsData.attendeeId = this.currentAttendeeId
      // paramsData.publish = 1
      this.$api({
        url: 'attendeeApi.getRoomTask',
        data: paramsData
      }).then(res => {
        if (res.success) {
          const data = res.result.list
          this.stayTaskData = data
          this.hotelInfoData = this.stayTaskData[0]
        }
      })
    },
    // 查询联络人
    getContacterData() {
      const conferenceId = this.routeParams.conferenceId
      const paramsData = {}
      paramsData.conferenceId = conferenceId
      paramsData.contacterRoleIds = '3'
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
.stay-container {
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
    height: 128px;
    background: linear-gradient(180deg, #2946bf 0%, #537ce1 100%);
  }
  .my-swipe {
    position: absolute;
    width: 100%;
    top: 54px;
    height: 230px;
    .my-swipe-item {
      margin: 16px;
      background-repeat: no-repeat;
      height: 180px;
      box-shadow: 0px 2px 6px 0px rgba(107, 127, 153, 0.41);
      box-shadow: 0px 2px 16px 0px rgba(49, 78, 144, 0.5);
      border-radius: 4px;
      background-size: 100%;
      padding: 16px 20px 21px 16px;
      color: #102c70;
      .title {
        height: 34px;
        font-size: 22px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        line-height: 34px;
        margin-bottom: 7px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .room-number {
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        margin-bottom: 10px;
        .number {
          height: 50px;
          font-size: 36px;
          line-height: 50px;
          margin-right: 8px;
        }
        .text {
          height: 21px;
          font-size: 15px;
          line-height: 21px;
        }
        .no-number {
          height: 21px;
          font-size: 15px;
          margin: 29px 0 17px 0;
          font-weight: 500;
          color: #102c70;
          line-height: 21px;
        }
      }
      .date {
        line-height: 16px;
      }
      .address {
        margin-top: 9px;
        line-height: 16px;
        .text {
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .date,
      .address {
        display: flex;
        font-size: 15px;
        color: #253763;
        align-items: center;
        .label {
          width: 16px;
          margin-right: 11px;
        }
        .text {
          flex: 1;
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
