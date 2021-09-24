<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-07-16 15:44:00
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-08 15:10:01
-->
<template>
  <div style="padding-top: 20px">
    <div class="card-content">
      <div class="card-info">
        <div class="left">
          <div class="name">{{ attendeeName }}</div>
          <div class="post">{{ position }}</div>
          <div class="company">{{ organizationName }}</div>
        </div>
        <div class="right">
          <div class="img">
            <img :src="photoUrl" alt="" />
          </div>
        </div>
      </div>
      <div class="card-code">
        <div class="card-code-title">{{ name }}</div>
        <div class="card-code-content">
          <img :src="url" />
          <div class="centerIcon">
            <img src="@/assets/svg/invitation/logo.svg" alt="" />
          </div>
        </div>
        <div class="card-code-tip">{{ newTip }}</div>
      </div>
    </div>
    <div class="bottom">
      <van-button type="info" block @click="handleSavePic(downloadHref_)">保存到手机</van-button>
    </div>
  </div>
</template>

<script>
import ScanCodeMixin from '@/mixins/scanCode'
export default {
  mixins: [ScanCodeMixin],
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      // 上部信息
      attendeeName: '',
      position: '',
      organizationName: '',
      photoUrl: '',
      //   下部信息
      name: '',
      startTime: '',
      endTime: '',
      url: '',
      downloadHref_: '' // 下载路径
    }
  },
  computed: {
    newTip() {
      for (var key in this.startTime) {
        for (var key in this.endTime) {
          const ma = this.endTime[5] + this.endTime[6]
          const da = this.endTime[8] + this.endTime[9]
          const str = '该二维码' + ma + '月' + da + '日' + '前有效'
          return str
        }
      }
    }
  },
  created() {
    this.getAgenda()
    this.getDetail()
  },
  mounted() {},
  methods: {
    // 获取参会人详情
    getAgenda() {
      const conferenceId = this.routeParams.conferenceId
      this.$api({
        url: 'desk.getAttendeeFromMeetingId',
        data: {
          conferenceId
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          this.attendeeName = data.fixAttributeCommonVO.attendeeName
          this.position = data.fixAttributeCommonVO.position
          this.organizationName = data.fixAttributeCommonVO.organizationName

          let showPhotoUrl = ''
          if (data.ssoUserPhoto !== null && data.ssoUserPhoto !== '') {
            showPhotoUrl = data.ssoUserPhoto
          } else {
            if (Number(data.fixAttributeCommonVO.sex) === 1) {
              showPhotoUrl = require('../../../../assets/images/defaultManPhoto.png')
            } else if (Number(data.fixAttributeCommonVO.sex) === 2) {
              showPhotoUrl = require('../../../../assets/images/defaultWomenPhoto.png')
            } else {
              showPhotoUrl = require('../../../../assets/images/defaultPhoto.png')
            }
          }
          this.photoUrl = showPhotoUrl
        }
      })
    },

    // 获取会议详情
    getDetail() {
      const conferenceId = this.routeParams.conferenceId
      this.$api({
        url: 'attendeeApi.getDetail',
        data: {
          id: conferenceId
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          this.name = data.name
          this.startTime = data.startTime
          this.endTime = data.endTime
          this.url = `${data.signInCodeUrl}`
          this.downloadHref_ = `https://hw-user-api.avicnet.cn/J07/files/download?filePath=${data.oldSignInCodeUrl}`
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.card-content {
  background-color: #fff;
  border-radius: 8px;
  margin: 0 20px;
  .card-info {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.06);
    .left {
      width: 80%;
      .name {
        font-size: 20px;
        margin-bottom: 10px;
        line-height: 25px;
      }
      .post {
        font-size: 13px;
        line-height: 18px;
        height: 18px;
      }
      .company {
        font-size: 13px;
        font-weight: 400;
        color: rgba(25, 31, 36, 0.64);
        line-height: 18px;
        height: 18px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .right {
      flex: 1;
      .img {
        width: 48px;
        height: 48px;
        img {
          border-radius: 32px;
          width: 100%;
        }
      }
    }
  }
  .card-code {
    padding: 20px;
    // border-top: 0.5px solid #eee;
    display: flex;
    flex-direction: column;
    align-items: center;
    .card-code-title {
      width: 295px;
      height: 42px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      line-height: 21px;
      text-align: center;
    }
    .card-code-content {
      width: 200px;
      height: 200px;
      margin: 20px 0 20px 0;
      position: relative;
      img {
        width: 100%;
      }
      .centerIcon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
      }
    }
    .card-code-tip {
      width: 200px;
      text-align: center;
      height: 18px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ff8200;
      line-height: 18px;
    }
  }
}
.bottom {
  padding: 10px 16px;
  position: fixed;
  bottom: 0;
  box-shadow: 0px 1px 0px 0px rgba(25, 31, 36, 0.08);
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
</style>
