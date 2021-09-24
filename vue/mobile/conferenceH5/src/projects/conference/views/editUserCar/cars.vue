<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 20:09:53
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-12 18:07:33
-->
<template>
  <div class="manage-use-car-container">
    <div class="filter-container">
      <div class="drivers-count">
        <img src="@/assets/images/cars.svg" alt="">
        <span>会议可用车辆共{{ carsCount }}台</span>
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
          @click="choice(ele, index)"
        >
          <div class="pic"><img :src="ele.checked ? choose : chooseDefault" alt=""></div>
          <div class="content">
            <dl>
            <dt>
              {{ ele.vehicleTypeVO.name }}-{{ ele.platNum }}-{{ ele.vehicleColorStr }}
              <span>{{ ele.vehicleTypeVO.seatNum }}座</span>
            </dt>
            <dd>
              <span>司机：</span>
              <span>{{ ele.driverVO ? ele.driverVO.name ? ele.driverVO.name : '-' : '-' }}</span>
              <i />
              <span class="contact">{{ ele.driverVO ? ele.driverVO.phone ? ele.driverVO.phone : '-' : '-' }}</span>
            </dd>
          </dl>
          <div class="cars-company">车辆所属公司：{{ ele.vehicleCompanyVO ? ele.vehicleCompanyVO.name ? ele.vehicleCompanyVO.name : '-' : '-'}}</div>
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
        <div class="popup-item">
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
              v-model="filterInput.vehicleCompanyLike"
              background="#fff"
              placeholder="输入所属公司查询"
            />
          </div>
        </div>
      </div>
      <div class="filter-submit-btn">
        <van-button @click="resetHandler">重置</van-button>
        <van-button type="info" @click="submitHandler">确定</van-button>
      </div>
    </van-popup>
    <div class="single-btn-bottom"  v-if="isLoading">
      <van-button
        @click="$emit('closePopup')"
      >
        取消
      </van-button>
      <van-button
        type="info"
        @click="submit"
      >
        确认选择
      </van-button>
    </div>
  </div>
</template>

<script>
import list from '@/components/list'
import chooseDefault from '@/assets/images/chooseDefault.svg'
import choose from '@/assets/images/choose.svg'
export default {
  components: { list },
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      isLoading: false,
      chooseDefault, choose,
      // 司机人数
      carsCount: '',
      sidePopupShow: false,
      filterInput: {
        platNumLike: '',
        vehicleTypeLike: '',
        vehicleCompanyLike: ''
      },
      // 颜色
      colorData: [],
      // 座位
      seatData: [],
      params: {
        customParams: true,
        httpUrl: 'manage.getCarsList',
        type: 'up',
        httpParams: {
          conferenceId: '',
          // 颜色
          vehicleColorIdList: '',
          // 座位
          seatNumList: '',
          // 车牌号
          platNumLike: '',
          // 车型
          vehicleTypeLike: '',
          // 所属公司
          vehicleCompanyLike: '',
          pageNum: 1,
          pageSize: 10
        }
      },
      clear: false
    }
  },
  created() {
    const id = this.routeParams.conferenceId
    this.$nextTick(() => {
      this.params.httpParams.conferenceId = id
    })
    this.getColor()
    this.getSeat()
  },
  methods: {
    submit() {
      this.$refs.list.listData.forEach(ele => {
        if (ele.checked) {
          this.$emit('getCarsData', ele)
        }
      })
      // this.$dialog.confirm({
      //   title: '将添加1辆车辆',
      //   message: '确认添加？',
      //   className: 'customDialog'
      // }).then(() => {
      //   this.$refs.list.listData.forEach(ele => {
      //     if (ele.checked) {
      //       this.$emit('getCarsData', ele)
      //     }
      //   })
      // }).catch(() => {
      //   this.$toast('取消添加')
      // })
    },
    // 单选及反选
    choice(ele, index) {
      this.$refs.list.listData.forEach(eleChoice => {
        eleChoice.checked = false
      })
      const data = this.$refs.list.listData[index]
      ele.checked = true
      this.$set(this.$refs.list.listData, index, data)
    },
    // 重置搜索条件
    resetHandler() {
      this.resetColor()
      this.resetSeat()
      this.resetInputStatus()
    },
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
      this.params.httpParams.pageNum = 1
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
    // 更多筛选条件
    filterHandler() {
      this.sidePopupShow = true
    },
    // 获取颜色
    getColor() {
      const conferenceId = this.routeParams.conferenceId
      this.$api({
        url: 'manage.getCarsColor',
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
        url: 'manage.getCarsSeat',
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
    loadFinish(res) {
      this.carsCount = res.result.total
      const data = res.result.list
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
  .filter-container {
    width: 100%;
    height: 48px;
    line-height: 48px;
    background-color: #fff;
    padding: 0 16px;
    @include list(row, space-between, center);
    .drivers-count {
      font-size: 15px;
      color: rgba(224, 143, 0, 1);
      @include list(row, flex-start, center);
      img {
        margin-right: 6px;
      }
    }
    .filter-btn {
      line-height: 48px;
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
    padding-bottom: 64px;
    // padding-top: 12px;
    .list-item {
      width: 100%;
      background-color: #fff;
      border-radius: 8px;
      margin-bottom: 10px;
      padding: 16px 0 12px;
      @include list(row, flex-start,center);
      .pic {
        width: 24px;
        margin-left: 16px;
      }
      .content {
        flex: 1;
      }
      .refuse {
        background-color: rgba(244, 249, 255, 1);
        color: rgba(30, 137, 255, 1);
      }
      dl {
        padding: 0 16px 4px 12px;
        line-height: 18px;
        dt {
          font-size: 16px;
          font-weight: 500;
          @include list(row,space-between,center);
          margin-bottom: 10px;
          span {
            font-size: 14px;
            color: rgba(25, 31, 36, 0.64);
            font-weight: normal;
          }
        }
        dd {
          font-size: 13px;
          margin-bottom: 6px;
          color: rgba(25, 31, 36, 0.48);
          @include list(row,flex-start,center);
          i {
            display: block;
            width: 1px;
            height: 14px;
            background-color: rgba(25, 31, 36, 0.24);
            margin: 0 10px;
          }
          span {
            color: rgba(25, 31, 36, 0.64);
          }
          .contact {
            color: rgba(30, 137, 255, 1);
          }
        }
      }
      .cars-company {
        width: 100%;
        font-size: 13px;
        color: rgba(25, 31, 36, 0.48);
        padding: 12px 16px 0;
        // border-top: 1px solid #f2f2f3;
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
  .single-btn-bottom {
    @include list(row, space-between,center);
    .van-button {
      width: 167px;
    }
  }
}
</style>
