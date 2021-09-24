<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-30 11:13:35
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-12 21:07:30
-->
<template>
  <div class="enter-code-container" v-if="conferenceData">
    <div class="enter-code-content">
      <div class="enter-code">
        <dl>
          <dt><h3>{{ conferenceData.name }}</h3></dt>
          <dd>{{ type === '1' ? '会议' : '报到'}}时间：{{ conferenceData.startTime.slice(0, conferenceData.startTime.length - 3) }} 至 {{ conferenceData.endTime.slice(0, conferenceData.endTime.length - 3) }}</dd>
          <dd>{{ type === '1' ? '会议' : '报到'}}地点：{{ conferenceData.address ? conferenceData.address: '-' }}</dd>
        </dl>
        <div class="code">
          <h4>{{ type === '1' ? '扫描下方二维码参加会议' : '扫描下方二维码签到/报到' }}</h4>
          <div class="share" v-if="userInfo">分享人：{{ userInfo.ssoUserName }}</div>
          <div class="pic"><img :src="conferenceData.handleSrc_" alt=""></div>
          <div class="time">该二维码于{{ conferenceData.endTime.slice(0, conferenceData.endTime.length - 3) }}前有效</div>
        </div>
      </div>
    </div>
    <div class="single-btn-bottom">
      <!-- <a :href="downloadHref_" :download="type==='1'?`${conferenceData.name}会议二维码.png`:`${conferenceData.name}会议报到码.png`"> -->
        <van-button type="info" @click="handleSavePic(downloadHref_)">保存到手机</van-button>
      <!-- </a> -->
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
      conferenceData: null,
      // type 1 → 会议二维码 /  type 2 → 会议报到码
      type: 1,
      downloadHref_: '',
      userInfo: null
    }
  },
  created() {
    const id = this.routeParams.id
    const type = this.routeParams.type
    document.title = type === '1' ? '会议二维码' : '会议报到码'
    this.type = type
    // const downloadHref = `https://hw-user-api.avicnet.cn/J07/files/download?filePath=${this.downloadHref_}`
    this.$api({
      url: 'desk.getDetail',
      data: {
        id
      }
    }).then(res => {
      if (res.code === 2000) {
        if (type === '1') {
          res.result.handleSrc_ = res.result.signCodeDownloadUrl
          this.downloadHref_ = `${res.result.signCodeDownloadUrl}`
        } else {
          // res.result.handleSrc_ = res.result.signInCode signCodeDownloadUrl
          res.result.handleSrc_ = res.result.signInCodeUrl
          this.downloadHref_ = `${res.result.signInCodeUrl}`
        }
        this.conferenceData = res.result
      }
    })
    this.$api({
      url: 'user.userInfo'
    }).then(res => {
      if (res.code === 2000) {
        const data = res.result
        this.userInfo = data
        console.log(res)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.enter-code-container {
  background-color: #f8f8f8;
  width: 100%;
  padding: 20px 20px 83px;
  .enter-code-content {
    width: 100%;
    border-radius: 8px;
    padding-bottom: 27px;
    background-color: #fff;
  }
  .enter-code {
    width: 100%;
    height: 100%;
    dl {
      text-align: center;
      padding-bottom: 26px;
      border-bottom: 1px solid #f0f0f1;
      dt {
        height: 50px;
        margin: 20px 0;
        padding: 0 20px;
        @include list(row,center,center);
        h3 {
          font-size: 20px;
          line-height: 25px;
          font-weight: 500;
        }
      }
      dd {
        font-size: 13px;
        color: rgba(25, 31, 36, 0.64);
        line-height: 18px;
        margin-bottom: 4px;
      }
    }
    .code {
      text-align: center;
      > h4 {
        font-size: 16px;
        font-weight: 500;
        padding: 20px 0 10px;
      }
      .share {
        font-size: 13px;
        color: rgba(25, 31, 36, 1);
        padding-bottom: 16px;
      }
      .pic {
        width: 200px;
        height: 200px;
        margin: 0 auto 16px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .time {
        font-size: 13px;
        color: rgba(255, 130, 0, 1);
      }
    }
  }
  // .save-mobile {
  //   width: 100%;
  //   height: 64px;
  //   padding: 10px 16px;
  //   background-color: #fff;
  //   @include absolute('','',0,0);
  //   .van-button {
  //     width: 100%;
  //     height: 100%;
  //     border-radius: 8px;
  //   }
  // }
  .single-btn-bottom {
    position: fixed;
  }
}
</style>
