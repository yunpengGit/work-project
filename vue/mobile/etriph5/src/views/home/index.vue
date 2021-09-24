<template>
  <div class="box">
    <div class="full-screen has-header-nav-bar has-footer-tab-bar">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(item, index) in banner" :key="index" @click.native="adClick(item)">
          <img class="swipe-item-img" v-lazy="ServerAddress+item.path"/>
        </van-swipe-item>
      </van-swipe>
      <part
        @itemTap="partItemClick"
        v-for="(part, index) in showParts"
        :key="index"
        :title="part.title"
        :items="part.list"
      />
      <!--对接航信信息-->
      <dy-form ref="HXForm" :action="ctripData.url"/>
      <!--对接航信信息-->
    </div>
    <copyright/>
  </div>
</template>

<script>
import Vue from 'vue'
import { Swipe, SwipeItem, Toast } from 'vant'
import Part from './Part'
import Copyright from './Copyright'
import qs from 'qs'
import api from '@/api'
import { ServerAddress } from '@/http'
import DyForm from '@/components/DyForm'
import IndexConfig from '@/mock/indexConfig'
import toData from './toData.js'

Vue.use(Swipe)
  .use(SwipeItem)
  .use(Toast)
const { partsArr, partsMap, partsGroupMap } = IndexConfig
export default {
  name: 'home',
  data () {
    return {
      privateState: '',
      banner: [],
      showParts: [],
      ServerAddress,
      partsArr,
      partsMap,
      partsGroupMap,
      userInfo: {
        functionModelList: []
      },
      privateData: [],
      parts: '',
      newParts: '',
      token: '',
      ctripData: {
        url: '',
        param: {
          accountName: '',
          appKey: '',
          callback: '',
          signature: '',
          token: '',
          viewname: ''
        }
      },
      loading: true
    }
  },
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
              this.showInfo()
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
    },
    showSwitch (arr) {
      arr = arr.filter((item) => item.name === '因私出行-H5')
      // arr = arr.filter((item) => item.name === '因私出行')
      if (arr.length > 0) {
        toData.$emit('privateState', true)
      } else {
        toData.$emit('privateState', false)
      }
    },
    grayStates (functionModelList) {
      // 返回当前要展示的对象
      let arr = []
      partsArr.forEach((item) => {
        arr.push(...functionModelList.filter(function (item1) {
          return item === item1.name
        }))
      })
      // 返回名称展示展示名称
      arr.forEach((item) => {
        item.name = partsMap.get(item.name)
      })
      // 将处理好的展示对象分组
      let obj = {
        list: []
      }
      arr.forEach((item, index) => {
        if (obj.title === partsGroupMap.get(item.name)) {
          obj.list.push(item)
        } else {
          if (obj.title) {
            this.showParts.push(obj)
            obj = {
              list: []
            }
          }
          obj.title = partsGroupMap.get(item.name)
          obj.list.push(item)
        }
        if (arr.length - 1 === index) {
          this.showParts.push(obj)
        }
      })
    },
    adClick (item) { // 轮播图点击记录
      const { categoryId, tel, personId, userName, email } = this.userInfo
      api.advertismentClickRecord({
        advertismentId: item.id,
        categoryId,
        personId,
        obtUserName: tel
      })
      switch (item.is_group_buying) {
        case 1:
          api.getOmsUrl({
            username: tel,
            name: userName,
            email,
            companyId: categoryId
          }).then(result => {
            const { successState, model } = result.CommonModel
            if (successState) {
              this.$router.push({
                name: 'iframe',
                params: {
                  src: model.url,
                  title: item.name,
                  showHome: true
                }
              })
            }
          })
          break
        default:
          item.outer_url && this.$router.push({
            name: 'iframe',
            params: {
              src: item.outer_url,
              title: item.name,
              showHome: true
            }
          })
          break
      }
    },
    showInfo () {
      this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      let functionModelList = this.userInfo.functionModelList
      this.$nextTick(() => {
        this.parts = this.grayStates(functionModelList)
        this.showSwitch(functionModelList)
      })
      this.getBanner()
    },
    partItemClick (item) {
      if (item.grayState) {
        Toast(`您暂未开通${item.name}的服务`)
        return false
      }
      switch (item.name) {
        case '中航服':
          this.getCtripUrl('zhf')
          break
        case '空港嘉华':
          this.getCtripUrl('kgjh')
          break
        case '阳光之旅':
          this.getCtripUrl('ygzl')
          break
        case '华宇航服':
          this.getCtripUrl('hyhf')
          break
        case '协议酒店':
          this.getHrsHotel()
          break
      }
    },
    getBanner () {
      api.getIndexBanner({
        fieldCode: 'index_top',
        categoryId: this.userInfo.categoryId,
        obtUserName: this.userInfo.tel
      }).then(res => {
        this.banner = res.advertismentModel.model
      })
    },
    getHrsHotel () { // 跳转协议酒店
      this.$store.dispatch('addLoading')
      api.getHrsHotel({
        username: JSON.parse(window.localStorage.getItem('userInfo')).tel,
        categoryId: JSON.parse(window.localStorage.getItem('userInfo')).categoryId,
        type: 2
      }).then(res => {
        this.$store.dispatch('removeLoading')
        if (res.CommonModel.successState) {
          this.$router.push({
            name: 'iframe',
            params: {
              src: res.CommonModel.model,
              title: '协议酒店（因公）',
              showHome: true
            }
          })
        } else {
          Toast(res.CommonModel.resultStr)
        }
      }).catch(err => {
        console.error(err)
        this.$store.dispatch('removeLoading')
      })
    },
    getCtripUrl (serviceCode) { // 跳转中航服
      this.$router.push({ path: `/hxCtrip/${serviceCode}` })
      // this.$store.dispatch('addLoading')
      // api.loginHx({
      //   categoryId: JSON.parse(window.localStorage.getItem('userInfo')).categoryId,
      //   obtUserName: JSON.parse(window.localStorage.getItem('userInfo')).tel,
      //   hxFunc: 'index',
      //   callBack: location.href,
      //   serviceCode
      // }).then(res => {
      //   this.$store.dispatch('removeLoading')
      //   this.ctripData = res.commonModel
      //   this.$refs.HXForm.submit(res.commonModel.param)
      // }).catch(e => {
      //   console.error(e)
      //   this.$store.dispatch('removeLoading')
      // })
    }
  },
  created () {
    this.$store.dispatch('addLoading')
    const search = qs.parse(location.search.replace(/^\?/, ''))
    if (process.env.NODE_ENV === 'development') {
      search.ticket = 'ST-3099-Wquo0s1Yxy2HjwfvD7kk0L0vpaY-iz2zeix2sgagsdunlcyfxjz'
    }
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
      localStorage.clear('ticket')
      localStorage.clear('token')
      localStorage.clear('obtUserName')
      localStorage.clear('obtCode')
      localStorage.clear('userInfo')
      api.getSSOToken({
        ticket: search.ticket
      }).then(res => {
        localStorage.setItem('ticket', search.ticket)
        if (res.CommonModel.successState) {
          localStorage.setItem('token', res.CommonModel.model.token)
          localStorage.setItem('obtUserName', res.CommonModel.model.obtUserName)
          localStorage.setItem('obtCode', res.CommonModel.model.obtCode)
          this.getPurview(localStorage.getItem('obtUserName'), res.CommonModel.model.obtCode)
        } else {
          this.$store.dispatch('removeLoading')
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
  },
  components: {
    Part,
    Copyright,
    DyForm
  }
}
</script>

<style scoped>
  /deep/ .van-swipe__track {
    height: 140px !important;
  }

  .box {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  .full-screen {
    flex-grow: 1;
  }

  .swipe-item-img {
    width: 100%;
    height: 100%;
  }
</style>
