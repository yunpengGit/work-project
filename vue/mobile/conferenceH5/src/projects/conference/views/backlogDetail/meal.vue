<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 20:09:53
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-09-03 15:24:59
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
          :class="ele.status === '-1' ? 'list-item-checked' : ''"
        >
          <div class="pic" @click="choice(ele, index)"><img :src="ele.assignment ? chooseForbid : ele.checked ? choose : chooseDefault" alt=""></div>
          <div class="list-content">
            <div class="status">
              <div class="status-title">
                <span>{{ ele.typeCode }}</span>
                <i />
                {{ dinnerTime(ele) }}
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
            <div class="free">
              <span>餐厅：</span>
              {{ ele.dining.dinnerRoom }}
              <i />
              可用餐位
              {{ ele.dining.remainCount }}
              <i />
            </div>
            <div class="free">
              <span>地址：</span>
              {{ ele.dining.diningAddress }}
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
            用餐类型
          </div>
          <ul class="filter-condition">
            <li
              v-for="(ele,index) in mealData"
              :key="index"
              @click="mealChoice(index)"
              :class="ele.checked ? 'filter-btn-checked' : ''"
            >
              {{ ele.typeCode }}
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
              v-model="filterInput.dinnerRoomLike"
              background="#fff"
              placeholder="输入餐厅名称查询"
            />
          </div>
          <div class="filter-input">
            <van-search
              v-model="filterInput.seatNum"
              background="#fff"
              placeholder="输入餐位数量查询"
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
      title="选择用餐时间"
      color="#1989fa"
      :default-date="defaultDate"
      :min-date="prevMonth"
      :max-date="nextMonth"
      @confirm="dateConfirm"
    />
    <div class="single-btn-bottom single-btn-bottom-allow" v-if="isLoading">
      <!-- <van-button
        @click="$router.push({
          name: 'addMeal',
          query: {
            [$enc('conferenceId')]: $enc(routeParams.id),
            [$enc('startTime')]: $enc(routeParams.startTime),
            [$enc('endTime')]: $enc(routeParams.endTime),
          }
        })"
      >添加用餐任务</van-button> -->
      <van-button
        type="info"
        @click="submit"
      >确认选择</van-button>
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
    <van-action-sheet
      v-model="actionShow"
      :actions="actions"
      close-on-click-action
      cancel-text="取消"
      @select="onSelect"
    />
  </div>
</template>

<script>
import list from '@/components/list'
import chooseDefault from '@/assets/images/chooseDefault.svg'
import choose from '@/assets/images/choose.svg'
import chooseForbid from '@/assets/images/chooseForbid.svg'
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
      actionShow: false,
      actions: [],
      submitData: [
        { name: '分配完成', checked: true },
        { name: '继续分配', checked: false },
        { name: '稍后分配', checked: false }
      ],
      submitShow: false,
      popoverText: [{ text: '详细信息' }, { text: '用餐人员' }],
      showPopover: [],
      chooseDefault, choose, chooseForbid, checkedIcon,
      isLoading: false,
      calendarShow: false,
      minDate: new Date(),
      maxDate: new Date(),
      filterDate: '',
      sidePopupShow: false,
      filterInput: {
        dinnerRoomLike: '',
        seatNum: ''
      },
      // 默认选中的日期
      defaultDate: [],
      // 用餐类型
      mealData: [],
      params: {
        httpUrl: 'manage.getMealList',
        type: 'up',
        httpParams: {
          attendeeId: '',
          conferenceId: '',
          // 用餐开始时间
          startDinnerDate: '',
          // 用餐结束时间
          endDinnerDate: '',
          // 用餐类型
          typeCodeList: '',
          sortName: 'dinnerDate',
          sortStatus: 'asc',
          pageNum: 1,
          pageSize: 10
        }
      },
      clear: false,
      choiceData: null
    }
  },
  computed: {
    prevMonth() {
      const date = (/\d{4}-\d{1,2}-\d{1,2}/g.exec(this.routeParams.startTime))[0]
      // 1 * 24 * 60 * 60 * 1000
      const nowDate = new Date(date).getTime()
      const resTime = nowDate - (60 * 24 * 60 * 60 * 1000)
      const year = new Date(resTime).getFullYear()
      const month = new Date(resTime).getMonth()
      const day = new Date(resTime).getDate()
      return new Date(year, month, day)
    },
    nextMonth() {
      const date = (/\d{4}-\d{1,2}-\d{1,2}/g.exec(this.routeParams.endTime))[0]
      // 1 * 24 * 60 * 60 * 1000
      const nowDate = new Date(date).getTime()
      const resTime = nowDate + (60 * 24 * 60 * 60 * 1000)
      const year = new Date(resTime).getFullYear()
      const month = new Date(resTime).getMonth()
      const day = new Date(resTime).getDate()
      return new Date(year, month, day)
    },
    dinnerTime() {
      return function(data) {
        const nowDate = new Date().getTime()
        const deDate = new Date(data.dinnerEndDate).getTime()
        const differDate = Math.ceil((deDate - nowDate) / (1000 * 60 * 60 * 24))
        const dinnerStartDate = this.dateFormat(data.dinnerStartDate)
        const dinnerEndDate = this.dateFormat(data.dinnerEndDate)
        const startTime = data.startTime.slice(0, 5)
        const endTime = data.endTime.slice(0, 5)
        let result = ''
        if (differDate === 1) {
          result = `${dinnerStartDate}至明天 ${startTime}-${endTime}`
        } else if (differDate === 2) {
          result = `${dinnerStartDate}至后天 ${startTime}-${endTime}`
        } else {
          result = `${dinnerStartDate}至${dinnerEndDate} ${startTime}-${endTime}`
        }
        return result
      }
    }
  },
  created() {
    console.log(this.routeParams)
    const id = this.routeParams.id
    const attendeeId = this.routeParams.attendeeId
    const startDinnerDate = (/\d{4}-\d{1,2}-\d{1,2}/g.exec(this.routeParams.startTime))[0]
    const endDinnerDate = (/\d{4}-\d{1,2}-\d{1,2}/g.exec(this.routeParams.endTime))[0]
    this.$nextTick(() => {
      this.params.httpParams.conferenceId = id
      this.params.httpParams.attendeeId = attendeeId
      this.params.httpParams.startDinnerDate = startDinnerDate
      this.params.httpParams.endDinnerDate = endDinnerDate
      attendeeId
    })
    this.getMeal()
    this.filterDateHandler()
  },
  methods: {
    onSelect(ele) {
      const tableNo = ele.name
      this.addMealUser(tableNo)
    },
    addMealUser(tableNo = '') {
      this.$dialog.confirm({
        title: tableNo ? `选定桌号为${tableNo}` : '为参会人添加用餐',
        message: '确认添加？',
        className: 'customDialog'
      }).then(() => {
        const params = {
          attendeeIdList: [this.routeParams.attendeeId],
          dinnerAttendees: [{ taskId: this.choiceData.id, tableNo }]
        }
        this.$api({
          url: 'desk.addMealUsers',
          data: params
        }).then(res => {
          if (res.code === 2000) {
            this.$refs.list.listData.forEach((eleChoice, indexChoice) => {
              if (this.choiceData.id === eleChoice.id) {
                eleChoice.assignment = true
                this.$set(this.$refs.list.listData, indexChoice, eleChoice)
              }
            })
            this.$toast.success('添加成功')
            this.submitShow = true
          }
        })
      }).catch(() => {
        this.$toast('取消')
      })
    },
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
          title: '确定完成用餐分配任务',
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
    // 确认选择
    submit() {
      const res = []
      this.$refs.list.listData.forEach(ele => {
        if (ele.checked) {
          res.push(ele)
        }
      })
      if (!res.length) {
        this.$toast('请至少选择一个任务')
        return false
      }
      const actions = []
      this.choiceData = res[0]
      this.choiceData.dining.tableNoList.forEach(ele => {
        actions.push({ name: ele })
      })
      this.actions = actions
      if (actions.length) {
        this.actionShow = true
      } else {
        this.addMealUser()
      }
    },
    submitChoice(index) {
      this.submitData.forEach(ele => {
        ele.checked = false
      })
      this.submitData[index].checked = true
    },
    cardCancel(ele, popoverText) {
      const type = popoverText.text
      const conferenceId = this.routeParams.id
      const hide = true
      if (type === '详细信息') {
        this.$router.push({
          name: 'formMealManage',
          query: {
            [this.$enc('conferenceId')]: this.$enc(conferenceId),
            [this.$enc('id')]: this.$enc(ele.id),
            [this.$enc('hide')]: this.$enc(hide)
          }
        })
      } else if (type === '用餐人员') {
        this.$router.push({
          name: 'manageMealStaff',
          query: {
            [this.$enc('conferenceId')]: this.$enc(conferenceId),
            [this.$enc('id')]: this.$enc(ele.diningId),
            [this.$enc('mealName')]: this.$enc(ele.dining.dinnerRoom),
            [this.$enc('mealType')]: this.$enc(ele.typeCode),
            [this.$enc('taskId')]: this.$enc(ele.id),
            [this.$enc('hide')]: this.$enc(hide)
          }
        })
      }
    },
    // 单选及反选
    choice(ele, index) {
      if (ele.assignment) {
        return
      }
      this.$refs.list.listData.forEach((ele, indexChoice) => {
        if (index === indexChoice) {
          ele.checked = !ele.checked
        } else {
          ele.checked = false
        }
        this.$set(this.$refs.list.listData, indexChoice, ele)
      })
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
      this.params.httpParams.startDinnerDate = startTime
      this.params.httpParams.endDinnerDate = endTime
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
    dateFormat(dateVal) {
      const date = new Date(dateVal)
      const month = date.getMonth() + 1
      const today = date.getDate()
      return `${month}月${today}日`
    },
    // 时间选择
    dateHandler() {
      this.calendarShow = true
    },
    // 重置搜索条件
    resetHandler() {
      this.resetMeal()
      this.resetTypes()
      this.resetInputStatus()
    },
    // 确定
    submitHandler() {
      // 用餐类型
      const mealData = []
      this.mealData.forEach(ele => {
        if (ele.checked) {
          mealData.push(ele.typeCode)
        }
      })
      this.params.httpParams.typeCodeList = mealData.join(',')
      // 清空现有list数据
      this.clear = true
      this.params.httpParams.pageNum = 1
      // 合并输入框内容筛选条件
      const httpParams = Object.assign({}, this.params.httpParams, this.filterInput)
      this.params.httpParams = httpParams
      // 关闭弹窗
      this.sidePopupShow = false
    },
    mealChoice(index) {
      const isChecked = this.mealData[index].checked
      this.$set(this.mealData[index], 'checked', !isChecked)
    },
    resetMeal() {
      this.mealData.forEach(ele => {
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
    // 获取用餐
    getMeal() {
      const id = this.routeParams.id
      this.$api({
        url: 'manage.getMeal',
        data: {
          conferenceId: id
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          data.forEach(ele => {
            ele.checked = false
          })
          this.mealData = data
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
      margin-top: 12px;
      @include list(row, flex-start,center);
      .pic {
        margin-right: 11px;
      }
      .list-content {
        width: 100%
      }
      .status {
        @include list(row, flex-start, center);
        font-size: 14px;
        color: rgba(25, 31, 36, 0.64);
        margin-bottom: 18px;
        .status-title {
          @include list(row, flex-start, center);
          flex: 1;
        }
        i {
          display: block;
          width: 1px;
          height: 14px;
          margin: 0 10px;
          background-color: rgba(25, 31, 36, 0.64);
        }
        span {
          font-size: 16px;
          color: rgba(25, 31, 36, 1);
          font-weight: 500;
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
        color: rgba(25, 31, 36, 1);
        line-height: 18px;
        margin-bottom: 4px;
        span {
          color: rgba(25, 31, 36, 0.48);
        }
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
    .list-item-checked {
      .status {
        color: rgba(25, 31, 36, 0.32);
        i {
          background-color: rgba(25, 31, 36, 0.32);
        }
        span {
          color: rgba(25, 31, 36, 0.32);
        }
      }
      .car {
        i {
          background-color: rgba(216, 216, 216, 1);
        }
      }
      .free {
        color: rgba(25, 31, 36, 0.32);
        span {
          color: rgba(25, 31, 36, 0.32);
        }
      }
      .time {
        color: rgba(25, 31, 36, 0.32);
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
    .van-button {
      width: 100%;
      height: 56px;
    }
  }
}
</style>
