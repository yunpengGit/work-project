<template>
  <div>
    <div class="email-list">
      <van-swipe-cell v-for="item in emails" :key="item.id" right-width="65">
        <div class="input-icon">
          <van-field :border="false" class="input" v-model="item.email"  placeholder="默认登录人邮箱／可手动删除录入邮箱" />
          <svg-icon href="lianxiren" class="icon" @click.native="chooseUser(item.id)"/>
        </div>
        <template #right>
          <van-button square type="danger" text="删除" @click="deleteEmail(item.id)"/>
        </template>
      </van-swipe-cell>
      <div class="btn-add">
        <van-button @click="addField" size="small" plain type="info">+ 添加邮箱</van-button>
      </div>
    </div>
    <div class="sent-email">
      <van-button @click="sentEmail" block round hairline type="info" size="small">发送</van-button>
    </div>
    <department class="department" v-if="departmentShow" @chooseUserEmail="chooseUserEmailFn"></department>
  </div>
</template>
<script>
import Vue from 'vue'
import {
  SwipeCell,
  Cell,
  Field,
  Button,
  Toast
} from 'vant'
import {
  TOKEN,
  OBTUSERNAME,
  CATEGORYID,
  PERSONH5INFOMODEL
} from '@/store/mutation-types'
import { sendEmail, batchConfirmationForMobilePhone } from '@/api/tripRecord/sendEmail'
import idFunction from '@/utils/idFunction'
import department from './department'

Vue.use(SwipeCell)
  .use(Cell)
  .use(Field)
  .use(Button)
  .use(Toast)

export default {
  components: {
    department
  },
  data () {
    return {
      departmentShow: false,
      activeId: '',
      params: {},
      emails: [
        { id: idFunction(), email: Vue.ls.get(PERSONH5INFOMODEL).email }
      ]
    }
  },
  created () {
    // this.$changePageTitle('发送到邮箱')
  },
  computed: {
    emailsArr () {
      const arr = this.emails.map(item => {
        return item.email
      })
      return arr
    }
  },
  methods: {
    addField () {
      this.emails.push({ id: idFunction() })
    },
    chooseUserEmailFn (email) {
      this.departmentShow = false
      this.emails.forEach(item => {
        if (this.activeId === item.id) {
          item.email = email
        }
      })
    },
    deleteEmail (id) {
      this.emails = this.emails.filter(item => {
        return id !== item.id
      })
    },
    sentEmail () {
      this.$store.dispatch('addLoading')
      const query = this.$route.query
      if (query.journeyId) {
        this.sendEmail(query.journeyId)
      }
      if (query.journeyIds) {
        this.batchConfirmationForMobilePhoneFn(query.journeyIds)
      }
    },
    sendEmail (journeyId) {
      const data = {
        obtUserName: Vue.ls.get(OBTUSERNAME),
        categoryId: Vue.ls.get(CATEGORYID),
        token: Vue.ls.get(TOKEN),
        emails: this.emailsArr.join(','),
        journeyId
      }
      sendEmail(data).then(res => {
        this.$store.dispatch('removeLoading')
        Toast(res.journeyModel.resultStr)
        this.$router.push({
          path: '/tripRecord'
        })
      })
    },
    batchConfirmationForMobilePhoneFn (journeyIds) {
      const data = {
        obtUserName: Vue.ls.get(OBTUSERNAME),
        categoryId: Vue.ls.get(CATEGORYID),
        token: Vue.ls.get(TOKEN),
        emails: this.emailsArr.join(','),
        journeyIds
      }
      batchConfirmationForMobilePhone(data).then(res => {
        this.$store.dispatch('removeLoading')
        Toast(res.CommonModel.resultStr)
        this.$router.push({
          path: '/tripRecord'
        })
      }).catch(() => {
        this.$store.dispatch('removeLoading')
      })
    },
    chooseUser (id) {
      this.activeId = id
      this.departmentShow = true
    }
  }
}
</script>
<style lang="less" scoped>
  .email-list {
    min-height: 100vh;
    padding-bottom: 80px;
    /deep/.van-swipe-cell{
      background-color: #fff;
      height: 60px;
      margin-top: 10px;
      .van-swipe-cell__wrapper{
        .input-icon{
          padding: 12px 18px;
          display: flex;
          align-items: center;
          .van-field{
            background: #F5F7F9;
            border-radius: 4px;
            font-size: 14px;
            color: #13171C;
            padding: 8px;
          }
          .icon{
            box-sizing: content-box;
            margin-left: 18px;
            padding: 3px;
            width: 21px;
            height: 21px;
          }
        }
        .van-swipe-cell__right{
          .van-button{
            width: 65px;
            height: 60px;
            background: #FC5F60;
            font-size: 15px;
            &.van-button--danger{
              color: #FFFFFF;
              background: #FC5F60;
            }
          }
        }
      }
    }
    .btn-add{
      padding-top: 10px;
      display: flex;
      justify-content: center;
      .van-button{
        width: 109px;
        height: 32px;
        border-radius: 4px;
        border: 1px solid #2D6DFF;
        font-size: 16px;
        color: #2D6DFF;
      }
    }
  }
  .sent-email {
    margin-top: -80px;
    padding: 20px 15px;
    .van-button {
      height: 40px;
      border-radius: 4px;
    }
  }
  .department{
    background-color: #F5F8FD;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
</style>
