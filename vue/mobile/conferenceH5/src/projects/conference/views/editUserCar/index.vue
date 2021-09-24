<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 20:09:53
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-26 16:39:01
-->
<template>
  <div class="add-driver-container">
    <van-form>
      <h3>用车信息</h3>
      <van-cell-group>
        <van-field
          readonly
          required
          v-model="paramsVal.typeVal"
          label="任务类型"
          placeholder="请选择任务类型"
          input-align="right"
          right-icon="arrow"
          @click="typeChoice"
        />
         <!-- <van-field
          readonly
          required
          v-model="params.startTime"
          label="出发时间"
          placeholder="请选择出发时间"
          input-align="right"
          right-icon="arrow"
          @click="dateStartShow = true"
        /> -->
        <van-field
          readonly
          required
          v-model="params.getOnVehicleTime"
          :label="startLabel"
          :placeholder="startLabelTips"
          input-align="right"
          right-icon="arrow"
          @click="dateEndShow = true"
        />
        <van-field
          readonly
          required
          v-model="params.startAddress"
          :label="startPlace"
          :placeholder="startPlaceTips"
          @click="placeChoice(startPlaceTips, 0)"
          input-align="right"
        />
        <van-field
          v-model="params.getOnVehicleAddress"
          label="详细位置"
          placeholder="请输入详细位置"
          input-align="right"
        />
        <van-field
          readonly
          required
          v-model="params.endTime"
          :label="endLabel"
          :placeholder="endLabelTips"
          input-align="right"
          right-icon="arrow"
          @click="dateArriveShow = true"
        />
        <van-field
          readonly
          required
          v-model="params.endAddress"
          :label="endPlace"
          :placeholder="endPlaceTips"
          @click="placeChoice(endPlaceTips, 1)"
          input-align="right"
        />
      </van-cell-group>
    </van-form>
    <van-form>
      <h3>车辆信息</h3>
      <van-cell-group>
        <van-field
          readonly
          required
          v-model="paramsVal.carCard"
          label="车牌号"
          :placeholder="paramsVal.carCardTips"
          input-align="right"
          right-icon="arrow"
          @click="carsChoiceShow"
        />
        <van-field
          readonly
          v-model="paramsVal.carName"
          placeholder="请选择车牌号"
          label="车辆品牌"
          input-align="right"
        />
        <van-field
          readonly
          v-model="paramsVal.seatNum"
          placeholder="请选择车牌号"
          label="座位数"
          input-align="right"
        />
        <van-field
          readonly
          v-model="paramsVal.color"
          placeholder="请选择车牌号"
          label="颜色"
          input-align="right"
        />
      </van-cell-group>
    </van-form>
    <van-form>
      <h3>司机信息</h3>
      <van-cell-group>
        <van-field
          readonly
          required
          v-model="paramsVal.driverName"
          label="姓名"
          :placeholder="paramsVal.driverNameTips"
          input-align="right"
          right-icon="arrow"
          @click="driversChoiceShow"
        />
        <van-field
          readonly
          v-model="paramsVal.driverPhone"
          placeholder="请选择司机"
          label="手机号"
          input-align="right"
        />
      </van-cell-group>
    </van-form>
    <div class="form-item">
      <h3>备注</h3>
      <textarea v-model="params.description" placeholder="请填写备注信息"></textarea>
    </div>
    <van-action-sheet
      v-model="actionShow"
      :actions="actions"
      close-on-click-action
      cancel-text="取消"
      @select="onSelect"
    />
    <van-popup v-model="dateStartShow" position="bottom" :style="{ width: '100%' }" round>
      <van-picker show-toolbar title="选择出发时间" :columns="columnsStart" @confirm="startChoice" @cancel="dateStartShow = false"/>
    </van-popup>
    <van-popup v-model="dateEndShow" position="bottom" :style="{ width: '100%' }" round>
      <van-picker show-toolbar title="选择上车时间" :columns="columnsEnd" @confirm="endChoice" @cancel="dateEndShow = false"/>
    </van-popup>
    <van-popup v-model="dateArriveShow" position="bottom" :style="{ width: '100%' }" round>
      <van-picker show-toolbar title="选择送达时间" :columns="columnsArrive" @confirm="arriveChoice" @cancel="dateArriveShow = false"/>
    </van-popup>
    <div class="single-btn-bottom">
      <van-button
        @click="cancelTask"
      >取消任务</van-button>
      <van-button
        type="info"
        @click="submit"
      >保存</van-button>
    </div>
    <div class="cars-choice-container" v-if="carsChoiceFlag || driversChoiceFlag">
      <cars
        v-if="carsChoiceFlag"
        :routeParams="routeParams"
        @getCarsData="getCarsData"
        @closePopup="closePopup"
      />
      <drivers
        v-if="driversChoiceFlag"
        :routeParams="routeParams"
        :startTime="params.startTime"
        :endTime="params.endTime"
        @getDriversData="getDriversData"
        @closePopup="closePopup"
      />
    </div>
    <van-popup v-model="attendantShow" position="bottom" :style="{ width: '100%', height: '60%' }" round @close="attendantClose" :close-on-click-overlay="false">
      <div class="attendant-container">
        <h3>
          <div @click="attendantShow = false" class="cancel">
            <!-- <van-icon name="arrow-left" /> -->
            <span>取消</span>
          </div>
          <div class="title">{{ placeIndex === 0 ? startPlace : endPlace }}</div>
          <div class="confirm" v-if="attendantVal.trim()" @click="placeComfire">确定</div>
        </h3>
        <van-search class="placeSearch" v-model="attendantVal" left-icon="" :placeholder="placeSearchTips" @search="attendantSearch" @input="attendantSearch"/>
        <div class="attendant-result-container" v-if="attendantResult.length">
          <div class="attendant-result" v-for="(ele, index) in attendantResult" :key="index" @click="choiceAttendant(ele)">
            <div class="name">{{ ele }}</div>
            <i/>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import cars from './cars'
import drivers from './drivers'
export default {
  components: {
    cars, drivers
  },
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      attendantShow: false,
      attendantVal: '',
      attendantResult: [],
      placeSearchTips: '',
      startLabel: '',
      endLabel: '',
      startLabelTips: '',
      endLabelTips: '',
      startPlace: '',
      startPlaceTips: '',
      endPlace: '',
      endPlaceTips: '',
      // 选择车型
      carsChoiceFlag: false,
      // 选择司机
      driversChoiceFlag: false,
      dateStartShow: false,
      dateEndShow: false,
      dateArriveShow: false,
      // 选择的开始时间
      choiceStartTime: '',
      // 选择的结束时间
      choiceEndTime: '',
      // 选择的送达时间
      choiceArriveTime: '',
      columnsStart: [
        {
          values: [],
          defaultIndex: 2
        },
        {
          values: ['0时', '1时', '2时', '3时', '4时', '5时', '6时', '7时', '8时', '9时', '10时', '11时', '12时', '13时', '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时', '22时', '23时'],
          defaultIndex: 1
        },
        {
          values: [],
          defaultIndex: 1
        }
      ],
      columnsEnd: [
        {
          values: [],
          defaultIndex: 2
        },
        {
          values: ['0时', '1时', '2时', '3时', '4时', '5时', '6时', '7时', '8时', '9时', '10时', '11时', '12时', '13时', '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时', '22时', '23时'],
          defaultIndex: 1
        },
        {
          values: [],
          defaultIndex: 1
        }
      ],
      columnsArrive: [
        {
          values: [],
          defaultIndex: 2
        },
        {
          values: ['0时', '1时', '2时', '3时', '4时', '5时', '6时', '7时', '8时', '9时', '10时', '11时', '12时', '13时', '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时', '22时', '23时'],
          defaultIndex: 1
        },
        {
          values: [],
          defaultIndex: 1
        }
      ],
      // sheet弹窗
      actionShow: false,
      actions: [
        { name: '接站用车', type: 1 },
        { name: '会议用车', type: 3 },
        { name: '送站用车', type: 2 }
      ],
      paramsVal: {
        // 任务类型
        typeVal: '',
        // 车牌号
        carCard: '',
        // 车辆品牌
        carName: '',
        // 座位数
        seatNum: '',
        // 颜色
        color: '',
        // 司机姓名
        driverName: '',
        // 司机手机号
        driverPhone: '',
        carCardTips: '请先选择上车时间',
        driverNameTips: '请先选择车牌号'
      },
      params: {
        conferenceId: '',
        // 任务类型：接站用车1 会议用车3 送站用车2
        type: '',
        // 出发时间
        startTime: '',
        // 上车时间
        getOnVehicleTime: '',
        // 送达时间
        endTime: '',
        // 上车地点
        startAddress: '',
        // 详细位置
        getOnVehicleAddress: '',
        // 送达地点
        endAddress: '',
        publish: 0,
        // 08月17日 下午 送站用车
        title: '',
        // 备注
        description: '',
        // 司机id
        driverId: '',
        // 车辆id
        vehicleId: ''
      },
      // 当前点击的是上车地点还是下车地点
      placeIndex: null
    }
  },
  created() {
    console.log(this.routeParams)
    const conferenceId = this.routeParams.conferenceId
    this.params.conferenceId = conferenceId
    const id = this.routeParams.id
    this.$api({
      url: 'manage.getUserCarDetail',
      data: {
        id
      }
    }).then(res => {
      if (res.code === 2000) {
        const data = res.result
        this.params.type = data.type
        let startName = ''
        let endName = ''
        if (this.params.type === 1) {
          startName = '接站'
          endName = '送达'
        } else if (this.params.type === 2) {
          startName = '上车'
          endName = '返程'
        } else if (this.params.type === 3) {
          startName = '上车'
          endName = '送达'
        } else {
          startName = '上车'
          endName = '送达'
        }
        this.startLabel = `${startName}时间`
        this.startLabelTips = `请选择${startName}时间`
        this.endLabel = `${endName}时间`
        this.endLabelTips = `请选择${endName}时间`
        this.startPlace = `${startName}地点`
        this.startPlaceTips = `请输入${startName}地点`
        this.endPlace = `${endName}地点`
        this.endPlaceTips = `请输入${endName}地点`
        this.paramsVal.typeVal = data.typeStr
        this.params.startTime = data.startTime
        this.params.endTime = data.endTime
        this.params.getOnVehicleTime = data.getOnVehicleTime
        this.params.startAddress = data.startAddress
        this.params.getOnVehicleAddress = data.getOnVehicleAddress
        this.params.description = data.description
        this.params.endAddress = data.endAddress
        this.params.driverId = data.driverId
        this.params.vehicleId = data.vehicle.id
        this.paramsVal.carCard = data.vehicle.platNum
        this.paramsVal.carName = data.vehicle.vehicleTypeVO.name
        this.paramsVal.seatNum = data.vehicle.vehicleTypeVO.seatNum
        this.paramsVal.color = data.vehicle.vehicleColorStr
        this.paramsVal.driverName = data.driverVO.name
        this.paramsVal.driverPhone = data.driverVO.phone
      }
    })
    // 获取日程可选择的时间范围
    this.getAgendaDate('columnsStart')
    this.getAgendaDate('columnsEnd')
    this.getAgendaDate('columnsArrive')
  },
  methods: {
    placeComfire() {
      this.placeChoiceHandler(this.attendantVal.trim())
    },
    // 上车地点/下车地点输入框防抖处理
    throttle(query, method, time = 300) {
      clearTimeout(method.tId)
      method.tId = setTimeout(() => {
        method.call(method, query)
      }, time)
    },
    // 寻找父节点下的某个子节点是否存在 存在返回该子节点DOM 不存在返回false 第一个参数传父元素DOM 第二个参数传需要搜寻的子节点的类名（不带点）
    findEle(parendNode, nodeClass) {
      if (!parendNode || !nodeClass) {
        return false
      }
      let result = null
      const recursFunc = (parendNode, nodeClass) => {
        const childNode = parendNode.childNodes
        if (!childNode.length) {
          return
        }
        for (let i = 0; i < childNode.length; i++) {
          if (Array.from(childNode[i].classList).includes(nodeClass)) {
            result = childNode[i]
            return
          } else {
            recursFunc(childNode[i], nodeClass)
          }
        }
      }
      recursFunc(parendNode, nodeClass)
      return result
    },
    // 点击上车地点/下车地点事件
    placeChoice(tips, index) {
      this.placeSearchTips = tips
      this.attendantShow = true
      this.placeIndex = index
      setTimeout(() => {
        try {
          const searchEle = this.findEle(document.querySelector('.placeSearch'), 'van-field__control')
          searchEle && searchEle.focus()
        } catch (e) {
          // alert(e)
        }
      }, 200)
      // 如果之前填写过 需要回显
      if (index === 0) {
        this.attendantVal = this.params.startAddress
      } else if (index === 1) {
        this.attendantVal = this.params.endAddress
      }
      this.attendantVal && this.throttle(this.attendantVal, this.getPlace)
    },
    // 上车地点/送达地点 弹窗关闭回调
    attendantClose() {
      this.attendantResult = []
      this.attendantVal = ''
    },
    // 上车地点/下车地点接口获取
    getPlace(queryString) {
      const conferenceId = this.routeParams.conferenceId
      const addressLike = queryString.trim()
      this.$api({
        url: 'manage.getPlace',
        data: {
          conferenceId, addressLike
        }
      }).then(res => {
        const data = res.result.list
        this.attendantResult = data
      })
    },
    // 上车地点/送达地点 搜索事件
    attendantSearch(val) {
      // if (val.trim()) {
      this.throttle(val, this.getPlace)
      // }
    },
    // 上车地点/送达地点 搜索结果点击事件
    choiceAttendant(ele) {
      this.placeChoiceHandler(ele)
    },
    placeChoiceHandler(val) {
      if (this.placeIndex === 0) {
        this.params.startAddress = val
      } else if (this.placeIndex === 1) {
        this.params.endAddress = val
      }
      this.attendantShow = false
    },
    typeChoice() {
      this.actionShow = true
    },
    // 取消任务
    cancelTask() {
      this.$dialog.confirm({
        title: `取消用车任务`,
        message: '确认取消？',
        className: 'customDialog'
      }).then(() => {
        const id = this.routeParams.id
        this.$api({
          url: 'desk.deleteUserCar',
          data: [id]
        }).then(res => {
          if (res.code === 2000) {
            this.$toast('取消任务成功')
            setTimeout(() => {
              this.$router.go(-1)
            }, 300)
          }
        }).catch(err => {
          this.$toast(err.message)
        })
      }).catch(() => {
        this.$toast('取消操作')
      })
    },
    closePopup() {
      this.carsChoiceFlag = false
      this.driversChoiceFlag = false
    },
    driversChoiceShow() {
      if (!this.params.vehicleId) {
        this.$toast(this.paramsVal.driverNameTips)
      } else {
        this.driversChoiceFlag = true
      }
    },
    carsChoiceShow() {
      if (!this.params.startTime) {
        this.$toast(`请选择${this.startLabel}`)
      } else if (!this.params.endTime) {
        this.$toast(`请选择${this.endLabel}`)
      } else {
        this.carsChoiceFlag = true
      }
    },
    // 选择出发时间或送达时间的时候 需要重置车辆信息和司机信息
    resetCarInfo() {
      this.params.driverId = ''
      this.paramsVal.driverName = ''
      this.paramsVal.driverPhone = ''
      this.params.vehicleId = ''
      this.paramsVal.carCard = ''
      this.paramsVal.carName = ''
      this.paramsVal.seatNum = ''
      this.paramsVal.color = ''
    },
    getDriversData(ele) {
      this.params.driverId = ele.id
      this.paramsVal.driverName = ele.name
      this.paramsVal.driverPhone = ele.phone
      this.driversChoiceFlag = false
    },
    getCarsData(ele) {
      this.params.vehicleId = ele.id
      this.paramsVal.carCard = ele.platNum
      this.paramsVal.carName = ele.vehicleTypeVO.name
      this.paramsVal.seatNum = ele.vehicleTypeVO.seatNum
      this.paramsVal.color = ele.vehicleColorStr
      // 选择车辆信息 顺便将司机的数据带过来
      if (ele.driverId) {
        this.params.driverId = ele.driverVO.id
        this.paramsVal.driverName = ele.driverVO.name
        this.paramsVal.driverPhone = ele.driverVO.phone
      }
      this.carsChoiceFlag = false
      this.paramsVal.driverNameTips = '请选择司机信息'
    },
    // 出发时间-上车时间-送达时间 验证 规则：出发时间 < 上车时间 < 送达时间
    dateCheck() {
      // const startTime = this.params.startTime
      const getOnVehicleTime = this.params.getOnVehicleTime
      const endTime = this.params.endTime
      // const startTimeFormat = startTime ? new Date(startTime).getTime() : ''
      const getOnVehicleTimeFormat = getOnVehicleTime ? new Date(getOnVehicleTime).getTime() : ''
      const endTimeFormat = endTime ? new Date(endTime).getTime() : ''
      if (getOnVehicleTime && endTime) {
        if (getOnVehicleTimeFormat > endTimeFormat) {
          this.$dialog.alert({
            message: `${this.startLabel}不得早于${this.endLabel}，请重新选择`
          }).then(() => {
            // this.params.endTime = ''
            // this.choiceArriveTime = ''
          })
          return false
        }
      }
      return true
    },
    // 结束日期选择
    endChoice(val) {
      const choiceEndTime = this.formatCodeSymbol(val[0], val[1], val[2])
      this.choiceEndTime = choiceEndTime
      this.params.getOnVehicleTime = this.choiceEndTime
      this.params.startTime = this.params.getOnVehicleTime
      this.dateEndShow = false
      this.dateCheck()
      if (this.params.endTime) {
        return
      }
      const yearIndex = this.columnsArrive[0].values.findIndex(ele => ele === val[0])
      this.columnsArrive[0].defaultIndex = yearIndex
      const hourIndex = this.columnsArrive[1].values.findIndex(ele => ele === val[1])
      this.columnsArrive[1].defaultIndex = hourIndex
      const minuteIndex = this.columnsArrive[2].values.findIndex(ele => ele === val[2])
      this.columnsArrive[2].defaultIndex = minuteIndex
    },
    // 开始日期选择
    startChoice(val) {
      const choiceStartTime = this.formatCodeSymbol(val[0], val[1], val[2])
      // 如果送达时间改变了 则清空车辆信息和司机信息
      if (!(this.choiceStartTime && (new Date(this.choiceStartTime).getTime()) === (new Date(choiceStartTime).getTime()))) {
        this.resetCarInfo()
      }
      this.choiceStartTime = choiceStartTime
      this.params.startTime = this.choiceStartTime
      this.dateStartShow = false
      this.dateCheck()
      if (this.params.getOnVehicleTime) {
        return
      }
      const yearIndex = this.columnsEnd[0].values.findIndex(ele => ele === val[0])
      this.columnsEnd[0].defaultIndex = yearIndex
      const hourIndex = this.columnsEnd[1].values.findIndex(ele => ele === val[1])
      this.columnsEnd[1].defaultIndex = hourIndex
      const minuteIndex = this.columnsEnd[2].values.findIndex(ele => ele === val[2])
      this.columnsEnd[2].defaultIndex = minuteIndex
      if (!this.params.endTime) {
        // this.paramsVal.carCardTips = `请先选择${}`
      } else {
        if (this.params.startTime) {
          this.paramsVal.carCardTips = '请选择车牌号'
        }
      }
      // carCardTips
    },
    // 送达时间选择
    arriveChoice(val) {
      this.dateArriveShow = false
      const choiceArriveTime = this.formatCodeSymbol(val[0], val[1], val[2])
      // 如果送达时间改变了 则清空车辆信息和司机信息
      if (!(this.choiceArriveTime && (new Date(this.choiceArriveTime).getTime()) === (new Date(choiceArriveTime).getTime()))) {
        this.resetCarInfo()
      }
      console.log(this.choiceArriveTime, choiceArriveTime)
      this.choiceArriveTime = choiceArriveTime
      this.params.endTime = this.choiceArriveTime
      this.dateCheck()
      if (!this.params.startTime) {
        // this.paramsVal.carCardTips = '请先选择接站时间'
      } else {
        if (this.params.endTime) {
          this.paramsVal.carCardTips = '请选择车牌号'
        }
      }
    },
    getAgendaDate(type) {
      for (let i = 0; i < 60; i++) {
        let minute = i
        if (i < 10) {
          minute = `0${i}`
        }
        this[type][2].values.push(`${minute}分`)
      }
      const calendarYear = this[type][0].values
      const calendarHour = this[type][1].values
      const calendarMinute = this[type][2].values
      const startTime = this.routeParams.startTime
      const endTime = this.routeParams.endTime
      const startDay = startTime.slice(0, 10)
      const endDay = endTime.slice(0, 10)
      const startHour = `${startTime.slice(-8, -6).replace(/\b(0+)/gi, '')}时`
      const startMinute = `${startTime.slice(-5, -3)}分`
      // 根据会议开始时间向前退两个月
      const prevYearMonthDay = []
      for (let i = 0; i < 61; i++) {
        const now = new Date(startDay)
        const yesterday = new Date(now.setDate(now.getDate() - i))
        prevYearMonthDay.push(this.formatCode(yesterday))
      }
      for (let i = 0; i < prevYearMonthDay.length; i++) {
        this[type][0].values.unshift(prevYearMonthDay[i])
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
        this[type][0].values.push(nowYearMonthDay[i])
      }
      // 根据会议结束向后推两个月
      const NextYearMonthDay = []
      for (let i = 0; i < 61; i++) {
        const now = new Date(endDay)
        const tomorrow = new Date(now.setDate(now.getDate() + i))
        NextYearMonthDay.push(this.formatCode(tomorrow))
      }
      for (let i = 0; i < NextYearMonthDay.length; i++) {
        this[type][0].values.push(NextYearMonthDay[i])
      }
      const filterStartDate = this.formatCode(new Date(startDay))
      const yearIndex = calendarYear.findIndex(ele => ele === filterStartDate)
      this[type][0].defaultIndex = yearIndex
      const hourIndex = calendarHour.findIndex(ele => ele === startHour)
      this[type][1].defaultIndex = hourIndex
      const minuteIndex = calendarMinute.findIndex(ele => ele === startMinute)
      this[type][2].defaultIndex = minuteIndex
    },
    // 将 2020-01-02 转换为 2020年01月01日
    formatCode(date) {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    },
    // 将 2020年01月02日 转换为2020-01-02
    formatCodeSymbol(yearMonthDay, hour, minute) {
      const choiceYearMonthDay = yearMonthDay.slice(0, -1).replace(/([^\u0000-\u00FF])/g, '-')
      const yearMonthDayArr = choiceYearMonthDay.split('-')
      yearMonthDayArr.forEach((ele, index) => {
        if (ele < 10) {
          yearMonthDayArr[index] = `0${ele}`
        }
      })
      const paramsYearMonthDay = yearMonthDayArr.join('-')
      // 将小时转换为两位数
      const choiceHour = hour.replace(/([^\u0000-\u00FF])/g, '')
      const paramsHour = choiceHour < 10 ? `0${choiceHour}` : choiceHour
      const choiceMinute = minute.replace(/([^\u0000-\u00FF])/g, '')
      const finalStartDate = `${paramsYearMonthDay} ${paramsHour}:${choiceMinute}`
      return finalStartDate
    },
    // 计算两个日期之间相差的天数
    getDaysBetween(startTime, endTime) {
      const startDate = Date.parse(startTime)
      const endDate = Date.parse(endTime)
      const days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
      return days
    },
    submit() {
      const params = this.params
      if (!params.type) {
        this.$toast('请选择任务类型')
        return
      } else if (!params.getOnVehicleTime) {
        this.$toast('请选择上车时间')
        return
      } else if (!params.startAddress) {
        this.$toast('请输入上车地点')
        return
      } else if (!params.endTime) {
        this.$toast('请选择送达时间')
        return
      } else if (!params.endAddress) {
        this.$toast('请输入送达地点')
        return
      } else if (!params.vehicleId) {
        this.$toast('请选择车牌号')
        return
      } else if (!params.driverId) {
        this.$toast('请选择司机姓名')
        return
      }
      // 根据与后端协商 隐藏startTime 每次选择getOnVehicleTime时候将getOnVehicleTime值赋值给startTime
      this.params.startTime = this.params.getOnVehicleTime
      const monthDay = params.startTime.slice(5, 10).split('-')
      const month = `${monthDay[0]}月`
      const day = `${monthDay[1]}日`
      const hours = Number(params.startTime.slice(-8).slice(0, 2).replace(/\b(0)/gi, ''))
      let timeSlot = ''
      if (hours >= 0 && hours < 6) {
        timeSlot = '凌晨'
      } else if (hours >= 6 && hours < 8) {
        timeSlot = '清晨'
      } else if (hours >= 8 && hours < 12) {
        timeSlot = '上午'
      } else if (hours >= 12 && hours < 18) {
        timeSlot = '下午'
      } else if (hours >= 18 && hours <= 23) {
        timeSlot = '晚上'
      }
      const title = `${month}${day} ${timeSlot} ${this.paramsVal.typeVal}`
      params.title = title
      const id = this.routeParams.id
      params.id = id
      params.startTime = `${params.startTime}:00`
      params.endTime = `${params.endTime}:00`
      params.getOnVehicleTime = `${params.getOnVehicleTime}:00`
      this.$api({
        url: 'desk.editUserCar',
        data: params
      }).then(res => {
        if (res.code === 2000) {
          this.$toast('编辑用车任务成功')
          setTimeout(() => {
            this.$router.go(-1)
          }, 300)
        }
      }).catch(err => {
        this.$toast(err.message)
      })
      // this.$dialog.confirm({
      //   title: '编辑用车任务',
      //   message: '确认编辑？',
      //   className: 'customDialog'
      // }).then(() => {
      // }).catch(() => {
      //   this.$toast('取消编辑')
      // })
    },
    onSelect(item) {
      this.paramsVal.typeVal = item.name
      this.params.type = item.type
      let startName = ''
      let endName = ''
      if (this.params.type === 1) {
        startName = '接站'
        endName = '送达'
      } else if (this.params.type === 2) {
        startName = '上车'
        endName = '返程'
      } else if (this.params.type === 3) {
        startName = '上车'
        endName = '送达'
      } else {
        startName = '上车'
        endName = '送达'
      }
      this.startLabel = `${startName}时间`
      this.startLabelTips = `请选择${startName}时间`
      this.endLabel = `${endName}时间`
      this.endLabelTips = `请选择${endName}时间`
      this.startPlace = `${startName}地点`
      this.startPlaceTips = `请输入${startName}地点`
      this.endPlace = `${endName}地点`
      this.endPlaceTips = `请输入${endName}地点`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.add-driver-container::v-deep {
  min-height: 100%;
  background-color: #f8f8f8;
  padding: 0 0 74px;
  .van-form {
    padding: 0 12px;
     > h3 {
      width: 100%;
      height: 44px;
      line-height: 44px;
      padding: 0 4px;
      font-size: 13px;
      color: rgba(25, 31, 36, 0.64);
      background-color: transparent;
    }
    .van-cell-group {
      border-radius: 8px;
      overflow: hidden;
      background: #fff;
      .van-cell {
        height: 56px;
        line-height: 56px;
        padding-top: 0;
        padding-bottom: 0;
        // border-bottom: 1px solid #f0f0f1;
      }
    }
  }
  .van-cell--required {
    &::before {
      content: '';
    }
    .van-cell__title {
      width: auto;
      flex: none;
      span {
        position: relative;
        white-space: nowrap;
        &:before {
          position: absolute;
          right: -10px;
          color: #ee0a24;
          font-size: 14px;
          content: '*';
        }
      }
    }
  }
  .form-item {
    padding: 0 12px;
    > h3 {
      width: 100%;
      height: 44px;
      line-height: 44px;
      padding: 0 4px;
      font-size: 13px;
      color: rgba(25, 31, 36, 0.64);
      background-color: transparent;
    }
    textarea {
      width: 100%;
      height: 200px;
      background-color: #fff;
      border-radius: 8px;
      padding: 16px;
      resize: none;
    }
  }
  .van-dialog__content {
    .van-cell {
      line-height: 44px;
    }
  }
  .van-dialog__confirm, .van-dialog__confirm:active {
    color: #1e89ff;
  }
  .single-btn-bottom {
    position: fixed;
  }
  .cars-choice-container {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
    background-color: #fff;
  }
  .single-btn-bottom {
    @include list(row, space-between,center);
    .van-button {
      width: 167px;
    }
  }
  .attendant-container {
    width: 100%;
    height: 100%;
    h3 {
      height: 57px;
      padding: 0 16px;
      @include list(row, space-between, center);
      position: relative;
      .cancel {
        float: left;
        height: 100%;
        @include list(row, flex-start, center);
        // color: #1E89FF;
        color: rgba(25, 31, 36, 0.64);
        font-size: 15px;
        // > span{
          // margin-left: 6px;
        // }
      }
      .title {
        line-height: 57px;
        @include absolute(0,'','',50%);
        transform: translateX(-50%);
        font-size: 17px;
        font-weight: 500;
      }
      .confirm {
        color: #1E89FF;
        font-size: 15px;
      }

    }
    .van-search {
      padding-left: 16px;
      padding-right: 16px;
    }
    .attendant-result-container {
      width: 100%;
      height: calc(100% - 121px);
      position: absolute;
      left: 0;
      top: 121px;
      overflow-y: scroll;
      overflow-x: hidden;
    }
    .attendant-result {
      padding: 16px;
      position: relative;
      margin-bottom: 10px;
      background-color: #fff;
      // overflow: hidden;
      .name {
        font-size: 17px;
        // margin-bottom: 12px;
        span {
          font-size: 14px;
        }
      }
      .phone {
        font-size: 14px;
      }
      i {
        display: block;
        width: calc(100% + 32px);
        height: 10px;
        // background-color: #efeff4;
        background-color: #efeff4;
        @include absolute('','',-10px,0)
      }
    }
  }
}
</style>
