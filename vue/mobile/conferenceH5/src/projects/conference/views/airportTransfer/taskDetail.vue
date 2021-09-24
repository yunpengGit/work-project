
<template>
  <div class="task-detail">
    <div class="group-title">乘车人信息</div>
    <div class="base-info">
      <div class="item">
        <span class="label">乘车人姓名</span>
        <span class="text">{{ task.attendeeName }}</span>
      </div>
      <div class="item">
        <span class="label">联系电话</span>
        <span class="text">{{ task.phone }}</span>
      </div>
      <div class="item">
        <span class="label">职务</span>
        <span class="text">{{ task.position }}</span>
      </div>
      <div class="item">
        <span class="label">单位名称</span>
        <span class="text">{{ task.organizationSortName || task.organizationName }}</span>
      </div>
      <div class="item">
        <span class="label">班次/车次号</span>
        <span class="text" v-if="task.arriveFlight">
          {{ task.arriveFlight }}
          <span class="look" v-if="showFlightBtn" @click="dialog.show = true">获取航班动态 </span>
          <van-icon name="arrow" v-if="showFlightBtn"/>
        </span>
      </div>

      <div class="item">
        <span class="label">{{textConfig.t1[type]}}时间</span>
        <span class="text">{{ task.arriveTime }}</span>
      </div>
      <div class="item">
        <span class="label">{{textConfig.t1[type]}}地点</span>
        <span class="text">{{ task.arriveStation }}</span>
      </div>
    </div>

    <div class="group-title">联系人信息</div>
    <div class="base-info">
      <div class="item">
        <span class="label">联系人姓名</span>
        <span class="text">{{ task.contactPerson }}</span>
      </div>
      <div class="item">
        <span class="label">联系电话</span>
        <a class="text" :href="`tel:${task.contactPhone}`">
          <img src="./icon/dianhua.svg" class="icon" />
          <span class="phone">{{task.contactPhone}}</span>
        </a>
      </div>
    </div>

    <div class="group-title">司机信息</div>
    <div class="base-info">
      <div class="item">
        <span class="label">司机姓名</span>
        <span class="text">{{ task.driverName }}</span>
      </div>
      <div class="item">
        <span class="label">联系电话</span>
        <a class="text" :href="`tel:${task.driverPhone}`">
          <img src="./icon/dianhua.svg" class="icon" />
          <span class="phone">{{task.driverPhone}}</span>
        </a>
      </div>
    </div>

    <div class="group-title">车辆信息</div>
    <div class="base-info">
      <div class="item">
        <span class="label">车型</span>
        <span class="text">{{ task.vehicleTypeName }}</span>
      </div>
      <div class="item">
        <span class="label">车牌号</span>
        <span class="text">{{ task.platNum }}</span>
      </div>
      <div class="item">
        <span class="label">座位数</span>
        <span class="text">{{ task.seatNum }}</span>
      </div>
      <div class="item">
        <span class="label">乘车人数</span>
        <span class="text">
          {{ task.takeNum }}人
          <template v-if="task.takeNum > 1">
            <span class="look" @click="onLookSame">查看同乘人员</span>
            <van-icon name="arrow" />
          </template>
          </span>
      </div>
    </div>

    <div class="btn">
      <van-button type="info" block :disabled="!!task.pickStatus"  @click="changeStatus">已{{textConfig.t2[type]}}乘客</van-button>
    </div>

    <van-dialog
      v-model="dialog.show"
      :title="dialog.title"
      show-cancel-button
      @confirm="updateTransferTask"
      confirmButtonText="更新任务"
      :closeOnClickOverlay="true"
      :showCancelButton="false"
    >
      <div class="van-dialog__message">
        <span>{{ dialog.msg1 }}</span>
        <span>{{ dialog.msg2 }}</span>
        <span>{{ dialog.msg3 }}</span>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'Index',
  components: {},
  filters: {
    phoneNum(val = '') {
      return val.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    }
  },
  data() {
    return {
      task: {
        arriveFlight: '',	// 到达航班
        arriveTime: '',		// 到达时间
        arriveStation: '', // 到达地点
        attendeeName: '',		// 参会人姓名
        contactPerson: '',		// 联系人
        contactPhone: '',		// 联系电话
        deptName: '',		// 部门名称
        deptShortName: '',		// 部门简称
        driverName: '',		// 司机姓名
        driverPhone: '',		// 司机电话
        organizationName: '',		// 公司名称
        organizationSortName: '',	// 公司简称
        phone: '',		// 参会电话
        photoUrl: '',	 // 头像链接
        pickStatus: '',		// 接站状态 0未接站 1接站
        platNum: '',	//	车牌号
        position: '',	// 职务
        remark: '',	//	备注信息
        seatNum: '',	//	座位数
        startTime: '',	//	任务开始时间
        takeNum: '',	//	乘坐人数
        vehicleTaskAttendeeId: '',	// 参会人ID
        vehicleTaskId: '',	//	任务ID
        vehicleTypeName: '' // 车型
      },
      type: '',
      conferenceId: '',
      textConfig: {
        type: {
          1: '接',
          2: '送'
        },
        t1: {
          1: '到达',
          2: '返程'
        },
        t2: {
          1: '接到',
          2: '送出'
        }
      },
      showFlightBtn: false,
      dialog: {
        show: false,
        title: '航班动态',
        msg1: '',
        msg2: '',
        msg3: ''
      },
      flightInfoData: null
    }
  },
  watch: {},
  mounted() {
    this.type = this.$route.query.type // 接机1 or 送机2
    this.conferenceId = this.$route.query.conferenceId
    this.task = JSON.parse(localStorage.getItem('airportTransPeopelInfo'))
    // 初始化即调用航旅纵横接口用于判断用户填写是否为真正航班号
    this.getFlightInfo()
  },
  methods: {
    changeStatus() {
      this.$dialog.confirm({
        title: `${this.textConfig.type[this.type]}站提醒`,
        message: `请确认是否已${this.textConfig.t2[this.type]}乘客`,
        className: 'customDialog'
      }).then(() => {
        this.$api({
          url: 'airportTransfer.updateStatus',
          data: [{
            attendeeId: this.task.vehicleTaskAttendeeId,
            vehicleTaskId: this.task.vehicleTaskId
          }]
        }).then(res => {
          this.$toast(res.message)
          if (res.code === 2000) {
            this.$router.back(-1)
            this.task.pickStatus = 1
          }
        })
      })
    },
    // 查看同乘人员 -- 带入任务日期、时间、车牌号
    onLookSame() {
      this.$router.push({
        name: 'airportTransferPersonInfo',
        query: {
          [this.$enc('type')]: this.$enc(this.type),
          [this.$enc('date')]: this.$enc(this.task.startTime || ''),
          [this.$enc('conferenceId')]: this.$enc(this.conferenceId),
          [this.$enc('vehicleTaskId')]: this.$enc(this.task.vehicleTaskId)
        }
      })
    },
    // 接站获取航班动态
    getFlightInfo() {
      const { arriveFlight, arriveTime } = this.task
      this.$api({
        url: 'airportTransfer.getFlightNews',
        data: {
          fnum: arriveFlight,
          querydate: arriveTime.slice(0, 10)
        }
      }).then(res => {
        if (res.code === 2000) {
          const code = res.result.model.errCode
          const result = res.result.model.flightStatusList[0]
          this.flightInfoData = result
          if (code === '0') {
            this.showFlightBtn = true
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
          }
        }
      }).catch(err => {
        this.$toast(err.message)
      })
    },
    // 更新任务
    updateTransferTask() {
      const ata = String(this.type) === '1' ? this.flightInfoData.ata : this.flightInfoData.atd
      const eta = String(this.type) === '1' ? this.flightInfoData.eta : this.flightInfoData.eta
      const destFlightDate = String(this.type) === '1' ? this.flightInfoData.destFlightDate : this.flightInfoData.deptFlightDate
      this.$api({
        url: 'airportTransfer.updateTask',
        data: {
          ata: ata || eta,	// 实际到达时间，格式：HH:mm
          destFlightDate,	// 到达日期，格式：yyyy-MM-dd
          vehicleTaskAttendeeId: this.task.vehicleTaskAttendeeId	// 分配乘车参会人ID
        }
      }).then(res => {
        this.$toast(res.message)
        if (res.code === 2000) {
          this.task.arriveTime = `${destFlightDate} ${ata || eta}:00`
        }
      }).catch(err => {
        this.$toast(err.message)
      })
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
        margin-bottom: 5px;
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

@import './style/mixin.scss';
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
      justify-content: space-between;
      align-items: center;
      &:nth-child(n + 2) {
        @include border1px('top');
      }
      .label {
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
        display: flex;
        align-items: center;
        justify-content: flex-end;
        img {
          display: inline-block;
        }
        .phone {
          color: #1E89FF;
          margin-left: 3px;
        }
        .look {
          color: #1E89FF;
          position: relative;
          padding: 0 3px 0 25px;
          &:before {
            content: '';
            width: 1Px;
            height: 16px;
            background: #ECEDED;
            position:absolute;
            left: 12px;
            top: 2px;
          }
        }
        i {
          color: #A8B0B9;
        }
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
