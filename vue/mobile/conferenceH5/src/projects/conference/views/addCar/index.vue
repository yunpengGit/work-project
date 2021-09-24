<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 20:09:53
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-11 23:58:53
-->
<template>
  <div class="add-driver-container">
    <van-form>
      <h3>车辆信息</h3>
      <van-cell-group>
        <van-field
          readonly
          required
          v-model="paramsVal.vehicleTypeStr"
          label="车型"
          placeholder="请选择车型"
          input-align="right"
          right-icon="arrow"
          @click="showSheet('carTypeData')"
        />
        <van-field
          readonly
          required
          v-model="paramsVal.seatNumStr"
          label="座位数"
          placeholder="请选择品牌车辆"
          input-align="right"
        />
        <van-field
          readonly
          required
          v-model="paramsVal.vehicleColorStr"
          label="颜色"
          placeholder="请选择颜色"
          input-align="right"
          right-icon="arrow"
          @click="showSheet('colorsData')"
        />
        <van-field
          required
          v-model="params.platNum"
          label="车牌号"
          placeholder="请输入车牌号"
          input-align="right"
        />
        <van-field
          readonly
          required
          v-model="paramsVal.companyIdStr"
          label="所属公司"
          placeholder="请选择所属公司"
          input-align="right"
          right-icon="arrow"
          @click="showSheet('companyData')"
        />
      </van-cell-group>
    </van-form>
    <van-form>
      <h3>司机信息</h3>
      <van-cell-group>
        <van-field
          readonly
          required
          v-model="paramsVal.driverIdStr"
          label="姓名"
          placeholder="请选择司机"
          input-align="right"
          right-icon="arrow"
          @click="driversChoiceShow"
        />
        <van-field
          readonly
          v-model="paramsVal.phone"
          placeholder="请选择司机"
          label="手机号"
          input-align="right"
        />
        <van-field
          readonly
          v-model="paramsVal.companyStr"
          label="所属公司"
          placeholder="请选择司机"
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
    <div class="single-btn-bottom">
      <van-button
        type="info"
        @click="submit"
      >提交</van-button>
    </div>
    <div class="cars-choice-container" v-if="driversChoiceFlag">
      <drivers
        v-if="driversChoiceFlag"
        :routeParams="routeParams"
        @getDriversData="getDriversData"
        @closePopup="closePopup"
      />
    </div>
  </div>
</template>

<script>
import drivers from './drivers'
export default {
  components: {
    drivers
  },
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      // 选择司机
      driversChoiceFlag: false,
      // sheet弹窗
      actionShow: false,
      actions: [],
      // 车型
      carTypeData: [],
      // 颜色
      colorsData: [],
      // 所属公司
      companyData: [],
      paramsVal: {
        // 车型
        vehicleTypeStr: '',
        // 座位
        seatNumStr: '',
        // 颜色
        vehicleColorStr: '',
        // 所属公司
        companyIdStr: '',
        // 姓名
        driverIdStr: '',
        // 手机号
        phone: '',
        // 司机信息- 所属公司
        companyStr: ''
      },
      params: {
        conferenceId: '',
        // 车型
        vehicleType: '',
        // 车辆颜色
        vehicleColor: '',
        // 车牌号
        platNum: '',
        // 所属公司
        companyId: '',
        // 司机id
        driverId: '',
        // 备注
        description: ''
      },
      clickType: ''
    }
  },
  created() {
    console.log(this.routeParams)
    const conferenceId = this.routeParams.conferenceId
    this.params.conferenceId = conferenceId
    // 获取日程可选择的时间范围
    this.getCarType()
    this.getColors()
    this.getCompany()
  },
  methods: {
    showSheet(type) {
      this.actions = this[type]
      this.actionShow = true
      this.clickType = type
    },
    getDriversData(ele) {
      this.driversChoiceFlag = false
      this.params.driverId = ele.id
      this.paramsVal.driverIdStr = ele.name
      this.paramsVal.phone = ele.phone
      this.paramsVal.companyStr = ele.vehicleCompanyVO.name
    },
    onSelect(item) {
      const clickType = this.clickType
      const name = item.name
      const id = item.id
      if (clickType === 'carTypeData') {
        this.params.vehicleType = id
        this.paramsVal.vehicleTypeStr = name
        this.paramsVal.seatNumStr = item.seatNum
      } else if (clickType === 'colorsData') {
        this.params.vehicleColor = id
        this.paramsVal.vehicleColorStr = name
      } else if (clickType === 'companyData') {
        this.params.companyId = id
        this.paramsVal.companyIdStr = name
      }
    },
    closePopup() {
      this.driversChoiceFlag = false
    },
    driversChoiceShow() {
      this.driversChoiceFlag = true
    },
    // 获取颜色
    getColors() {
      this.$api({
        url: 'dic.getColors'
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          data.forEach(ele => {
            ele.name = ele.valName
            ele.id = ele.valCode
          })
          this.colorsData = data
        }
      })
    },
    // 获取车型
    getCarType() {
      const conferenceId = this.routeParams.conferenceId
      this.$api({
        url: 'desk.getCarType',
        data: {
          conferenceId
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result.list
          this.carTypeData = data
        }
      })
    },
    // 获取车辆公司
    getCompany() {
      const conferenceId = this.routeParams.conferenceId
      this.$api({
        url: 'manage.getCarsCompany',
        data: {
          conferenceId
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result.list
          this.companyData = data
        }
      })
    },
    submit() {
      const params = this.params
      if (!params.vehicleType) {
        this.$toast('请选择车型')
        return
      } else if (!params.vehicleColor) {
        this.$toast('请选择车辆颜色')
        return
      } else if (!params.platNum) {
        this.$toast('请填写车牌号')
        return
      } else if (!params.companyId) {
        this.$toast('请选择所属公司')
        return
      } else if (!params.driverId) {
        this.$toast('请选择司机姓名')
        return
      }
      this.$dialog.confirm({
        title: '新增车辆',
        message: '确认新增？',
        className: 'customDialog'
      }).then(() => {
        this.$api({
          url: 'desk.addCar',
          data: params
        }).then(res => {
          if (res.code === 2000) {
            this.$toast('车辆添加成功')
            setTimeout(() => {
              this.$router.go(-1)
            }, 300)
          }
        })
      }).catch(() => {
        this.$toast('取消新增')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.add-driver-container::v-deep {
  padding: 0 0 74px;
  min-height: 100%;
  background-color: #f8f8f8;
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
}
</style>
