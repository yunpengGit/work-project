<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-07-16 15:44:00
* @LastEditors: Please set LastEditors
* @LastEditTime:
-->
<template>
  <div class="stay-container">
    <div class="hotel-info">
      <div class="info-item">
        <div class="label">用车时间</div>
        <div class="value">
          {{ filterDate(planSpecialCarDetailData.startTime) }} - {{ filterDate(planSpecialCarDetailData.endTime) }}
        </div>
      </div>

      <div class="info-item">
        <div class="label">车型</div>
        <div class="value">
          {{ planSpecialCarDetailData.vehicle.vehicleTypeVO.name }}·{{
            planSpecialCarDetailData.vehicle.vehicleColorStr
          }}
        </div>
      </div>
      <div class="info-item">
        <div class="label">车牌号</div>
        <div class="value">{{ planSpecialCarDetailData.vehicle.platNum }}</div>
      </div>
      <div class="info-item">
        <div class="label">座位数</div>
        <div class="value">{{ planSpecialCarDetailData.vehicle.vehicleTypeVO.seatNum }}</div>
      </div>
      <div class="info-item">
        <div class="label">同乘人员</div>
        <div class="value">
          <span
v-for="(ele, index) in specialCarAttendeeData"
:key="index"
            >{{ ele.contactPerson }}{{ index === specialCarAttendeeData.length - 1 ? '' : '、' }}</span
          >
          <span>{{ specialCarAttendeeData.length ? '-' : '无' }}</span>
        </div>
      </div>
    </div>
    <div class="hotel-info">
      <div class="info-item">
        <div class="label">司机姓名</div>
        <div class="value">{{ planSpecialCarDetailData.driverVO.name }}</div>
      </div>
      <div class="info-item" style="border: none">
        <div class="label">联系电话</div>
        <div class="value phone" v-if="planSpecialCarDetailData.driverVO.phone.length">
          <div>{{ planSpecialCarDetailData.driverVO.phone }}</div>
          <a
            :href="`tel:${planSpecialCarDetailData.driverVO.phone}`"
            v-if="planSpecialCarDetailData.driverVO.phone.length"
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
      planSpecialCarDetailData: null,
      specialCarAttendeeData: [], // 同乘
      contacterData: [] // 联络人列表
    }
  },
  computed: {},
  created() {
    const planSpecialCarDetailData = JSON.parse(this.routeParams.planSpecialCarDetailData)
    this.planSpecialCarDetailData = planSpecialCarDetailData
    this.getSpecialCarAttendee()
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
    getSpecialCarAttendee() {
      const conferenceId = this.routeParams.conferenceId
      const paramsData = {}
      paramsData.conferenceId = conferenceId
      paramsData.taskId = this.planSpecialCarDetailData.id
      this.$api({
        url: 'attendeeApi.getSpecialCarAttendee',
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
          this.specialCarAttendeeData = newArr
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
    padding-left: 18px;
    .info-item {
      font-size: 14px;
      display: flex;
      align-items: center;
      padding: 16px 24px 16px 0;
      border-bottom: 1px solid #f1f1f2;
      .label {
        width: 70px;
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
