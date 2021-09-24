<template>
  <div>
    <van-nav-bar left-arrow title="发送到邮箱" @click-left="back"/>
    <div class="email-list">
      <div class="email-item" flex="cross:center" v-for="(item, index) in emails" :key="index">
        <van-field :border="false" class="input" v-model="emails[index]"  placeholder="默认登陆人邮箱／可手动删除录入邮箱" />
        <svg-icon @click.native="chooseUser(index)" class="icon" href="icontianjiahaoyou-"/>
      </div>
      <div class="button-add" flex="cross:center main:center">
        <van-button @click="addField" size="small" plain type="info">+ 添加邮箱</van-button>
      </div>
    </div>
    <van-action-sheet :value="true" :overlay="false" :lock-scroll="false" :round="false">
      <div class="sent-email">
        <van-button @click="sentEmail" block round hairline type="info" size="small">发送</van-button>
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
import { NavBar, Field, Icon, Button, ActionSheet, Toast } from 'vant'
import Vue from 'vue'
import ApiJourney from '@/api/journey'

Vue.use(NavBar).use(Field).use(Icon).use(Button).use(ActionSheet)

export default {
  data () {
    return {
      params: {},
      emails: []
    }
  },
  created () {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (this.$route.params.requestParams) { // 跳转进来的才需要添加默认email
      this.emails.push(userInfo.email)
      this.params = this.$route.params.requestParams
    } else {
      const { checkUsersEmails, params } = this.$store.state.journeyList
      this.emails = checkUsersEmails
      this.params = params
    }
  },
  methods: {
    addField () {
      this.emails.push('')
    },
    back () {
      this.$store.dispatch('setParams', {})
      this.$store.dispatch('clearCheckUsersEmails')
      if (this.$store.state.journeyDetail.isOrderSendEmail) {
        this.$store.dispatch('changeOrderSendEmail', false)
        this.$router.push(`/planeNoteDetail?id=${this.params.journeyIds}`)
      } else {
        this.$router.push('/planeNote')
      }
    },
    sentEmail () {
      this.$store.dispatch('addLoading')
      ApiJourney.batchConfirmationForMobilePhone({
        ...this.params,
        emails: this.emails.join(',')
      }).then(res => {
        this.$store.dispatch('removeLoading')
        if (res.CommonModel.successState) {
          Toast(res.CommonModel.resultStr)
          this.back()
        } else {
          Toast(res.CommonModel.resultStr)
        }
      }).catch(() => {
        this.$store.dispatch('removeLoading')
      })
    },
    chooseUser (index) {
      this.$store.dispatch('setSelectedUserIndex', index)
      this.$store.dispatch('setCheckUsersEmails', this.emails)
      this.$store.dispatch('setParams', this.params)
      this.$router.push('/checkDepartment')
    }
  }
}
</script>
<style lang="less" scoped>
  .email-list {
    background-color: white;
    padding: 15px 22.5px 67.5px;
  }
  .email-item {
    margin-top: 22.5px;
    &:first-of-type {
      margin-top: 0;
    }
    .input {
      background: #EEEEEE;
      border-radius: 8px;
      height: 30px;
      line-height: 30px;
      padding: 0 7.5px;
      font-size: 11px;
      line-height: 30px;
    }
    .icon {
      margin-left: 9px;
      width: 30px;
      height: 30px;
    }
  }
  .button-add {
    margin: 21px 0;
    button {
      height: 30px;
      line-height: 30px;
      width: 120px;
      font-size: 16px;
      border-radius: 6px;
    }
  }
  .sent-email {
    padding: 15px 22.5px 22.5px;
    background: #EEEEEE;
    button {
      height: 30px;
    }
  }
</style>
