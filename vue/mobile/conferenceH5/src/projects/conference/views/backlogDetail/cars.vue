<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 20:09:53
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-22 13:23:29
-->
<template>
  <div class="add-driver-container">
    <van-form>
      <h3>车辆信息</h3>
      <van-cell-group>
        <van-field
          readonly
          v-model="paramsVal.vehicleTypeStr"
          label="车型"
          input-align="right"
        />
        <van-field
          readonly
          v-model="paramsVal.seatNumStr"
          label="座位数"
          input-align="right"
        />
        <van-field
          readonly
          v-model="paramsVal.vehicleColorStr"
          label="颜色"
          input-align="right"
        />
        <van-field
          readonly
          v-model="params.platNum"
          label="车牌号"
          input-align="right"
        />
        <van-field
          readonly
          v-model="paramsVal.companyIdStr"
          label="所属公司"
          input-align="right"
        />
      </van-cell-group>
    </van-form>
    <van-form>
      <h3>司机信息</h3>
      <van-cell-group>
        <van-field
          readonly
          v-model="paramsVal.driverIdStr"
          label="姓名"
          input-align="right"
        />
        <van-field
          readonly
          v-model="paramsVal.phone"
          label="手机号"
          input-align="right"
        />
        <van-field
          readonly
          v-model="paramsVal.companyStr"
          label="所属公司"
          input-align="right"
        />
      </van-cell-group>
    </van-form>
    <div class="form-item">
      <h3>备注</h3>
      <textarea readonly v-model="params.description"></textarea>
    </div>
    <van-action-sheet
      v-model="actionShow"
      :actions="actions"
      close-on-click-action
      cancel-text="取消"
      @select="onSelect"
    />
    <!-- <div class="single-btn-bottom">
      <van-button
        @click="deleteCar"
      >
        删除车辆
      </van-button>
      <van-button
        type="info"
        @click="submit"
      >
        保存
      </van-button>
    </div> -->
    <!-- <div class="cars-choice-container" v-if="driversChoiceFlag">
      <drivers
        v-if="driversChoiceFlag"
        :routeParams="routeParams"
        @getDriversData="getDriversData"
        @closePopup="closePopup"
      />
    </div> -->
  </div>
</template>

<script>
// import drivers from './drivers'
export default {
  components: {
    // drivers
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
    const id = this.routeParams.id
    this.$api({
      url: 'manage.getCarsDetail',
      data: {
        id
      }
    }).then(res => {
      if (res.code === 2000) {
        const data = res.result
        // this.detailData = data
        this.params.vehicleType = data.vehicleType
        this.params.vehicleColor = data.vehicleColor
        this.params.platNum = data.platNum
        this.params.companyId = data.companyId
        this.params.driverId = data.driverId
        this.params.description = data.description
        this.paramsVal.vehicleTypeStr = data.vehicleTypeVO ? data.vehicleTypeVO.name ? data.vehicleTypeVO.name : '-' : '-'
        this.paramsVal.seatNumStr = data.vehicleTypeVO.seatNum
        this.paramsVal.vehicleColorStr = data.vehicleColorStr ? data.vehicleColorStr : '-'
        this.paramsVal.companyIdStr = data.vehicleCompanyVO ? data.vehicleCompanyVO.name ? data.vehicleCompanyVO.name : '-' : '-'
        this.paramsVal.driverIdStr = data.driverVO ? data.driverVO.name ? data.driverVO.name : '-' : '-'
        this.paramsVal.phone = data.driverVO ? data.driverVO.phone ? data.driverVO.phone : '-' : '-'
        this.paramsVal.companyStr = data.driverVO ? data.driverVO.vehicleCompanyVO ? data.driverVO.vehicleCompanyVO.name ? data.driverVO.vehicleCompanyVO.name : '-' : '-' : '-'
      }
    })
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
    // 删除车辆
    deleteCar() {
      this.$dialog.confirm({
        title: '删除车辆',
        message: '确认删除？',
        className: 'customDialog'
      }).then(() => {
        const id = this.routeParams.id
        this.$api({
          url: 'desk.deleteCar',
          data: [id]
        }).then(res => {
          if (res.code === 2000) {
            this.$toast('删除车辆成功')
            setTimeout(() => {
              this.$router.go(-1)
            }, 300)
          }
        })
      }).catch(() => {
        this.$toast('取消删除')
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
        title: '编辑车辆',
        message: '确认编辑？',
        className: 'customDialog'
      }).then(() => {
        const id = this.routeParams.id
        params.id = id
        this.$api({
          url: 'desk.editCar',
          data: params
        }).then(res => {
          if (res.code === 2000) {
            this.$toast('编辑车辆成功')
            setTimeout(() => {
              this.$router.go(-1)
            }, 300)
          }
        })
      }).catch(() => {
        this.$toast('取消编辑')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.add-driver-container::v-deep {
  min-height: 100%;
  background-color: #f8f8f8;
  // padding: 0 0 64px;
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
    background-color: #fff;
    position: fixed;
    z-index: 9;
    @include list(row, space-between,center);
    .van-button {
      width: 167px;
    }
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
  .van-field__control {
    // text-align: right;
  }
}
</style>
