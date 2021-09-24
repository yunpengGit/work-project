<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-25 14:34:54
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-09 19:08:22
-->
<template>
  <div class="web-login-container">
    <img src="@/assets/images/logo.svg" alt="" />
    <div class="title">{{ conferenceName }}</div>
    <van-form>
      <van-field v-model="phone" label="手机号码" placeholder="请输入手机号码" />
      <van-field v-model="code" label="手机验证码" placeholder="请输入手机验证码">
        <template #button>
          <van-button size="small" type="info" plain @click="nextStep" :disabled="countDownTime > 0">{{
            getCodeText
          }}</van-button>
        </template>
      </van-field>
      <div class="login-btn">
        <van-button block type="info" :disabled="phone.length != 11 || !code.length" @click="login">登录</van-button>
      </div>
    </van-form>
    <div class="tip">
      登录即代表您已阅读并同意<span @click="link(0)">《用户协议》</span>和<span @click="link(1)">《隐私政策》</span>
    </div>
    <div class="supportTip">中航金网（北京）电子商务有限公司提供技术支持</div>
  </div>
</template>

<script>
import { setToken } from '@/utils/auth'
export default {
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      phone: '',
      code: '',
      getCodeText: '获取验证码',
      countDownTime: 0,
      conferenceName: ''
    }
  },
  created() {
    this.getDetail()
  },
  beforeRouteEnter(to, from, next) {
    localStorage.setItem('fullPath', from.fullPath)
    next()
  },
  methods: {
    // 获取会议详情
    getDetail() {
      const conferenceId = this.routeParams.conferenceId
      // 动态加载js
      const getTimestamp = new Date().getTime()
      const VUE_APP_SSOURL = process.env.VUE_APP_SSOURL
      const webSsourl = `${VUE_APP_SSOURL}${conferenceId}/jsonFile/ajaxResult.js?ts=${getTimestamp}`
      loadJS(webSsourl, () => {
        if (conferenceResult !== null && conferenceResult !== undefined) {
          this.conferenceName = conferenceResult.name
        }
      })

      function loadJS(url, success) {
        const domScript = document.createElement('script')
        domScript.src = url
        success = success || function() {}
        domScript.onload = domScript.onreadystatechange = function() {
          if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
            success()
            this.onload = this.onreadystatechange = null
            this.parentNode.removeChild(this)
          }
        }
        document.getElementsByTagName('body')[0].appendChild(domScript)
      }
    },
    // 用户协议和隐私政策跳转
    link(type) {
      let url = ''
      if (type) {
        // 隐私政策链接
        url = 'https://sw-pro.oss-cn-beijing.aliyuncs.com/html/app/agreement/policy.html'
      } else {
        // 用户协议链接
        url = 'https://sw-pro.oss-cn-beijing.aliyuncs.com/html/app/agreement/terms.html'
      }
      window.location.href = url
    },
    // 发送验证码
    nextStep() {
      this.$api({
        url: 'attendeeApi.getWebCode',
        data: {
          mobile: this.phone
        }
      }).then(res => {
        if (res.success) {
          // 倒计时显示
          this.countDownTime = 59
          const timer = setInterval(() => {
            this.countDownTime--
            this.getCodeText = `获取验证码(${this.countDownTime}s)`
            if (this.countDownTime <= 0) {
              this.getCodeText = '重新获取验证码'
              window.clearInterval(timer)
            }
          }, 1000)
        }
      }).catch(err => {
        this.$dialog
          .alert({
            message: err.message,
            title: '系统提示',
            confirmButtonText: '我知道了',
            className: 'attendeeDialog'
          })
      })
    },
    // 登录
    login() {
      this.$api({
        url: 'attendeeApi.webLogin',
        data: {
          identifierCode: 'h5',
          mobile: this.phone,
          verificationCode: this.code,
          ssoUserName: ''
        }
      }).then(res => {
        if (res.success) {
          const token = res.result
          setToken(token)
          setTimeout(() => {
            // 跳转回中转页面
            const fullPath = localStorage.getItem('fullPath')
            this.$router.push(fullPath)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.web-login-container {
  min-height: 100%;
  background-color: #fff;
  width: 100%;
  padding: 16px 20px;
  img {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
  }
  .title {
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #191f24;
    line-height: 25px;
    margin-bottom: 45px;
  }
  .van-form {
    .van-cell {
      flex-direction: column;
      border-bottom: 1px solid #d4d4d4;
      padding: 10px 0;
      ::v-deep .van-cell {
        padding-bottom: 10px;
      }
      ::v-deep .van-field__label {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191f24;
        margin-bottom: 3px;
      }
      ::v-deep .van-field__control {
        font-size: 17px;
      }
    }
    .login-btn {
      margin: 24px 0 16px 0;
      .van-button {
        border-radius: 8px;
        font-size: 18px;
      }
    }
  }
  .tip {
    text-align: center;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(38, 48, 56, 0.73);
    line-height: 16px;
    span {
      color: #1e89ff;
    }
  }
  .supportTip {
    position: fixed;
    bottom: 16px;
    left: 0;
    right: 0;
    margin: 0 auto;
    text-align: center;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(25, 31, 36, 0.56);
    line-height: 16px;
  }
}
</style>
