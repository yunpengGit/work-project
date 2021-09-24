<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-07-16 15:44:00
* @LastEditors: Please set LastEditors
* @LastEditTime:
-->
<template>
  <div class="agenda-detail">
    <div class="agenda-detail-item">
      <div class="left">议程标题</div>
      <div class="right">{{ agendaDetailObj.name }}</div>
    </div>
    <div class="agenda-detail-item">
      <div class="left">议程日期</div>
      <div class="right">{{ agendaDetailObj.conductDate }}</div>
    </div>
    <div class="agenda-detail-item">
      <div class="left">议程时间</div>
      <div class="right">{{ agendaDetailObj.startTime }}-{{ agendaDetailObj.endTime }}</div>
    </div>
    <div class="agenda-detail-item">
      <div class="left">议程地点</div>
      <div class="right">{{ agendaDetailObj.address }}</div>
    </div>
    <div class="agenda-detail-item">
      <div class="left">联系人</div>
      <div class="right">{{ agendaDetailObj.linkMan || '-' }}</div>
    </div>
    <div class="bottom" v-if="agendaDetailObj.seatUrl && agendaDetailObj.seatUrl.length">
      <van-button block type="info" @click="previewImg">查看座位图</van-button>
    </div>
    <van-image-preview v-model="imgPreviewShow" :images="images" :showIndex="false"> </van-image-preview>
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
      agendaId: '',
      agendaDetailObj: {},
      // 图片预览开关
      imgPreviewShow: false,
      // 图片数组
      images: []
    }
  },
  mounted() {
    this.agendaId = this.routeParams.agendaId
    this.getAgendaDetail()
  },
  methods: {
    // 获取议程详情
    getAgendaDetail() {
      this.$api({
        url: 'attendeeApi.getAgendaDetail',
        data: {
          id: this.agendaId
        }
      }).then(res => {
        if (res.success) {
          this.agendaDetailObj = res.result
        }
      })
    },
    // 预览座位图
    previewImg() {
      this.imgPreviewShow = true
      this.images = [this.agendaDetailObj.seatUrl]
    }
  }
}
</script>

<style scoped lang="scss">
.agenda-detail {
  background-color: #fff;
  .agenda-detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 53px;
    padding: 0 20px;
    background: rgba(255, 255, 255, 0);
    box-shadow: 0px 0px 0px 0px rgb(25 31 36 / 8%);
    line-height: 53px;
    border-bottom: 1px solid #eeeeef;
    .left {
      font-size: 15px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(25, 31, 36, 0.64);
    }
    .right {
      font-size: 15px;
      max-width: 275px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #191f24;
      white-space: nowrap;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
  }
  .bottom {
    z-index: 999;
    padding: 10px 16px;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    position: fixed;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .van-button {
      border-radius: 4px;
    }
  }
}
</style>
