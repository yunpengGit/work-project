<template>
    <div>
    </div>
</template>

<script>
import Vue from 'vue'
import { Toast } from 'vant'
import qs from 'qs'
import api from '@/api'

Vue.use(Toast)

export default {
  methods: {
    getPurview (tel, obtCode) {
      api.getPersonByPhone({
        tel: tel,
        obt_code: obtCode
      })
        .then(res => {
          this.$store.dispatch('removeLoading')
          if (res.PhoneModel.state === 1) {
            let data = res.PhoneModel.functionModelList
            if (data === undefined || data === null || data.length === 0) {
              this.$router.push({
                name: 'errorPage',
                params: {
                  msg: res.PhoneModel.resultMsg,
                  title: '错误提示',
                  showHome: true
                }
              })
            } else {
              window.localStorage.setItem('userInfo', JSON.stringify(res.PhoneModel))
              this.$store.dispatch('setUserInfo', res.PhoneModel)
              this.$router.push('/index')
            }
          } else {
            this.$router.push({
              name: 'errorPage',
              params: {
                msg: res.PhoneModel.resultMsg,
                title: '错误提示',
                showHome: true
              }
            })
          }
        })
        .catch((e) => {
          this.$store.dispatch('removeLoading')
          Toast.fail(e)
        })
    }
  },
  created () {
    this.$store.dispatch('addLoading')
    const search = qs.parse(location.search.replace(/^\?/, ''))
    if (!search || !search.ticket) {
      if (localStorage.getItem('obtUserName')) {
        this.getPurview(localStorage.getItem('obtUserName'), localStorage.getItem('obtCode'))
      } else {
        this.$store.dispatch('removeLoading')
        this.$router.push({
          name: 'errorPage',
          params: {
            msg: location.href,
            title: '错误提示',
            showHome: true
          }
        })
      }
    } else {
      localStorage.clear('token')
      localStorage.clear('obtUserName')
      localStorage.clear('obtCode')
      localStorage.clear('userInfo')
      api.getSSOToken({
        ticket: search.ticket
      }).then(res => {
        if (res.CommonModel.successState) {
          localStorage.setItem('token', res.CommonModel.model.token)
          localStorage.setItem('obtUserName', res.CommonModel.model.obtUserName)
          localStorage.setItem('obtCode', res.CommonModel.model.obtCode)
          this.getPurview(localStorage.getItem('obtUserName'), res.CommonModel.model.obtCode)
        } else {
          this.$router.push({
            name: 'errorPage',
            params: {
              msg: res.CommonModel.resultStr,
              title: '错误提示',
              showHome: true
            }
          })
        }
      }).catch((e) => {
        this.$store.dispatch('removeLoading')
        Toast.fail(e)
      })
    }
  }
}
</script>

<style scoped lang="less">

</style>
