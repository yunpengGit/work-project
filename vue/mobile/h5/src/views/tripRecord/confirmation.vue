<!--
 * @Author: your name
 * @Date: 2020-10-19 16:21:16
 * @LastEditTime: 2020-10-30 14:12:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \h5\src\views\tripRecord\confirmation.vue
-->
<template>
  <div>
    <div class="imgs-box" id="img_box">
      <img class="img" :src="src" alt="">
    </div>
    <div class="btn-box">
      <van-button plain type="info" @click="shareFn">转发好友</van-button>
      <van-button plain type="info" @click="sendEmailFn">发送邮箱</van-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Notify, Toast } from 'vant'
import './../../assets/js/md5'
import './../../assets/js/previewImage'

import {
  TOKEN,
  OBTUSERNAME,
  CATEGORYID
} from '@/store/mutation-types'
import { confirmationForMobilePhone } from '@/api/tripRecord/confirmation'
Vue.use(Notify).use(Toast)
export default {
  name: 'confirmation',
  data () {
    return {
      src: ''
    }
  },
  created () {
    // this.$changePageTitle('确认函')
    const data = {
      obtUserName: Vue.ls.get(OBTUSERNAME),
      categoryId: Vue.ls.get(CATEGORYID),
      token: Vue.ls.get(TOKEN),
      journeyId: this.$route.query.journeyId
    }
    confirmationForMobilePhone(data).then(res => {
      this.src = process.env.VUE_APP_TARGET_DOMAIN + res.path
      // if (process.env.VUE_APP_TARGET_DOMAIN === 'development') {
      //   this.src = 'https://etrip63.eavic.com' + res.path
      // } else {
      //   this.src = process.env.TARGET_DOMAIN + res.path
      // }
    })
  },
  mounted () {
    const s = document.createElement('script')
    // s.type = 'javascript'
    s.src = 'https://sw-pro.oss-cn-beijing.aliyuncs.com/html/jsapi/prod/jsapi-2.0.8.js'
    document.body.appendChild(s)
    var $ = {}
    /**
     * get multiple elements
     * @public
     */
    $.all = function (selector, contextElement) {
      var nodeList
      var list = []
      if (contextElement) {
        nodeList = contextElement.querySelectorAll(selector)
      } else {
        nodeList = document.querySelectorAll(selector)
      }
      if (nodeList && nodeList.length > 0) {
        list = Array.prototype.slice.call(nodeList)
      }
      return list
    }

    /**
     * delegate an event to a parent element
     * @public
     * @param  array     $el        parent element
     * @param  string    eventType  name of the event
     * @param  string    selector   target's selector
     * @param  function  fn
     */
    $.delegate = function ($el, eventType, selector, fn) {
      if (!$el) { return }
      $el.addEventListener(eventType, function (e) {
        var targets = $.all(selector, $el)
        if (!targets) {
          return
        }
        // findTarget:
        for (var i = 0; i < targets.length; i++) {
          var $node = e.target
          while ($node) {
            if ($node === targets[i]) {
              fn.call($node, e)
              break // findTarget;
            }
            $node = $node.parentNode
            if ($node === $el) {
              break
            }
          }
        }
      }, false)
    }

    var urls = []
    var imgs = $.all('img', $.all('#img_box')[0])
    imgs.forEach(function (v, i) {
      urls.push(v.src)
    })
    const that = this
    $.delegate(document.querySelector('#img_box'), 'click', 'img', function () {
      var current = this.src
      var obj = {
        urls: [that.src],
        current: current
      }
      // eslint-disable-next-line
      previewImage.start(obj)
    })
  },
  methods: {
    shareFn () {
      // eslint-disable-next-line
      const jsapi = new JsApi()
      jsapi.getPublicNoArticalDetailShareInfo({
        appId: '2d3f464583ee4b8', // 必填，第三方的唯一标识
        title: '机票确认函', // 页面title
        img: '', // 分享的图片
        content: '', // 分享的内容
        link: this.src, // 分享跳转的url地址
        success: function (res) {
          Notify({
            type: 'success',
            message: res.CommonModel.resultStr
          })
        },
        fail: (fail) => {
          Toast(fail)
        },
        cancel: () => {
          Toast('已取消分享')
        }
      })
    },
    sendEmailFn () {
      this.$router.push(
        { path: '/tripRecord/confirmation/sendEmail', query: { journeyId: this.$route.query.journeyId } }
      )
    }
  }
}
</script>

<style scoped lang="less">
.img{
  width: 100vw;
  padding: 15px;
}
.btn-box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 0 15px;
  width: 100vw;
  height: 60px;
  background-color: #fff;
  box-shadow: 0px -2px 7px 0px rgba(134, 152, 194, 0.15);
  z-index: 10;
  .van-button {
    width: 165px;
    font-size: 16px;
    height: 32px;
    border-radius: 4px;
  }
}
</style>
