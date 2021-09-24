<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 20:09:53
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-09-03 15:23:23
-->
<template>
  <div class="manage-use-car-container">
    <div class="tabs-type">
      <div
        v-for="(ele, index) in tabsTypeData"
        :key="ele.text"
        class="tabs-type-item"
        :class="ele.checked ? 'tabs-type-item-checked' : ''"
        @click="tabsTypeHandle(index)"
      >
        {{ ele.text }}
        <i :class="ele.checked ? 'show' : ''"></i>
      </div>
    </div>
    <div class="filter-container">
      <div class="filter-btn" @click="dateHandler">
        {{ filterDate }}
        <img src="@/assets/images/arrowDown.svg" alt="">
      </div>
      <div class="filter-btn" @click="filterHandler">
        筛选
        <img src="@/assets/images/filter.svg" alt="">
      </div>
    </div>
    <list
      ref="list"
      :params="params"
      :clear="clear"
      @resetClear="resetClear"
      @onRefresh="onRefresh"
      @onLoad="onLoad"
      @loadFinish="loadFinish"
    >
      <template v-slot:item="data">
        <div v-if="tabsIndex === 0">
          <div
            v-for="(ele, index) in data.data"
            :key="index"
            class="list-item"
          >
            <div class="status">
              <div class="status-choice">
                <div class="pic" @click="choice(ele, index)"><img :src="ele.isOrder ? chooseForbid : ele.checked ? choose : chooseDefault" alt=""></div>
                <div class="text">
                  <i class="status-icon"></i>
                  <span>{{ ele.typeStr }}</span>
                  <i class="line">|</i>
                  <span class="task-status" :style="{color: statusColor(ele.status)}">{{ status(ele.status) }}</span>
                </div>
              </div>
              <van-popover
                v-model="showPopover[index]"
                theme="dark"
                :actions="popoverText"
                placement="bottom-end"
                trigger="click"
                @select="cardCancel(ele, ...arguments)"
              >
                <template #reference>
                  <img src="@/assets/svg/invitation/morenew4.svg" />
                </template>
              </van-popover>
            </div>
            <div class="car">{{ ele.vehicle.vehicleTypeVO.name }} - {{ ele.vehicle.platNum }}</div>
            <div class="free">
              {{ ele.vehicle.vehicleTypeVO.seatNum }}座 | 可乘{{ ele.remainCount }}人
            </div>
            <div class="detail">
              <span class="origin">始发地：</span>
              {{ ele.startAddress }}
            </div>
            <div class="detail">
              <span class="destination">目的地：</span>
              {{ ele.endAddress }}
            </div>
            <div class="detail">
              <span>司机：</span>
              {{ ele.driverVO.name }}
            </div>
            <div class="detail">
              <span>日期：</span>
              {{ ele.startTime.slice(0, ele.startTime.length - 3) }} - {{ ele.endTime.slice(0, ele.endTime.length - 3) }}
            </div>
          </div>
        </div>
        <div v-if="tabsIndex === 1">
          <div
            v-for="(ele, index) in data.data"
            :key="index"
            class="list-item list-item-car"
          >
            <div class="status">
              <div class="status-choice">
                <div class="pic" @click="choice(ele, index)"><img :src="ele.isOrder ? chooseForbid : ele.checked ? choose : chooseDefault" alt=""></div>
                <div class="car">
                  {{ ele.vehicleVO.platNum }}
                  <div class="car-status">空闲</div>
                </div>
              </div>
              <van-popover
                v-model="showPopoverCar[index]"
                theme="dark"
                :actions="popoverTextCar"
                placement="bottom-end"
                trigger="click"
                @select="cardCancelCar(ele, ...arguments)"
              >
                <template #reference>
                  <img src="@/assets/svg/invitation/morenew4.svg" />
                </template>
              </van-popover>
            </div>
            <div class="text">
              <span>{{ ele.vehicleVO.vehicleTypeVO.name }}</span>
              <i class="line">|</i>
              <span>{{ ele.vehicleVO.vehicleColorStr }}</span>
              <i class="line">|</i>
              <span>{{ ele.vehicleVO.vehicleTypeVO.seatNum }}座位</span>
            </div>
            <!-- <div class="detail">
              <span>所属公司：</span>
              {{ ele.vehicleVO.vehicleCompanyVO.name }}
            </div> -->
            <div class="detail">
              <span>司机：</span>
              {{ ele.driverVO ? ele.driverVO.name : '-' }} | {{ ele.driverVO ? ele.driverVO.phone: '-' }}
            </div>
          </div>
        </div>
      </template>
    </list>
    <van-popup
      v-model="sidePopupShow"
      position="right"
      :style="{ width: '315px',height:'100%' }"
      round
    >
      <div class="popup-container">
        <div class="popup-title">
          <i />
          座位数
        </div>
        <ul class="filter-condition">
          <li
            v-for="(ele,index) in seatData"
            :key="index"
            @click="seatChoice(index)"
            :class="ele.checked ? 'filter-btn-checked' : ''"
          >
            {{ ele.enumValue }}座
          </li>
        </ul>
        <div class="popup-title">
          <i />
          车辆颜色
        </div>
        <ul class="filter-condition">
          <li
            v-for="(ele,index) in colorsData"
            :key="index"
            @click="modelChoice(index)"
            :class="ele.checked ? 'filter-btn-checked' : ''"
          >
            {{ ele.enumValue }}
          </li>
        </ul>
        <div class="popup-title">
          <i />
          其他条件筛选
        </div>
        <div class="filter-input">
          <van-search
            v-model="filterInput.platNumLike"
            background="#fff"
            placeholder="输入车牌号查询"
          />
        </div>
        <div class="filter-input">
          <van-search
            v-model="filterInput.vehicleTypeLike"
            background="#fff"
            placeholder="输入车型查询"
          />
        </div>
        <div class="filter-input">
          <van-search
            v-model="filterInput.startAddressLike"
            background="#fff"
            placeholder="输入始发地查询"
            @input="emptyModelStart"
          />
        </div>
        <div class="filter-input">
          <van-search
            v-model="filterInput.endAddressLike"
            background="#fff"
            placeholder="输入目的地查询"
            @input="emptyModelEnd"
          />
        </div>
        <div class="filter-input">
          <van-search
            v-model="filterInput.returnFlight"
            background="#fff"
            placeholder="输入航班号查询"
            @input="emptyNum"
          />
        </div>
      </div>
      <div class="filter-submit-btn">
        <van-button @click="resetHandler">重置</van-button>
        <van-button type="info" @click="submitHandler">确定</van-button>
      </div>
    </van-popup>
    <van-popup v-model="dateStartShow" position="bottom" :style="{ width: '100%' }" round>
      <van-picker show-toolbar title="选择开始时间" :columns="columnsStart" @confirm="startChoice" @cancel="dateStartShow = false"/>
    </van-popup>
    <van-popup v-model="dateEndShow" position="bottom" :style="{ width: '100%' }" round>
      <van-picker show-toolbar title="选择结束时间" :columns="columnsEnd" @confirm="endChoice" @cancel="dateEndShow = false"/>
    </van-popup>
    <!-- <div class="single-btn-bottom" v-if="isLoading">
      <van-button
        @click="$router.push({
          name: 'addUserCar',
          query: {
            [$enc('conferenceId')]: $enc(routeParams.id),
            [$enc('startTime')]: $enc(routeParams.startTime),
            [$enc('endTime')]: $enc(routeParams.endTime),
            [$enc('taskType')]: $enc(routeParams.taskType),
            [$enc('hide')]: $enc(true)
          }
        })"
      >添加用车任务</van-button>
      <van-button
        type="info"
        @click="submit"
      >确认选择</van-button>
    </div> -->
    <div class="single-btn-bottom single-btn-bottom-allow" v-if="isLoading">
      <!-- <van-button
        @click="$router.push({
          name: 'addUserCar',
          query: {
            [$enc('conferenceId')]: $enc(routeParams.id),
            [$enc('startTime')]: $enc(routeParams.startTime),
            [$enc('endTime')]: $enc(routeParams.endTime),
            [$enc('taskType')]: $enc(routeParams.taskType),
            [$enc('hide')]: $enc(true)
          }
        })"
      >添加用车任务</van-button> -->
      <van-button
        type="info"
        @click="submit"
      >确认选择</van-button>
    </div>
    <van-dialog v-model="customDinnerShow" show-cancel-button :beforeClose="beforeClose">
      <div class="custom-info-container">
        <van-field required label="联系人" v-model="contactName" placeholder="请输入联系人" class="customInput"/>
        <van-field required label="联系电话" v-model="contactPhone" placeholder="请输入联系电话" class="customInput"/>
      </div>
    </van-dialog>
    <van-popup
      v-model="submitShow"
      position="bottom"
      :style="{ width: '100%' }"
      round
    >
      <div class="submit-container">
        <h3>请确认司机如何联系用车人</h3>
        <ul>
          <li v-for="(ele, index) in submitData" :key="index" @click="submitChoice(index)">
            <img :src="ele.checked ? checkedIcon : ''" alt="">
            <span>{{ ele.name }}</span>
          </li>
        </ul>
        <i />
        <div class="submit-btn">
          <van-button @click="submitShow = false">取消</van-button>
          <van-button type="info" @click="submitFinnal">确定</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import list from '@/components/list'
import chooseDefault from '@/assets/images/chooseDefault.svg'
import choose from '@/assets/images/choose.svg'
import chooseForbid from '@/assets/images/chooseForbid.svg'
import checkedIcon from '@/assets/images/checked.svg'
// import { parse } from 'qs'

export default {
  components: { list },
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      tabsIndex: 0,
      contactName: '',
      contactPhone: '',
      customDinnerShow: false,
      submitData: [
        { name: '直接联系用车人', checked: true },
        { name: '指定联系人', checked: false }
      ],
      submitShow: false,
      chooseDefault, choose, chooseForbid, checkedIcon,
      popoverTextCar: [{ text: '车辆信息' }],
      popoverText: [{ text: '用车信息' }, { text: '用车人员' }],
      showPopover: [],
      showPopoverCar: [],
      isLoading: false,
      dateStartShow: false,
      dateEndShow: false,
      // 选择的开始时间
      choiceStartTime: '',
      // 选择的结束时间
      choiceEndTime: '',
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
      tabsTypeData: [
        { text: '任务车辆', checked: true, queryType: '1' },
        { text: '空闲车辆', checked: false, queryType: '2' }
      ],
      filterDate: '全部用车时间',
      sidePopupShow: false,
      filterInput: {
        // 车牌号筛选
        platNumLike: '',
        // 出发地筛选
        startAddressLike: '',
        // 目的地筛选
        endAddressLike: '',
        // 车型
        vehicleTypeLike: '',
        // 航班/车次
        returnFlight: ''
      },
      // 筛选车辆颜色
      colorsData: [],
      // 座位选择
      seatData: [],
      params: {
        httpUrl: 'task.getArriveCarTaskPc',
        type: 'up',
        httpParams: {
          conferenceId: '',
          startTime: '',
          endTime: '',
          pageNum: 1,
          pageSize: 10,
          // 座位
          seatNumList: [],
          // 颜色
          vehicleColorIdList: [],
          // 车牌号查询
          // platNumLike: '',
          // 车型
          // vehicleTypeLike: '',
          // 始发地查询
          startAddressLike: null,
          // 目的地查询
          endAddressLike: null,
          // 航班/车次
          returnFlight: null,
          type: null
          // 2 空闲车辆 1 任务车辆
          // queryType: '1'
        }
      },
      paramsRequire: {
        attendeeIdList: null,
        type: null
      },
      clear: false,
      submitIndex: 0,
      taskId: null,
      paramsData: null
    }
  },
  computed: {
    status() {
      return function(status) {
        let result = ''
        if (status === -1) {
          result = '已取消'
        } else if (status === 0) {
          result = '未开始'
        } else if (status === 1) {
          result = '进行中'
        } else if (status === 2) {
          result = '已完成'
        } else if (status === 3) {
          result = '删除'
        }
        return result
      }
    },
    statusColor() {
      return function(status) {
        let result = ''
        if (status === -1) {
          result = '#aeb2b7'
        } else if (status === 0) {
          result = '#191F24'
        } else if (status === 1) {
          result = '#F8B700'
        } else if (status === 2) {
          result = '#aeb2b7'
        } else if (status === 3) {
          result = '#aeb2b7'
        }
        return result
      }
    }
  },
  created() {
    console.log(this.routeParams)
    const id = this.routeParams.id
    const startTime = this.routeParams.startTime
    const endTime = this.routeParams.endTime
    const attendeeId = this.routeParams.attendeeId
    const taskType = this.routeParams.taskType
    this.filterDate = `${startTime.slice(0, startTime.length - 3)}至${endTime.slice(0, endTime.length - 3)}`
    this.$nextTick(() => {
      this.params.httpParams.startTime = startTime
      this.params.httpParams.endTime = endTime
      this.params.httpParams.conferenceId = id
      this.paramsRequire.type = taskType
      this.paramsRequire.attendeeIdList = [attendeeId]
      if (taskType === '61') {
        this.params.httpParams.type = 1
      } else if (taskType === '62') {
        this.params.httpParams.type = 2
      } else if (taskType === '63') {
        this.params.httpParams.type = 3
      }
    })
    // 获取座位数
    this.getSeat()
    // 获取当前会议下的颜色
    this.getModel()
    // 获取日程可选择的时间范围
    this.getAgendaDate()
  },
  methods: {
    beforeClose(action, done) {
      if (action === 'confirm') {
        const contactName = this.contactName
        const contactPhone = this.contactPhone
        if (!contactName.trim()) {
          this.$toast('请输入联系人姓名')
          done(false)
          return
        } else if (!contactPhone.trim()) {
          this.$toast('请输入联系电话')
          done(false)
          return
        } else {
          if (contactPhone.length < 7) {
            this.$toast('请输入正确的联系电话')
            done(false)
            return
          }
        }
        this.customDinnerShow = false
        const params = {
          contact: 1,
          contactPerson: '',
          contactPhone: '',
          attendeeName: '',
          attendeePhone: ''
          // type: this.params.httpParams.type,
        }
        params.conferenceId = this.routeParams.id
        params.taskId = this.taskId
        params.attendees = [{ id: this.routeParams.attendeeId }]
        params.attendeeId = this.routeParams.attendeeId
        // if (this.paramsData.title) {
        //   params.title = this.paramsData.title
        // }
        // if (this.paramsData.description) {
        //   params.description = this.paramsData.description
        // }
        // if (this.paramsData.startTime) {
        //   params.startTime = this.paramsData.startTime
        // }
        // if (this.paramsData.endTime) {
        //   params.endTime = this.paramsData.endTime
        // }
        // if (this.paramsData.getOnVehicleTime) {
        //   params.getOnVehicleTime = this.paramsData.getOnVehicleTime
        // }
        // if (this.paramsData.startAddress) {
        //   params.startAddress = this.paramsData.startAddress
        // }
        // if (this.paramsData.endAddress) {
        //   params.endAddress = this.paramsData.endAddress
        // }
        // if (this.paramsData.getOnVehicleAddress) {
        //   params.getOnVehicleAddress = this.paramsData.getOnVehicleAddress
        // }
        // if (this.paramsData.getOnVehicleTime) {
        //   params.getOnVehicleTime = this.paramsData.getOnVehicleTime
        // }
        // if (this.paramsData.driverId) {
        //   params.driverId = this.paramsData.driverId
        // }
        // if (this.paramsData.vehicleId) {
        //   params.vehicleId = this.paramsData.vehicleId
        // }
        // if (this.paramsData.vehicleId) {
        //   params.publish = this.paramsData.publish
        // } else {
        //   params.publish = false
        // }
        this.$dialog.confirm({
          title: `为此参会人添加用车任务`,
          message: '确认添加？',
          className: 'customDialog'
        }).then(() => {
          params.contact = false
          params.contactPerson = contactName
          params.contactPhone = contactPhone
          params.attendeeName = contactName
          params.attendeePhone = contactPhone
          this.$api({
            url: 'task.setvehiclePCTask',
            data: params
          }).then(res => {
            if (res.code === 2000) {
              this.$toast('用车分配成功')
              setTimeout(() => {
                if (sessionStorage.getItem('isJumpToHome')) {
                  sessionStorage.removeItem('isJumpToHome')
                  this.$router.replace({
                    name: 'conferenceDesk',
                    query: {
                      [this.$enc('id')]: this.$enc(this.routeParams.id)
                    }
                  })
                } else {
                  this.$router.go(-2)
                }
                // this.$router.go(-2)
              }, 500)
            }
          }).catch(err => {
            this.$toast(err.message)
          })
        }).catch(() => {
          this.$toast('取消')
        })
        done()
      } else {
        this.submitShow = true
        done()
      }
    },
    submitChoice(index) {
      this.submitData.forEach(ele => {
        ele.checked = false
      })
      this.submitData[index].checked = true
      this.submitIndex = index
    },
    submitFinnal() {
      this.submitShow = false
      if (this.submitIndex === 1) {
        this.customDinnerShow = true
      } else {
        const attendeeInfo = JSON.parse(sessionStorage.getItem('attendeeInfo'))
        const params = {
          contact: 1,
          contactPerson: attendeeInfo ? attendeeInfo.name : '',
          contactPhone: attendeeInfo ? attendeeInfo.phone : '',
          attendeeName: attendeeInfo ? attendeeInfo.name : '',
          attendeePhone: attendeeInfo ? attendeeInfo.phone : ''
          // type: this.params.httpParams.type
        }
        params.conferenceId = this.routeParams.id
        params.taskId = this.taskId
        params.attendees = [{ id: this.routeParams.attendeeId }]
        params.attendeeId = this.routeParams.attendeeId
        // if (this.paramsData.title) {
        //   params.title = this.paramsData.title
        // }
        // if (this.paramsData.description) {
        //   params.description = this.paramsData.description
        // }
        // if (this.paramsData.startTime) {
        //   params.startTime = this.paramsData.startTime
        // }
        // if (this.paramsData.endTime) {
        //   params.endTime = this.paramsData.endTime
        // }
        // if (this.paramsData.getOnVehicleTime) {
        //   params.getOnVehicleTime = this.paramsData.getOnVehicleTime
        // }
        // if (this.paramsData.startAddress) {
        //   params.startAddress = this.paramsData.startAddress
        // }
        // if (this.paramsData.endAddress) {
        //   params.endAddress = this.paramsData.endAddress
        // }
        // if (this.paramsData.getOnVehicleAddress) {
        //   params.getOnVehicleAddress = this.paramsData.getOnVehicleAddress
        // }
        // if (this.paramsData.getOnVehicleTime) {
        //   params.getOnVehicleTime = this.paramsData.getOnVehicleTime
        // }
        // if (this.paramsData.driverId) {
        //   params.driverId = this.paramsData.driverId
        // }
        // if (this.paramsData.vehicleId) {
        //   params.vehicleId = this.paramsData.vehicleId
        // }
        // if (this.paramsData.vehicleId) {
        //   params.publish = this.paramsData.publish
        // } else {
        //   params.publish = false
        // }
        this.$dialog.confirm({
          title: `为此参会人添加用车任务`,
          message: '确认添加？',
          className: 'customDialog'
        }).then(() => {
          // 新增 直接联系用车人
          this.$api({
            url: 'task.setvehiclePCTask',
            data: params
          }).then(res => {
            if (res.code === 2000) {
              this.$toast('用车分配成功')
              setTimeout(() => {
                if (sessionStorage.getItem('isJumpToHome')) {
                  sessionStorage.removeItem('isJumpToHome')
                  this.$router.replace({
                    name: 'conferenceDesk',
                    query: {
                      [this.$enc('id')]: this.$enc(this.routeParams.id)
                    }
                  })
                } else {
                  this.$router.go(-2)
                }
                // this.$router.go(-2)
              }, 500)
            }
          }).catch(err => {
            this.$toast(err.message)
          })
        }).catch(() => {
          this.$toast('取消')
        })
      }
    },
    submit() {
      const res = []
      this.$refs.list.listData.forEach(ele => {
        if (ele.checked) {
          res.push(ele)
        }
      })
      if (!res.length) {
        this.$toast('请选择一个任务或空闲车辆')
        return false
      }
      const index = this.tabsIndex
      this.paramsData = res[0]
      if (index === 1) {
        const conferenceId = this.routeParams.id
        const startTime = this.routeParams.startTime
        const endTime = this.routeParams.endTime
        const attendeeId = this.routeParams.attendeeId
        const taskId = this.routeParams.taskId
        const taskType = this.routeParams.taskType
        const hide = true
        this.$router.push({
          name: 'backlogDetail/userCars',
          query: {
            [this.$enc('conferenceId')]: this.$enc(conferenceId),
            [this.$enc('attendeeId')]: this.$enc(attendeeId),
            [this.$enc('startTime')]: this.$enc(startTime),
            [this.$enc('endTime')]: this.$enc(endTime),
            [this.$enc('taskId')]: this.$enc(taskId),
            [this.$enc('taskType')]: this.$enc(taskType),
            [this.$enc('hide')]: this.$enc(hide)
          }
        })
        return false
      }
      this.submitShow = true
    },
    cardCancelCar(ele) {
      console.log(ele)
      const id = ele.vehicleVO.id
      const conferenceId = this.routeParams.id
      this.$router.push({
        name: 'backlogDetail/cars',
        query: {
          [this.$enc('conferenceId')]: this.$enc(conferenceId),
          [this.$enc('id')]: this.$enc(id)
        }
      })
      console.log(ele)
    },
    cardCancel(ele, popoverText) {
      const type = popoverText.text
      const conferenceId = this.routeParams.id
      const startTime = this.routeParams.startTime
      const endTime = this.routeParams.endTime
      const taskId = this.routeParams.taskId
      // this.taskId = ele.id
      const hide = true
      if (type === '用车信息') {
        this.$router.push({
          name: 'formUserCarManage',
          query: {
            [this.$enc('conferenceId')]: this.$enc(conferenceId),
            [this.$enc('taskId')]: this.$enc(taskId),
            [this.$enc('id')]: this.$enc(ele.id),
            [this.$enc('startTime')]: this.$enc(startTime),
            [this.$enc('endTime')]: this.$enc(endTime),
            [this.$enc('hide')]: this.$enc(hide)
          }
        })
      } else if (type === '用车人员') {
        const carNum = ele.vehicle.platNum
        const carType = ele.vehicle.vehicleTypeVO.name
        const seatTotal = ele.vehicle.vehicleTypeVO.seatNum
        const seatCount = ele.remainCount
        this.$router.push({
          name: 'manageUseCarStaff',
          query: {
            [this.$enc('conferenceId')]: this.$enc(conferenceId),
            [this.$enc('taskId')]: this.$enc(ele.id),
            [this.$enc('carNum')]: this.$enc(carNum),
            [this.$enc('carType')]: this.$enc(carType),
            [this.$enc('seatTotal')]: this.$enc(seatCount),
            [this.$enc('seatCount')]: this.$enc(seatTotal),
            [this.$enc('hide')]: this.$enc(hide)
          }
        })
      }
    },
    // 单选及反选
    choice(ele, index) {
      const isOrder = ele.isOrder
      if (isOrder) {
        return false
      }
      this.$refs.list.listData.forEach((ele, indexChoice) => {
        if (index === indexChoice) {
          ele.checked = !ele.checked
          this.taskId = ele.id
        } else {
          ele.checked = false
        }
        this.$set(this.$refs.list.listData, indexChoice, ele)
        if (this.tabsIndex === 1) {
          sessionStorage.setItem('carInfo', JSON.stringify(ele))
        }
      })
    },
    // 如果input为空 则需要将 空字符串处理为null 不为什么 接口传空字符串就是不行 传null就行！！！！！
    emptyModelStart() {
      this.filterInput.startAddressLike = this.filterInput.startAddressLike === '' ? null : this.filterInput.startAddressLike
    },
    // 如果input为空 则需要将 空字符串处理为null 不为什么 接口传空字符串就是不行 传null就行！！！！！
    emptyModelEnd() {
      this.filterInput.endAddressLike = this.filterInput.endAddressLike === '' ? null : this.filterInput.endAddressLike
    },
    emptyNum() {
      this.filterInput.returnFlight = this.filterInput.returnFlight === '' ? null : this.filterInput.returnFlight
    },
    // 结束日期选择
    endChoice(val) {
      const choiceEndTime = this.formatCodeSymbol(val[0], val[1], val[2])
      this.choiceEndTime = choiceEndTime
      // 结束时间不得大于开始时间
      if (new Date(this.choiceEndTime).getTime() < new Date(this.choiceStartTime).getTime()) {
        this.$toast({
          message: '结束时间不得大于开始时间',
          duration: 3000
        })
        return
      }
      this.filterDate = `${this.choiceStartTime.slice(0, this.choiceStartTime.length - 3)} 至 ${this.choiceEndTime.slice(0, this.choiceEndTime.length - 3)}`
      // 请求接口
      this.clear = true
      this.params.httpParams.startTime = this.choiceStartTime
      this.params.httpParams.endTime = this.choiceEndTime
      this.params.httpParams.pageNum = 1
      this.dateEndShow = false
    },
    // 开始日期选择
    startChoice(val) {
      this.dateStartShow = false
      const choiceStartTime = this.formatCodeSymbol(val[0], val[1], val[2])
      this.choiceStartTime = choiceStartTime
      for (let i = 0; i < 60; i++) {
        let minute = i
        if (i < 10) {
          minute = `0${i}`
        }
        this.columnsEnd[2].values.push(`${minute}分`)
      }
      const calendarYear = this.columnsEnd[0].values
      const calendarHour = this.columnsEnd[1].values
      const calendarMinute = this.columnsEnd[2].values
      const startTime = this.routeParams.startTime
      const endTime = this.routeParams.endTime
      const startDay = startTime.slice(0, 10)
      const endDay = endTime.slice(0, 10)
      // const startHour = `${startTime.slice(-8, -6).replace(/\b(0+)/gi, '')}时`
      const endHour = `${endTime.slice(-8, -6).replace(/\b(0+)/gi, '')}时`
      // const startMinute = `${startTime.slice(-5, -3)}分`
      const endMinute = `${endTime.slice(-5, -3)}分`
      // 根据会议开始时间向前退两个月
      const prevYearMonthDay = []
      for (let i = 1; i < 61; i++) {
        const now = new Date(startDay)
        const yesterday = new Date(now.setDate(now.getDate() - i))
        prevYearMonthDay.push(this.formatCode(yesterday))
      }
      for (let i = 0; i < prevYearMonthDay.length; i++) {
        this.columnsEnd[0].values.unshift(prevYearMonthDay[i])
      }
      // 把开始时间和结束时间的日期补全
      const nowYearMonthDay = []
      const getDaysBetween = this.getDaysBetween(startDay, endDay)
      for (let i = 0; i < getDaysBetween; i++) {
        const now = new Date(startDay)
        const tomorrow = new Date(now.setDate(now.getDate() + i))
        nowYearMonthDay.push(this.formatCode(tomorrow))
      }
      for (let i = 0; i < nowYearMonthDay.length; i++) {
        this.columnsEnd[0].values.push(nowYearMonthDay[i])
      }
      // 根据会议结束向后推两个月
      const NextYearMonthDay = []
      for (let i = 0; i < 61; i++) {
        const now = new Date(endDay)
        const tomorrow = new Date(now.setDate(now.getDate() + i))
        NextYearMonthDay.push(this.formatCode(tomorrow))
      }
      for (let i = 0; i < NextYearMonthDay.length; i++) {
        this.columnsEnd[0].values.push(NextYearMonthDay[i])
      }
      const filterStartDate = this.formatCode(new Date(endDay))
      const yearIndex = calendarYear.findIndex(ele => ele === filterStartDate)
      this.columnsEnd[0].defaultIndex = yearIndex
      const hourIndex = calendarHour.findIndex(ele => ele === endHour)
      this.columnsEnd[1].defaultIndex = hourIndex
      const minuteIndex = calendarMinute.findIndex(ele => ele === endMinute)
      this.columnsEnd[2].defaultIndex = minuteIndex
      this.dateEndShow = true
    },
    getAgendaDate() {
      for (let i = 0; i < 60; i++) {
        let minute = i
        if (i < 10) {
          minute = `0${i}`
        }
        this.columnsStart[2].values.push(`${minute}分`)
      }
      const calendarYear = this.columnsStart[0].values
      const calendarHour = this.columnsStart[1].values
      const calendarMinute = this.columnsStart[2].values
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
        this.columnsStart[0].values.unshift(prevYearMonthDay[i])
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
        this.columnsStart[0].values.push(nowYearMonthDay[i])
      }
      // 根据会议结束向后推两个月
      const NextYearMonthDay = []
      for (let i = 0; i < 61; i++) {
        const now = new Date(endDay)
        const tomorrow = new Date(now.setDate(now.getDate() + i))
        NextYearMonthDay.push(this.formatCode(tomorrow))
      }
      for (let i = 0; i < NextYearMonthDay.length; i++) {
        this.columnsStart[0].values.push(NextYearMonthDay[i])
      }
      const filterStartDate = this.formatCode(new Date(startDay))
      const yearIndex = calendarYear.findIndex(ele => ele === filterStartDate)
      this.columnsStart[0].defaultIndex = yearIndex
      const hourIndex = calendarHour.findIndex(ele => ele === startHour)
      this.columnsStart[1].defaultIndex = hourIndex
      const minuteIndex = calendarMinute.findIndex(ele => ele === startMinute)
      this.columnsStart[2].defaultIndex = minuteIndex
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
      const finalStartDate = `${paramsYearMonthDay} ${paramsHour}:${choiceMinute}:00`
      return finalStartDate
    },
    // 计算两个日期之间相差的天数
    getDaysBetween(startTime, endTime) {
      const startDate = Date.parse(startTime)
      const endDate = Date.parse(endTime)
      const days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
      return days
    },
    // 重置搜索条件
    resetHandler() {
      this.resetModelStatus()
      this.resetInputStatus()
    },
    // 确定
    submitHandler() {
      const vehicleColorIdList = []
      this.colorsData.forEach(ele => {
        if (ele.checked) {
          vehicleColorIdList.push(ele.enumKey)
        }
      })
      this.params.httpParams.vehicleColorIdList = vehicleColorIdList.join(',')
      const seatNumList = []
      this.seatData.forEach(ele => {
        if (ele.checked) {
          seatNumList.push(ele.enumKey)
        }
      })
      this.params.httpParams.seatNumList = seatNumList.join(',')
      // 清空现有list数据
      this.clear = true
      this.params.httpParams.pageNum = 1
      // 合并输入框内容筛选条件
      Object.keys(this.filterInput).forEach(ele => {
        if (!this.filterInput[ele]) {
          this.filterInput[ele] = null
        }
      })
      const httpParams = Object.assign({}, this.params.httpParams, this.filterInput)
      this.params.httpParams = httpParams
      // 关闭弹窗
      this.sidePopupShow = false
    },
    // 时间选择
    dateHandler() {
      this.choiceStartTime = ''
      this.choiceEndTime = ''
      this.dateStartShow = true
    },
    // 重置车型选择状态
    resetModelStatus() {
      this.colorsData.forEach(ele => {
        ele.checked = false
      })
      this.seatData.forEach(ele => {
        ele.checked = false
      })
    },
    // 重置筛选中输入框的内容
    resetInputStatus() {
      Object.keys(this.filterInput).forEach(key => {
        this.filterInput[key] = ''
      })
    },
    // 颜色选择
    modelChoice(index) {
      const isChecked = this.colorsData[index].checked
      this.$set(this.colorsData[index], 'checked', !isChecked)
    },
    // 座位选择
    seatChoice(index) {
      const isChecked = this.seatData[index].checked
      this.$set(this.seatData[index], 'checked', !isChecked)
    },
    // 更多筛选条件
    filterHandler() {
      this.sidePopupShow = true
    },
    tabsTypeHandle(index) {
      // 当前选中的不允许点击
      if (this.tabsTypeData[index].checked) {
        return
      }
      this.tabsTypeData.forEach(ele => {
        ele.checked = false
      })
      this.$router.replace({
        name: 'backlogDetail/freeCars',
        query: {
          [this.$enc('id')]: this.$enc(this.routeParams.id),
          [this.$enc('attendeeId')]: this.$enc(this.routeParams.attendeeId),
          [this.$enc('taskId')]: this.$enc(this.routeParams.taskId),
          [this.$enc('taskType')]: this.$enc(this.routeParams.taskType),
          [this.$enc('startTime')]: this.$enc(this.routeParams.startTime),
          [this.$enc('endTime')]: this.$enc(this.routeParams.endTime)
        }
      })
      // this.taskId = null
      // this.tabsIndex = index
      // this.tabsTypeData[index].checked = true
      // const queryType = this.tabsTypeData[index].queryType
      // this.clear = true
      // this.params.httpParams.queryType = queryType
      // this.params.httpParams.pageNum = 1
      // if (index === 0) {
      //   this.params.httpUrl = 'task.getArriveCarTask'
      // } else {
      //   this.params.httpUrl = 'task.getReturnCarTask'
      // }
    },
    // 获取当前会议下颜色
    getModel() {
      const id = this.routeParams.id
      this.$api({
        url: 'manage.getCarsColor',
        data: {
          conferenceId: id
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result.list
          data.forEach(ele => {
            ele.checked = false
            ele.name = ele.enumValue
          })
          this.colorsData = data
        }
      })
    },
    // 获取当前会议下座位
    getSeat() {
      const id = this.routeParams.id
      this.$api({
        url: 'manage.getCarsSeat',
        data: {
          conferenceId: id
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result.list
          data.forEach(ele => {
            ele.checked = false
            ele.name = ele.enumValue
          })
          this.seatData = data
        }
      })
    },
    resetClear() {
      this.clear = false
    },
    onRefresh() {
      this.params.httpParams.pageNum++
      this.params.type = 'down'
    },
    onLoad() {
      this.params.httpParams.pageNum++
      this.params.type = 'up'
    },
    loadFinish(result) {
      const data = result.result.list
      data.forEach(ele => {
        ele.checked = false
      })
      this.isLoading = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.van-picker {
  z-index: 1;
}
.manage-use-car-container{
  min-height: 100%;
  background-color: #f8f8f8;
  .popup-container {
    width: 100%;
    height: 100%;
    padding: 24px 16px 50px;
    position: absolute;
    left: 0;
    top: 0;
    .popup-title {
      width: 100%;
      height: 50px;
      line-height: 50px;
      font-size: 15px;
      font-weight: 500;
      @include list(row,flex-start,center);
      i {
        display: block;
        width: 4px;
        height: 14px;
        border-radius: 2px;
        background-color: rgba(30, 137, 255, 1);
        margin-right: 4px;
      }
    }
    .filter-condition {
      margin:10px 0 10px -12px;
      li {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        color: rgba(25, 31, 36, 0.8);
        background-color: rgba(25, 31, 36, 0.04);
        border-radius: 6px;
        padding: 0 31px;
        margin: 0 0 12px 12px;
      }
      .filter-btn-checked {
        background-color: rgba(30, 137, 255, 1);
        color: #fff;
      }
    }
    .filter-input {
      width: 100%;
      margin-bottom: 16px;
      .van-search {
        padding: 0;
      }
    }
    .filter-submit-btn {
      width: 100%;
      height: 50px;
      @include absolute('','',0,0);
      .van-button {
        width: 50%;
        height: 100%;
      }
    }
  }
  .tabs-type {
    width: 100%;
    height: 54px;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    padding: 0 16px;
    @include list(row,space-between,center);
    .tabs-type-item {
      width: 164px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      font-size: 15px;
      border-radius: 22px;
      color: rgba(25, 31, 36, 0.64);
      i {
        display: none;
        width: 30px;
        height: 3px;
        background: linear-gradient(270deg, #40BEFF 0%, #1E89FF 100%);
        border-radius: 2px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 4px;
      }
    }
    .tabs-type-item-checked {
        color: #1E89FF;
        color: rgba(25, 31, 36, 1);
        font-weight: 500;
        background-color: rgba(25, 31, 36, 0.04);
      }
  }
  .filter-container {
    width: 100%;
    height: 48px;
    line-height: 48px;
    background-color: #fff;
    padding: 0 16px;
    @include list(row, space-between, center);
    .filter-btn {
      @include list(row, flex-start, center);
      font-size: 13px;
      img {
        margin-left: 4px;
      }
    }
  }
  .list-container {
    height: calc(100% - 102px);
    top: 102px;
    // padding-top: 12px;
    padding-bottom: 64px;
    .list-item {
      width: 100%;
      border-radius: 8px;
      background-color: #fff;
      overflow: hidden;
      padding: 16px 16px 8px;
      margin-bottom: 12px;
      .status {
        .status-choice {
          @include list(row, flex-start,center);
          .pic {
            margin-right: 6px;
          }
        }
        @include list(row, space-between, center);
        font-size: 15px;
        margin-bottom: 20px;
      }
      .text {
        color: rgba(25, 31, 36, 1);
        @include list(row, flex-start, center);
        .status-icon {
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: rgba(25, 31, 36, 0.12);
          margin-right: 8px;
        }
      }
      .line {
        color: rgba(25, 31, 36, 0.24);
        margin: 0 10px;
      }
      .task-status {
        color: rgba(248, 183, 0, 1);
      }
      .car {
        font-size: 20px;
        font-weight: 500;
        line-height: 25px;
        margin-bottom: 6px;
      }
      .free {
        font-size: 14px;
        color: rgba(25, 31, 36, 0.64);
        line-height: 18px;
        margin-bottom: 20px;
      }
      .detail {
        font-size: 14px;
        line-height: 18px;
        margin-bottom: 8px;
        span {
          color: rgba(25, 31, 36, 0.48);
        }
        .origin {
          color: rgba(0, 162, 140, 1);
        }
        .destination {
          color: rgba(255, 130, 0, 1);
        }
      }
    }
    .list-item-car {
      .status {
        margin-bottom: 16px;
      }
      .car {
        font-size: 15px;
        margin-bottom: 0;
        font-weight: 400;
        @include list(row,flex-start,center);
        .car-status {
          font-size: 13px;
          width: 40px;
          height: 20px;
          text-align: center;
          line-height: 20px;
          color: #fff;
          background-color: #03BE1C;
          margin-left: 4px;
          border-radius: 4px;
        }
      }
      .text {
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 16px;
      }
    }
  }
  .single-btn-bottom {
    position: fixed;
    background-color: #fff;
    z-index: 9;
    @include list(row, space-between,center);
    .van-button {
      width: 167px;
    }
    .van-button__text {
      font-size: 15px;
    }
  }
  .single-btn-bottom-allow {
    .van-button {
      width: 100%;
    }
  }
  .submit-container {
    h3 {
      width: 100%;
      height: 40px;
      font-size: 14px;
      text-align: center;
      line-height: 40px;
      color: rgba(25, 31, 36, 0.64);
      border-bottom: 1px solid #eeeeef;
    }
    li {
      width: 100%;
      font-size: 17px;
      line-height: 56px;
      padding: 0 16px;
      border-bottom: 1px solid #eeeeef;
      @include list(row, flex-start, center);
      img {
        margin-right: 16px;
      }
    }
    i {
      display: block;
      width: 100%;
      height: 16px;
      background-color: rgba(25, 31, 36, 0.04);
    }
    .submit-btn {
      width: 100%;
      @include list(row, flex-start, center);
      .van-button {
        width: 50%;
        height: 56px;
      }
    }
  }
  .custom-info-container {
    padding: 16px 12px;
    .van-cell {
      height: 54px;
    }
  }
}
</style>
