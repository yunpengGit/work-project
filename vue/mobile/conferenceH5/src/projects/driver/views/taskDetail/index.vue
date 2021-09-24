<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-07-06 11:28:08
 * @LastEditors: peng
 * @LastEditTime: 2021-07-12 09:36:37
-->
<template>
  <div class="task-detail">
    <div class="group-title">出车任务信息</div>
    <div class="base-info">
      <div class="item">
        <span class="label">任务类型</span>
        <span class="text">{{ task.typeStr }}</span>
      </div>
      <div class="item">
        <span class="label">车型</span>
        <span class="text">{{ task.name }}</span>
      </div>
      <div class="item">
        <span class="label">乘车人数</span>
        <span class="text">{{ task.attendeeCount }}人</span>
      </div>
      <div class="item">
        <span class="label">车牌号</span>
        <span class="text">{{ task.platNum }}</span>
      </div>
      <div class="item">
        <span class="label">接站时间</span>
        <span class="text">{{ task.getOnVehicleTime }}</span>
      </div>
      <div class="item">
        <span class="label">接站地点</span>
        <span class="text">{{ task.startAddress }}</span>
      </div>
      <div class="item">
        <span class="label">送达时间</span>
        <span class="text">{{ task.endTime }}</span>
      </div>
      <div class="item">
        <span class="label">送达地点</span>
        <span class="text">{{ task.endAddress }}</span>
      </div>
    </div>
    <div class="group-title">乘车人信息</div>
    <div class="passenger-info">
      <div class="item" v-for="e in personInfoList" :key="e.id">
        <div class="title">
          <span class="label">{{ (e.arriveFlight || e.returnFlight)?type === '1' ? e.arriveFlight : e.returnFlight:'无班次/车次信息' }}</span>
          <span
          class="text"
          v-if="(e.arriveFlight&&e.arriveTime) || (e.returnFlight&&e.returnTime)"
          @click="flightInfo(e)">获取航班动态<img src="./../../icon/gengduo.svg" class="icon"/></span>
        </div>
        <div class="name">
          <span class="label">乘车人姓名</span>
          <span class="text">{{e.personStr?e.personStr:e.name}}</span>
        </div>
        <div class="arrival-date">
          <span class="label">到达时间</span>
          <span class="text" :class="{'gary': !(e.arriveTime && e.returnTime)}">{{ type === '1' ? (e.arriveTime?e.arriveTime:'暂无信息') : (e.returnTime?e.returnTime:'暂无信息') }}</span>
        </div>
        <div class="arrival-address">
          <span class="label">到达地点</span>
          <span class="text" :class="{'gary': !(e.arriveStation && e.returnStation)}">{{ type === '1' ? (e.arriveStation?e.arriveStation:'暂无信息') : (e.returnStation?e.returnStation:'暂无信息') }}</span>
        </div>
        <div class="contact-person">
          <span class="label">联系人</span>
          <a class="text" :href="`tel:${e.contactPhone}`">
            <img src="./../../icon/dianhua.svg" class="icon" />
            {{e.contactPerson}}({{e.contactPhone | phoneNum}})
          </a>
        </div>
      </div>
    </div>
    <div class="btn">
      <van-button type="info" :disabled="btnDisabled" block @click="changeStatus">
        {{btnText}}
      </van-button>
    </div>
    <van-dialog v-model="dialog.show" :title="dialog.title" show-cancel-button @confirm="dialog.confirm">
      <div class="van-dialog__message"><span>{{dialog.msg}}</span></div>
    </van-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { Dialog } from 'vant'

// 全局注册
Vue.use(Dialog)
export default {
  name: 'Index',
  components: {},
  filters: {
    phoneNum(val) {
      return val.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    }
  },
  data() {
    return {
      dialog: {
        show: false,
        title: '标题',
        msg: 'dialog内容',
        confirm: () => {}
      },
      type: '',
      status: '',
      btnText: '乘客已上车',
      btnDisabled: false,
      task: {
        id: '',
        typeStr: '',
        // 车辆类型
        vehicleTypeStr: '',
        attendeeCount: '',
        // 车牌
        platNum: '',
        getOnVehicleTime: '',
        startAddress: '',
        endTime: '',
        endAddress: ''
      },
      personInfoList: []
    }
  },
  watch: {
    status(n) {
      if (n === 1) {
        this.btnText = '乘客已送达'
      } else if (n === 2) {
        this.btnText = '已完成出车任务'
        this.btnDisabled = true
      }
    }
  },
  mounted() {
    this.id = this.$route.query.id
    this.init()
  },
  methods: {
    init() {
      const params = {
        id: this.id
      }
      const data = {
        url: 'driver.taskDetails',
        data: params
      }
      this.$api(data).then(res => {
        if (res.code === 2000) {
          const {
            type,
            status,
            typeStr,
            attendeeCount,
            getOnVehicleTime,
            startAddress,
            endTime,
            endAddress,
            vehicle,
            vechicleTaskAttendeeMap
          } = res.result
          const { platNum, vehicleTypeVO } = vehicle
          // console.log(vehicleTypeVO)
          const { name } = vehicleTypeVO
          // console.log(typeStr, name, attendeeCount, platNum, getOnVehicleTime, startAddress, endTime, endAddress)
          this.task = {
            typeStr,
            name,
            attendeeCount,
            platNum,
            getOnVehicleTime,
            startAddress,
            endTime,
            endAddress
          }
          const personData = vechicleTaskAttendeeMap
          // console.log(personData)
          // 任务状态 1 接站 2 送站
          this.status = status
          // type 1 接站 2 送站
          this.type = type
          for (const key in personData) {
            let obj = {}
            if (personData[key].length > 1) {
              let personArr = []
              personArr = personData[key].map(e => {
                return e.name
              })
              obj = {
                personStr: personArr.join('、'),
                ...personData[key][0]
              }
            } else {
              obj = personData[key][0]
            }
            this.personInfoList.push(obj)
          }
        }
      })
    },
    flightInfo(e) {
      // 查询航班信息
      const { arriveFlight, arriveTime, returnFlight, returnTime } = e
      let params = {}
      if (arriveFlight) {
        params = {
          arriveFlight,
          arriveTime
        }
      } else {
        params = {
          returnFlight,
          returnTime
        }
      }
      const data = {
        url: 'driver.getFlightNews',
        data: params
      }
      this.$api(data).then(res => {
        console.log(res)
      })
      this.dialog.msg = '内容'
      this.dialog.show = true
    },
    changeStatus() {
      const confirm = () => {
        // console.log(123)
        const data = {
          url: 'driver.updateTaskStatus',
          data: {
            id: this.task.id
          }
        }
        this.$api(data).then(res => {
          if (res.code === 2000) {
            this.status += 1
          }
        })
      }
      if (this.status === 0) {
        this.dialog = {
          show: true,
          title: '任务提醒',
          msg: '请确认已接到所有乘客',
          confirm: confirm
        }
      } else if (this.status === 1) {
        this.dialog = {
          show: true,
          title: '任务提醒',
          msg: '请确认已将所有乘客送达指定地点',
          confirm: confirm
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .van-dialog{
  .van-dialog__header{
    padding-top: 20px;
    font-size: 17px;
    font-weight: 500;
    color: #191F24;
    line-height: 22px;
  }
  .van-dialog__content{
    & > .van-dialog__message{
      padding: 12px 20px 16px;
      text-align: center;
      font-size: 15px;
      color: #191F24;
      line-height: 23px;
      &>span{
        display: inline-block;
        text-align: left;
      }
    }
  }
  .van-dialog__footer{
    .van-button{
      font-size: 17px;
      color: #191F24;
    }
    & > .van-dialog__confirm, .van-dialog__confirm:active{
      color: #1E89FF;
    }
  }
}

@import './../../style/mixin.scss';
.task-detail {
  padding: 0 12px 80px;
  background-color: #f6f6f6;
  .group-title {
    height: 44px;
    font-size: 13px;
    color: rgba(25, 31, 36, 0.64);
    display: flex;
    align-items: center;
  }
  .base-info {
    background: #ffffff;
    border-radius: 8px;
    padding: 0 16px;
    .item {
      position: relative;
      height: 53px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      &:nth-child(n + 2) {
        @include border1px('top');
      }
      .label {
        width: 60px;
        font-size: 15px;
        color: rgba(25, 31, 36, 0.64);
      }
      .text {
        flex: 1;
        text-align: right;
        font-size: 15px;
        font-weight: 500;
        color: #191f24;
        line-height: 20px;
      }
    }
  }
  .passenger-info {
    .item {
      background: #ffffff;
      border-radius: 8px;
      padding-bottom: 10px;
      &:nth-child(n+1){
        margin-top: 16px;
      }
      .title {
        position: relative;
        padding: 0 16px;
        height: 52px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        @include border1px('bottom');
        .label {
          font-size: 18px;
          font-weight: 500;
          color: #191f24;
          line-height: 20px;
        }
        .text {
          font-size: 13px;
          font-weight: 500;
          color: #8090ae;
          display: flex;
          align-items: center;
          & > .icon {
            width: 16px;
            height: 16px;
          }
        }
      }
      .name,
      .arrival-date,
      .arrival-address,
      .contact-person {
        padding: 0 16px;
        height: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .label {
          width: 88px;
          font-size: 15px;
          color: rgba(25, 31, 36, 0.64);
        }
        .text {
          text-align: right;
          flex: 1;
          font-size: 15px;
          color: #191f24;
        }
        .gary{
          color: #bcbcbc;
        }
      }
      .name {
        margin-top: 10px;
      }
      .contact-person {
        .text {
          display: flex;
          justify-content: flex-end;
          .icon {
            width: 16px;
            height: 16px;
            margin-right: 4px;
          }
          font-size: 15px;
          color: #1e89ff;
        }
      }
    }
  }
  .btn {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    height: 64px;
    background: #ffffff;
    box-shadow: 0px 1px 0px 0px rgba(25, 31, 36, 0.08);
    padding: 10px 16px;
  }
}
</style>
