<!--
 * @Descripttion: 此组件的vehicleTypeLike和companyNameLike参数不能传空字符串，需要传null。等待接口修复。
 * @Author: zhaohx
 * @Date: 2021-07-04 20:09:53
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-11 12:27:48
-->
<template>
  <div class="manage-stay-staff-container">
    <div class="tabs-container">
      <swiper :options="swiperOptions" v-if="tabsData.length">
        <swiper-slide v-for="(ele, index) in tabsData" :key="index">
          <div
            class="tabs-item"
            :class="ele.checked ? 'tabs-item-checked' : ''"
            @click="tabsChoice(index)"
          >
            {{ ele.text }}
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <div class="filter-container">
      <van-search
        v-model="searchVal"
        shape="round"
        background="#fff"
        placeholder="输入车牌号查询"
        @search="search"
      />
      <div class="filter-btn" @click="filterHandler">
        筛选
        <img src="@/assets/images/filter.svg" alt="">
      </div>
    </div>
    <div class="room-info">
      {{ routeParams.cardName }}
      <div class="room-number">
        可用{{ routeParams.remainCount }}张
        <i />
        共{{ routeParams.totalCount }}张
      </div>
    </div>
    <list
      ref="list"
      :params="params"
      :clear="clear"
      @resetClear="resetClear"
      @onRefresh="onRefresh"
      @onLoad="onLoad"
    >
      <template v-slot:item="data">
        <van-checkbox-group
          v-model="changeCars"
          @change="checkGroupChange"
          ref="checkboxGroup"
        >
          <div
            v-for="(ele, i) in data.data"
            :key="ele.id"
            class="list-item"
            @click="clickItem(i)"
          >
            <div class="left-item">
              <van-checkbox
                v-if="changeStatus"
                :ref="'checkbox'+ i"
                class="list-check"
                :name="ele"
              />
              <dl>
                <dt>
                  {{ ele.vehicle.platNum }}
                  <div
                    class="status"
                    :class="ele.card.cardStatus === 2 ? 'status-making' : ele.card.cardStatus === 3 ? 'status-unclaimed' : ele.card.cardStatus === 4 ? 'status-drew' : ele.card.cardStatus === 5 ? 'status-isvoid' : ''"
                  >{{ ele.card.cardStatusStr }}</div>
                </dt>
                <dd>{{ ele.vehicle.vehicleTypeVO.name }} - {{ ele.vehicle.vehicleColorStr }}</dd>
                <dd><span>司机：</span>{{ ele.vehicle.driverVO.name }}</dd>
                <dd><span>电话：</span><span class="contact">{{ ele.vehicle.driverVO.phone }}</span></dd>
              </dl>
            </div>
            <van-popover
              v-if="!changeStatus"
              v-model="showPopover[i]"
              theme="dark"
              :actions="popoverText"
              placement="top-end"
              trigger="click"
              @select="cardCancel(ele)"
            >
              <template #reference>
                <img src="@/assets/svg/invitation/morenew4.svg" />
              </template>
            </van-popover>
          </div>
        </van-checkbox-group>
      </template>
    </list>
    <div class="btn-bottom" v-if="!changeStatus">
      <van-button round @click="changeStatus = true">调整证件状态</van-button>
    </div>
    <div class="status-bottom" v-if="changeStatus">
      <div class="all-check">
        <van-checkbox v-model="checkAll" :disabled="couldAll" @click="toggleAll">全选</van-checkbox>
      </div>
      <div>
        <van-button round @click="changeStatusCancel">取消</van-button>
        <van-button
          round
          type="info"
          :disabled="changeCars.length === 0"
          @click="statusShow = true"
      >
        确定
        <span v-if="changeCars.length !== 0">({{changeCars.length}})</span>
      </van-button>
      </div>
    </div>
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
            颜色
          </div>
          <ul class="filter-condition">
            <li
              v-for="(ele,index) in colorData"
              :key="index"
              @click="colorChoice(index)"
              :class="ele.checked ? 'filter-btn-checked' : ''"
            >
              {{ ele.enumValue }}
            </li>
          </ul>
        </div>
        <div class="popup-item">
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
              {{ ele.enumValue }}
            </li>
          </ul>
        </div>
        <div class="popup-title">
          <i />
          其他条件筛选
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
            v-model="filterInput.companyNameLike"
            background="#fff"
            placeholder="输入所属公司查询"
          />
        </div>
      </div>
      <div class="filter-submit-btn">
        <van-button @click="resetHandler">重置</van-button>
        <van-button type="info" @click="submitHandler">确定</van-button>
      </div>
    </van-popup>
    <van-popup v-model="statusShow" position="bottom" round class="status-pop">
      <div class="status-head">请选择调整为哪种状态</div>
      <div class="status-container">
        <div
          class="status-item"
          v-for="t in statusColumn"
          :key="t.value"
          @click="selectStatus = t.value"
        >
          <van-icon v-if="selectStatus === t.value" name="success" color="#1989fa" />
          {{t.label}}
        </div>
      </div>
      <div class="status-footer">
        <van-button @click="statusPopCancel">取消</van-button>
        <van-button type="info" @click="statusComfirm">确定</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Vue from 'vue'
import list from '@/components/list'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { Dialog, Toast, Popover } from 'vant'
Vue.use(Popover)
export default {
  components: { list, swiper, swiperSlide },
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      changeStatus: false,
      statusShow: false,
      changeCars: [],
      checkAll: false,
      showPopover: [],
      popoverText: [{ text: '取消分配' }],
      statusColumn: [{
        label: '制证中',
        value: '2'
      }, {
        label: '待领取',
        value: '3'
      }, {
        label: '已领取',
        value: '4'
      }, {
        label: '已作废',
        value: '5'
      }],
      selectStatus: '',
      swiperOptions: {
        slidesPerView: 'auto',
        spaceBetween: 40,
        slidesOffsetBefore: 20,
        freeMode: true
      },
      tabsData: [
        { checked: true, text: '全部', cardStatus: '' },
        { checked: false, text: '已分配', cardStatus: '1' },
        { checked: false, text: '制证中', cardStatus: '2' },
        { checked: false, text: '待领取', cardStatus: '3' },
        { checked: false, text: '已领取', cardStatus: '4' },
        { checked: false, text: '作废', cardStatus: '5' },
        { checked: false, text: '取消', cardStatus: '6' }
      ],
      // 颜色
      colorData: [],
      // 座位
      seatData: [],
      searchVal: '',
      sidePopupShow: false,
      filterInput: {
        vehicleTypeLike: '',
        companyNameLike: ''
      },
      params: {
        httpUrl: 'manage.getCardCarsList',
        type: 'up',
        // 模拟数据
        httpParams: {
          conferenceId: '',
          cardId: '',
          cardStatus: '',
          // 车型 ：访问接口时不能传空字符串 - 接口有点问题
          // vehicleTypeLike: null,
          // 所属公司 ：访问接口时不能传空字符串 - 接口有点问题
          // companyNameLike: null,
          // 搜索框内容
          platNumLike: '',
          pageNum: 1,
          pageSize: 10
        }
      },
      clear: false,
      carsParams: {
        cardStatus: '',
        cardVehicleList: []
      }
    }
  },
  created() {
    const conferenceId = this.routeParams.conferenceId
    const cardId = this.routeParams.cardId
    this.$nextTick(() => {
      this.params.httpParams.conferenceId = conferenceId
      this.params.httpParams.cardId = cardId
    })
    this.getColor()
    this.getSeat()
  },
  computed: {
    couldAll() {
      if (this.$refs.list && this.$refs.list.listData.length === 0) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    tabsChoice(index) {
      // 当前选中的不允许点击
      if (this.tabsData[index].checked) {
        return
      }
      this.tabsData.forEach(ele => {
        ele.checked = false
      })
      this.tabsData[index].checked = true
      const cardStatus = this.tabsData[index].cardStatus
      this.clear = true
      this.params.httpParams.cardStatus = cardStatus
      this.params.httpParams.pageNum = 1
    },
    // 搜索
    search() {
      this.clear = true
      this.params.httpParams.pageNum = 1
      this.params.httpParams.platNumLike = this.searchVal
    },
    // 重置搜索条件
    resetHandler() {
      this.resetInputStatus()
    },
    // 确定
    submitHandler() {
      // 颜色
      const colorType = []
      this.colorData.forEach(ele => {
        if (ele.checked) {
          colorType.push(ele.enumKey)
        }
      })
      this.params.httpParams.vehicleColorIdList = colorType.join(',')
      // 座位
      const seatType = []
      this.seatData.forEach(ele => {
        if (ele.checked) {
          seatType.push(ele.enumKey)
        }
      })
      this.params.httpParams.seatNumList = seatType.join(',')
      // 清空现有list数据
      this.clear = true
      // 合并输入框内容筛选条件
      const httpParams = Object.assign({}, this.params.httpParams, this.filterInput)
      this.params.httpParams = httpParams
      // 关闭弹窗
      this.sidePopupShow = false
    },
    colorChoice(index) {
      const isChecked = this.colorData[index].checked
      this.$set(this.colorData[index], 'checked', !isChecked)
    },
    resetColor() {
      this.colorData.forEach(ele => {
        ele.checked = false
      })
    },
    seatChoice(index) {
      const isChecked = this.seatData[index].checked
      this.$set(this.seatData[index], 'checked', !isChecked)
    },
    resetSeat() {
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
    // 获取颜色
    getColor() {
      const conferenceId = this.routeParams.conferenceId
      this.$api({
        url: 'manage.getCardCarsColor',
        data: {
          conferenceId
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result.list
          this.colorData = data
        }
      })
    },
    // 获取座位
    getSeat() {
      const conferenceId = this.routeParams.conferenceId
      this.$api({
        url: 'manage.getCardCarsSeat',
        data: {
          conferenceId
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result.list
          this.seatData = data
        }
      })
    },
    // 更多筛选条件
    filterHandler() {
      this.sidePopupShow = true
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
    // 点击整张卡片选中
    clickItem(index) {
      if (!this.changeStatus) {
        return false
      }
      this.$refs[`checkbox${index}`][0].toggle()
    },
    // 取消修改状态
    changeStatusCancel() {
      this.changeStatus = false
      this.changeCars = []
      this.checkAll = false
    },
    statusPopCancel() {
      this.statusShow = false
      this.selectStatus = ''
    },
    // 全选与反选
    toggleAll() {
      if (this.checkAll === true) {
        this.$refs.checkboxGroup.toggleAll(true)
      } else {
        this.$refs.checkboxGroup.toggleAll()
      }
    },
    checkGroupChange() {
      const selectLen = this.changeCars.length
      const listLen = this.$refs.list.listData.length
      if (selectLen !== listLen) {
        this.checkAll = false
      } else {
        this.checkAll = true
      }
    },
    cardCancel(data) {
      Dialog.confirm({
        title: `将取消该车辆的证件分配`,
        message: '确认取消?',
        confirmButtonColor: '#1E89FF'
      }).then(() => {
        const obj = {
          cardStatus: 6,
          cardVehicleList: [{
            card: { id: data.card.id },
            vehicle: { id: data.vehicle.id }
          }]
        }
        this.$api({
          url: 'manage.changeCarStatus',
          data: obj
        }).then(res => {
          if (res.code === 2000) {
            this.$api({
              url: 'manage.getCardCarsList',
              data: this.params.httpParams
            }).then(res => {
              if (res.code === 2000) {
                this.$refs.list.listData = res.result.list
              }
            })
          }
        }).catch(err => {
          Toast(err.message)
        })
      })
    },
    // 修改状态确定
    statusComfirm() {
      this.carsParams.cardStatus = this.selectStatus
      this.carsParams.cardVehicleList = []
      this.changeCars.map(t => {
        const obj = {
          card: { id: '' },
          vehicle: { id: '' }
        }
        obj.card.id = t.card.id
        obj.vehicle.id = t.vehicle.id
        this.carsParams.cardVehicleList.push(obj)
      })
      Dialog.confirm({
        title: `将修改${this.changeCars.length}辆车辆的证件分配状态`,
        message: '确认修改?',
        confirmButtonColor: '#1E89FF'
      }).then(() => {
        this.$api({
          url: 'manage.changeCarStatus',
          data: this.carsParams
        }).then(res => {
          if (res.code === 2000) {
            this.$api({
              url: 'manage.getCardCarsList',
              data: this.params.httpParams
            }).then(res => {
              if (res.code === 2000) {
                this.$refs.list.listData = res.result.list
              }
            })
            this.selectStatus = ''
            this.changeCars = []
            this.changeStatus = false
            this.statusShow = false
          }
        }).catch(err => {
          Toast(err.message)
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.manage-stay-staff-container {
  min-height: 100%;
  background-color: #f8f8f8;
  .tabs-container {
    height: 54px;
    .swiper-container {
      width: 100%;
      height: 100%;
      background-color: #fff;
      .swiper-slide {
        width: auto !important;
        @include list(row, flex-start, center);
        .tabs-item {
          height: 100%;
          line-height: 54px;
          font-size: 15px;
        }
        .tabs-item-checked {
          color: rgba(30, 137, 255, 1);
          position: relative;
          &:after {
            content: '';
            display: block;
            width: 80%;
            height: 3px;
            background: linear-gradient(270deg, #40BEFF 0%, #1E89FF 100%);
            border-radius: 2px;
            position: absolute;
            bottom: 8px;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        &:nth-last-of-type(1) {
          padding-right: 10px;
        }
      }
    }
  }
  .filter-container {
    width: 100%;
    height: 48px;
    line-height: 48px;
    background-color: #fff;
    padding: 0 16px;
    @include list(row, space-between, center);
    .van-search {
      padding: 0;
      width: 283px;
    }
    .filter-btn {
      @include list(row, flex-start, center);
      font-size: 13px;
      img {
        margin-left: 4px;
      }
    }
  }
  .room-info {
    width: 100%;
    height: 36px;
    padding: 0 16px;
    font-size: 14px;
    background-color: rgba(255, 250, 235, 1);
    color: rgba(224, 143, 0, 1);
    @include list(row,space-between,center);
    .room-number {
      @include list(row,space-between,center);
      color: rgba(25, 31, 36, 0.56);
      i {
        display: block;
        width: 1px;
        height: 14px;
        background-color: rgba(224, 143, 0, 1);
        margin: 0 10px;
      }
    }
  }
  .list-container {
    height: calc(100% - 138px);
    top: 138px;
    // padding-top: 12px;
    .list-item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      background-color: #fff;
      border-radius: 8px;
      margin-bottom: 10px;
      padding: 16px 16px 12px;
      .left-item {
        display: flex;
      }
      i {
        border-radius: 8px;
        padding: 4px 14px;
        background-color: rgba(3, 190, 28, 0.08);
        color: #1E89FF;
      }
      .list-check {
        margin-right: 16px;
      }
      .refuse {
        background-color: rgba(244, 249, 255, 1);
        color: rgba(30, 137, 255, 1);
      }
      dl {
        line-height: 18px;
        dt {
          font-size: 16px;
          font-weight: 500;
          @include list(row,flex-start,center);
          margin-bottom: 10px;
          .status {
            display: block;
            width: 44px;
            height: 18px;
            text-align: center;
            line-height: 18px;
            color: #fff;
            background-color: rgba(248, 183, 0, 1);
            border-radius: 4px;
            font-size: 12px;
            margin-left: 8px;
          }
          .status-making {
            background-color: rgba(3, 190, 28, 1);
          }
          .status-unclaimed {
            background-color: rgba(30, 137, 255, 1);
          }
          .status-drew {
            background-color: rgba(255, 130, 0, 1);
          }
          .status-isvoid {
            background-color: rgba(25, 31, 36, 0.32);
          }
        }
        dd {
          font-size: 13px;
          margin-bottom: 6px;
          span {
            color: rgba(25, 31, 36, 0.64);
          }
          .contact {
            color: rgba(30, 137, 255, 1);
          }
        }
      }
    }
  }
  .btn-bottom {
    display: flex;
    width: 100%;
    padding: 10px 16px;
    background-color: #fff;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 9;
    button {
      width: 100%;
      height: 38px;
      border-radius: 19px;
      font-size: 15px;
      font-weight: 400;
    }
  }
  .status-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 8px 16px;
    background-color: #fff;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 9;
    button {
      width: 96px;
      height: 38px;
      &:first-child {
        margin-right: 8px;
      }
    }
    .all-check {
      font-size: 15px;
      font-weight: 400;
      color: rgba(25, 31, 36, 0.8);
    }
  }
  .status-pop {
    background-color: #eee;
    .status-head {
      padding: 11px 0;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(25, 31, 36, 0.64);
      line-height: 18px;
      text-align: center;
      background-color: #fff;
      border-bottom: 1px solid #eeeeef;
    }
    .status-container {
      margin-bottom: 10px;
      background-color: #fff;
      .status-item {
        margin: 0 15px;
        padding: 17px 0;
        display: flex;
        align-items: center;
        font-size: 17px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191F24;
        line-height: 22px;
        border-bottom: 1px solid #eeeeef;
        i {
          margin-right: 16px;
          font-size: 18px;
        }
      }
    }
    .status-footer {
      width: 100%;
      display: flex;
      background-color: #fff;
      button {
        height: 56px;
        flex: 1;
        border-radius: 0;
        border: none;
      }
    }
  }
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
}
</style>
