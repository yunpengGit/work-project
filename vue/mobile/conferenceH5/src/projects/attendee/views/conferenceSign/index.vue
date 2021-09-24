<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-07-16 15:44:00
* @LastEditors: Please set LastEditors
* @LastEditTime:
-->
<template>
  <div class="conference-sign">
    <img src="@/assets/images/signTip.svg" alt="" />
    <div class="tip">
      <div class="tip-text">您正在进行{{ flag == 'conferenceSign' ? '会议' : '议程' }}签到...</div>
    </div>
    <van-button type="info" block round @click="sign">确认签到</van-button>
  </div>
</template>

<script>
export default {
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      flag: '' // conferenceSign会议签到 agendaSign议程签到
    }
  },
  created() {
    this.flag = this.routeParams.flag
  },
  mounted() {},
  methods: {
    sign() {
      if (this.flag === 'conferenceSign') {
        this.handleReport()
      } else {
        this.handleSignInAgenda()
      }
    },
    // 会议签到
    handleReport() {
      this.$api({
        url: 'attendeeApi.handleReport',
        data: {
          conferenceId: this.routeParams.conferenceId
        }
      }).then(res => {
        if (res.success) {
          this.$toast('签到成功')
          this.$router.push({
            name: 'conferenceHomePage',
            query: {
              [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId)
            }
          })
        }
      })
    },
    // 议程签到
    handleSignInAgenda() {
      this.$api({
        url: 'attendeeApi.handleSignInAgenda',
        data: {
          agendaId: this.routeParams.conferenceAgendaId
        }
      }).then(res => {
        if (res.success) {
          this.$toast('签到成功')
          this.$router.push({
            name: 'conferenceHomePage',
            query: {
              [this.$enc('conferenceId')]: this.$enc(this.routeParams.conferenceId)
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.conference-sign {
  padding-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 60%;
    margin-bottom: 30px;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
  .tip {
    margin-top: 230px;
    .tip-text {
      font-size: 16px;
      margin-bottom: 20px;
    }
  }
  .van-button--block {
    width: 80%;
    background: linear-gradient(to right, #0067ff, #00beff);
  }
}
</style>
