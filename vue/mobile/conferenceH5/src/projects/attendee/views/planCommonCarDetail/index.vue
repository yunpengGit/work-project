<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-07-16 15:44:00
* @LastEditors: Please set LastEditors
* @LastEditTime:
-->
<template>
  <div class="stay-container">
    <div class="top" :style="{ 'padding-bottom': planCommonCarDetailData.status == 0 ? '64px' : '' }">
      <div class="hotel-info">
        <div class="info-item">
          <div class="label">用车类型</div>
          <div class="value">
            {{
              planCommonCarDetailData.type == '1'
                ? '接站用车'
                : planCommonCarDetailData.type == '2'
                ? '送站用车'
                : '会议用车'
            }}
          </div>
        </div>
        <div class="info-item">
          <div class="label">接站时间</div>
          <div class="value">{{ filterDate(planCommonCarDetailData.getOnVehicleTime) || '-' }}</div>
        </div>
        <div class="info-item">
          <div class="label">接站地点</div>
          <div class="value">{{ planCommonCarDetailData.startAddress || '-' }}</div>
        </div>
        <div class="info-item">
          <div class="label">计划送达时间</div>
          <div class="value">{{ filterDate(planCommonCarDetailData.endTime) || '-' }}</div>
        </div>
        <div class="info-item">
          <div class="label">送达地点</div>
          <div class="value">{{ planCommonCarDetailData.endAddress || '-' }}</div>
        </div>
        <div class="info-item">
          <div class="label">车型</div>
          <div class="value">
            {{ planCommonCarDetailData.vehicle.vehicleTypeVO.name }}·{{
              planCommonCarDetailData.vehicle.vehicleColorStr
            }}
          </div>
        </div>
        <div class="info-item">
          <div class="label">车牌号</div>
          <div class="value">{{ planCommonCarDetailData.vehicle.platNum }}</div>
        </div>
        <div class="info-item">
          <div class="label">座位数</div>
          <div class="value">{{ planCommonCarDetailData.vehicle.vehicleTypeVO.seatNum }}</div>
        </div>
        <div class="info-item">
          <div class="label">同乘人员</div>
          <div class="value">
            <span
v-for="(ele, index) in carAttendeeData"
:key="index"
              >{{ ele.contactPerson }}{{ index == carAttendeeData.length - 1 ? '' : '、' }}</span
            >
            <span>{{ carAttendeeData.length ? '' : '无' }}</span>
          </div>
        </div>
      </div>
      <div class="hotel-info">
        <div class="info-item">
          <div class="label">司机姓名</div>
          <div class="value">{{ planCommonCarDetailData.driverVO.name }}</div>
        </div>
        <div class="info-item" style="border: none">
          <div class="label">联系电话</div>
          <div class="value phone" v-if="planCommonCarDetailData.driverVO.phone.length">
            <div>{{ planCommonCarDetailData.driverVO.phone }}</div>
            <a
              :href="`tel:${planCommonCarDetailData.driverVO.phone}`"
              v-if="planCommonCarDetailData.driverVO.phone.length"
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
    <div class="bottom" v-if="planCommonCarDetailData.pickStatus == 0">
      <!-- 0未接1已接 -->
      <van-button block type="info" @click="confirmAboard">确认上车</van-button>
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
      planCommonCarDetailData: null,
      carAttendeeData: [], // 同乘
      contacterData: [] // 联络人列表
    }
  },
  computed: {},
  created() {
    const planCommonCarDetailData = JSON.parse(this.routeParams.planCommonCarDetailData)
    this.planCommonCarDetailData = planCommonCarDetailData
    this.getCarAttendee()
    this.getContacterData()
  },
  mounted() {},
  methods: {
    // 将时间2021-08-25 18:00:00 处理为 2021.08.25 18:00
    filterDate(time) {
      const str = time.replace(/-/g, '.')
      const newStr = str.slice(0, str.length - 3)
      return newStr
    },
    // 获取用车人员列表
    getCarAttendee() {
      const conferenceId = this.routeParams.conferenceId
      const paramsData = {}
      paramsData.conferenceId = conferenceId
      paramsData.taskId = this.planCommonCarDetailData.id
      this.$api({
        url: 'attendeeApi.getCarAttendee',
        data: paramsData
      }).then(res => {
        if (res.success) {
          const data = res.result.list
          const newArr = []
          data.forEach(item => {
            if (Number(item.id) !== Number(this.routeParams.attendeeId)) {
              newArr.push(item)
            }
          })
          this.carAttendeeData = newArr
        }
      })
    },
    // 查询联络人
    getContacterData() {
      const conferenceId = this.routeParams.conferenceId
      const paramsData = {}
      paramsData.conferenceId = conferenceId
      paramsData.contacterRoleIds = '2'
      this.$api({
        url: 'attendeeApi.getContacter',
        data: paramsData
      }).then(res => {
        if (res.success) {
          const data = res.result.list
          this.contacterData = data
        }
      })
    },

    // 确认上车
    confirmAboard() {
      this.$dialog
        .confirm({
          title: '用车提醒',
          message: `请确认您乘坐车辆的车牌号是"${this.planCommonCarDetailData.vehicle.platNum}"`
        })
        .then(() => {
          console.log(this.planCommonCarDetailData.id)
          this.$api({
            url: 'attendeeApi.updateTaskStatus',
            data: [
              {
                vehicleTaskId: this.planCommonCarDetailData.id,
                attendeeId: Number(this.routeParams.attendeeId)
              }
            ]
          }).then(res => {
            if (res.success) {
              this.$toast(res.message)
              this.planCommonCarDetailData.status = 1
              this.$router.back()
            }
          })
        })
    }
  }
}
</script>

<style scoped lang="scss">
.stay-container {
  background-color: #f2f5fc;
  height: 100%;
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
        width: 90px;
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
  .bottom {
    z-index: 999;
    padding: 10px 16px;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    position: fixed;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .van-button {
      border-radius: 4px;
    }
  }
}
</style>
