<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-07-06 11:28:08
 * @LastEditors: peng
 * @LastEditTime: 2021-07-12 10:02:47
-->
<template>
  <div class="task-detail" :style="{ 'padding-bottom': personInfoList.length ? '74px' : '0px' }">
    <div class="group-title">出车任务信息</div>
    <div class="base-info">
      <div class="base-item">
        <span class="label">任务类型</span>
        <span class="text">{{ task.typeStr }}</span>
      </div>
      <div class="base-item">
        <span class="label">车型</span>
        <span class="text">{{ task.name }}</span>
      </div>
      <div class="base-item">
        <span class="label">乘车人数</span>
        <span class="text">{{ task.attendeeCount || 0 }}人</span>
      </div>
      <div class="base-item">
        <span class="label">车牌号</span>
        <span class="text">{{ task.platNum }}</span>
      </div>
      <div class="base-item">
        <span class="label">接站时间</span>
        <span class="text">{{ formatCode(task.getOnVehicleTime) }}</span>
      </div>
      <div class="base-item">
        <span class="label">接站地点</span>
        <span
class="text"
          >{{ task.startAddress
          }}<span v-if="task.getOnVehicleAddress.length">({{ task.getOnVehicleAddress }})</span></span
        >
      </div>
      <div class="base-item">
        <span class="label">送达时间</span>
        <span class="text">{{ formatCode(task.endTime) }}</span>
      </div>
      <div class="base-item">
        <span class="label">送达地点</span>
        <span class="text">{{ task.endAddress }}</span>
      </div>
    </div>
    <div class="group-title" v-if="personInfoList.length">乘车人信息</div>
    <div class="passenger-info">
      <template v-if="task.type === '3'">
        <div class="passenger-item" style="padding: 8px 0 0 0" v-for="e in personInfoList" :key="e.id">
          <div class="name">
            <span class="label">乘车人</span>
            <span class="text">{{ e.personStr ? e.personStr : e.name }}</span>
          </div>
          <div class="contact-person">
            <span class="label">联系人</span>
            <a class="text" :href="`tel:${e.contactPhone}`">
              {{ e.contactPerson }}({{ e.contactPhone | phoneNum }})
              <img src="@/assets/images/phone.svg" class="icon" />
            </a>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="passenger-item" v-for="e in personInfoList" :key="e.id">
          <div class="title">
            <span class="label">{{
              e.arriveFlight || e.returnFlight
                ? type === '1'
                  ? e.arriveFlight || '无班次/车次信息'
                  : e.returnFlight || '无班次/车次信息'
                : '无班次/车次信息'
            }}</span>
            <!-- v-if="(e.arriveFlight && e.arriveTime) || (e.returnFlight && e.returnTime)" -->
            <span
class="text"
v-show="e.showFlightBtn"
@click="flightInfo(e)"
              >获取航班动态<img
src="./../icon/gengduo.svg"
class="icon"
            /></span>
          </div>
          <div class="name">
            <span class="label">乘车人</span>
            <span class="text">{{ e.personStr ? e.personStr : e.name }}</span>
          </div>
          <div class="arrival-date">
            <span class="label">到达时间</span>
            <span class="text" :class="{ gary: (type === '1' && !e.arriveTime) || (type === '2' && !e.returnTime) }">{{
              type === '1'
                ? e.arriveTime
                  ? formatCode(e.arriveTime)
                  : '暂无信息'
                : e.returnTime
                ? formatCode(e.returnTime)
                : '暂无信息'
            }}</span>
          </div>
          <div class="arrival-address">
            <span class="label">到达地点</span>
            <span class="text" :class="{ gary: (type === '1' && !e.arriveStation) || (type === '2' && !e.returnStation) }">{{
              type === '1'
                ? e.arriveStation
                  ? e.arriveStation
                  : '暂无信息'
                : e.returnStation
                ? e.returnStation
                : '暂无信息'
            }}</span>
          </div>
          <div class="contact-person">
            <span class="label">联系人</span>
            <a class="text" :href="`tel:${e.contactPhone}`">
              {{ e.contactPerson }}({{ e.contactPhone | phoneNum }})
              <img src="@/assets/images/phone.svg" class="icon" />
            </a>
          </div>
        </div>
      </template>
    </div>
    <div class="btn" v-if="personInfoList.length">
      <van-button type="info" :disabled="btnDisabled" block @click="changeStatus">
        {{ btnText }}
      </van-button>
    </div>
    <van-dialog
      v-model="dialog.show"
      :title="dialog.title"
      show-cancel-button
      @confirm="dialog.confirm"
      confirmButtonText="我知道了"
      :showCancelButton="false"
    >
      <div class="van-dialog__message">
        <span>{{ dialog.msg1 }}</span>
        <span>{{ dialog.msg2 }}</span>
        <span>{{ dialog.msg3 }}</span>
        <div style="text-align: center">{{ dialog.msg }}</div>
      </div>
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
  props: {
    routeParams: {
      type: Object
    }
  },
  components: {},
  filters: {
    phoneNum(val) {
      return val.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    }
  },
  data() {
    return {
      id: '', // 任务id
      dialog: {
        show: false,
        title: '航班动态',
        msg1: '',
        msg2: '',
        msg3: '',
        msg: '',
        confirm: () => {}
      },
      type: '',
      status: '',
      btnText: '乘客已上车',
      btnDisabled: false,
      task: {
        typeStr: '',
        // 车辆类型
        attendeeCount: '',
        // 车牌
        platNum: '',
        getOnVehicleTime: '',
        startAddress: '',
        endTime: '',
        endAddress: '',
        getOnVehicleAddress: '',
        type: ''
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
    this.id = this.routeParams.id
    this.init()
  },
  methods: {
    flightInfo(e) {
      // 查询航班信息
      const { arriveFlight, arriveTime, returnFlight, returnTime } = e
      let params = {}
      if (arriveFlight) {
        params = {
          fnum: arriveFlight,
          querydate: arriveTime
        }
      } else {
        params = {
          fnum: returnFlight,
          querydate: returnTime
        }
      }
      const data = {
        url: 'driver.getFlightNews',
        data: params
      }
      this.$api(data).then(res => {
        this.dialog.show = true
        const result = res.result.model.flightStatusList[0]
        // 起飞/计划
        this.dialog.msg1 = `起飞/计划：${result.airlineName}${result.airlineCode}预计${result.etd}到达${result.deptAirportName}${result.deptTerminal || '--'}`
        // 延误
        const d1 = new Date(result.destFlightDate + ' ' + result.eta)
        const d2 = new Date(result.destFlightDate + ' ' + result.sta)
        const delayMin = parseInt(d2 - d1) / 1000 / 60
        this.dialog.msg2 = `延误：${result.airlineName}${result.airlineCode}预计${result.eta}到达${result.destAirportName}${result.destTerminal}，延误${delayMin}分钟`
        // 到达
        this.dialog.msg3 = `到达：${result.airlineName}${result.airlineCode}已到达${result.destAirportName}${
          result.destTerminal
        }，实际到达时间${result.ata || '--'}`
      })
    },
    // 将 2020-01-02 00:00:00 处理为 2020年01月01日 00:00
    formatCode(start) {
      const startStr = start.replace('-', '年').replace('-', '月')
      const startNewStr = startStr.slice(0, 10) + '日 ' + startStr.slice(11, 16)
      return startNewStr
    },
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
            vechicleTaskAttendeeMap,
            getOnVehicleAddress
          } = res.result
          const { platNum, vehicleTypeVO } = vehicle
          const { name } = vehicleTypeVO
          this.task = {
            typeStr,
            name,
            attendeeCount,
            platNum,
            getOnVehicleTime,
            startAddress,
            endTime,
            endAddress,
            getOnVehicleAddress,
            type
          }
          const personData = vechicleTaskAttendeeMap
          // 任务状态 1 接站 2 送站
          this.status = status
          // type 1 接站 2 送站
          this.type = type
          const arr = []
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
            arr.push(obj)
          }
          arr.forEach(item => {
            item.showFlightBtn = false
          })
          this.personInfoList = arr
          // 根据接口判断是否展示[航班动态按钮]
          this.personInfoList.forEach(item => {
            if ((item.arriveFlight && item.arriveTime) || (item.returnFlight && item.returnTime)) {
              const { arriveFlight, arriveTime, returnFlight, returnTime } = item
              let params = {}
              if (arriveFlight) {
                params = {
                  fnum: arriveFlight,
                  querydate: arriveTime.slice(0, 10)
                }
              } else {
                params = {
                  fnum: returnFlight,
                  querydate: returnTime.slice(0, 10)
                }
              }
              const data = {
                url: 'driver.getFlightNews',
                data: params
              }
              this.$api(data).then(res => {
                if (res.code === 2000) {
                  const code = res.result.model.errCode
                  console.log(code)
                  if (code === '0') {
                    item.showFlightBtn = true
                  }
                }
              })
            }
          })
        }
      })
    },

    changeStatus() {
      const confirm = () => {
        const id = this.routeParams.id
        const data = {
          url: 'driver.updateTaskStatus',
          data: {
            id
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
::v-deep .van-dialog {
  .van-dialog__header {
    padding-top: 20px;
    font-size: 17px;
    font-weight: 500;
    color: #191f24;
    line-height: 22px;
  }
  .van-dialog__content {
    & > .van-dialog__message {
      padding: 12px 20px 16px;
      text-align: left;
      font-size: 15px;
      color: #191f24;
      line-height: 23px;
      & > span {
        display: inline-block;
        text-align: left;
        margin-bottom: 5px;
      }
    }
  }
  .van-dialog__footer {
    .van-button {
      font-size: 17px;
      color: #191f24;
    }
    & > .van-dialog__confirm,
    .van-dialog__confirm:active {
      color: #1e89ff;
    }
  }
}

@import './../style/mixin.scss';
.task-detail {
  font-size: 15px;
  background-color: #f6f6f6;
  .group-title {
    height: 44px;
    font-size: 13px;
    padding-left: 24px;
    color: rgba(25, 31, 36, 0.64);
    display: flex;
    align-items: center;
  }
  .base-info {
    background: #ffffff;
    margin-bottom: 12px;
    padding-left: 24px;
    .base-item {
      display: flex;
      padding: 19px 24px 19px 0;
      border-bottom: 1px solid #f1f1f2;
      .label {
        width: 82px;
        color: rgba(25, 31, 36, 0.64);
      }
      .text {
        flex: 1;
        color: #191f24;
      }
      .phone {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
  .passenger-info {
    .passenger-item {
      background: #ffffff;
      border-radius: 8px;
      padding-bottom: 10px;
      margin-bottom: 12px;
      &:last-child {
        margin-bottom: 0;
      }
      .title {
        position: relative;
        padding: 0 24px;
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
        padding: 0 24px;
        height: 32px;
        display: flex;
        // align-items: center;
        .label {
          width: 82px;
          color: rgba(25, 31, 36, 0.64);
        }
        .text {
          // text-align: right;
          flex: 1;
          color: #191f24;
        }
        .gary {
          color: #bcbcbc;
        }
      }
      .name {
        margin-top: 10px;
      }
      .contact-person {
        .text {
          display: flex;
          justify-content: space-between;
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
    .van-button {
      border-radius: 4px;
      font-size: 18px;
    }
  }
}
</style>
