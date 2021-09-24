<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 20:09:53
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-27 16:23:03
-->
<template>
  <div class="manage-use-car-container">
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
        <div
          v-for="(ele, index) in data.data"
          :key="index"
          class="list-item"
        >
          <div class="item-container">
            <div class="status">
              <div class="status-choice">
                <div class="pic" @click="choice(ele, index)"><img :src="ele.checked ? choose : chooseDefault" alt=""></div>
                <div class="text">
                  <i class="status-icon"></i>
                  <span>{{ ele.roomFormVO.hotelVO.name }}</span>
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
            <div class="car">
              {{ ele.roomFormVO.modelName ? ele.roomFormVO.modelName : '-' }}
              <i />
              {{ ele.roomNo ? ele.roomNo : '-' }}
              <i />
              <div class="room-status room-status-vip" v-if="ele.oneself === 1">单住</div>
              <i v-if="ele.oneself === 1"/>
              <div
                class="room-status"
                :class="ele.fullStatus === 0 ? 'room-status-full' : ele.fullStatus === 1 ? 'room-status-full-no' : ele.fullStatus === 2 ? 'room-status-free' : ''"
              >{{ ele.fullStatusStr }}</div>
            </div>
            <div class="free">
              总床位：{{ ele.totalCount }} 可用床位{{ ele.remainCount }}
            </div>
            <div class="time">
              <img src="@/assets/images/time.svg" alt="">
              {{ ele.startDate }} - {{ ele.endDate }}
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
        <div class="popup-item">
          <div class="popup-title">
            <i />
            房间状态
          </div>
          <ul class="filter-condition">
            <li
              v-for="(ele,index) in statusData"
              :key="index"
              @click="statusChoice(index)"
              :class="ele.checked ? 'filter-btn-checked' : ''"
            >
              {{ ele.text }}
            </li>
          </ul>
        </div>
        <div class="popup-item">
          <div class="popup-title">
            <i />
            房型
          </div>
          <ul class="filter-condition">
            <li
              v-for="(ele,index) in roomData"
              :key="index"
              @click="roomChoice(index)"
              :class="ele.checked ? 'filter-btn-checked' : ''"
            >
              {{ ele.enumValue }}
            </li>
          </ul>
        </div>
        <div class="popup-item">
          <div class="popup-title">
            <i />
            床位数
          </div>
          <ul class="filter-condition">
            <li
              v-for="(ele,index) in roomCountData"
              :key="index"
              @click="roomCountChoice(index)"
              :class="ele.checked ? 'filter-btn-checked' : ''"
            >
              {{ ele.enumValue }}
            </li>
          </ul>
        </div>
        <div class="popup-item">
          <div class="popup-title">
            <i />
            房间使用方式
          </div>
          <ul class="filter-condition">
            <li
              v-for="(ele,index) in typesData"
              :key="index"
              @click="typesChoice(index)"
              :class="ele.checked ? 'filter-btn-checked' : ''"
            >
              {{ ele.text }}
            </li>
          </ul>
        </div>
        <div class="popup-item">
          <div class="popup-title">
            <i />
            其他条件筛选
          </div>
          <div class="filter-input">
            <van-search
              v-model="filterInput.hotelNameLike"
              background="#fff"
              placeholder="输入酒店名称查询"
            />
          </div>
          <div class="filter-input">
            <van-search
              v-model="filterInput.roomNoLike"
              background="#fff"
              placeholder="输入房间号查询"
            />
          </div>
        </div>
      </div>
      <div class="filter-submit-btn">
        <van-button @click="resetHandler">重置</van-button>
        <van-button type="info" @click="submitHandler">确定</van-button>
      </div>
    </van-popup>
    <van-calendar
      v-model="calendarShow"
      type="range"
      title="选择用房时间"
      color="#1989fa"
      :default-date="defaultDate"
      :min-date="prevMonth"
      :max-date="nextMonth"
      @confirm="dateConfirm"
    />
    <van-calendar
      v-model="calendarChoiceShow"
      type="range"
      title="选择用房时间"
      color="#1989fa"
      :min-date="prevMonthChoice(startDate)"
      :max-date="nextMonthChoice(endDate)"
      :default-date="null"
      :show-confirm="false"
      @select="btnDisabled = true"
      @confirm="onConfirm"
    >
      <div slot="footer">
        <van-cell center title="设置为单住">
          <template #right-icon>
            <van-switch v-model="checked" size="24" />
          </template>
        </van-cell>
        <van-button class="calendar-btn" :disabled="btnDisabled" round block type="info" @click="onSubmit">确定</van-button>
      </div>
    </van-calendar>
    <div class="single-btn-bottom single-btn-bottom-allow" v-if="isLoading">
      <van-button type="info" @click="submit">确认选择</van-button>
    </div>
    <van-popup
      v-model="submitShow"
      position="bottom"
      :style="{ width: '100%' }"
      round
    >
      <div class="submit-container">
        <h3>选择下一步操作</h3>
        <ul>
          <li v-for="(ele, index) in submitData" :key="index" @click="submitChoice(index)">
            <img :src="ele.checked ? checkedIcon : ''" alt="">
            <span>{{ ele.name }}</span>
          </li>
        </ul>
        <i />
        <van-button type="info" @click="submitFinnal">确定</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import list from '@/components/list'
import chooseDefault from '@/assets/images/chooseDefault.svg'
import choose from '@/assets/images/choose.svg'
import checkedIcon from '@/assets/images/checked.svg'

export default {
  components: { list },
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      submitData: [
        { name: '分配完成', checked: true },
        { name: '继续分配', checked: false },
        { name: '稍后分配', checked: false }
      ],
      checkedIcon,
      submitShow: false,
      startDate: new Date(),
      endDate: new Date(),
      calendarChoiceShow: false,
      checked: true,
      // minDate: '',
      // maxDate: '',
      btnDisabled: true,
      param: {
        attendeeIdList: [],
        conferenceId: '',
        startDate: '',
        endDate: '',
        oneself: '',
        roomId: ''
      },
      chooseDefault, choose,
      isLoading: false,
      popoverText: [{ text: '详细信息' }, { text: '入住人员' }],
      showPopover: [],
      // 默认选中的日期
      defaultDate: [],
      calendarShow: false,
      minDate: new Date(),
      maxDate: new Date(),
      filterDate: '选择用房时间',
      sidePopupShow: false,
      filterInput: {
        hotelNameLike: '',
        roomNoLike: ''
      },
      // 房间状态
      statusData: [
        { text: '空闲', checked: false, fullStatusList: 0 },
        { text: '未满', checked: false, fullStatusList: 1 },
        { text: '已满', checked: false, fullStatusList: 2 }
      ],
      // 筛选条件房间类型
      roomData: [],
      // 床位数
      roomCountData: [],
      // 房间使用方式
      typesData: [
        { text: '单住', checked: false, oneself: 1 },
        { text: '合住', checked: false, oneself: 0 }
      ],
      params: {
        httpUrl: 'manage.getStayList',
        type: 'up',
        // 模拟数据
        httpParams: {
          conferenceId: '',
          // 酒店名称
          hotelNameLike: '',
          // 输入房间号查询
          roomNoLike: '',
          // 房间状态
          fullStatusList: '',
          // 房型
          modelIdList: '',
          // 床位数
          capacityList: '',
          // 是否单住
          oneself: '',
          startDate: '',
          endDate: '',
          sortName: 'roomNo,startDate',
          sortStatus: 'asc',
          pageNum: 1,
          pageSize: 10
        }
      },
      clear: false
    }
  },
  watch: {
    calendarShow: {
      handler(val) {
        if (val === false) {
          this.btnDisabled = true
          this.checked = true
        }
      }
    }
  },
  computed: {
    prevMonthChoice() {
      return function(time) {
        // const date = (/\d{4}-\d{1,2}-\d{1,2}/g.exec(this.routeParams.startTime))[0]
        // 1 * 24 * 60 * 60 * 1000
        const nowDate = new Date(time).getTime()
        // const resTime = nowDate - (60 * 24 * 60 * 60 * 1000)
        const year = new Date(nowDate).getFullYear()
        const month = new Date(nowDate).getMonth()
        const day = new Date(nowDate).getDate()
        return new Date(year, month, day)
      }
    },
    nextMonthChoice() {
      return function(time) {
        // const date = (/\d{4}-\d{1,2}-\d{1,2}/g.exec(this.routeParams.endTime))[0]
        // 1 * 24 * 60 * 60 * 1000
        const nowDate = new Date(time).getTime()
        // const resTime = nowDate + (60 * 24 * 60 * 60 * 1000)
        const year = new Date(nowDate).getFullYear()
        const month = new Date(nowDate).getMonth()
        const day = new Date(nowDate).getDate()
        return new Date(year, month, day)
      }
    },
    prevMonth() {
      const date = (/\d{4}-\d{1,2}-\d{1,2}/g.exec(this.routeParams.startTime))[0]
      // 1 * 24 * 60 * 60 * 1000
      const nowDate = new Date(date).getTime()
      // const resTime = nowDate - (60 * 24 * 60 * 60 * 1000)
      const year = new Date(nowDate).getFullYear()
      const month = new Date(nowDate).getMonth()
      const day = new Date(nowDate).getDate()
      console.log(year, month, day)
      return new Date(year, month, day)
    },
    nextMonth() {
      const date = (/\d{4}-\d{1,2}-\d{1,2}/g.exec(this.routeParams.endTime))[0]
      // 1 * 24 * 60 * 60 * 1000
      const nowDate = new Date(date).getTime()
      // const resTime = nowDate + (60 * 24 * 60 * 60 * 1000)
      const year = new Date(nowDate).getFullYear()
      const month = new Date(nowDate).getMonth()
      const day = new Date(nowDate).getDate()
      return new Date(year, month, day)
    }
  },
  created() {
    console.log(this.routeParams)
    const id = this.routeParams.id
    this.$nextTick(() => {
      this.params.httpParams.conferenceId = id
    })
    this.getRoomType()
    this.getRoomCount()
    // const { roomId, conferenceId } = this.routeParams
    // this.minDate = new Date(startDate)
    // this.maxDate = new Date(endDate)
    // this.param.roomId = roomId
    // this.param.conferenceId = conferenceId
    // this.filterDateHandler()
  },
  methods: {
    submitFinnal() {
      let indexChoice = null
      this.submitData.forEach((ele, index) => {
        if (ele.checked) {
          indexChoice = index
        }
      })
      if (indexChoice === 0) {
        // 分配完成
        this.$dialog.confirm({
          title: '确定完成住宿分配任务',
          message: '确认完成？',
          className: 'customDialog'
        }).then(() => {
          // ignoreTask
          const conferenceId = this.routeParams.id
          const attendeeId = this.routeParams.attendeeId
          const taskType = this.routeParams.taskType
          const param = {
            conferenceId, attendeeId, type: taskType, result: 100
          }
          console.log(this.routeParams)
          this.$api({
            url: 'task.ignoreTask',
            data: [param]
          }).then(res => {
            if (res.code === 2000) {
              this.$toast.success('分配完成')
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
                // this.$router.replace({
                //   name: 'backlog',
                //   [this.$enc('id')]: this.$enc(this.routeParams.id)
                // })
              })
            }
          })
        }).catch(() => {
          this.$toast('取消')
        })
      } else if (indexChoice === 1) {
        // 继续分配
        this.submitShow = false
      } else if (indexChoice === 2) {
        // 稍后分配
        this.$router.go(-1)
      }
    },
    submitChoice(index) {
      this.submitData.forEach(ele => {
        ele.checked = false
      })
      this.submitData[index].checked = true
    },
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    },
    onConfirm(date) {
      this.btnDisabled = false
      const [start, end] = date
      this.param.startDate = this.formatDate(start)
      this.param.endDate = this.formatDate(end)
    },
    onSubmit() {
      this.param.oneself = this.checked === true ? 1 : 0
      const attendeeId = this.routeParams.attendeeId
      const conferenceId = this.routeParams.id
      this.param.conferenceId = conferenceId
      this.param.attendeeIdList.push(attendeeId)
      this.$dialog.confirm({
        title: '将为该人员分配房间',
        message: '确认分配',
        className: 'customDialog'
      }).then(() => {
        // on confirm
        console.log(this.routeParams)
        console.log(this.param)
        this.$api({
          url: 'manage.allotRoom',
          data: this.param
        }).then(res => {
          if (res.code === 2000) {
            this.calendarShow = false
            this.calendarChoiceShow = false
            this.$toast.success('用房添加成功')
            this.submitShow = true
          }
        }).catch(err => {
          this.$toast({
            message: err.message
            // position: 'bottom'
          })
        })
      }).catch(() => {
        // on cancel
      })
    },
    // 确认选择
    submit() {
      const res = []
      this.$refs.list.listData.forEach(ele => {
        if (ele.checked) {
          res.push(ele)
        }
      })
      if (!res.length) {
        this.$toast('请至少选择一个酒店')
        return false
      }
      this.calendarChoiceShow = true
    },
    cardCancel(ele, popoverText) {
      const type = popoverText.text
      const conferenceId = this.routeParams.id
      // const id = ele.id
      // const startDate = this.routeParams.startTime.slice(0, 10)
      // const endDate = this.routeParams.endTime.slice(0, 10)
      const hide = true
      if (type === '详细信息') {
        this.$router.push({
          name: 'formStayManage',
          query: {
            [this.$enc('conferenceId')]: this.$enc(conferenceId),
            [this.$enc('roomId')]: this.$enc(ele.roomId),
            [this.$enc('startDate')]: this.$enc(ele.startDate),
            [this.$enc('endDate')]: this.$enc(ele.endDate),
            [this.$enc('hide')]: this.$enc(hide)
          }
        })
      } else if (type === '入住人员') {
        this.$router.push({
          name: 'manageStayStaff',
          query: {
            [this.$enc('conferenceId')]: this.$enc(conferenceId),
            [this.$enc('roomId')]: this.$enc(ele.roomId),
            [this.$enc('startDate')]: this.$enc(ele.startDate),
            [this.$enc('endDate')]: this.$enc(ele.endDate),
            [this.$enc('fullStatus')]: this.$enc(ele.fullStatus),
            [this.$enc('hotelName')]: this.$enc(ele.roomFormVO.hotelVO.name),
            [this.$enc('roomNo')]: this.$enc(ele.roomNo),
            [this.$enc('hide')]: this.$enc(hide)
          }
        })
      }
    },
    // 单选及反选
    choice(ele, index) {
      this.$refs.list.listData.forEach((ele, indexChoice) => {
        if (index === indexChoice) {
          ele.checked = !ele.checked
        } else {
          ele.checked = false
        }
        this.$set(this.$refs.list.listData, indexChoice, ele)
      })
      this.param.roomId = ele.roomId
      this.startDate = ele.startDate
      this.endDate = ele.endDate
    },
    filterDateHandler() {
      const startDinnerDate = (/\d{4}-\d{1,2}-\d{1,2}/g.exec(this.routeParams.startTime))[0]
      const endDinnerDate = (/\d{4}-\d{1,2}-\d{1,2}/g.exec(this.routeParams.endTime))[0]
      // this.prevMonth(startDinnerDate)
      // this.nextMonth(endDinnerDate)
      const nowDateMill = new Date().getTime()
      const startDateMill = new Date(this.routeParams.startTime).getTime()
      const endDateMill = new Date(this.routeParams.endTime).getTime()
      if (nowDateMill > endDateMill) {
        // 当前日期大于结束日期
        this.filterDate = `${startDinnerDate}至${endDinnerDate}`
      } else {
        if (nowDateMill > startDateMill) {
          const now = new Date()
          const year = now.getFullYear()
          const month = now.getMonth() + 1
          const date = now.getDate()
          this.filterDate = `${year}-${month}-${date} 至 ${endDinnerDate}`
        } else {
          this.filterDate = `${startDinnerDate} 至 ${endDinnerDate}`
        }
        const defaultStartDate = new Date(this.filterDate.slice(0, 10))
        const defaultEndDate = new Date(this.filterDate.slice(-10))
        this.defaultDate = [defaultStartDate, defaultEndDate]
      }
    },
    dateConfirm(val) {
      const startTime = this.dateCode(val[0])
      const endTime = this.dateCode(val[1])
      this.filterDate = `${startTime} - ${endTime}`
      // 请求接口
      this.clear = true
      this.params.httpParams.startDate = startTime
      this.params.httpParams.endDate = endTime
      this.params.httpParams.pageNum = 1
      this.calendarShow = false
    },
    dateCode(date) {
      const now = new Date(date)
      const year = now.getFullYear()
      const month = (now.getMonth() + 1) < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1
      const day = (now.getDate()) < 10 ? `0${now.getDate()}` : now.getDate()
      return `${year}-${month}-${day}`
    },
    // 时间选择
    dateHandler() {
      this.calendarShow = true
    },
    // 重置搜索条件
    resetHandler() {
      this.resetRoom()
      this.resetRoomCount()
      this.resetStatus()
      this.resetTypes()
      this.resetInputStatus()
    },
    // 确定
    submitHandler() {
      // 房型
      const roomType = []
      this.roomData.forEach(ele => {
        if (ele.checked) {
          roomType.push(ele.enumKey)
        }
      })
      this.params.httpParams.modelIdList = roomType.join(',')
      // 床位数
      const roomCount = []
      this.roomCountData.forEach(ele => {
        if (ele.checked) {
          roomCount.push(ele.enumKey)
        }
      })
      this.params.httpParams.capacityList = roomCount.join(',')
      // 房间状态
      const status = []
      this.statusData.forEach(ele => {
        if (ele.checked) {
          status.push(ele.fullStatusList)
        }
      })
      this.params.httpParams.fullStatusList = status.join(',')
      // 房间使用方式
      const types = []
      this.typesData.forEach(ele => {
        if (ele.checked) {
          types.push(ele.oneself)
        }
      })
      this.params.httpParams.oneself = types.join(',')
      // 清空现有list数据
      this.clear = true
      this.params.httpParams.pageNum = 1
      // 合并输入框内容筛选条件
      const httpParams = Object.assign({}, this.params.httpParams, this.filterInput)
      this.params.httpParams = httpParams
      // 关闭弹窗
      this.sidePopupShow = false
    },
    roomChoice(index) {
      const isChecked = this.roomData[index].checked
      this.$set(this.roomData[index], 'checked', !isChecked)
    },
    resetRoom() {
      this.roomData.forEach(ele => {
        ele.checked = false
      })
    },
    roomCountChoice(index) {
      const isChecked = this.roomCountData[index].checked
      this.$set(this.roomCountData[index], 'checked', !isChecked)
    },
    resetRoomCount() {
      this.roomCountData.forEach(ele => {
        ele.checked = false
      })
    },
    statusChoice(index) {
      const isChecked = this.statusData[index].checked
      this.$set(this.statusData[index], 'checked', !isChecked)
    },
    resetStatus() {
      this.statusData.forEach(ele => {
        ele.checked = false
      })
    },
    typesChoice(index) {
      this.typesData.forEach(ele => {
        ele.checked = false
      })
      this.$set(this.typesData[index], 'checked', true)
    },
    resetTypes() {
      this.typesData.forEach(ele => {
        ele.checked = false
      })
    },
    // 重置筛选中输入框的内容
    resetInputStatus() {
      Object.keys(this.filterInput).forEach(key => {
        this.filterInput[key] = ''
      })
    },
    // 更多筛选条件
    filterHandler() {
      this.sidePopupShow = true
    },
    // 获取当前会议下所有房型
    getRoomType() {
      const id = this.routeParams.id
      this.$api({
        url: 'manage.getRoomType',
        data: {
          conferenceId: id
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result.list
          data.forEach(ele => {
            ele.checked = false
          })
          this.roomData = data
        }
      })
    },
    // 获取当前会议下床位数
    getRoomCount() {
      const id = this.routeParams.id
      this.$api({
        url: 'manage.getRoomBedCount',
        data: {
          conferenceId: id
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result.list
          data.forEach(ele => {
            ele.checked = false
          })
          this.roomCountData = data
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
      background-color: rgba(25, 31, 36, 0.04);
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
    height: calc(100% - 48px);
    top: 48px;
    // padding-top: 12px;
    padding-bottom: 64px;
    .list-item {
      width: 100%;
      border-radius: 8px;
      background-color: #fff;
      overflow: hidden;
      padding: 16px 16px 8px;
      margin-bottom: 12px;
      // @include list(row, flex-start,center);
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
          .task-status {
            color: rgba(248, 183, 0, 1);
          }
        }
      }
      .car {
        font-size: 18px;
        font-weight: 500;
        line-height: 22px;
        margin-bottom: 6px;
        @include list(row, flex-start,center);
        i {
          display: block;
          width: 1px;
          height: 18px;
          background-color: rgba(216, 216, 216, 1);
          margin: 0 10px;
        }
        .room-status {
          height: 20px;
          line-height: 20px;
          padding: 0 7px;
          font-size: 13px;
          color: #fff;
          border-radius: 4px;
        }
        .room-status-free {
          background-color: rgba(3, 190, 28, 1);
        }
        .room-status-full-no {
          background-color: rgba(248, 183, 0, 1);
        }
        .room-status-full {
          background-color: rgba(25, 31, 36, 0.32);
        }
        .room-status-vip {
          background: linear-gradient(230deg, #FF00EA 0%, #8000F8 100%);
        }
      }
      .free {
        font-size: 14px;
        color: rgba(25, 31, 36, 0.64);
        line-height: 18px;
        margin-bottom: 12px;
      }
      .time {
        @include list(row,flex-start,center);
        font-size: 14px;
        color: rgba(25, 31, 36, 0.64);
        line-height: 18px;
        margin-bottom: 8px;
        img {
          margin-right: 8px;
        }
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
  .item-container {
    flex: 1;
    width: 100%;
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
    .van-button {
      width: 100%;
      height: 56px;
    }
  }
}
</style>
<style lang="scss" scoped>
.manage-use-car-container::v-deep {
   .van-pull-refresh {
    padding-top: 12px;
  }
}
</style>
