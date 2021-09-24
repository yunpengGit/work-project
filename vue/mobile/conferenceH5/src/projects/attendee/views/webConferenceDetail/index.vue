<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-30 21:31:48
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-23 14:10:19
-->
<template>
  <div class="detail-container" v-if="conferenceData">
    <div style="padding-bottom: 64px">
      <div class="pic">
        <img :src="conferenceData.coverVOs[0].downloadUrl" alt="" />
      </div>
      <dl class="synopsis">
        <dt>{{ conferenceData.name }}</dt>
        <dd v-if="conferenceData.setSignConfigFlag === 1">
          <span>报名时间：</span>
          {{ signUpTime }}
        </dd>
        <dd>
          <span>会议时间：</span>{{ filterTime(conferenceData.startTime) }} - {{ filterTime(conferenceData.endTime) }}
        </dd>
        <dd><span>会议地点：</span>{{ conferenceData.station }}</dd>
      </dl>
      <div class="recom detail-item" v-if="conferenceData.introduction">
        <h3 class="detail-title-pic">
          <img src="@/assets/images/recom.png" alt="" />
          会议介绍
        </h3>
        <p>{{ conferenceData.introduction }}</p>
      </div>
      <div class="guest detail-item" v-if="guestData.length">
        <h3 class="detail-title-pic">
          <img src="@/assets/images/guest.png" alt="" />
          会议嘉宾
        </h3>
        <div v-for="(ele, index) in guestData" :key="index" class="guest-item">
          <div class="pic-text">
            <div class="pic"><img :src="ele.billUrl" alt="" /></div>
            <div class="text">
              <h3 class="title">{{ ele.name }}</h3>
              <h4 class="company">{{ ele.organizationName }}</h4>
              <ul class="duties">
                <li v-for="(eleChild, indexChild) in duties(index)" :key="indexChild">{{ eleChild }}</li>
              </ul>
            </div>
          </div>
          <dl class="theme">
            <dt><i></i>演讲主题</dt>
            <dd>{{ ele.theme }}</dd>
          </dl>
        </div>
      </div>
      <div class="agenda detail-item" v-if="agendaData.length">
        <h3 class="detail-title-pic">
          <img src="@/assets/images/agenda.png" alt="" />
          会议议程
        </h3>
        <div v-for="(ele, index) in agendaData" :key="index" class="agenda-list">
          <div v-for="(eleChild, indexChild) in ele.children" :key="indexChild" class="agenda-item">
            <div class="time">{{ eleChild.conductDate }} {{ eleChild.startTime }}-{{ eleChild.endTime }}</div>
            <div class="name">{{ eleChild.name }}</div>
          </div>
        </div>
      </div>
      <div class="org detail-item" v-if="conferenceData.organizationVOs.length">
        <h3 class="detail-title-pic">
          <img src="@/assets/images/org.png" alt="" />
          会议组织
        </h3>
        <dl v-for="(ele, index) in conferenceData.organizationVOs" :key="index">
          <dt>{{ ele.organizationTypeStr }}</dt>
          <dd>{{ ele.organizationName }}</dd>
        </dl>
      </div>
      <div class="note detail-item" v-if="conferenceData.notice">
        <h3 class="detail-title-pic">
          <img src="@/assets/images/note.png" alt="" />
          会议须知
        </h3>
        <p v-html="notice" />
      </div>
      <div class="contacts detail-item" v-if="conferenceData.contactInformation">
        <h3 class="detail-title-pic">
          <img src="@/assets/images/contacts.png" alt="" />
          联系我们
        </h3>
        <p v-html="contacts" />
      </div>
      <div class="means detail-item" v-if="meansData.length">
        <h3 class="detail-title-pic">
          <img src="@/assets/images/means.png" alt="" />
          会议资料
        </h3>
        <div v-for="ele in meansData" :key="ele.id" class="material-list">
          <a :href="ele.materialUrl">
            <div class="material-item">
              <img :src="srcParse(ele)" alt="" class="material-pic" />
              <van-cell-group>
                <van-cell :title="ele.materialName ? ele.materialName : '-'" is-link />
              </van-cell-group>
            </div>
          </a>
        </div>
      </div>
    </div>
    <div class="bottom">
      <van-button block type="default" @click="linkPage(0)">进入会议</van-button>
      <van-button block type="info" @click="linkPage(1)">我要报名</van-button>

      <van-popup v-model="showBtnPopup" position="bottom" round>
        <div class="popup-container">
          <ul class="filter-condition">
            <li class="filter-item" v-for="ele in btnData" :key="ele.type" @click="linkApply(ele.index)">
              {{ ele.text }}
            </li>
          </ul>
          <div class="filter-submit-btn">
            <div @click="showBtnPopup = false">取消</div>
          </div>
        </div>
      </van-popup>
      <van-popup class="authentication-pop" v-model="showAuthenticationPop" position="bottom" round>
        <div class="authentication-pop-container">
          <div v-if="!authenticationStep">
            <div class="tool-bar">
              <span @click="showAuthenticationPop = false">取消</span>
              <span style="float: right" v-if="!authenticationStep" @click="nextStep">下一步</span>
            </div>
            <div class="content">
              <div class="title">身份验证</div>
              <div class="tip">请输入您的常用手机号码</div>
              <van-field v-model="phoneNum" type="tel" placeholder="点此输入手机号" />
              <div class="filter-submit-btn">
                <van-button block type="info" @click="nextStep">下一步</van-button>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="tool-bar">
              <span @click="authenticationStep = 0">返回</span>
            </div>
            <div class="content">
              <div class="title">请输入验证码</div>
              <div class="tip">
                验证码已发送至您的手机号：<span style="color: #191f24">{{ filterPhoneNum(phoneNum) }}</span>
              </div>
              <div class="code-container">
                <van-field v-model="codeNum1" type="digit" maxlength="1" autofocus />
                <van-field v-model="codeNum2" type="digit" maxlength="1" />
                <van-field v-model="codeNum3" type="digit" maxlength="1" />
                <van-field v-model="codeNum4" type="digit" maxlength="1" />
                <van-field v-model="codeNum5" type="digit" maxlength="1" />
                <van-field v-model="codeNum6" type="digit" maxlength="1" />
              </div>
              <div class="count-down">
                <span v-if="countDownTime >= 1">{{ countDownTime }}秒后可重新发送</span>
                <span v-else style="color: #1e89ff" @click="nextStep">重新发送</span>
              </div>
            </div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import web from '@/assets/images/Web.svg'
import video from '@/assets/images/video.svg'
import voice from '@/assets/images/voice.svg'
import ppt from '@/assets/images/ppt.svg'
import txt from '@/assets/images/txt.svg'
import folder from '@/assets/images/folder.svg'
import picture from '@/assets/images/picture.svg'
import excel from '@/assets/images/excel.svg'
import word from '@/assets/images/Word.svg'
import zip from '@/assets/images/Zip.svg'
import unknow from '@/assets/images/Unknow.svg'
import pdf from '@/assets/images/PDF.svg'
import { getToken } from '@/utils/auth'
export default {
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      // 会议详情
      conferenceData: null,
      // 议程数据
      agendaData: [],
      // 嘉宾数据
      guestData: [],
      // 会议资料
      web,
      video,
      voice,
      ppt,
      txt,
      folder,
      picture,
      excel,
      word,
      zip,
      unknow,
      pdf,
      meansData: [],
      applyBtnText: '我要报名',
      showApplyBtn: false, // 报名按钮是否展示-逻辑有点混乱
      showBtnPopup: false,
      btnData: [
        { text: '本人报名', index: 0 },
        { text: '代报名', index: 1 }
      ],
      showAuthenticationPop: false, // 身份录入底部弹窗
      authenticationStep: 0, // 第一步
      phoneNum: '', // 手机号
      codeNum1: null,
      codeNum2: null,
      codeNum3: null,
      codeNum4: null,
      codeNum5: null,
      codeNum6: null,
      countDownTime: 60, // 倒计时时间
      clickType: null // type=0 进入会议 type=1 我要报名
    }
  },
  computed: {
    // 验证码输入长度
    codeLength() {
      let length = 0
      if (this.codeNum1) {
        length += 1
      }
      if (this.codeNum2) {
        length += 1
      }
      if (this.codeNum3) {
        length += 1
      }
      if (this.codeNum4) {
        length += 1
      }
      if (this.codeNum5) {
        length += 1
      }
      if (this.codeNum6) {
        length += 1
      }
      return length
    },
    // 报名时间
    signUpTime() {
      if (this.conferenceData.signTimeFlag === 3) {
        return `起始于  ${this.conferenceData.signStartTime.replace(/-/g, '/').slice(0, -3)}`
      } else if (this.conferenceData.signTimeFlag === 2) {
        return `${this.conferenceData.signStartTime.replace(/-/g, '/').slice(0, -3)} - ${this.conferenceData.signEndTime
          .replace(/-/g, '/')
          .slice(0, -3)}`
      } else if (this.conferenceData.signTimeFlag === 1) {
        return `截止至  ${this.conferenceData.signEndTime.replace(/-/g, '/').slice(0, -3)}`
      } else {
        return ''
      }
    },
    // 职务处理
    duties() {
      return function(index) {
        console.log(index, this.guestData)
        const title = this.guestData[index].title
        return title ? title.split(',') : []
      }
    },
    notice() {
      return this.conferenceData.notice.replace(/\n/g, '<br/>')
    },
    contacts() {
      return this.conferenceData.contactInformation.replace(/\n/g, '<br/>')
    },
    srcParse() {
      return function(ele) {
        if (ele.materialType === 2) {
          return web
        } else if (ele.materialType === 1) {
          const name = ele.materialName
          let type = ''
          if (!name.length) {
            return unknow
          }
          type = name.slice(name.lastIndexOf('.') + 1, name.length).toLowerCase()
          if (type === 'com') {
            return web
          } else if (type === 'txt') {
            return txt
          } else if (type === 'xlsx' || type === 'xls') {
            return excel
          } else if (type === 'pdf') {
            return pdf
          } else if (type === 'jpg' || type === 'png') {
            return picture
          } else if (type === 'doc' || type === 'docx') {
            return word
          } else if (type === 'ppt') {
            return ppt
          } else {
            return unknow
          }
        }
      }
    }
  },
  watch: {
    codeLength: {
      handler(newVal) {
        if (newVal === 6) {
          // 校验输入验证码是否正确
          this.verifyCode()
        }
      },
      deep: true
    }
  },
  created() {
    const conferenceId = this.routeParams.conferenceId
    // 获取会议详情
    this.$api({
      url: 'attendeeApi.getDetail',
      data: {
        id: conferenceId
      }
    }).then(res => {
      if (res.success) {
        this.conferenceData = res.result
        if (Number(this.conferenceData.setSignConfigFlag) !== 0) {
          this.showApplyBtn = true
        } else {
          this.showApplyBtn = false
        }
        // 获取当前时间
        const dt = new Date()
        const y = dt.getFullYear()
        const m = (dt.getMonth() + 1).toString().padStart(2, 0)
        const d = dt.getDate().toString().padStart(2, 0)
        const hh = dt.getHours().toString().padStart(2, 0)
        const mm = dt.getMinutes().toString().padStart(2, 0)
        const ss = dt.getSeconds().toString().padStart(2, 0)
        const time = y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        if (this.conferenceData.signEndTime < time) {
          this.applyBtnText = '会议报名已结束'
        } else if (this.conferenceData.signStartTime > time) {
          this.applyBtnText = '会议报名未开始'
        }
      }
    })
    // 获取议程详情
    this.$api({
      url: 'attendeeApi.getAddAgenda',
      data: {
        conferenceId,
        // 我也不知为啥要传这个参数 接口文档没有注释 只是上一版本里面传了这个
        queryFlag: 2
      }
    }).then(res => {
      if (res.success) {
        this.agendaData = res.result
      }
    })

    // 获取嘉宾
    this.$api({
      url: 'attendeeApi.getGuest',
      data: {
        conferenceId
      }
    }).then(res => {
      if (res.success) {
        this.guestData = res.result.list
      }
    })

    // 获取会议资料
    this.$api({
      url: 'attendeeApi.getMaterial',
      data: {
        conferenceId
      }
    }).then(res => {
      if (res.success) {
        let meansArr = []
        res.result.list.forEach(item => {
          meansArr = meansArr.concat(item.conferenceMaterialsList)
        })
        this.meansData = meansArr
      }
    })

    // 底部按钮文字展示逻辑
    this.$api({
      url: 'attendeeApi.getAttendeeFromMeetingId',
      data: {
        conferenceId
      }
    }).then(res => {
      if (res.success) {
        const data = res.result
        if (data != null) {
          if (Number(data.signStatus) === 1 || Number(data.signStatus) === 2 || Number(data.signStatus) === 3) {
            this.showApplyBtn = true
            this.btnData = [{ text: '代报名', index: 1 }]
          }
          // 这里逻辑有点混乱
          if (Number(data.signStatus) !== 0 && Number(data.signStatus) !== -3) {
            this.showApplyBtn = false
          } else {
            this.showApplyBtn = true
          }
        }
      }
    })
  },
  methods: {
    // 将手机号中间四位处理成****
    filterPhoneNum(tel) {
      const telStr = '' + tel
      var reg = /(\d{3})\d{4}(\d{4})/
      return telStr.replace(reg, '$1****$2')
    },

    // 发送验证码
    nextStep() {
      if (this.phoneNum.length !== 11) {
        this.$toast('请输入正确的手机号')
        return
      }
      this.authenticationStep = 1
      this.$api({
        url: 'attendeeApi.getWebCode',
        data: {
          mobile: this.phoneNum
        }
      }).then(res => {
        if (res.success) {
          // 倒计时显示
          const timer = setInterval(() => {
            this.countDownTime--
            if (this.countDownTime < 0) {
              window.clearInterval(timer)
            }
          }, 1000)
        }
      })
    },

    // 将时间2021-08-25 18:00:00 处理为 2021/08/25 18:00
    filterTime(time) {
      const str = time.replace(/-/g, '/')
      const newStr = str.slice(0, str.length - 3)
      return newStr
    },
    linkApply(index) {
      /**
       * index=0 [我要报名]
       * index=1 [代他人报名]
       */
      this.$router.push({
        name: 'addApply',
        query: {
          [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId),
          [this.$enc('replaceIdent')]: index ? this.$enc(3) : this.$enc(2)
        }
      })
    },
    // 点击底部按钮跳转
    linkPage(type) {
      // type=0 进入会议 type=1 我要报名
      // 先判断有没有token，有则直接跳转，否则进行短信验证
      const token = getToken()
      if (token) {
        if (type) {
          this.showBtnPopup = true
        } else {
          this.$router.push({
            name: 'conferenceHomePage',
            query: {
              [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId)
            }
          })
        }
      } else {
        // 短信验证
        this.showAuthenticationPop = true
        this.clickType = type
      }
    },
    // 校验输入验证码是否正确
    verifyCode() {
      const code = this.codeNum1 + this.codeNum2 + this.codeNum3 + this.codeNum4 + this.codeNum5 + this.codeNum6
      console.log(code, 'CODE----')

      // 成功后跳转 type=0进入会议则进入会议首页 type=1点击报名则打开报名选择弹窗
      this.showAuthenticationPop = false
      if (this.clickType) {
        this.showBtnPopup = true
      } else {
        this.$router.push({
          name: 'conferenceHomePage',
          query: {
            [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.detail-container {
  .pic {
    width: 100%;
    height: 171px;
    overflow: hidden;
    position: relative;
    z-index: 1;
    img {
      width: 100%;
    }
  }
  .synopsis {
    width: 100%;
    background-color: #fff;
    border-radius: 16px 16px 0px 0px;
    padding: 16px;
    margin: -16px 0 12px;
    overflow: hidden;
    position: relative;
    z-index: 2;
    dt {
      font-size: 20px;
      font-weight: 500;
      line-height: 25px;
    }
    dd {
      font-size: 14px;
      line-height: 18px;
      color: rgba(25, 31, 36, 1);
      margin-bottom: 4px;
      span {
        color: rgba(25, 31, 36, 0.64);
      }
    }
  }
  .detail-item {
    width: 100%;
    padding: 20px 16px 30px;
    background-color: #fff;
    margin-bottom: 12px;
  }
  .recom {
    p {
      font-size: 15px;
      color: rgba(25, 31, 36, 0.88);
      line-height: 24px;
    }
  }
  .detail-title-pic {
    font-size: 17px;
    font-weight: 500;
    line-height: 22px;
    padding-bottom: 15px;
    @include list(row, flex-start, center);
    img {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
  }
  .agenda {
    width: 100%;
    padding-bottom: 20px;
    .agenda-list {
      width: 100%;
      // margin-bottom: 16px;
      padding: 0 4px 24px;
      position: relative;
      &::after {
        content: '';
        display: block;
        width: 1px;
        height: 100%;
        border-left: 1px dashed rgba(194, 232, 255, 1);
        @include absolute(3px, '', '', 8px);
      }
      &::before {
        content: '';
        display: block;
        width: 324px;
        height: 1px;
        background-color: rgba(25, 31, 36, 0.08);
        @include absolute('', 0, 8px, '');
      }
      &:nth-last-of-type(1) {
        &::after {
          display: none;
        }
      }
      .agenda-item {
        padding: 0 0 20px 15px;
        position: relative;
        z-index: 2;
        &::before {
          content: '';
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1px solid rgba(30, 137, 255, 1);
          @include absolute(2px, '', '', 0);
          background-color: #fff;
        }
        &:nth-last-of-type(1) {
          padding-bottom: 0;
        }
        .time {
          font-size: 13px;
          color: rgba(25, 31, 36, 0.64);
          line-height: 18px;
          margin-bottom: 3px;
        }
        .name {
          font-size: 14px;
          color: rgba(25, 31, 36, 0.88);
          line-height: 18px;
        }
      }
    }
  }
  .note,
  .contacts {
    p {
      font-size: 15px;
      color: rgba(25, 31, 36, 0.88);
      line-height: 28px;
    }
  }
  .guest {
    .guest-item {
      width: 100%;
      border-bottom: 1px solid rgba(25, 31, 36, 0.08);
      margin-top: 20px;
      padding-bottom: 20px;
      .pic-text {
        width: 100%;
        padding-left: 116px;
        min-height: 140px;
        .pic {
          width: 100px;
          height: 140px;
          overflow: hidden;
          @include absolute(0, '', '', 0);
          img {
            width: 100%;
          }
        }
        .title {
          height: 28px;
          background: url('../../../../assets/images/guestName.png') no-repeat left;
          background-size: 74px 28px;
          font-size: 16px;
          line-height: 28px;
          color: #fff;
          font-weight: 500;
          padding-left: 8px;
        }
        .company {
          font-size: 12px;
          color: rgba(3, 76, 179, 1);
          line-height: 16px;
          padding: 6px 8px;
          background-color: rgba(235, 248, 255, 1);
          margin-bottom: 12px;
        }
        .duties {
          li {
            font-size: 14px;
            line-height: 20px;
            padding-left: 6px;
            margin-bottom: 1px;
            position: relative;
            &::before {
              content: '';
              display: block;
              width: 2px;
              height: 2px;
              background-color: #191f24;
              @include absolute(50%, '', '', 0);
              transform: translateY(-50%);
              border-radius: 50%;
            }
          }
        }
      }
      .theme {
        font-size: 14px;
        dt {
          color: rgba(25, 31, 36, 0.64);
          line-height: 22px;
          @include list(row, flex-start, center);
          margin-bottom: 2px;
          i {
            display: block;
            width: 4px;
            height: 16px;
            background-color: rgba(25, 31, 36, 0.16);
            margin-right: 3px;
          }
        }
        dd {
          line-height: 18px;
          font-weight: 500;
        }
      }
    }
  }
  .org {
    dl {
      border-bottom: 1px solid rgba(25, 31, 36, 0.08);
      padding-bottom: 10px;
      margin-top: 10px;
      dt {
        font-size: 14px;
        line-height: 18px;
        color: rgba(25, 31, 36, 0.64);
        margin-bottom: 4px;
      }
      dd {
        font-size: 16px;
        line-height: 21px;
        color: rgba(25, 31, 36, 0.88);
        padding-left: 12px;
        position: relative;
        &::before {
          content: '';
          display: block;
          width: 4px;
          height: 4px;
          background-color: #191f24;
          @include absolute(50%, '', '', 0);
          transform: translateY(-50%);
          border-radius: 50%;
        }
      }
    }
  }
  .means {
    .material-item {
      width: 100%;
      height: 56px;
      padding: 0 16px;
      background-color: #fff;
      @include list(row, flex-start, center);
      .material-pic {
        width: 24px;
        height: 24px;
        margin-right: 16px;
      }
      .van-cell-group {
        flex: 1;
      }
      .van-cell {
        height: 56px;
        line-height: 56px;
        padding: 0;
        .van-cell__left-icon,
        .van-cell__right-icon {
          line-height: 56px;
        }
      }
    }
  }
  .bottom {
    z-index: 999;
    padding: 10px 16px;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    position: fixed;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .van-button {
      font-size: 18px;
      border-radius: 4px;
    }
  }
  .popup-container {
    width: 100%;
    height: 100%;
    background-color: rgba(25, 31, 36, 0.04);
    .filter-condition {
      background-color: #fff;
      margin-bottom: 60px;

      .filter-item {
        font-size: 16px;
        height: 50px;
        line-height: 50px;
        text-align: center;
      }
    }
    .filter-submit-btn {
      background-color: #fff;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      text-align: center;
    }
  }
  .authentication-pop {
    .tool-bar {
      height: 60px;
      line-height: 60px;
      color: #1e89ff;
      font-size: 17px;
      padding: 0 20px;
      border-bottom: 1px solid rgba(25, 31, 36, 0.08);
    }
    .content {
      height: 274px;
      padding: 24px 16px 0 16px;
      .van-cell {
        padding: 0;
      }
      .title {
        color: #191f24;
        font-size: 20px;
        height: 25px;
        line-height: 25px;
        margin-bottom: 12px;
      }
      .tip {
        font-size: 14px;
        height: 18px;
        line-height: 18px;
        color: rgba(25, 31, 36, 0.64);
        margin-bottom: 32px;
      }
      .code-container {
        padding: 0 27px;
        margin-bottom: 36px;
        display: flex;
        justify-content: space-between;
        .van-cell {
          border: 1px solid rgba(25, 31, 36, 0.64);
          border-radius: 6px;
          width: 40px;
          height: 44px;
        }
        ::v-deep .van-field__control {
          text-align: center;
          font-size: 18px;
          color: rgba(25, 31, 36, 0.64);
          margin-top: 8px;
        }
      }
      .filter-submit-btn {
        border-top: 1px solid rgba(25, 31, 36, 0.08);
        z-index: 999;
        height: 50px;
        padding: 6px 16px;
        position: fixed;
        bottom: 0;
        width: 100%;
        .van-button {
          font-size: 15px;
          border-radius: 8px;
          width: 100%;
        }
      }
      .count-down {
        text-align: center;
        height: 18px;
        font-size: 14px;
        color: rgba(25, 31, 36, 0.64);
        line-height: 18px;
      }
    }
    // .filter-submit-btn {
    //   z-index: 999;
    //   padding: 10px 16px;
    //   position: fixed;
    //   bottom: 0;
    //   background-color: #fff;
    //   position: fixed;
    //   width: 100%;
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    //   .van-button {
    //     font-size: 18px;
    //     border-radius: 8px;
    //     width: 100%;
    //   }
    // }
  }
}
</style>
