<template>
    <div>
      <van-sticky>
        <van-nav-bar left-arrow title="下载确认函" @click-left="back" />
      </van-sticky>
      <div class="img-box">
        <van-image
          width="100%"
          :src="ServerAddress+src"
        ><template v-slot:error>加载失败</template></van-image>
      </div>
      <div class="btn-box">
        <!-- <van-button size="small" round plain hairline type="info"  @click="shareFriends">分享给好友</van-button>
        <van-button size="small" round type="info" @click="savePhotoAlbum">保存到相册</van-button> -->
        <van-button size="small" round plain hairline type="info"  @click="sendEmail">发送到邮箱</van-button>
      </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { Sticky, NavBar, Image, Button, Toast } from 'vant'
import { ServerAddress } from '@/http'
import api from '@/api/journey'

Vue.use(Sticky).use(NavBar).use(Image).use(Button).use(Toast)
export default {
  name: 'downloadConfirmation',
  data () {
    return {
      src: '',
      ServerAddress,
      params: {}
    }
  },
  created () {
    this.params.journeyId = this.$route.query.id
    this.params.categoryId = JSON.parse(window.localStorage.getItem('userInfo')).categoryId
    this.params.obtUserName = JSON.parse(window.localStorage.getItem('userInfo')).tel
    api.confirmationForMobilePhone(this.params).then(res => {
      this.src = res.path
    }).catch(e => {
      console.error(e)
    })
  },
  methods: {
    back () {
      this.$router.push(`/planeNoteDetail?id=${this.params.journeyId}`)
    },
    shareFriends () {},
    savePhotoAlbum () {
      let Url = ServerAddress + this.src
      let blob = new Blob([''], { type: 'application/octet-stream' })
      let url = URL.createObjectURL(blob)
      let a = document.createElement('a')
      a.href = Url
      a.download = Url.replace(/(.*\/)*([^.]+.*)/ig, '$2').split('?')[0]
      let e = document.createEvent('MouseEvents')
      e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      a.dispatchEvent(e)
      URL.revokeObjectURL(url)
      // Toast()
    },
    sendEmail () {
      this.$store.dispatch('changeOrderSendEmail', true)
      this.$router.push({
        name: 'checkEmails',
        params: {
          requestParams: {
            journeyIds: this.params.journeyId,
            categoryId: this.params.categoryId,
            obtUserName: this.params.obtUserName
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  .btn-box{
    position: fixed;
    padding: 10px 0;
    bottom: 0;
    text-align: center;
    width: 100%;
    background-color: #DDE4EE;
    & > * {
      margin: 0 10px;
    }
  }

</style>
