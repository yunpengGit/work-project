<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 20:09:53
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-26 17:15:06
-->
<template>
  <div class="add-driver-container">
    <van-form>
      <h3>司机信息</h3>
      <van-cell-group>
        <van-field
          required
          :rules="[{ required: true, message: '请填写用户名' }]"
          v-model="params.name"
          label="姓名"
          placeholder="请输入姓名"
          input-align="right"
        />
         <van-field
          required
          :rules="[{ required: true, message: '请填写手机号' }]"
          v-model="params.phone"
          label="手机号"
          placeholder="请输入手机号"
          input-align="right"
          @blur="regPhone"
        />
        <van-field
          readonly
          v-model="paramsVal.sexVal"
          label="性别"
          placeholder="请选择性别"
          input-align="right"
          right-icon="arrow"
          @click="sheetChoice('sex')"
        />
        <van-field
          readonly
          v-model="paramsVal.companyIdVal"
          label="所属公司"
          placeholder="请选择所属公司"
          input-align="right"
          right-icon="arrow"
          @click="sheetChoice('company')"
        />
        <van-field
          v-model="params.idCard"
          label="身份证号"
          placeholder="请输入身份证号"
          input-align="right"
          @blur="cardComputed"
        />
        <van-field
          readonly
          v-model="paramsVal.age"
          label="年龄"
          placeholder="根据身份证号自动计算"
          input-align="right"
        />
        <van-field
          v-model="params.drivingAge"
          label="驾龄"
          placeholder="请输入驾龄"
          input-align="right"
        />
      </van-cell-group>
    </van-form>
    <div class="form-item">
      <h3>备注</h3>
      <textarea v-model="params.description" placeholder="请输入备注信息"></textarea>
    </div>
    <van-action-sheet
      v-model="actionShow"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onSelect"
    />
    <div class="single-btn-bottom">
      <van-button
        @click="deleteDriver"
      >删除司机信息</van-button>
      <van-button
        type="info"
        @click="submit"
      >保存</van-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      // paramsVal做展示用，当选择sheet时候动态改变params的id值，考虑用户网速慢提交不成功时候的再次提交，舍弃delete key方法改为分开赋值
      paramsVal: {
        sexVal: '',
        age: '',
        companyIdVal: ''
      },
      params: {
        conferenceId: '',
        name: '',
        idCard: '',
        drivingAge: '',
        phone: '',
        sex: '',
        companyId: '',
        // 描述
        description: ''
      },
      // 性别
      sexData: [],
      // 汽车公司
      carsCompanyData: [],
      actionShow: false,
      actions: [],
      // 当前选择的sheet是哪个
      actionsIndex: null
    }
  },
  created() {
    const conferenceId = this.routeParams.conferenceId
    this.params.conferenceId = conferenceId
    const getData = async function() {
      await this.getSex()
      await this.getCarsCompany()
      this.getDriverDetail()
    }.bind(this)
    getData()
  },
  methods: {
    submit() {
      const params = this.params
      const name = params.name
      const phone = params.phone
      // const companyId = params.companyId
      if (!name) {
        this.$toast('请输入姓名')
        return
      } else if (!phone || !this.mobileReg(phone)) {
        this.$toast('请输入正确的手机号')
        return
      }
      this.$dialog.alert({
        message: '到达时间不得大于返程时间，请重新选择到达时间或调整返程时间',
        confirmButtonText: '确定',
        className: 'customDialog'
      }).then(() => {
        this.findEle('arriveTime').fieldValue = ''
        this.findEle('arriveTime').fieldValueStr = ''
        this.timeData = []
        return
      })
      this.$dialog.confirm({
        title: '修改司机信息',
        message: '确认修改？',
        className: 'customDialog'
      }).then(() => {
        this.$api({
          url: 'manage.editDriver',
          data: params
        }).then(res => {
          if (res.code === 2000) {
            this.$toast('修改成功')
            setTimeout(() => {
              this.$router.back(-1)
            }, 150)
          }
        }).catch(err => {
          this.$toast(err.message)
        })
      }).catch(() => {})
    },
    // 删除司机信息
    deleteDriver() {
      const id = this.routeParams.id
      this.$dialog.confirm({
        title: '删除司机信息',
        message: '确认删除？',
        className: 'customDialog'
      }).then(() => {
        const params = new URLSearchParams()
        params.append('ids', id)
        this.$api({
          url: 'manage.deleteDriver',
          data: params
        }).then(res => {
          if (res.code === 2000) {
            this.$toast('删除成功')
            setTimeout(() => {
              this.$router.back(-1)
            }, 300)
          }
        }).catch(err => {
          this.$toast(err.message)
        })
      }).catch(() => {})
    },
    // 年龄根据身份证号码计算
    cardComputed() {
      const card = this.params.idCard
      if (!this.cardReg(card)) {
        this.$toast('身份证号码格式不正确')
        this.paramsVal.age = ''
        return
      }
      const nowYear = new Date().getFullYear()
      const birthdayYear = card.slice(6, 10)
      const age = nowYear - birthdayYear
      this.paramsVal.age = age
    },
    // 手机号码验证
    regPhone() {
      const phone = this.params.phone
      if (!this.mobileReg(phone)) {
        this.$toast('请输入正确的手机号')
        return
      }
    },
    // sheet弹窗打开事件
    sheetChoice(type) {
      this.actionsIndex = type
      this.actionShow = true
      if (type === 'sex') {
        this.actions = this.sexData
      } else if (type === 'company') {
        this.actions = this.carsCompanyData
      }
    },
    // sheet弹窗内容选择事件
    onSelect(item) {
      const actionsIndex = this.actionsIndex
      if (actionsIndex === 'sex') {
        this.params.sex = item.id
        this.paramsVal.sexVal = item.name
      } else if (actionsIndex === 'company') {
        this.params.companyId = item.id
        this.paramsVal.companyIdVal = item.name
      }
    },
    // 获取司机详情
    getDriverDetail() {
      const id = this.routeParams.id
      this.$api({
        url: 'manage.getDriverDetail',
        data: {
          id
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          this.params = Object.assign({}, this.params, data)
          const sex = this.params.sex
          this.paramsVal.sexVal = sex === '1' ? '男' : '女'
          const idCard = this.params.idCard
          idCard && this.cardComputed(idCard)
          // this.paramsVal.companyIdVal
          const companyId = this.params.companyId
          if (companyId) {
            this.paramsVal.companyIdVal = this.carsCompanyData.find(ele => ele.id === companyId).name
          }
          // paramsVal: {
          //   sexVal: '',
          //   age: '',
          //   companyIdVal: ''
          // },
        }
      }).catch(err => {
        this.$toast(err.message)
      })
    },
    // 获取性别
    getSex() {
      return new Promise(resolve => {
        this.$api({
          url: 'dic.getSex'
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result
            data.forEach(ele => {
              ele.name = ele.valName
            })
            this.sexData = data
            resolve()
          }
        }).catch(err => {
          this.$toast(err.message)
        })
      })
    },
    // 获取汽车公司
    getCarsCompany() {
      return new Promise(resolve => {
        const conferenceId = this.routeParams.conferenceId
        this.$api({
          url: 'manage.getCarsCompany',
          data: {
            conferenceId
          }
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result.list
            this.carsCompanyData = data
            resolve()
          }
        })
      })
    },
    // 手机号码验证
    mobileReg(value) {
      if (value.length === 11) {
        return true
      } else {
        return false
      }
    },
    // 身份证验证
    cardReg(value) {
      const pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      return pattern.test(value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.add-driver-container::v-deep {
  min-height: 100%;
  background-color: #f8f8f8;
  padding-bottom: 74px;
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
  .single-btn-bottom {
    @include list(row, space-between,center);
    .van-button {
      width: 167px;
    }
  }
}
</style>
