<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-07-16 15:44:00
* @LastEditors: Please set LastEditors
* @LastEditTime:
-->
<template>
  <div :style="bgc" class="invitation-container">
    <div class="invitation-info">
      <div class="invitation-time">{{ filterDate(detailData.startTime) }} 至 {{ filterDate(detailData.endTime) }}</div>
      <div class="invitation-place">{{ detailData.station }}</div>
    </div>
    <h3 class="conference-name">{{ detailData.name }}</h3>
    <div class="preview-detail" @click="linkConferenceDetail">
      查看会议活动详情<img src="@/assets/svg/invitation/zhankai.svg" style="transform: translate(0px, 0.6vh)" />
    </div>
    <div class="button-list" v-if="!showAcceptIcon && !showRefuseIcon">
      <van-button type="primary" round block @click="isShowAcceptDialog = true">接受邀请</van-button>
      <van-button plain round block type="primary" @click="isShowRefuseDialog = true">拒绝邀请</van-button>
    </div>
    <div class="no-button-list" v-if="showAcceptIcon || showRefuseIcon">
      <template v-if="showAcceptIcon">
        <img src="@/assets/images/accetp@2x.png" alt="" />
        <p>您已接受邀请</p>
      </template>
      <template v-if="showRefuseIcon">
        <img src="@/assets/images/refuse@2x.png" alt="" />
        <p>您已拒绝邀请</p>
      </template>
    </div>
    <van-dialog
      v-model="isShowAcceptDialog"
      :showConfirmButton="false"
      :showCancelButton="false"
      title="请完善会议/活动/培训所需信息"
      width="284px"
      show-cancel-button
      class="customDialog"
    >
      <div class="accept-tip">
        <p>尊敬的{{ ssoUser.ssoUserName }}，为保障您的会议/活动/培训安排，还需您完善本场会议/活动/培训所需信息</p>
        <div @click="linkAddApply">去完善</div>
        <div @click="sendOnOthers">转交他人代办</div>
        <div @click="isShowAcceptDialog = false">取消</div>
      </div>
    </van-dialog>
    <van-dialog
      v-model="isShowRefuseDialog"
      title="确定拒绝会议活动邀请？"
      width="284px"
      show-cancel-button
      class="refuse-dialog"
      cancelButtonText="再想想"
      confirmButtonText="拒绝"
      @confirm="refuse"
      @close="refuseReason = ''"
    >
      <div style="margin: 10px 0">
        <van-field v-model="refuseReason" placeholder="请输入拒绝参加的原因" />
      </div>
    </van-dialog>
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
      ssoUser: {
        ssoUserName: ''
      },
      bgc: {
        backgroundImage: 'url(' + require('@/assets/images/invitationBgc.png') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%',
        height: '100%'
      },
      isShowAcceptDialog: false,
      isShowRefuseDialog: false,
      refuseReason: '', // 拒绝原因
      showAcceptIcon: false,
      showRefuseIcon: false,
      // 会议详情
      detailData: {
        startTime: '',
        endTime: '',
        station: '',
        name: '',
        modifyUserName: ''
      }
    }
  },
  created() {
    this.getDetail()
    this.getUserInfo()
  },
  mounted() {},
  methods: {
    // 将时间2021-08-25 18:00:00 处理为 2021.08.25
    filterDate(time) {
      const str = time.replace(/-/g, '.')
      const newStr = str.slice(0, str.length - 9)
      return newStr
    },
    // 获取用户id
    getUserInfo() {
      this.$api({
        url: 'attendeeApi.userInfo'
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          this.ssoUser = data
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
          this.detailData = data
        }
      })
    },
    // 跳转到详情
    linkConferenceDetail() {
      const conferenceId = this.routeParams.conferenceId
      this.$router.push({
        name: 'conferenceDetail',
        query: {
          [this.$enc('conferenceId')]: this.$enc(conferenceId)
        }
      })
    },
    // 去完善
    linkAddApply() {
      const conferenceId = this.routeParams.conferenceId
      this.$router.push({
        name: 'addApply',
        query: { [this.$enc('conferenceId')]: this.$enc(conferenceId), [this.$enc('replaceIdent')]: this.$enc(2) }
      })
    },
    // 转交给他人
    sendOnOthers() {
      // 调起商网选择联系人页面
      const this_ = this
      const jsapi = new JsApi()
      jsapi.addressBook({
        appId: 'd11d727a3455427', // 必填，第三方的唯一标识
        type: 1, // 1 单选；2 多选，默认为1
        maxNum: 1, // 最大支持选择人数
        members: '@1', // 已选中人员 格式：userId@status||userId@status  userId为sso用户Id;status：1支持删除，2：不可删除
        success: function(res) {
          this_.sendAgent(res.content.addressBookArray[0])
        }
      })
    },
    // 邀请函代办转发IM
    sendAgent(ssoUser) {
      const conferenceInviteId = this.routeParams.conferenceInviteId
      this.$api({
        url: 'attendeeApi.sendInviteAgent',
        data: {
          inviteId: conferenceInviteId,
          ssoUserId: ssoUser.userId
        }
      })
        .then(res => {
          if (res.code === 2000) {
            this.$toast(`已通知${ssoUser.name}代为办理!`)
            this.isShowAcceptDialog = false
          } else {
            this.$toast(res.message)
          }
        })
        .catch(err => {
          this.$toast(err.message)
        })
    },
    // 拒绝邀请
    refuse() {
      const conferenceInviteId = this.routeParams.conferenceInviteId
      this.$api({
        url: 'attendeeApi.refuseInvitation',
        data: {
          id: conferenceInviteId,
          inviteStatus: 4,
          rejectReason: this.refuseReason
        }
      })
        .then(res => {
          if (res.code === 2000) {
            this.showRefuseIcon = true
          } else {
            this.$toast(res.message)
          }
        })
        .catch(err => {
          this.$toast(err.message)
        })
    }
  }
}
</script>

<style scoped lang="scss">
.invitation-container {
  position: relative;
  text-align: center;
  color: #ffecc4;
  .invitation-info,
  .conference-name,
  .preview-detail,
  .button-list,
  .no-button-list {
    padding: 0 20px;
    position: absolute;
    left: 0;
    right: 0;
    font-size: 16px;
  }
  .invitation-info {
    top: 26%;
    line-height: 19px;
  }
  .conference-name {
    padding: 0 20px;
    line-height: 0.8rem;
    font-size: 0.7rem;
    top: 43%;
  }
  .preview-detail {
    top: 60%;
    color: #fff;
    img {
      display: inline-block;
    }
  }
  .button-list {
    bottom: 10%;
    .van-button {
      border: 0;
      width: 100%;
      font-size: 18px;
      font-weight: 600;
      height: 52px;
    }
    .van-button:first-child {
      color: rgba(85, 63, 18, 1);
      background: linear-gradient(270deg, #fff9ea 0%, #eddcb7 100%);
      margin-bottom: 20px;
    }
    .van-button:last-child {
      color: #f1e1c1;
      background-color: rgba(220, 38, 38, 0);
      border: 0.5px solid #f1e1c1;
    }
  }
  .no-button-list {
    bottom: 15%;
    img {
      width: 40px;
      display: inline-block;
      margin-bottom: 10px;
    }
    p {
      color: #f1e1c1;
      font-size: 18px;
      height: 22px;
      line-height: 22px;
    }
  }
  .accept-tip {
    color: rgba(25, 31, 36, 0.72);
    p {
      padding: 20px 20px 0 20px;
      text-align: left;
      margin-bottom: 10px;
      font-size: 15px;
      line-height: 22px;
    }
    div {
      border-top: 1px solid #f3f2f5;
      color: #1e89ff;
      height: 50px;
      line-height: 50px;
    }
    div:hover {
      background-color: #eee;
    }
  }
  .refuse-dialog {
    ::v-deep .van-dialog__header {
      color: #191f24 !important;
    }
    ::v-deep .van-dialog__confirm,
    .van-dialog__confirm:active {
      color: #ea340f;
    }
  }
}
</style>
